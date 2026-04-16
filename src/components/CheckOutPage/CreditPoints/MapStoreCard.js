import React, { Component } from 'react'
import { connect } from "react-redux";
import PropTypes from 'prop-types';
import { Grid, Typography, TextField, Button, Box, MenuItem, Accordion, AccordionSummary, AccordionDetails } from '@material-ui/core';
import { ExpandMore, CheckCircle } from '@material-ui/icons'
import { updateRewardPkgId, updateMemberNo } from "../../../redux/action/customerAction"
import { fetch_customer_data, save_customer_data, apply_redeem_coupon, apply_redeem_amount, setChecked, createCustomer } from '../../../redux/action/customerAction';


class MapStoreCard extends Component {

  constructor (props) {
    super(props)

    this.state = {
      isSaved: false
    }
  }


  componentDidMount() {

  }

  handlePkg = (e) => {
    this.props.updateRewardPkgId(e.target.value)
  }

  handleMemNo = (e) => {
    this.props.updateMemberNo(e.target.value)
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const { checkoutData, customerData } = this.props
    var formData = {}
    formData.name = (checkoutData.customer && checkoutData.customer.customer_name) ? checkoutData.customer.customer_name : ""
    if (!checkoutData.customer.phone_number) {
      return
    }
    formData.phone = checkoutData.customer.phone_number
    if (!customerData.rewardPkgId) {
      return
    }
    formData.reward_pkg_id = customerData.rewardPkgId
    if (!customerData.memberNo) {
      return
    }
    formData.membership_no = customerData.memberNo
    this.props.createCustomer(formData)
      .then(res => res.json())
      .then(res => {
        if (res.success) {
          this.setState({ isSaved: true });
        } else {

        }
      })
      .catch(err => {

      })
  }

  render() {
    const { storeData, customerData } = this.props
    var customer_rewards = (storeData && storeData.data && storeData.data.customer_rewards) ? storeData.data.customer_rewards : []
    const { isSaved } = this.state

    return (

      <Accordion elevation={0} className="membership-card-container">
        <AccordionSummary
          expandIcon={<ExpandMore />}
        >
          <Typography >Add Membership</Typography>
        </AccordionSummary>
        <AccordionDetails className="width-100">
          <Box className="width-100">
            <Grid container justify="space-between" alignItems="center">
              <Grid item xs={12}>
                <form onSubmit={this.handleSubmit}>
                  <Grid item container direction="row" alignItems="center" spacing={1}>
                    <Grid item xs={4}>
                      <TextField
                        select
                        name="rewardPkg"
                        value={(customerData.rewardPkgId) ? customerData.rewardPkgId : 0}
                        variant="outlined"
                        type="text"
                        margin="dense"
                        inputProps={{
                          className: "padding-7 width-100 background-white"
                        }}
                        className="width-100 margin-0"
                        onChange={this.handlePkg}
                        disabled={isSaved}
                      >
                        <MenuItem key={0} value={0}>
                          None
                        </MenuItem>
                        {customer_rewards ?
                          customer_rewards.map((pkg, i) => (
                            <MenuItem key={i + 1} value={pkg.pkg_id}>
                              {pkg.pkg_name}
                            </MenuItem>
                          ))
                          : null
                        }
                      </TextField>
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        name="memberNo"
                        value={customerData.memberNo}
                        variant="outlined"
                        type="text"
                        inputProps={{
                          className: "padding-7 width-100 background-white"
                        }}
                        className="width-100 margin-0"
                        onChange={this.handleMemNo}
                        disabled={isSaved}
                        placeholder="Enter membership number."
                      />
                    </Grid>
                    <Grid item xs={2}>
                      {isSaved ?
                        <CheckCircle color="secondary" fontSize="small" />
                        :
                        <Button variant="contained" size="small" type="submit" color="secondary" className="width-100">Save</Button>
                      }
                    </Grid>
                  </Grid>
                </form>
              </Grid>
              <Grid item xs={12}>

              </Grid>
            </Grid>
          </Box>
        </AccordionDetails>
      </Accordion>
    )
  }

}


MapStoreCard.propTypes = {
  updateRewardPkgId: PropTypes.func.isRequired,
  updateMemberNo: PropTypes.func.isRequired,
  fetch_customer_data: PropTypes.func.isRequired,
  save_customer_data: PropTypes.func.isRequired,
  apply_redeem_coupon: PropTypes.func.isRequired,
  apply_redeem_amount: PropTypes.func.isRequired,
  setChecked: PropTypes.func.isRequired,
  createCustomer: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  storeData: state.storeData,
  customerData: state.customerData,
  checkoutData: state.checkoutData
});

const mapActionsToProps = {
  updateRewardPkgId,
  updateMemberNo,
  fetch_customer_data,
  save_customer_data,
  apply_redeem_coupon,
  apply_redeem_amount,
  setChecked,
  createCustomer
}


export default connect(mapStateToProps, mapActionsToProps)(MapStoreCard);
