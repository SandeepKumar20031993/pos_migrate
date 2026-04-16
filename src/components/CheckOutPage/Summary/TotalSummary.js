import React, { Component, Fragment } from 'react'
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
//import PropTypes from 'prop-types';
import { Grid, Typography, Box, Fab, Avatar, IconButton } from '@material-ui/core'
import { Info } from '@material-ui/icons'
import CartHelper from '../../../Helper/cartHelper'

const Styles = theme => ({
    qtybox: {
        width: 65,
        height: 30,
        marginLeft: 10,
        textAlign: 'center',
        border: '1px solid #c2c2c2',
        borderRadius: 4,
        fontSize: 14,
        color: '#313131',
        display: 'inline-block',
        backgroundColor: '#fff',
        lineHeight: '26px',
    },
    totalamount: {
        fontSize: 20,
        fontWeight: 'bold',
    }
});

class TotalSummary extends Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }

    render() {
        const { classes, cartProduct, returnData, exchange } = this.props;
        const totalQty = Number(CartHelper.getTotalQty());
        let totalAmount = CartHelper.getTotalAmount();

        // Calculate net total paid
        let netTotalPaid = Number(returnData?.sales_data?.nettotal) - (returnData?.sales_data?.delivery_charge ? Number(returnData?.sales_data?.delivery_charge) : 0)
        if (!CartHelper.isEmpty(exchange?.data)) {
            netTotalPaid = Number(exchange?.data?.sales_data?.nettotal) - (exchange?.data?.sales_data?.delivery_charge ? Number(exchange?.data?.sales_data?.delivery_charge) : 0)
        }

        // Calculate old products total (items being returned/exchanged)
        const oldProductsTotal = cartProduct
            .filter(product => product.isExchange)
            .reduce((total, product) => {
                const rulesAppliedData = CartHelper.getRulesAppliedData(product);
                const discountedPrice = rulesAppliedData?.price || product.price;
                return total + discountedPrice * product.qty;
            }, 0);

        // Calculate new products total (items being added in exchange)
        const newProductsTotal = cartProduct
            .filter(product => !product.isExchange)
            .reduce((total, product) => {
                const rulesAppliedData = CartHelper.getRulesAppliedData(product);
                const discountedPrice = rulesAppliedData?.price || product.price;
                return total + discountedPrice * product.qty;
            }, 0);

        // Calculate display amount based on scenario
        // const getDisplayAmount = () => {
        //     // RETURN CASE - Always refund the value of returned items
        //     if (returnData.barcode_return) {
        //         const refundAmount = oldProductsTotal;
        //         return 'Refund Amount : ' + CartHelper.getCurrencyFormatted(refundAmount);
        //     }

        //     // EXCHANGE CASE - Calculate difference between new and old items
        //     if (!CartHelper.isEmpty(exchange?.data) && exchange?.data?.success) {
        //         const differenceAmount = newProductsTotal - oldProductsTotal;

        //         if (differenceAmount > 0) {
        //             return 'Due Amount : ' + CartHelper.getCurrencyFormatted(differenceAmount);
        //         } else if (differenceAmount < 0) {
        //             return 'Refund Amount : ' + CartHelper.getCurrencyFormatted(Math.abs(differenceAmount));
        //         } else {
        //             return 'No Amount Due';
        //         }
        //     }

        //     // DEFAULT CASE
        //     return 'Refund Amount : ' + CartHelper.getCurrencyFormatted(totalAmount);
        // };

        const getDisplayAmount = () => {
            // RETURN CASE - Always refund the value of returned items
            if (returnData.barcode_return) {
                // Calculate total of only return items (not exchange items)
                const returnItemsTotal = cartProduct
                    .filter(product => !product.isExchange) // In return case, returned items are NOT marked as exchange
                    .reduce((total, product) => {
                        const rulesAppliedData = CartHelper.getRulesAppliedData(product);
                        const discountedPrice = rulesAppliedData?.price || product.price;
                        return total + discountedPrice * product.qty;
                    }, 0);

                return 'Refund Amount : ' + CartHelper.getCurrencyFormatted(returnItemsTotal);
            }

            // EXCHANGE CASE - Calculate difference between new and old items
            if (!CartHelper.isEmpty(exchange?.data) && exchange?.data?.success) {
                const differenceAmount = newProductsTotal - oldProductsTotal;

                if (differenceAmount > 0) {
                    return 'Due Amount : ' + CartHelper.getCurrencyFormatted(differenceAmount);
                } else if (differenceAmount < 0) {
                    return 'Refund Amount : ' + CartHelper.getCurrencyFormatted(Math.abs(differenceAmount).toFixed(2));
                } else {
                    return 'No Amount Due';
                }
            }

            // DEFAULT CASE
            return 'Refund Amount : ' + CartHelper.getCurrencyFormatted(totalAmount);
        };

        const displayAmount = getDisplayAmount();

        return (
            <Fragment>
                <Grid item style={{ display: 'inline-flex', justifyContent: 'end' }}  >
                    <Typography variant="body1" component="span">
                        Total Qty
                    </Typography>
                    <Typography variant="h6" component="span" className={classes.qtybox} >
                        {Number(totalQty).toFixed(3)}
                    </Typography>
                </Grid>

                <Grid item >
                    <Grid container direction="row" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'end' }}>
                        <Box mr={2}>
                            {!returnData.success && (CartHelper.isEmpty(exchange?.data)) ?
                                <Typography variant="button" className={classes.totalamount}>
                                    {CartHelper.getCurrencyFormatted(totalAmount)}
                                </Typography>
                                :
                                <>
                                    <Typography variant="body2" component="p">
                                        Paid Amount : {CartHelper.getCurrencyFormatted(netTotalPaid)}
                                    </Typography>
                                    <Typography variant="h6" component="p">
                                        {displayAmount}
                                    </Typography>
                                </>
                            }
                        </Box>
                        <Box>
                            <IconButton
                                size={'small'}
                                id="summary-info-btn"
                                title="Summary Info [Alt+I]"
                                onClick={() => this.props.handleClickOpen()}
                                disabled={CartHelper.isEmpty(cartProduct) ? true : false}
                            >
                                <Info style={{ color: '#ee3e3', fontSize: '26px' }} />
                            </IconButton>
                        </Box>
                    </Grid>
                </Grid>
            </Fragment>
        )
    }
}

const mapStateToProps = state => ({
    cartProduct: state.cartProduct,
    returnData: state.returnData,
    exchange: state.exchange,
});

export default connect(mapStateToProps, null)(withStyles(Styles)(TotalSummary));