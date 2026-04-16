import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
    saveCashRegisterApi,
} from "../../redux/action/cashRegisterAction";
import {
    Avatar,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from "@material-ui/core";

import CartHelper from "../../Helper/cartHelper";
import StoreHelper from "../../Helper/storeHelper";
import { HighlightOff } from "@material-ui/icons";
import { alert } from "../../redux/action/InterAction";

function CashRegisterComponentClosed({ fetchCashregister }) {
    const dispatch = useDispatch();
    const storeData = useSelector((state) => state.storeData);
    const [denoms, setDenoms] = useState(null);
    const [openDialogForm, setOpenDialogForm] = useState(false);
    const [totalCash, setTotalCash] = useState(0);
    const myInputRef = useRef(null);

    useEffect(() => {
        const denominationsConfig = storeData?.data?.configs?.denominations;
        let vals = {};

        if (denominationsConfig && denominationsConfig.length) {
            const denominations = denominationsConfig.split(",");

            for (let index = 0; index < denominations?.length; index++) {
                vals = { ...vals, [denominations[index]]: 0 };
            }
        }

        setDenoms(vals);
        setTotalCash(0);
    }, [storeData]);

    const getdenomsTotal = () => {
        const currentDenoms = denoms || {};
        return Object.keys(currentDenoms).reduce((sum, currentValue) => {
            return sum + +currentValue * currentDenoms[currentValue];
        }, 0);
    };

    const handleOpenCashRegister = async () => {
        const location_id = StoreHelper.getLocationId();
        const currentDenoms = denoms || {};
        const value = getdenomsTotal();

        const open_denom_data = Object.keys(currentDenoms).map((item) => {
            return {
                denom: item,
                count: currentDenoms[item],
                total: +item * currentDenoms[item],
            };
        });

        const payload = {
            location_id,
            type: "open",
            open_denom_data,
            opening_cash: totalCash,
        };

        if (Object.keys(currentDenoms).length && value !== Number(totalCash)) {
            return dispatch(alert(true, "There is a mismatch in total cash"));
        }

        const res = await dispatch(saveCashRegisterApi(payload))
            .then((result) => {
                return result.json();
            })
            .catch(() => {
                console.error("error while opening cash register");
                return null;
            });

        if (res?.success) {
            setOpenDialogForm(false);
            dispatch(alert(true, res?.msg));

            fetchCashregister();
        } else {
            setOpenDialogForm(false);
            dispatch(alert(true, res?.msg));
        }
    };

    const onChangeDenom = ({ key, value }) => {
        const nextDenoms = {
            ...(denoms || {}),
            [key]: value,
        };

        const total = Object.entries(nextDenoms).reduce((acc, [key, value]) => {
            return acc + (parseInt(key) * +value);
        }, 0);
        setDenoms(nextDenoms);
        setTotalCash(total);
    };

    return (
        <>
            <Box display={'inline-flex'} width={"100%"} justifyContent={'center'} alignItems={'center'} >
                <Button
                    style={{ backgroundColor: 'black', color: 'white', '&:hover': { backgroundColor: 'red' } }}
                    onClick={() => {
                        setOpenDialogForm(true);
                    }}>
                    Open Register
                </Button>
            </Box>

            <Dialog open={openDialogForm}>
                <DialogActions>
                    <Avatar
                        onClick={() => {
                            setOpenDialogForm(false);
                        }}
                        className={"popup-close-button"}>
                        <HighlightOff />
                    </Avatar>
                </DialogActions>
                <DialogContent>
                    <Table className={""} size="small" aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="left" colSpan={4}>
                                    {"Denomination"}
                                </TableCell>
                                <TableCell align="center" colSpan={4}>
                                    {"Currency Count"}
                                </TableCell>
                                <TableCell align="right" colSpan={4}>
                                    {"Currency Value"}
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {denoms &&
                                Object.keys(denoms)?.map((data, index) => (
                                    <TableRow key={index}>
                                        <TableCell colSpan={4}>
                                            {CartHelper.getCurrencyFormatted(Number(data))}
                                        </TableCell>
                                        <TableCell align="center" colSpan={4}>
                                            <TextField
                                                type="number"
                                                ref={myInputRef}
                                                className="margin-0 "
                                                value={denoms[data]}
                                                InputLabelProps={{ shrink: true }}
                                                margin="normal"
                                                inputProps={{ className: "align-center-important" }}
                                                onChange={(event) => {
                                                    onChangeDenom({ key: data, value: event.currentTarget.value });
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell align="right" colSpan={4}>
                                            {CartHelper.getCurrencyFormatted(+data * denoms[data])}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            <TableRow>
                                <TableCell colSpan={8}>
                                    <Typography align="right">Total Cash </Typography>
                                </TableCell>
                                <TableCell colSpan={4}>
                                    <TextField
                                        type="number"
                                        className="margin-0 "
                                        value={totalCash}
                                        InputLabelProps={{ shrink: true }}
                                        margin="normal"
                                        inputProps={{ className: "align-center-important" }}
                                        onChange={(event) => {
                                            setTotalCash(event.currentTarget.value);
                                        }}
                                    />
                                </TableCell>
                            </TableRow>
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TableCell align="right" colSpan={12}>
                                    <Button
                                        onClick={handleOpenCashRegister}
                                        size="large"
                                        variant="contained"
                                        color="secondary"
                                        type="submit"
                                        className="color-white">
                                        Save
                                    </Button>
                                </TableCell>
                            </TableRow>
                        </TableFooter>
                    </Table>
                </DialogContent>
            </Dialog>
        </>
    );
}

export default CashRegisterComponentClosed;
