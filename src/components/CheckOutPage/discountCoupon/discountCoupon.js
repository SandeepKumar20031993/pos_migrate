import React, { Component } from 'react'
//import ReactDOM from 'react-dom'
import { Box, Grid, Paper, Button } from '@material-ui/core';
import { connect } from "react-redux";
import PropTypes from 'prop-types';
import { isDiscountCouponApplied, applyCoupon, applyPercentoff, applyFlatoff, clearAppliedDiscount, fetchCoupon, saveCouponData, fetchCreditNoteCoupon, updateInvoice, saveCreditData } from '../../../redux/action/discountAction';
import CartHelper from '../../../Helper/cartHelper';
import { loading, alert } from '../../../redux/action/InterAction'
import { updateCPhone } from '../../../redux/action/cartAction';
import StoreHelper from '../../../Helper/storeHelper';
import Coupon from './coupon/Coupon';
import Discount from './discount/Discount';



class discountCoupon extends Component {
    constructor(props) {
        super(props)

        this.state = {
        }
    }

    handleSubmit = event => {
        event.preventDefault();
        const { coupon, flatoff, percentoff, is_credit_note } = this.props.discount;
        if (coupon || flatoff || percentoff) {
            if (coupon && (!flatoff && !percentoff)) {
                this.props.applyPercentoff('');
                this.props.applyFlatoff('');
                if (is_credit_note) {
                    this.fetchCreditNoteCoupon();
                } else {
                    this.fetchCoupon();
                }
            } else if (percentoff && (!coupon && !flatoff)) {
                this.props.applyCoupon("");
                this.props.applyFlatoff("");
                this.props.isDiscountCouponApplied(true);
                this.props.toggle();
            } else if (flatoff && (!coupon && !percentoff)) {
                this.props.applyCoupon("");
                this.props.applyPercentoff("");
                this.props.isDiscountCouponApplied(true);
                this.props.toggle();

            }
        }
    }

    fetchCoupon = () => {
        const { discount, checkoutData } = this.props;
        const phone_number = checkoutData.customer.phone_number
        var formData = {}
        formData.coupon = discount.coupon
        formData.phone = phone_number
        this.props.loading(true)
        this.props.fetchCoupon(formData)
            .then(res => res.json())
            .then(resData => {
                if (resData.success) {
                    this.props.saveCouponData(resData)
                    this.props.isDiscountCouponApplied(true);
                    this.props.loading(false)
                    if (resData.data.type === 'fixed') {
                        this.props.alert(true, "Applied coupon discount of " + CartHelper.getCurrencyFormatted(resData.data.discount));
                    }
                    this.props.toggle();
                } else {
                    this.props.loading(false)
                    this.props.alert(true, resData.msg)
                }
            })
            .catch(error => {
                this.props.loading(false)
                this.props.alert(true, "Something went wrong!")
            })
    }

    fetchCreditNoteCoupon = () => {
        const { discount } = this.props;
        var formData = {}
        formData.crdnoteno = discount.coupon
        formData.invoiceno = discount.invoice
        this.props.loading(true)
        this.props.fetchCreditNoteCoupon(formData)
            .then(res => res.json())
            .then(resData => {
                if (resData.success) {
                    this.props.saveCreditData(resData)
                    this.props.isDiscountCouponApplied(true);
                    this.props.loading(false)
                    if (resData.credit_amt) {
                        this.props.alert(true, "Applied credit note discount of " + CartHelper.getCurrencyFormatted(resData.credit_amt));
                    }
                    this.props.toggle();
                } else {
                    this.props.loading(false)
                    this.props.alert(true, resData.message)
                }
            })
            .catch(error => {
                this.props.loading(false)
                this.props.alert(true, "Something went wrong!")
            })
    }


    clearAppliedDiscount = () => {
        this.props.clearAppliedDiscount();
        this.props.updateCPhone("")
        this.props.toggle();
    }

    resetFields = () => {
        this.props.updateCPhone("")
        this.props.clearAppliedDiscount();
    }

    render() {
        const { discount } = this.props
        const apply = discount.apply;
        const coupon = discount.coupon;
        const flatoff = discount.flatoff;
        const percentoff = discount.percentoff;

        return (
            <Box className={'discountCoupon-Box'} id={'discountCoupon-Box'} >
                <Paper>
                    <Box p={1}>
                        <form onSubmit={this.handleSubmit} className={'discountCoupon-form'}>
                            <Grid container direction="row" spacing={1} justify="center">
                                <Grid item xs container alignItems='center' justify="space-between">
                                    <Coupon />
                                </Grid>
                                {StoreHelper.isGlobalDiscountEnabled() === 1 ?
                                    <Grid item lg={6} xs={12} container alignItems='center' justify="space-between">
                                        <Discount />
                                    </Grid>
                                    : null}
                                <Grid item xs={12} container>
                                    <Grid container justify="flex-end" alignItems="center" spacing={2}>
                                        <Grid item xs>
                                            {coupon || flatoff || percentoff ?
                                                <Button size="small" type="button" variant="outlined" onClick={this.resetFields}>Reset</Button>
                                                :
                                                null
                                            }
                                        </Grid>

                                        <Grid item>
                                            <Button size="small" type="button" variant="contained" onClick={() => this.props.toggle()}>Close</Button>
                                        </Grid>

                                        {apply ?
                                            <Grid item>
                                                <Button type="button" variant="contained" color="secondary" onClick={this.clearAppliedDiscount}>Clear</Button>
                                            </Grid>
                                            :
                                            <Grid item>
                                                <Button type="submit" variant="contained" color="secondary">Apply</Button>
                                            </Grid>
                                        }
                                    </Grid>
                                </Grid>
                            </Grid>
                        </form>
                    </Box>
                </Paper>
            </Box>
        )
    }
}
discountCoupon.propTypes = {
    isDiscountCouponApplied: PropTypes.func.isRequired,
    applyCoupon: PropTypes.func.isRequired,
    applyPercentoff: PropTypes.func.isRequired,
    clearAppliedDiscount: PropTypes.func.isRequired,
    applyFlatoff: PropTypes.func.isRequired,
    fetchCoupon: PropTypes.func.isRequired,
    saveCouponData: PropTypes.func.isRequired,
    loading: PropTypes.func.isRequired,
    alert: PropTypes.func.isRequired,
    fetchCreditNoteCoupon: PropTypes.func.isRequired,
    updateInvoice: PropTypes.func.isRequired,
    updateCPhone: PropTypes.func.isRequired,
    saveCreditData: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
    suspendedCart: state.suspendedCart,
    cartProduct: state.cartProduct,
    discount: state.discount,
    checkoutData: state.checkoutData
});

const mapActionsToProps = {
    isDiscountCouponApplied,
    applyCoupon,
    applyPercentoff,
    applyFlatoff,
    clearAppliedDiscount,
    fetchCoupon,
    saveCouponData,
    fetchCreditNoteCoupon,
    saveCreditData,
    updateInvoice,
    updateCPhone,
    loading,
    alert
}

export default connect(mapStateToProps, mapActionsToProps)(discountCoupon)
