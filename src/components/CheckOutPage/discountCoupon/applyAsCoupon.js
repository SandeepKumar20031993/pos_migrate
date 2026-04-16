import React, { Component } from 'react'
import { Box, Typography, Grid, FormGroup, FormControlLabel, Switch } from '@material-ui/core'
import { connect } from "react-redux";
import PropTypes from 'prop-types';
import CartHelper from '../../../Helper/cartHelper'
import { spotApplyDiscount, isDiscountCouponApplied, applyFlatoff, clearAppliedDiscount } from '../../../redux/action/discountAction'

class applyAsCoupon extends Component {
    constructor(props) {
        super(props)

        this.state = {

        }
    }

    handleChange = () => {
        this.props.clearAppliedDiscount()
        const { discount } = this.props
        const summary = CartHelper.getBillSummary();
        var discountAmount = summary.discountAmount
        if (!discount.spotApply) {
            this.props.spotApplyDiscount(!discount.spotApply)
            this.props.isDiscountCouponApplied(true)
            this.props.applyFlatoff(discountAmount)
        } else {
            this.props.clearAppliedDiscount()
        }
    }

    render() {
        const { discount, cartProduct } = this.props
        const summary = CartHelper.getBillSummary();
        var discountAmount = summary.discountAmount
        if (CartHelper.isRulesAppliedAsCoupon()) {
            if (CartHelper.isAppliedManualDiscount() && !CartHelper.isSpotApplied()) {
                discountAmount = summary.ruleDiscountAmount
            }
        }
        return (
            <>
                {!CartHelper.isEmpty(cartProduct) && Number(discountAmount) > 0 ?
                    <Box p={1} pb={2} pr={0}>
                        <Grid container justifyContent="flex-end" alignItems="center">
                            <Box p={1}>
                                <Typography variant="subtitle2" component="span">
                                    Voucher Discount Value :
                                </Typography>
                                <Typography variant="subtitle1" component="span" className="font-weight-900">
                                    {CartHelper.getCurrencyFormatted(Number(discountAmount).toFixed(2))}
                                </Typography>
                            </Box>
                            <Box p={1} pr={0}>
                                <FormGroup row>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={discount.spotApply}
                                                onChange={this.handleChange}
                                                value={discount.spotApply}
                                                color="secondary"
                                            />
                                        }
                                        label="Spot Apply"
                                    />
                                </FormGroup>
                            </Box>
                        </Grid>
                    </Box>
                    : null}
            </>
        )
    }
}

applyAsCoupon.propTypes = {
    spotApplyDiscount: PropTypes.func.isRequired,
    isDiscountCouponApplied: PropTypes.func.isRequired,
    applyFlatoff: PropTypes.func.isRequired,
    clearAppliedDiscount: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
    customerData: state.customerData,
    discount: state.discount,
    cartProduct: state.cartProduct,
});
export default connect(mapStateToProps, { spotApplyDiscount, isDiscountCouponApplied, applyFlatoff, clearAppliedDiscount })(applyAsCoupon)
