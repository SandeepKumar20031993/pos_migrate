import React, { Component } from "react";
import { Grid, Typography, Box } from "@material-ui/core";
import { connect } from "react-redux";
import CartHelper from '../../../Helper/cartHelper';

class AdditionalDiscountSummery extends Component {


  hasSummary = (summary) => {
    let isFound = false
    if (summary) {
      let keys = Object.keys(summary);
      keys.forEach(key => {
        if (summary[key] && Number(summary[key]) > 0) {
          isFound = true
          return isFound;
        }
      });
    }
    return isFound;
  }

  render() {
    const { discount, page, columnSpan } = this.props;
    const summary = CartHelper.getBillSummary();

    const hasSummary = this.hasSummary(summary);
    const columnSpan1 = (columnSpan) ? columnSpan[0] : 4;
    const columnSpan2 = (columnSpan) ? columnSpan[1] : 4;
    const columnSpan3 = (columnSpan) ? columnSpan[2] : 4;
    var billingData = CartHelper.getBillingData();
    return (

      <React.Fragment>
        {page === "billsummary" ?
          <>
            {hasSummary ?
              <>
                {summary && Number(summary.ruleDiscountAmount) > 0 ?
                  <Grid container direction="row">
                    <Grid item xs={6}>
                      <Box className={'align-left'} pl={3}>
                        <Typography component="p" className="billsummarytext">
                          Discount (Rule)
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box className={'align-right'} pr={3}>
                        <Typography component="p" className="billsummarytext">
                          {CartHelper.getCurrencyFormatted(Number(summary.ruleDiscountAmount).toFixed(2))}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                  : null
                }

                {summary && Number(summary.addItemWiseDiscAmt) > 0 ?
                  <Grid container direction="row">
                    <Grid item xs={6}>
                      <Box className={'align-left'} pl={3}>
                        <Typography component="p" className="billsummarytext">
                          Add. Discount
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box className={'align-right'} pr={3}>
                        <Typography component="p" className="billsummarytext">
                          {CartHelper.getCurrencyFormatted(Number(summary.addItemWiseDiscAmt).toFixed(2))}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                  : null
                }


                {summary && Number(summary.manualDiscAmt) > 0 ?
                  <Grid container direction="row">
                    <Grid item xs={6}>
                      <Box className={'align-left'} pl={3}>
                        <Typography component="p" className="billsummarytext">
                          Discount ({discount && discount.flatoff ? "FLAT" : discount.percentoff + "%"})
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box className={'align-right'} pr={3}>
                        <Typography component="p" className="billsummarytext">
                          {CartHelper.getCurrencyFormatted(summary.manualDiscAmt.toFixed(2))}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                  : null
                }
                {summary && Number(summary.creditNoteAmt) > 0 ? (
                  <Grid container direction="row">
                    <Grid item xs={6}>
                      <Box className={'align-left'} pl={3}>
                        <Typography component="p" className="billsummarytext">
                          CreditNote ({discount && discount.coupon ? discount.coupon : "credit"})
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box className={'align-right'} pr={3}>
                        <Typography component="p" className="billsummarytext">
                          {CartHelper.getCurrencyFormatted(summary.creditNoteAmt.toFixed(2))}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                ) : null}
                {summary && Number(summary.couponAmount) > 0 ? (
                  <Grid container direction="row">
                    <Grid item xs={6}>
                      <Box className={'align-left'} pl={3}>
                        <Typography component="p" className="billsummarytext">
                          Discount ({discount && discount.coupon ? discount.coupon : "coupon"})
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box className={'align-right'} pr={3}>
                        <Typography component="p" className="billsummarytext">
                          {/* {CartHelper.getCurrencyFormatted(summary.couponAmount.toFixed(2))} discountAmount*/}
                          {CartHelper.getCurrencyFormatted(
                            Number(summary.ruleDiscountAmount) > 0
                              ? (Number(summary.discountAmount) - Number(summary.ruleDiscountAmount)).toFixed(2)
                              : Number(summary.discountAmount).toFixed(2)
                          )}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                ) : null}
                {summary && Number(summary.redeemAmount) > 0 ?
                  <Grid container direction="row">
                    <Grid item xs={6}>
                      <Box className={'align-left'} pl={3}>
                        <Typography component="p" className="billsummarytext">
                          Discount (redeem)
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box className={'align-right'} pr={3}>
                        <Typography component="p" className="billsummarytext">
                          {CartHelper.getCurrencyFormatted(summary.redeemAmount.toFixed(2))}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                  : null
                }
              </>
              :
              <>
                {!hasSummary && billingData && billingData.sales_data && Number(billingData.sales_data.discount) > 0 ?
                  <Grid container direction="row">
                    <Grid item xs={6}>
                      <Box className={'align-left'} pl={3}>
                        <Typography component="p" className="billsummarytext">
                          Discount
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box className={'align-right'} pr={3}>
                        <Typography component="p" className="billsummarytext">
                          {CartHelper.getCurrencyFormatted(billingData.sales_data.discount)}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                  : null
                }
              </>
            }
          </>
          : null
        }
        {page === "invoice" ?
          <>
            {hasSummary ?
              <>
                {summary && Number(summary.ruleDiscountAmount) > 0 ?
                  <tr className="inv-table-row">
                    <td colSpan={columnSpan1}></td>
                    <td className="inv-table-data align-right" colSpan={columnSpan2}>
                      <Typography className="custom-font" variant="body2" component="span">
                        Discount (Rule)
                      </Typography>
                    </td>
                    <td className="inv-table-data align-right" colSpan={columnSpan3}>
                      <Typography className="custom-font" variant="body2" component="span">{CartHelper.getCurrencyFormatted(Number(summary && summary.ruleDiscountAmount).toFixed(2))}
                      </Typography>
                    </td>
                  </tr>
                  : null
                }
                {summary && Number(summary.manualDiscAmt) > 0 ?
                  <tr className="inv-table-row">
                    <td colSpan={columnSpan1}></td>
                    <td className="inv-table-data align-right" colSpan={columnSpan2}>
                      <Typography className="custom-font" variant="body2" component="span">
                        Discount ({discount && discount.flatoff ? "FLAT" : discount.percentoff + "%"})
                      </Typography>
                    </td>
                    <td className="inv-table-data align-right" colSpan={columnSpan3}>
                      <Typography className="custom-font" variant="body2" component="span">{CartHelper.getCurrencyFormatted(summary.manualDiscAmt.toFixed(2))}
                      </Typography>
                    </td>
                  </tr>
                  : null
                }
                {summary && Number(summary.creditNoteAmt) > 0 ?
                  <tr className="inv-table-row">
                    <td colSpan={columnSpan1}></td>
                    <td className="inv-table-data align-right" colSpan={columnSpan2}>
                      <Typography className="custom-font" variant="body2" component="span">
                        Discount ({discount && discount.coupon ? discount.coupon : "credit"})
                      </Typography>
                    </td>
                    <td className="inv-table-data align-right" colSpan={columnSpan3}>
                      <Typography className="custom-font" variant="body2" component="span">
                        {CartHelper.getCurrencyFormatted(summary.creditNoteAmt.toFixed(2))}
                      </Typography>
                    </td>
                  </tr>
                  : null
                }
                {summary && Number(summary.couponAmount) > 0 ?
                  <tr className="inv-table-row">
                    <td colSpan={columnSpan1}></td>
                    <td className="inv-table-data align-right" colSpan={columnSpan2}>
                      <Typography className="custom-font" variant="body2" component="span">
                        Discount ({discount && discount.coupon ? discount.coupon : "coupon"})
                      </Typography>
                    </td>
                    <td className="inv-table-data align-right" colSpan={columnSpan3}>
                      <Typography className="custom-font" variant="body2" component="span">
                        {CartHelper.getCurrencyFormatted(summary.couponAmount.toFixed(2))}
                        { }
                      </Typography>
                    </td>
                  </tr>
                  : null
                }
                {summary && Number(summary.redeemAmount) > 0 ?
                  <tr className="inv-table-row">
                    <td colSpan={columnSpan1}></td>
                    <td className="inv-table-data align-right" colSpan={columnSpan2}>
                      <Typography className="custom-font" variant="body2" component="span">
                        Discount (redeem)
                      </Typography>
                    </td>
                    <td className="inv-table-data align-right" colSpan={columnSpan3}>
                      <Typography className="custom-font" variant="body2" component="span">
                        {CartHelper.getCurrencyFormatted(summary.redeemAmount.toFixed(2))}
                      </Typography>
                    </td>
                  </tr>
                  : null
                }
              </>
              :
              <>
                {!hasSummary && billingData && billingData.sales_data && Number(billingData.sales_data.discount) > 0 ?
                  <tr className="inv-table-row">
                    <td colSpan={columnSpan1}></td>
                    <td className="inv-table-data align-right" colSpan={columnSpan2}>
                      <Typography className="custom-font" variant="body2" component="span">
                        Discount
                      </Typography>
                    </td>
                    <td className="inv-table-data align-right" colSpan={columnSpan3}>
                      <Typography className="custom-font" variant="body2" component="span">
                        {CartHelper.getCurrencyFormatted(billingData.sales_data.discount)}
                      </Typography>
                    </td>
                  </tr>
                  : null
                }
              </>
            }
          </>
          : null
        }
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => ({
  cartProduct: state.cartProduct,
  productData: state.productData,
  returnData: state.returnData,
  customerData: state.customerData,
  discount: state.discount
});
export default connect(mapStateToProps, null)(AdditionalDiscountSummery);