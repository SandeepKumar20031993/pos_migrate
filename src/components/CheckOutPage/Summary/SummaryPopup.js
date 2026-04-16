import React, { Component } from 'react'
import { Dialog, DialogActions, DialogContent, Grid, Avatar, Box, Typography } from '@material-ui/core';
import { ArrowBack, HighlightOff } from '@material-ui/icons';
import Billsummery from './BillSummery';
import PaymentBill from './PaymentBill';
import CartHelper from '../../../Helper/cartHelper';
import Custrec from './customerrecord';
import RewardContainer from '../CreditPoints/RewardContainer';
import StoreHelper from '../../../Helper/storeHelper';

export class SummaryPopup extends Component {


  isRewardBlockVisible = () => {
    var isVisible = false;
    if (CartHelper.isCustomerLoaded() && StoreHelper.isCustomerRewardEnable() && StoreHelper.getPosLayout() !== "grocery") {
      isVisible = true
    }
    return isVisible;
  }


  render() {
    const isRulesAppliedAsCoupon = CartHelper.isRulesAppliedAsCoupon();
    return (
      <Dialog open={this.props.open} scroll={'body'} className={'dialog'}>
        <Grid>
          <DialogActions>
            {this.props.popup_type === 'checkout' ?
              <Avatar onClick={() => this.props.handleClose('back')} className={'popup-back-button'}>
                <ArrowBack />
              </Avatar>
              : null
            }
            <Avatar onClick={() => this.props.handleClose('close')} className={'popup-close-button'}>
              <HighlightOff />
            </Avatar>
          </DialogActions>
        </Grid>
        <DialogContent>
          <Grid className={''}>
            <Billsummery />
          </Grid>
          {this.props.popup_type === 'checkout' ?
            <React.Fragment>
              {this.isRewardBlockVisible() ?
                <RewardContainer />
                : null
              }
              {isRulesAppliedAsCoupon ?
                <Grid >
                  <Custrec />
                </Grid>
                : null}
              <Grid>
                <Box pt={2}>
                  <Typography className={'payment-option-title'} gutterBottom>
                    Payment Options
                  </Typography>
                </Box>
              </Grid>
              <Grid className={'payment-content'}>
                <PaymentBill openSucessPopup={this.props.openSucessPopup} />
              </Grid>
            </React.Fragment>
            : <Box p={2}></Box>
          }
        </DialogContent>
      </Dialog>
    )
  }
}

export default SummaryPopup
