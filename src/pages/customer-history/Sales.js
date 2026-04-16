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
import { fetchOrder } from '../../redux/action/cartAction';
import SalesOrderPopup from "./SalesOrderPopup"



export function Sales() {
    const dispatch = useDispatch();
    const [reportType] = useState("SALES");
    const [mobile, setMobile] = useState("");
    const [mobileError, setMobileError] = useState(true);
    const [sales, setSales] = useState([]);
    const [popup, setPopup] = useState(false);
    const [order, setOrder] = useState({});

    useEffect(() => {
        dispatch(pageTitle('Sales history'));
    }, [dispatch]);

    const handleMobile = useCallback((e) => {
        const mobNo = e.target.value;
        setMobile(mobNo);
        setMobileError(!(mobNo.length === 10));
        setSales([]);
    }, []);

    const fetchSales = useCallback(() => {
        const form = {};
        form.phone = mobile;
        form.report_type = reportType;
        dispatch(loading(true));
        dispatch(fetchCustomerHistory(form))
            .then(res => res.json())
            .then(res => {
                dispatch(loading(false));
                if (res && res.success) {
                    setSales(res.sales);
                }
            })
            .catch(() => {
                dispatch(loading(false));
            });
    }, [dispatch, mobile, reportType]);

    const onSubmit = useCallback((e) => {
        e.preventDefault();
        if (mobile.length === 10 && !mobileError) {
            fetchSales();
        }
    }, [fetchSales, mobile, mobileError]);

    const formatAmt = useCallback((e) => {
        return CartHelper.getCurrencyFormatted(e);
    }, []);

    const handleGetRowId = useCallback((e) => {
        return e.invoice_number;
    }, []);

    const loadOrder = useCallback((salesOrder) => {
        if (salesOrder && salesOrder.invoice_number) {
            const form = {
                orderno: salesOrder.invoice_number
            };
            dispatch(loading(true));
            dispatch(fetchOrder(form))
                .then(res => res.json())
                .then(res => {
                    dispatch(loading(false));
                    if (res.success) {
                        setPopup(true);
                        setOrder(res);
                    }
                })
                .catch(() => {
                    dispatch(loading(false));
                });
        }
    }, [dispatch]);

    const renderAction = useCallback((e) => {
        return (
            <Button className="background-blue" variant="contained" size="small" onClick={() => loadOrder(e.row)}>
                View Details
            </Button>
        );
    }, [loadOrder]);

    const closePopup = useCallback(() => {
        setPopup(false);
        setOrder({});
    }, []);

    const columns = useMemo(() => [
        { field: 'invoice_number', headerName: 'Invoice No', flex: 1 },
        { field: 'location_name', headerName: 'Location', flex: 1 },
        {
            field: 'net_total', headerName: 'Payment Amount', flex: 1,
            valueFormatter: ({ value }) => formatAmt(value),
        },
        { field: 'payment_type', headerName: 'Payment Type', flex: 1 },
        { field: 'sale_time', headerName: 'Date', flex: 1 },
        { field: 'action', headerName: 'Action', flex: 1, renderCell: renderAction }
    ], [formatAmt, renderAction]);

    return (
            <>
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
                                    <DataGrid className="no-border-radius data-grid-border" rows={(sales && sales.length > 0) ? sales : []} getRowId={handleGetRowId} columns={columns} autoHeight={true} pageSize={20} rowsPerPageOptions={[20, 40, 60]} />
                                </Box>
                            </Grid>
                        </Grid>
                    </form>
                </Box>
                <SalesOrderPopup popup={popup} order={order} closePopup={closePopup} />
            </>
        )
}

export default Sales
