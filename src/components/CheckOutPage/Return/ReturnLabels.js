import React, { Component } from 'react'
import { Grid, Box, Typography } from '@material-ui/core'
import { connect } from "react-redux";
import CartHelper from '../../../Helper/cartHelper'


class ReturnLabels extends Component {
    render() {
        const { returnData } = this.props;
        var paidAmount = returnData.sales_data.nettotal
        if (returnData.barcode_return) {
            paidAmount = CartHelper.getTotalAmount()
        }

        var totalAmount = CartHelper.getTotalAmount();
        var dueAmount = Number(totalAmount) - Number(paidAmount)
        var refundAmount = Number(paidAmount) - Number(totalAmount)

        return (
            <>
                <Grid container direction="row" spacing={1} className={''}>
                    <Grid item xs={6}>
                        <Box className={'align-left'} pl={3} pt={1}>
                            <Typography variant="h6" component="p" gutterBottom className={'color-green'}>
                                Paid Amount
                        </Typography>
                        </Box>
                    </Grid>

                    <Grid item xs={6}>
                        <Box className={'align-right'} pr={3} pt={1}>
                            <Typography variant="h6" component="p" gutterBottom className={'color-green'}>
                                {CartHelper.getCurrencyFormatted(paidAmount)}
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>
                {returnData.barcode_return ?
                    <>
                        <Grid container direction="row" spacing={1} className={''}>
                            <Grid item xs={6}>
                                <Box className={'align-left'} pl={3} pt={1}>
                                    <Typography variant="h6" component="p" gutterBottom>
                                        Refund Amount
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={6}>
                                <Box className={'align-right'} pr={3} pt={1}>
                                    <Typography variant="h6" component="p" gutterBottom>
                                        {CartHelper.getCurrencyFormatted(Number(totalAmount).toFixed(2))}
                                    </Typography>
                                </Box>
                            </Grid>
                        </Grid>
                    </>
                    :
                    <>
                        {Number(totalAmount) > Number(paidAmount) ?
                            <Grid container direction="row" spacing={1} className={''}>
                                <Grid item xs={6}>
                                    <Box className={'align-left'} pl={3} pt={1}>
                                        <Typography variant="h6" component="p" gutterBottom>
                                            Due Amount
                                    </Typography>
                                    </Box>
                                </Grid>

                                <Grid item xs={6}>
                                    <Box className={'align-right'} pr={3} pt={1}>
                                        <Typography variant="h6" component="p" gutterBottom>
                                            {CartHelper.getCurrencyFormatted(Number(dueAmount).toFixed(2))}
                                        </Typography>
                                    </Box>
                                </Grid>
                            </Grid>
                            :
                            <Grid container direction="row" spacing={1} className={''}>
                                <Grid item xs={6}>
                                    <Box className={'align-left'} pl={3} pt={1}>
                                        <Typography variant="h6" component="p" gutterBottom>
                                            Refund Amount
                                    </Typography>
                                    </Box>
                                </Grid>

                                <Grid item xs={6}>
                                    <Box className={'align-right'} pr={3} pt={1}>
                                        <Typography variant="h6" component="p" gutterBottom>
                                            {CartHelper.getCurrencyFormatted(Number(refundAmount).toFixed(2))}
                                        </Typography>
                                    </Box>
                                </Grid>
                            </Grid>
                        }
                    </>

                }

            </>
        )
    }
}

const mapStateToProps = state => ({
    cartProduct: state.cartProduct,
    productData: state.productData,
    returnData: state.returnData,
});
export default connect(mapStateToProps, null)(ReturnLabels)
