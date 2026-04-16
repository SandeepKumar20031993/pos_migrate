import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Box, Paper, Grid, Typography, TextField, MenuItem, Button } from '@material-ui/core';
//import { ArrowForwardIos } from '@material-ui/icons';
import { useDispatch, useSelector } from "react-redux";
import { loadSalesRecord } from '../../redux/action/salesRecordAction';
import CartHelper from '../../Helper/cartHelper'
import StoreHelper from '../../Helper/storeHelper'
import { pageTitle } from '../../redux/action/themeAction';
import { DataGrid } from '@material-ui/data-grid';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { loadBillingData, saveInvoiceInBilling, saveBillResponse, saveBillingData } from '../../redux/action/cartAction';
import SalesOrderPopup from "../../pages/customer-history/SalesOrderPopup"

function OnlineSales() {
    const dispatch = useDispatch()
    const salesRecord = useSelector((state) => state.salesRecord)
    const checkoutData = useSelector((state) => state.checkoutData)

    const today = useMemo(() => new Date(), [])
    const [from, setFrom] = useState(new Date())
    const [to, setTo] = useState(today)
    const [lastSelectableDate, setLastSelectableDate] = useState(new Date().setDate(today.getDate() - 7))
    const [transactionType, setTransactionType] = useState('all')
    const [popup, setPopup] = useState(false)

    const fetchSalesRecord = useCallback(() => {
        if (from && from.getDate() && to && to.getDate()) {
            var from_date = from.getDate() + '/' + (from.getMonth() + 1) + '/' + from.getFullYear();
            var to_date = to.getDate() + '/' + (to.getMonth() + 1) + '/' + to.getFullYear();
            var formData = {}
            formData.location = StoreHelper.getLocationId();
            formData.from_date = from_date;
            formData.to_date = to_date;
            formData.salestype = transactionType;
            dispatch(loadSalesRecord(formData));
        }
    }, [dispatch, from, to, transactionType])

    useEffect(() => {
        dispatch(pageTitle('Sales Record'));
        const currentDate = new Date()
        const salesDurationStr = StoreHelper.getSalesReportDuration();
        const salesDuration = salesDurationStr ? parseInt(salesDurationStr.split(" ")[0], 10) - 1 : 7;
        setLastSelectableDate(new Date().setDate(currentDate.getDate() - salesDuration))
    }, [dispatch])

    useEffect(() => {
        fetchSalesRecord()
    }, [fetchSalesRecord])

    const paymentTypes = useMemo(() => {
        var payment_type = []
        if (salesRecord.success && !CartHelper.isEmpty(salesRecord.data)) {
            salesRecord.data.forEach(sales => {
                if (!payment_type.includes(sales.payment_type)) {
                    payment_type.push(sales.payment_type)
                }
            })
        }
        return payment_type
    }, [salesRecord])

    const handleGetRowId = (e) => {
        return (e.invoice_no) ? e.invoice_no + Math.random() : Math.random();
    }

    const formatAmt = (e) => {
        return StoreHelper.getCurrencyFormatted(e);
    }

    const handleFrom = (value) => {
        setFrom(value);
    }

    const handleTo = (value) => {
        setTo(value);
    }

    const handleTransactionType = (event) => {
        setTransactionType(event.target.value)
    }

    const saveResponseData = useCallback((resData, inv) => {
        var responseData = {}
        var orderdate = CartHelper.formatOrderDate(resData.customer.order_date);
        responseData.date = orderdate
        responseData.invoice_num = inv
        responseData.sale_id = resData.sale_id
        responseData.success = true
        dispatch(saveBillResponse(responseData));
    }, [dispatch])

    const fetchBillingData = useCallback((invNo) => {
        var invoice_num = invNo;
        var form = {
            orderno: invoice_num,
            isReport: true
        }
        dispatch(loadBillingData(form))
            .then(res => res.json())
            .then(resData => {
                if (resData.success) {
                    dispatch(saveBillingData(resData))
                    dispatch(saveInvoiceInBilling(invoice_num));
                    saveResponseData(resData, invoice_num);
                    setPopup(true);
                } else {
                    dispatch(saveInvoiceInBilling(invoice_num));
                }
            }).catch(() => {
                dispatch(saveInvoiceInBilling(invoice_num));
            });
    }, [dispatch, saveResponseData])

    const printSale = useCallback((sale) => {
        fetchBillingData(sale.invoice_no);
    }, [fetchBillingData])

    const renderPrint = (e) => {
        return (
            <Button className="background-blue" variant="contained" size="small" onClick={() => printSale(e.row)}>
                View & Print
            </Button>
        )
    }

    const closePopup = () => {
        setPopup(false)
    }

    const columns = [
        { field: 'invoice_no', headerName: 'Invoice No', flex: 1 },
        { field: 'invoice_date', headerName: 'Date', flex: 1 },
        { field: 'payment_type', headerName: 'Payment Type', flex: 1 },
        {
            field: 'payment_amount', headerName: 'Payment Amount', flex: 1,
            valueFormatter: ({ value }) => formatAmt(value),
        },
        { field: 'view', headerName: 'Action', flex: 1, renderCell: renderPrint }
    ];

    return (
        <Box pt={2}>
            <Box p={2}>
                <Grid container direction="row" justify="center" alignItems="center">
                    <Grid item xs={12}>
                        <Grid container direction="row" item spacing={2} xs={12} md={10} lg={7}>
                            <Grid item xs>
                                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                    <Grid container justify="flex-start">
                                        <KeyboardDatePicker
                                            required
                                            id="from-date-picker-dialog"
                                            label="From"
                                            format="dd/MM/yyyy"
                                            value={from}
                                            minDate={lastSelectableDate}
                                            maxDate={today}
                                            size="small"
                                            inputVariant="outlined"
                                            InputProps={{ readOnly: true }}
                                            KeyboardButtonProps={{
                                                'aria-label': 'change date'
                                            }}
                                            onChange={handleFrom}
                                        />
                                    </Grid>
                                </MuiPickersUtilsProvider>
                            </Grid>

                            <Grid item xs>
                                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                    <Grid container justify="space-around">
                                        <KeyboardDatePicker
                                            required
                                            id="to-date-picker-dialog"
                                            label="To"
                                            format="dd/MM/yyyy"
                                            value={to}
                                            minDate={from}
                                            maxDate={today}
                                            size="small"
                                            inputVariant="outlined"
                                            InputProps={{ readOnly: true }}
                                            KeyboardButtonProps={{
                                                'aria-label': 'change date',
                                            }}
                                            onChange={handleTo}
                                        />
                                    </Grid>
                                </MuiPickersUtilsProvider>
                            </Grid>

                            <Grid item xs={6}>
                                <TextField
                                    select
                                    variant="outlined"
                                    value={transactionType}
                                    label="Transaction type"
                                    onChange={handleTransactionType}
                                    className="width-100"
                                    inputProps={{
                                        className: "padding-9 width-100"
                                    }}
                                >
                                    <MenuItem value="all">All</MenuItem>
                                    {paymentTypes.map((paymentType, index) => (
                                        <MenuItem value={paymentType} key={index}>{paymentType}</MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Box>
            {!CartHelper.isEmpty(salesRecord) && salesRecord.success ?
                <>
                    <Box p={2} pt={0}>
                        <Paper square={true}>
                            <Box p={2}>
                                <Grid container direction="row" justify="space-between">
                                    <Grid item>
                                        <Typography variant="subtitle2" component="strong">Total:{!CartHelper.isEmpty(salesRecord.data) ? salesRecord.totalpayment : 0.00}</Typography>
                                    </Grid>
                                    <Grid item>
                                        <Typography variant="subtitle2" component="strong">{!CartHelper.isEmpty(salesRecord.data) ? salesRecord.paymentdetail : null}</Typography>
                                    </Grid>
                                </Grid>
                            </Box>
                            <Box>
                                <DataGrid className="no-border-radius data-grid-border" rows={salesRecord.data ? salesRecord.data : []} getRowId={handleGetRowId} columns={columns} autoHeight={true} pageSize={20} rowsPerPageOptions={[20, 40, 60]} />
                            </Box>
                        </Paper>
                    </Box>
                </>
                : null
            }
            {checkoutData && checkoutData.billingData ?
                <SalesOrderPopup popup={popup && !CartHelper.isEmpty(checkoutData.billingData)} order={checkoutData.billingData} printBtn={true} closePopup={closePopup} />
                : null
            }
        </Box>
    )
}

export default OnlineSales;
