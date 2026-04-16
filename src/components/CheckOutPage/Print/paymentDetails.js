import React, { Component } from 'react'
import { Box, Typography, Grid } from '@material-ui/core';
import CartHelper from '../../../Helper/cartHelper'

class paymentDetails extends Component {

    render() {
        const checkoutData = CartHelper.getCheckoutData();
        var responseData = checkoutData.responseData
        var billingData = checkoutData.billingData
        var credit_balance = (billingData && billingData.sales_data && billingData.sales_data.credit_balance) ? billingData.sales_data.credit_balance : 0
        var payment_amount = checkoutData.data.payment_amount
        if (Number(payment_amount) < 0) {
            payment_amount = Number(0).toFixed(2)
        }
        return (
            <Box p={0} className="align-left background-white">
                <Grid container>
                    <Grid item>
                        <table className="inv-table" colSpan={12}>
                            <tbody>
                                {checkoutData.data.payment_type !== 'OTHER' ?
                                    <>
                                        {checkoutData.data.payment_type && payment_amount ?
                                            <tr className="inv-table-row">
                                                <td className="inv-table-data-left padding-7 padding-left-0">
                                                    <Typography className="custom-font" variant="body2" component="p">{"Payment details : "}</Typography>
                                                </td>
                                                <td className="inv-table-data-left padding-7">
                                                    <Typography className="custom-font" variant="body2" component="p">{checkoutData.data.payment_type + ":"}</Typography>
                                                </td>
                                                <td className="inv-table-data-right padding-7">
                                                    <Typography className="custom-font" variant="body2" component="p">{CartHelper.getCurrencyFormatted(payment_amount)}</Typography>
                                                </td>
                                            </tr>
                                            : null
                                        }
                                    </>
                                    :
                                    <>
                                        <tr className="inv-table-row">
                                            <td className="inv-table-data-left padding-7 padding-left-0" rowSpan={4} colSpan={3}>
                                                <Typography className="custom-font" variant="body2" component="p">{"Payment details : "}</Typography>
                                            </td>
                                        </tr>
                                        {checkoutData.otherPayment.cash ?
                                            <tr className="inv-table-row">
                                                <td className="inv-table-data-left " colSpan={2}>
                                                    <Typography className="custom-font" variant="body2" component="p">{"CASH :"}</Typography>
                                                </td>
                                                <td className="inv-table-data-right ">
                                                    <Typography className="custom-font" variant="body2" component="p">{CartHelper.getCurrencyFormatted(checkoutData.otherPayment.cash)}</Typography>
                                                </td>
                                            </tr>
                                            : null}
                                        {checkoutData.otherPayment.upi ?
                                            <tr className="inv-table-row">
                                                <td className="inv-table-data-left " colSpan={2}>
                                                    <Typography className="custom-font" variant="body2" component="p">{"CASH :"}</Typography>
                                                </td>
                                                <td className="inv-table-data-right ">
                                                    <Typography className="custom-font" variant="body2" component="p">{CartHelper.getCurrencyFormatted(checkoutData.otherPayment.upi)}</Typography>
                                                </td>
                                            </tr>
                                            : null}
                                        {checkoutData.otherPayment.card ?
                                            <tr className="inv-table-row">
                                                <td className="inv-table-data-left" colSpan={2}>
                                                    <Typography className="custom-font" variant="body2" component="p">{"CARD :"}</Typography>
                                                </td>
                                                <td className="inv-table-data-right">
                                                    <Typography className="custom-font" variant="body2" component="p">{CartHelper.getCurrencyFormatted(checkoutData.otherPayment.card)}</Typography>
                                                </td>
                                            </tr>
                                            : null}
                                        {checkoutData.otherPayment.other ?
                                            <tr className="inv-table-row">
                                                <td className="inv-table-data-left" colSpan={2}>
                                                    <Typography className="custom-font" variant="body2" component="p">{checkoutData.otherPayment.otherType + ":"}</Typography>
                                                </td>
                                                <td className="inv-table-data-right">
                                                    <Typography className="custom-font" variant="body2" component="p">{CartHelper.getCurrencyFormatted(checkoutData.otherPayment.other)}</Typography>
                                                </td>
                                            </tr>
                                            : null}
                                    </>
                                }
                                <>
                                    {responseData.RRN !== undefined && responseData.RRN ?
                                        <tr className="inv-table-row">
                                            <td className="inv-table-data-left padding-7 padding-left-0">
                                                <Typography className="custom-font" variant="body2" component="p">{"RRN : "}</Typography>
                                            </td>
                                            <td className="inv-table-data-right padding-7" colSpan={2}>
                                                <Typography className="custom-font" variant="body2" component="p">{responseData.RRN}</Typography>
                                            </td>
                                        </tr>
                                        : null}
                                </>
                                <>
                                    {Number(credit_balance) > 0 ?
                                        <tr className="inv-table-row">
                                            <td className="inv-table-data-left padding-7 padding-left-0">
                                                <Typography className="custom-font" variant="body2" component="p">{"Credit Balance : "}</Typography>
                                            </td>
                                            <td className="inv-table-data-right padding-7" colSpan={2}>
                                                <Typography className="custom-font" variant="body2" component="p">{CartHelper.getCurrencyFormatted(billingData.sales_data.credit_balance)}</Typography>
                                            </td>
                                        </tr>
                                        : null
                                    }
                                </>
                            </tbody>
                        </table>
                    </Grid>
                </Grid>
            </Box>
        )
    }
}
export default paymentDetails
