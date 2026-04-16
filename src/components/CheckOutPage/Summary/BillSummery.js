import React, { Component } from "react";
import { Grid, Typography, Box } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import CartHelper from '../../../Helper/cartHelper';
//import StoreHelper from '../../../Helper/storeHelper';
import ReturnLabels from '../Return/ReturnLabels'
import AdditionalDiscountSummery from '../discountCoupon/AdditionalDiscountSummery'


const Styles = theme => ({
  Billname: {
    textAlign: 'left',
    fontSize: 20,
    fontWeight: 'bold',
  },
  Billsummarycontent: {
    textAlign: "center",
    boxSizing: 'border-box',
    // maxWidth: 340,
    wdith: '100%',
    margin: '0 auto'
  },
  totalbill: {
    borderTop: '2px solid #717171',
    borderBottom: '2px solid #717171',
    padding: 2,

  },
  billsummarytext: {
    color: '#717171',
    fontSize: 14,
    lineHeight: 1.25,
  },
  billsummarytotal: {
    color: '#717171',
    fontSize: 16,
    fontWeight: 'bold',
  }

});
class BillSummary extends Component {

  render() {
    const { classes, returnData, checkoutData, exchange } = this.props;
    const summary = CartHelper.getBillSummary();
    var totalAmount = Number(checkoutData?.data?.payment_amount);// CartHelper.getTotalAmount();
    var subtotal = Number(checkoutData?.data?.subtotal);
    console.log("SUUUUUmmmatt", summary)
    return (
      <Grid container direction="row" className={classes.Billsummarycontent}>
        <Grid item xs={12}>
          <Box >
            <Typography component="p" gutterBottom className={classes.Billname}>
              Bill Summary
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={6}>
          <Box className={'align-left'} pl={3}>
            <Typography component="p" gutterBottom className={classes.billsummarytext}>
              Subtotal
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={6}>
          <Box className={'align-right'} pr={3}>
            <Typography component="p" gutterBottom className={classes.billsummarytext}>
              {CartHelper.getCurrencyFormatted(!CartHelper.isEmpty(exchange?.data) ? subtotal : summary.beforeDiscount)}
            </Typography>
          </Box>
        </Grid>

        {!CartHelper.isApplyingDiscountAfterTax() ?
          <AdditionalDiscountSummery page="billsummary" />
          : null
        }



        <Grid item xs={6}>
          <Box className={'align-left'} pl={3}>
            <Typography component="p" gutterBottom className={classes.billsummarytext}>
              Tax {Number(summary.taxamount) >= 0 ? '(+)' : '(-)'}
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={6}>
          <Box className={'align-right'} pr={3}>
            <Typography component="p" gutterBottom className={classes.billsummarytext}>
              {CartHelper.getCurrencyFormatted(Math.abs(summary.taxamount))}
            </Typography>
          </Box>
        </Grid>

        {CartHelper.isApplyingDiscountAfterTax() ?
          <AdditionalDiscountSummery page="billsummary" />
          : null
        }
        {summary?.exchangeTotalAmount && summary?.exchangeTotalAmount > 0 ?

          <>
            <Grid item xs={6}>
              <Box className={'align-left'} pl={3}>
                <Typography component="p" gutterBottom className={classes.billsummarytext}>
                  Exchange Total (-)
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box className={'align-right'} pr={3}>
                <Typography component="p" gutterBottom className={classes.billsummarytext}>
                  {CartHelper.getCurrencyFormatted(summary.exchangeTotalAmount)}
                </Typography>
              </Box>
            </Grid>
          </>
          : null}

        {summary.delivery &&
          <>
            <Grid item xs={6}>
              <Box className={'align-left'} pl={3}>
                <Typography component="p" gutterBottom className={classes.billsummarytext}>
                  Delivery Charge (+)
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box className={'align-right'} pr={3}>
                <Typography component="p" gutterBottom className={classes.billsummarytext}>
                  {CartHelper.getCurrencyFormatted(summary.delivery)}
                </Typography>
              </Box>
            </Grid>
          </>
        }

        {summary.packaging &&
          <>
            <Grid item xs={6}>
              <Box className={'align-left'} pl={3}>
                <Typography component="p" gutterBottom className={classes.billsummarytext}>
                  Packaging Charge (+)
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box className={'align-right'} pr={3}>
                <Typography component="p" gutterBottom className={classes.billsummarytext}>
                  {CartHelper.getCurrencyFormatted(summary.packaging)}
                </Typography>
              </Box>
            </Grid>
          </>
        }

        <Grid item xs={6}>
          <Box className={'align-left'} pl={3}>
            <Typography component="p" gutterBottom className={classes.billsummarytext}>
              Round
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={6}>
          <Box className={'align-right'} pr={3}>
            <Typography component="p" gutterBottom className={classes.billsummarytext}>
              {CartHelper.getCurrencyFormatted(summary.round)}
            </Typography>
          </Box>
        </Grid>

        <Grid container direction="row" spacing={1} className={classes.totalbill}>
          <Grid item xs={6}>
            <Box className={'align-left'} pl={3}>
              <Typography component="p" gutterBottom className={classes.billsummarytotal}>
                Total
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={6}>
            <Box className={'align-right'} pr={3}>
              <Typography component="p" gutterBottom className={classes.billsummarytotal}>
                {CartHelper.getCurrencyFormatted(totalAmount)}
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {!CartHelper.isEmpty(returnData) ?
          <ReturnLabels />
          : null
        }
      </Grid>
    )

  }

}

const mapStateToProps = state => ({
  cartProduct: state.cartProduct,
  productData: state.productData,
  checkoutData: state.checkoutData,
  returnData: state.returnData,
  customerData: state.customerData,
  exchange: state.exchange
});
export default connect(mapStateToProps, null)(withStyles(Styles)(BillSummary));