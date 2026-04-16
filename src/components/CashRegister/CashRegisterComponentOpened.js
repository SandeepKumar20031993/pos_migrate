import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
    saveCashRegisterApi,
} from "../../redux/action/cashRegisterAction";
import {
    Avatar,
    Button,
    Card,
    CardContent,
    CardHeader,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from "@material-ui/core";

import StoreHelper from "../../Helper/storeHelper";
import { alert } from "../../redux/action/InterAction";
import { HighlightOff } from "@material-ui/icons";

function CashRegisterComponentOpened({ fetchCashregister }) {
    const dispatch = useDispatch();
    const cashRegister = useSelector((state) => state.cashRegister);
    const [openCloseRegisterDailog, setOpenCloseRegisterDailog] = useState(false);
    const [closingCash, setClosingCash] = useState(0);

    const registerData = cashRegister?.data ?? {};
    const totalSales = cashRegister?.data?.total_sales || {};
    const totalCash = (() => {
        let total = registerData?.opening_cash || 0;
        if (totalSales?.cash) {
            total += totalSales.cash;
        }
        return total;
    })();

    const handleCloseRegister = async () => {
        const location_id = StoreHelper.getLocationId();

        const payload = {
            register_id: cashRegister?.register_id,
            location_id,
            type: "close",
            closing_cash: closingCash,
        };

        const res = await dispatch(saveCashRegisterApi(payload))
            .then((result) => {
                return result.json();
            })
            .catch(() => {
                console.error("error while opening cash register");
                return null;
            });

        if (res?.success) {
            dispatch(alert(true, res?.msg));
            fetchCashregister();
            setOpenCloseRegisterDailog(false);
        } else {
            dispatch(alert(true, res?.msg));
        }
    };

    return (
        <>
            <Grid container spacing={4} style={{ padding: "32px 16px" }}>
                <Grid item xs={5}>
                    <Card>
                        <CardHeader
                            title="Register Open"
                            action={
                                <Button
                                    variant="contained"
                                    onClick={() => {
                                        setOpenCloseRegisterDailog(true);
                                    }}>
                                    Close Register
                                </Button>
                            }
                        />
                        <CardContent>
                            <Typography>
                                Opened on: {registerData?.opening_date}{" "}
                            </Typography>
                            <Typography>
                                {"Opening cash : " + registerData?.opening_cash}
                            </Typography>
                            <TableContainer style={{ padding: '10px 16px' }}>
                                <Table aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Payment Type</TableCell>
                                            <TableCell align="right">Sale Total</TableCell>
                                            <TableCell align="right">Total</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {Object.keys(totalSales).map((row, index) => (
                                            <TableRow key={row + index}>
                                                <TableCell align="left" style={{ textTransform: 'capitalize' }} >{row}</TableCell>
                                                <TableCell align="right">{totalSales[row]}</TableCell>
                                                {row === 'cash' &&
                                                    <TableCell align="right">{+registerData?.opening_cash + totalSales[row]}</TableCell>
                                                }
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
            <Grid item xs={5} spacing={4} style={{ display: 'flex', justifyContent: 'flex-end', paddingRight: "13px" }}>
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => {
                        window.location.href = `${process.env.PUBLIC_URL}/`
                    }}>
                    New Sale
                </Button>
            </Grid>

            <Dialog open={openCloseRegisterDailog} style={{ minWidth: "500px" }}>
                <DialogTitle id="alert-dialog-title" />
                <DialogActions>
                    <Avatar
                        onClick={() => {
                            setOpenCloseRegisterDailog(false);
                        }}
                        className={"popup-close-button"}>
                        <HighlightOff />
                    </Avatar>
                </DialogActions>
                <DialogContent>
                    <Grid container>
                        <Grid item xs={12}>
                            Expected Cash : {totalCash}
                        </Grid>
                        <Grid item xs={6}>
                            <Typography>Enter closing cash</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                type="number"
                                className="margin-0 "
                                value={closingCash}
                                InputLabelProps={{ shrink: true }}
                                margin="normal"
                                inputProps={{ className: "align-center-important" }}
                                onChange={(event) => {
                                    setClosingCash(event.currentTarget.value);
                                }}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>

                <DialogActions>
                    <Button variant="outlined" onClick={handleCloseRegister}>
                        Close Register
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default CashRegisterComponentOpened;
