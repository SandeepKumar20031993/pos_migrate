import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Box, Grid, Typography, TextField, Button } from '@material-ui/core';
import { DataGrid } from '@material-ui/data-grid';
import 'date-fns';
import { Search } from '@material-ui/icons';
import { useDispatch } from "react-redux";
import { fetchCustomerHistory } from '../../redux/action/customerAction';
import CartHelper from '../../Helper/cartHelper'
import { pageTitle } from '../../redux/action/themeAction';
import { loading } from '../../redux/action/InterAction';



export function GiftCards() {
    const dispatch = useDispatch();
    const [reportType] = useState("GIFTCARDS");
    const [mobile, setMobile] = useState("");
    const [mobileError, setMobileError] = useState(true);
    const [giftCards, setGiftCards] = useState({});

    useEffect(() => {
        dispatch(pageTitle('Giftcards history'));
    }, [dispatch]);

    const handleMobile = useCallback((e) => {
        const mobNo = e.target.value;
        setMobile(mobNo);
        setMobileError(!(mobNo.length === 10));
        setGiftCards({});
    }, []);

    const fetchGiftCards = useCallback(() => {
        const form = {};
        form.phone = mobile;
        form.report_type = reportType;
        dispatch(loading(true));
        dispatch(fetchCustomerHistory(form))
            .then(res => res.json())
            .then(res => {
                dispatch(loading(false));
                if (res && res.success) {
                    setGiftCards(res);
                }
            })
            .catch(() => {
                dispatch(loading(false));
            });
    }, [dispatch, mobile, reportType]);

    const onSubmit = useCallback((e) => {
        e.preventDefault();
        if (mobile.length === 10 && !mobileError) {
            fetchGiftCards();
        }
    }, [fetchGiftCards, mobile, mobileError]);

    const formatAmt = useCallback((e) => {
        return CartHelper.getCurrencyFormatted(e);
    }, []);

    const handleGetRowId = useCallback((e) => {
        return e.giftcard_id;
    }, []);

    const totalBalance = (!CartHelper.isEmpty(giftCards) && giftCards.totalBalance) ? giftCards.totalBalance : 0;

    const columns = useMemo(() => [
        { field: 'record_time', headerName: 'Date', flex: 1 },
        { field: 'giftcard_number', headerName: 'Gift Card No', flex: 1 },
        {
            field: 'value', headerName: 'Value', flex: 1,
            valueFormatter: ({ value }) => formatAmt(value),
        },
        { field: 'discount_type', headerName: 'Discount Type', flex: 1 },
        { field: 'validity', headerName: 'Validity', flex: 1 }
    ], [formatAmt]);

    return (
            <Box className="width-100 clearfix">
                <form onSubmit={onSubmit}>
                    <Grid container direction="row" alignItems="flex-start">
                        <Grid item xs={5}>
                            <Grid container direction="row" alignItems="flex-start" className="mb-5">
                                <Grid item xs>
                                    <TextField
                                        required
                                        label="Mobile"
                                        variant="outlined"
                                        value={mobile}
                                        className="width-100"
                                        size="small"
                                        type="number"
                                        onChange={handleMobile}
                                        error={mobileError}
                                    />
                                    {mobileError ?
                                        <Typography variant="caption">Enter valid mobile number</Typography>
                                        :
                                        <Typography variant="caption">&nbsp;</Typography>}
                                </Grid>
                                <Grid item>
                                    <Button
                                        type="submit"
                                        className="search-button"
                                        variant="contained"
                                        color="secondary"
                                        size="large"
                                    >
                                        <Search />
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid container>
                        <Grid item xs={12}>

                            <Box pt={2}>
                                {totalBalance ?
                                    <Grid container>
                                        <Grid item>
                                            <Typography variant="subtitle2" component="strong">
                                                Total Balance:{CartHelper.getCurrencyFormatted(totalBalance)}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                    : null
                                }

                                <DataGrid className="no-border-radius data-grid-border" rows={(giftCards.giftcards && giftCards.giftcards.length > 0) ? giftCards.giftcards : []} getRowId={handleGetRowId} columns={columns} autoHeight={true} pageSize={20} rowsPerPageOptions={[20, 40, 60]} />
                            </Box>
                        </Grid>
                    </Grid>
                </form>
            </Box>
        )
}

export default GiftCards
