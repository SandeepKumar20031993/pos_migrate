import React, { Component } from 'react'
import { Box, Card, Grid, Typography } from '@material-ui/core';
import CartHelper from '../../Helper/cartHelper';
import { connect } from "react-redux";


export class bottomSummary extends Component {
    render() {
        const summary = CartHelper.getBillSummary();
        const totalAmount = CartHelper.getTotalAmount();
        return (
            <Box className="width-100" p={2} mt={1}>
                <Grid container spacing={3} alignItems="center" className="width-100">
                    <Grid item xs>
                        <Card className="background-blue">
                            <Box p={2}>
                                <Grid container direction="column" alignItems="center">
                                    <Grid item>
                                        <Typography variant="h5" component="strong" className="bold-i">
                                            {CartHelper.getCurrencyFormatted(summary.beforeDiscount)}
                                        </Typography>
                                    </Grid>
                                    <Grid item>
                                        <Typography variant="subtitle2" component="strong">
                                            Subtotal
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Card>
                    </Grid>
                    <Grid item xs>
                        <Card className="background-blue">
                            <Box p={2}>
                                <Grid container direction="column" alignItems="center">
                                    <Grid item>
                                        <Typography variant="h5" component="strong" className="bold-i">
                                            {CartHelper.getCurrencyFormatted(summary.discountAmount)}
                                        </Typography>
                                    </Grid>
                                    <Grid item>
                                        <Typography variant="subtitle2" component="strong">
                                            Discount
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Card>
                    </Grid>
                    <Grid item xs>
                        <Card className="background-blue width-100">
                            <Box p={2}>
                                <Grid container direction="column" alignItems="center">
                                    <Grid item>
                                        <Typography variant="h5" component="strong" className="bold-i">
                                            {CartHelper.getCurrencyFormatted(summary.taxamount)}
                                        </Typography>
                                    </Grid>
                                    <Grid item>
                                        <Typography variant="subtitle2" component="strong">
                                            Tax
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Card>
                    </Grid>
                    <Grid item xs>
                        <Card className="background-blue width-100">
                            <Box p={2}>
                                <Grid container direction="column" alignItems="center">
                                    <Grid item>
                                        <Typography variant="h5" component="strong" className="bold-i">
                                            {CartHelper.getCurrencyFormatted(Math.round(totalAmount).toFixed(2))}
                                        </Typography>
                                    </Grid>
                                    <Grid item>
                                        <Typography variant="subtitle2" component="strong">
                                            Grand Total
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Card>
                    </Grid>
                </Grid>
            </Box>
        )
    }
}

const mapStateToProps = state => ({
    cartProduct: state.cartProduct,
    productData: state.productData,
    returnData: state.returnData,
    editData: state.editData,
    discount: state.discount,
});

export default connect(mapStateToProps, null)(bottomSummary)
