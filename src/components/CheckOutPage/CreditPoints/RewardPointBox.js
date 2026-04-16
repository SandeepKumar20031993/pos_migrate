import React, { Component } from 'react'
import { connect } from "react-redux";
import { fetch_customer_data, save_customer_data, apply_redeem_coupon, apply_redeem_amount, setChecked } from '../../../redux/action/customerAction';
import PropTypes from 'prop-types';
import { Grid, Paper, Typography, TextField, Button, Box, Card, CardHeader, CardContent } from '@material-ui/core';
import CartHelper from '../../../Helper/cartHelper';
import { isDiscountCouponApplied, applyCoupon, applyPercentoff, applyFlatoff, clearAppliedDiscount, fetchCoupon } from '../../../redux/action/discountAction';
import { prepareCheckout } from '../../../redux/action/cartAction';
import RewardHelper from '../../../Helper/rewardHelper';

class RewardPointBox extends Component {

  handleRedeemAmount = event => {
    var eventValue = event.target.value
    const { customerData, checkoutData } = this.props
    var rewardPoint = RewardHelper.getTotalReward(customerData);
    var payment_amount = checkoutData.data.payment_amount
    var array = [rewardPoint, payment_amount];
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
    if (!CartHelper.isEmpty(this.props.returnData) || !CartHelper.isEmpty(this.props.exchange.data)) {
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
    const { customerData } = this.props
    var custRecord = (customerData.custrecord.data) ? customerData.custrecord.data : ""
    var totalshopping = CartHelper.getTotalShopping(customerData)
    var rewardPoint = RewardHelper.getTotalReward(customerData);
    return (

      <Card elevation={0}>

        <CardHeader title={"Customer Rewards"} />

        <CardContent p={1}>
          <Grid container justify="space-between" alignItems="flex-end">
            <Grid item xs={6} sm>
              <Typography variant="caption" component="p">
                {/* Life-time Sale : <strong>{totalshopping}</strong> */}
              </Typography>
              {custRecord.reward_points && rewardPoint ?
                <>
                  <Typography variant="caption" component="p">
                    {(custRecord.pkgName) ?
                      <>
                        {"Group name : "}
                        <strong>
                          {custRecord.pkgName}
                        </strong>
                      </> : ""}
                  </Typography>
                  <Typography variant="caption" component="p">
                    Reward point : <strong>{custRecord.reward_points}</strong>
                  </Typography>
                  <Typography variant="caption" component="p">
                    Reward amount : <strong>{CartHelper.getCurrencyFormatted(rewardPoint.toFixed(2))}</strong>
                  </Typography>
                </>
                : null}
            </Grid>
            {custRecord.reward_points && rewardPoint ?
              <Grid item xs={6} sm={5}>
                <Typography variant="caption" component="span">
                  Redeem amount
                </Typography>
                <form onSubmit={this.handleRedeem} >
                  <Grid item container direction="row" justify="space-between" alignItems="center" spacing={1}>
                    <Grid item xs>
                      <TextField
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
                    <Grid item xs>
                      {customerData.isChecked ?
                        <Button variant="contained" size="small" type="button" className="width-100" onClick={this.clearRedeem}>Clear</Button>
                        :
                        <Button variant="contained" size="small" type="submit" color="secondary" className="width-100">Redeem</Button>
                      }
                    </Grid>
                  </Grid>
                </form>
              </Grid>
              : null
            }
          </Grid>
        </CardContent>
      </Card>
    )
  }

}


RewardPointBox.propTypes = {
  fetch_customer_data: PropTypes.func.isRequired,
  save_customer_data: PropTypes.func.isRequired,
  apply_redeem_coupon: PropTypes.func.isRequired,
  apply_redeem_amount: PropTypes.func.isRequired,
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
  returnData: state.returnData,
  exchange: state.exchange
});

const mapActionsToProps = {
  fetch_customer_data,
  save_customer_data,
  apply_redeem_coupon,
  apply_redeem_amount,
  setChecked,
  isDiscountCouponApplied,
  applyCoupon,
  applyPercentoff,
  applyFlatoff,
  clearAppliedDiscount,
  fetchCoupon,
  prepareCheckout
}


export default connect(mapStateToProps, mapActionsToProps)(RewardPointBox);
