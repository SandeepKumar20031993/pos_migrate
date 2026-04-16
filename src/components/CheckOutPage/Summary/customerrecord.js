import React, { Component } from 'react'
import { connect } from "react-redux";
import { fetch_customer_data, save_customer_data, apply_redeem_coupon, apply_redeem_amount, setChecked, clear_customer_data } from '../../../redux/action/customerAction';
import PropTypes from 'prop-types';
// design
import { Grid, Paper, Typography, TextField, Button } from '@material-ui/core';
import { withStyles } from "@material-ui/core/styles";
import CartHelper from '../../../Helper/cartHelper';
import { isDiscountCouponApplied, applyCoupon, applyPercentoff, applyFlatoff, clearAppliedDiscount, fetchCoupon } from '../../../redux/action/discountAction';
import { prepareCheckout } from '../../../redux/action/cartAction';

const Styles = theme => ({
  paper: {
    margin: "16px 0 0",
    marginBottom: 0,
    background: '#fff',
    padding: "5px 10px",
  },
  totalshop: {
    color: '#717171',
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 4,

  },
  coupon: {
    color: '#717171',
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 6,

  },
  coupontext: {
    color: '#717171',
    fontSize: 12,
    fontWeight: 'bold',
  },
  textField: {
    marginTop: 0,
    marginBottom: 0,
  },
  input: {
    color: '#717171',
    fontWeight: 'bold',
    padding: "0 !important",
    backgroundColor: "#fff",
    height: 32,
  },
  formcontrol: {
    marginLeft: 2,
  },
  root: {
    padding: 0,
    paddingRight: 5,
    '&:hover': {
      backgroundColor: 'transparent',
    },
  },
  icon: {
    borderRadius: 3,
    width: 16,
    height: 16,
    boxShadow: 'inset 0 0 0 1px rgba(16,22,26,.2), inset 0 -1px 0 rgba(16,22,26,.1)',
    backgroundColor: '##71717100',

    'input:hover ~ &': {
      backgroundColor: '#ebf1f5',
    },
    'input:disabled ~ &': {
      boxShadow: 'none',
      background: 'rgba(206,217,224,.5)',
    },
  },
  checkedIcon: {
    backgroundColor: '#137cbd',
    backgroundImage: 'linear-gradient(180deg,hsla(0,0%,100%,.1),hsla(0,0%,100%,0))',
    '&:before': {
      display: 'block',
      width: 16,
      height: 16,
      backgroundImage:
        "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath" +
        " fill-rule='evenodd' clip-rule='evenodd' d='M12 5c-.28 0-.53.11-.71.29L7 9.59l-2.29-2.3a1.003 " +
        "1.003 0 00-1.42 1.42l3 3c.18.18.43.29.71.29s.53-.11.71-.29l5-5A1.003 1.003 0 0012 5z' fill='%23fff'/%3E%3C/svg%3E\")",
      content: '""',
    },
    'input:hover ~ &': {
      backgroundColor: '#106ba3',
    },
  },
  checkbox: {
    color: '#717171',
    padding: 0,
    backgroundColor: '#fff'
  }
});


class PaymentBill extends Component {

  constructor(props) {
    super(props);
    this.state = {

    };
  }

  componentDidMount() {
    this.props.clear_customer_data();
    const { checkoutData } = this.props
    var form = {}
    form.phone = checkoutData.customer.phone_number
    this.props.fetch_customer_data(form)
      .then(res => res.json())
      .then(products => {
        this.props.save_customer_data(products);
      });
    this.props.setChecked(false);
    this.props.apply_redeem_amount("");
  }


  handleRedeemAmount = event => {
    var eventValue = event.target.value
    const { customerData, checkoutData } = this.props
    var giftval = CartHelper.getCouponBalance(customerData);
    var payment_amount = checkoutData.data.payment_amount
    var array = [giftval, payment_amount];
    var maxRedemtion = Math.min(...array);
    if (maxRedemtion >= eventValue) {
      this.props.apply_redeem_amount(eventValue);
    } else {
      this.props.apply_redeem_amount(maxRedemtion);
    }

    //clearing data on change
    this.props.setChecked(false);
    if (CartHelper.isAppliedManualDiscount()) {
      this.props.isDiscountCouponApplied(true);
    }
    this.prepareCheckout()
  }
  handleRedeem = (e) => {
    e.preventDefault();
    const { customerData } = this.props
    if (customerData.redeemamount > 0) {
      this.props.setChecked(true);
      this.props.isDiscountCouponApplied(true);
    }
    this.prepareCheckout()
  }

  prepareCheckout = () => {
    var checkoutData = {};
    var summary = CartHelper.getBillSummary();
    checkoutData.total_qty = CartHelper.getTotalQty();
    checkoutData.subtotal = summary.beforeDiscount;
    checkoutData.discount = summary.discountAmount;
    checkoutData.totaltax = summary.taxamount;
    if (!CartHelper.isEmpty(this.props.returnData)) {
      var currentTotal = Number(CartHelper.getTotalAmount());
      var paidTotal = Number(this.props.returnData.sales_data.nettotal);
      checkoutData.payment_amount = currentTotal - paidTotal;
    } else {
      checkoutData.payment_amount = CartHelper.getTotalAmount();
    }
    checkoutData.payment_type = 'CASH';
    checkoutData.card_no = '';
    this.props.prepareCheckout(checkoutData);
  }

  clearRedeem = () => {
    this.props.setChecked(false);
    this.props.apply_redeem_amount("");
  }

  render() {
    const { classes } = this.props;
    const { customerData } = this.props

    if (customerData.custrecord.success === true) {
      var totalshopping = CartHelper.getTotalShopping(customerData)
      var giftval = CartHelper.getCouponBalance(customerData);
      return (
        <span>
          <Paper className={classes.paper}>
            <Grid container justify="space-between">
              <Grid item xs={6} sm={6}>
                <Typography className={classes.totalshop}>
                  Customer life-time Sale : {totalshopping}
                </Typography>
                <Typography className={classes.coupon}>
                  Store credit : {CartHelper.getCurrencyFormatted(giftval.toFixed(2))}
                </Typography>
              </Grid>
              <Grid item xs={6} sm={5}>
                <Typography variant="caption" component="span" className={classes.coupon}>
                  Redeem amount
                </Typography>
                <form onSubmit={this.handleRedeem} >
                  <Grid item container direction="row" justify="space-between" alignItems="center">
                    <Grid item xs={7}>
                      <TextField
                        className={classes.textField}
                        name="redeeminput"
                        value={customerData.redeemamount}
                        onChange={this.handleRedeemAmount}
                        variant="outlined"
                        type="tel"
                        inputProps={{
                          className: "padding-7 width-100 background-white"
                        }}
                      />
                    </Grid>
                    <Grid item xs={5}>
                      {customerData.isChecked ?
                        <Button variant="contained" size="small" type="button" className="width-100" onClick={this.clearRedeem}>Clear</Button>
                        :
                        <Button variant="contained" size="small" type="submit" color="secondary" className="width-100">Redeem</Button>
                      }
                    </Grid>
                  </Grid>
                </form>
              </Grid>
            </Grid>
          </Paper>
        </span>
      )
    }

    else {
      return (
        <></>
      )
    }
  }

}


PaymentBill.propTypes = {
  fetch_customer_data: PropTypes.func.isRequired,
  save_customer_data: PropTypes.func.isRequired,
  apply_redeem_coupon: PropTypes.func.isRequired,
  apply_redeem_amount: PropTypes.func.isRequired,
  clear_customer_data: PropTypes.func.isRequired,
  setChecked: PropTypes.func.isRequired,
  isDiscountCouponApplied: PropTypes.func.isRequired,
  applyCoupon: PropTypes.func.isRequired,
  applyPercentoff: PropTypes.func.isRequired,
  applyFlatoff: PropTypes.func.isRequired,
  clearAppliedDiscount: PropTypes.func.isRequired,
  fetchCoupon: PropTypes.func.isRequired,
  prepareCheckout: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  customerData: state.customerData,
  checkoutData: state.checkoutData,
  discount: state.discount,
  returnData: state.returnData
});

const mapActionsToProps = {
  fetch_customer_data,
  save_customer_data,
  apply_redeem_coupon,
  apply_redeem_amount,
  clear_customer_data,
  setChecked,
  isDiscountCouponApplied,
  applyCoupon,
  applyPercentoff,
  applyFlatoff,
  clearAppliedDiscount,
  fetchCoupon,
  prepareCheckout
}


export default connect(mapStateToProps, mapActionsToProps)(withStyles(Styles)(PaymentBill));
