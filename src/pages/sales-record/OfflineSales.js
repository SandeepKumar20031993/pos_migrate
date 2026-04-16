import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Box, Paper, Grid, Button } from '@material-ui/core';
//import { ArrowForwardIos } from '@material-ui/icons';
import { useDispatch, useSelector } from "react-redux";
import CartHelper from '../../Helper/cartHelper'
import StoreHelper from '../../Helper/storeHelper'
import { pageTitle } from '../../redux/action/themeAction';
import { DataGrid } from '@material-ui/data-grid';
import { saveInvoiceInBilling, saveBillResponse, saveBillingData, clearBilling } from '../../redux/action/cartAction';
import { removeOfflineOrder, removeAllOfflineOrder } from '../../redux/action/offlineAction';
import SalesOrderPopup from "../../pages/customer-history/SalesOrderPopup"

function OfflineSales() {
    const dispatch = useDispatch()
    const offlineData = useSelector((state) => state.offlineData)
    const checkoutData = useSelector((state) => state.checkoutData)
    const [popup, setPopup] = useState(false)

    useEffect(() => {
        dispatch(pageTitle('Sales Record'));
    }, [dispatch])

    const handleGetRowId = (e) => {
        return (e.off_ref_no) ? e.off_ref_no + Math.random() : Math.random();
    }

    const renderPaymentType = (e) => {
        return e.row.payments.payment_type;
    }

    const renderPayment = (e) => {
        let row = e.row
        let paymentAmt = row.payments.payment_amount;
        return StoreHelper.getCurrencyFormatted(paymentAmt)
    }

    const clearAllOfflineOrders = useCallback(() => {
        dispatch(removeAllOfflineOrder());
    }, [dispatch])

    const clearOfflineOrder = useCallback((e) => {
        dispatch(removeOfflineOrder(e.rowIndex));
    }, [dispatch])

    const saveResponseData = useCallback((resData, inv) => {
        var responseData = {}
        var orderdate = CartHelper.formatOrderDate(resData.customer.order_date);
        responseData.date = orderdate
        responseData.invoice_num = inv
        responseData.sale_id = resData.sale_id
        responseData.success = true
        dispatch(saveBillResponse(responseData));
    }, [dispatch])

    const loadPrint = useCallback((sale) => {
        var resData = {
            customer: {
                amount: sale.payments.payment_amount,
                order_date: sale.order_date,
                phone_number: sale.cphone
            },
            data: sale.cart,
            invoice: sale.off_ref_no,
            sales_data: {
                applyDisWithoutTax: sale.applyDisWithoutTax,
                discount: sale.payments.discount,
                nettotal: sale.payments.payment_amount,
                subtotal: sale.payments.subtotal,
                tax: sale.payments.totaltax,
            },
            success: true

        };
        dispatch(saveBillingData(resData))
        dispatch(saveInvoiceInBilling(sale.off_ref_no));
        saveResponseData(resData, sale.off_ref_no);
        setPopup(true);
    }, [dispatch, saveResponseData])

    const printSale = useCallback((sale) => {
        loadPrint(sale);
    }, [loadPrint])

    const renderPrint = useCallback((e) => {
        return (
            <div>
                <Grid container spacing={1}>
                    <Grid item>
                        <Button className="background-blue" variant="contained" size="small" onClick={() => printSale(e.row)}>
                            View & Print
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button className="primary-background" variant="contained" size="small" onClick={() => clearOfflineOrder(e)}>
                            Clear
                        </Button>
                    </Grid>
                </Grid>
            </div>
        )
    }, [clearOfflineOrder, printSale])

    const closePopup = () => {
        dispatch(clearBilling());
        dispatch(saveBillResponse({}));
        setPopup(false)
    }

    const columns = useMemo(() => [
        { field: 'off_ref_no', headerName: 'Invoice No', flex: 1 },
        { field: 'order_date', headerName: 'Date', flex: 1 },
        { field: 'payment_type', headerName: 'Payment Type', flex: 1, renderCell: renderPaymentType },
        {
            field: 'payment_amount', headerName: 'Payment Amount', flex: 1,
            renderCell: renderPayment
        },
        { field: 'view', headerName: 'Action', flex: 1, renderCell: renderPrint }
    ], [renderPrint])

    return (
        <Box pt={2}>
            {offlineData && offlineData.orders ?
                <>
                    <Box p={2}>
                        <Grid container direction="row" justify="flex-end">
                            <Button className="primary-background" variant="contained" size="small" onClick={clearAllOfflineOrders}>
                                Clear All
                            </Button>
                        </Grid>
                    </Box>

                    <Box p={2} pt={0}>
                        <Paper square={true}>
                            <Box>
                                <DataGrid className="no-border-radius data-grid-bclearBillingorder" rows={offlineData.orders ? offlineData.orders : []} getRowId={handleGetRowId} columns={columns} autoHeight={true} pageSize={20} rowsPerPageOptions={[20, 40, 60]} />
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

export default OfflineSales;
