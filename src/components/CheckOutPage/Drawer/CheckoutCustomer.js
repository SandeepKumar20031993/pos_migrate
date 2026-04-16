import React, { Component } from 'react'
import { Grid, Avatar, Box, Typography, Button, TextField, FormControl, MenuItem, Switch, Divider } from '@material-ui/core';
import { HighlightOff } from '@material-ui/icons';

import { connect } from "react-redux";
import PropTypes from 'prop-types';
import { updateCPhone, updateCName, updateCustId, updateSalesExe, toogleDummyBill, updateCAdditionalComment, updateCPhoneCode, updateCReferralSource } from '../../../redux/action/cartAction';
import storeHelper from '../../../Helper/storeHelper';
import CustAutoCompleteList from '../../Search/customer/CustAutoCompleteList';
import store from '../../../store';
import ReactCountryDropdown from 'react-country-dropdown';
import { getSessionValue } from '../../../Helper/sessionStorage';

export class CheckoutCustomer extends Component {
    constructor(props) {
        super(props)

        this.state = {
            continue: false,
            isMobileRequired: false,
        }
    }
    componentDidMount() {
        this.validateMobile();

    }

    handleCountryChange = (country) => {
        this.props.updateCPhoneCode(country.callingCodes[0])
    };

    changePhone = event => {
        this.props.updateCustId("");
        this.props.updateCName("");
        this.props.updateCPhone(event.target.value);
        this.props.updateCAdditionalComment("");
        this.validateMobile();
    }

    changeName = event => {
        this.props.updateCName(event.target.value);
    }
    changeAdditionalComment = event => {
        this.props.updateCAdditionalComment(event.target.value);
    }


    handleContinue = () => {
        if (!this.state.isMobileRequired) {
            this.props.continue()
        }
    }

    handleSource = event => {
        this.props.updateCReferralSource(event.target.value)
    }

    handleSalesPerson = event => {
        this.props.updateSalesExe(event.target.value)
    }

    handleSubmit = event => {
        event.preventDefault();
        if (!this.state.isMobileRequired) {
            this.props.continue()
        }
        if (!storeHelper.isCustRequired()) {
            this.props.continue()
        }
    }

    onDummyChange = event => {
        const { checkoutData } = this.props
        this.props.toogleDummyBill(!checkoutData.dummyBill)
    }

    validateMobile = () => {
        if (storeHelper.isCustRequired()) {
            const { checkoutData } = this.props
            let mobile = checkoutData.customer.phone_number
            if (!isNaN(mobile) && mobile.length === 10) {
                this.setState({
                    isMobileRequired: false
                })
            } else {
                this.setState({
                    isMobileRequired: true
                })
            }
        }
        clearTimeout(this.timeout)
    }
    componentDidUpdate() {
        clearTimeout(this.timeout)
        this.timeout = setTimeout(() => {
            this.validateMobile();
        }, 200)
    }

    render() {
        const { checkoutData, storeData } = this.props
        const { isMobileRequired } = this.state
        let customer_source = getSessionValue('configs_customer_source');
        let customerSourceArray = customer_source ? customer_source.split(',') : [];

        let isMObileFull = checkoutData?.customer?.phone_number?.length === 10 ? false : true

        // console.log("storeData.data.salesexes:", storeData);
        return (
            <Grid container scroll={'body'} className={'dialog'}>
                <form onSubmit={this.handleSubmit} autoComplete="off">
                    {/* <Grid>
                        <DialogActions>

                            <Avatar onClick={this.props.close} className={'popup-close-button'}>
                                <HighlightOff />
                            </Avatar>
                        </DialogActions>
                    </Grid> */}

                    <Box>
                        <Grid container direction="row" justify="space-between" >
                            <Grid item>
                                <Typography variant="h6" component="span">{'Customer Details'}</Typography>
                            </Grid>
                            {storeHelper.isDummyBillAllowed() ?
                                <Grid item>
                                    <Switch
                                        checked={checkoutData.dummyBill}
                                        onChange={this.onDummyChange}
                                        name="checkedB"
                                        inputProps={{ 'aria-label': 'primary checkbox' }}
                                    />
                                    Offline
                                </Grid>
                                : null}
                        </Grid>
                        <Grid container style={{ marginTop: '10px' }} justify="center" alignItems="stretch">
                            <Grid item>
                                <Box pr={0} className="position-relative">
                                    <ReactCountryDropdown
                                        onSelect={this.handleCountryChange}
                                        defaultCountry="IN"
                                    />
                                    <TextField
                                        pl={1}
                                        error={isMobileRequired}
                                        id="outlined-mobile"
                                        label="Mobile"
                                        value={checkoutData.customer.phone_number}
                                        onChange={this.changePhone}
                                        variant="outlined"
                                        autoFocus
                                        type="number"
                                        size="small"
                                        name="phone"
                                        inputProps={{
                                            autoComplete: "nope"
                                        }}
                                    />
                                    {checkoutData.customer.phone_number ?
                                        <CustAutoCompleteList type="phone" />
                                        : null
                                    }
                                    {/*
                                    {isMobileRequired ?
                                        <Typography variant="caption" color='error'  >Enter valid mobile number</Typography>
                                        : null}*/}
                                </Box>
                            </Grid>
                            <Grid item xs>
                                <Box pl={1} className="position-relative">
                                    <TextField
                                        id="outlined-name"
                                        label="Name"
                                        value={checkoutData.customer.customer_name}
                                        onChange={this.changeName}
                                        variant="outlined"
                                        size="small"
                                        inputProps={{
                                            autoComplete: "nope"
                                        }}
                                    />
                                    {checkoutData.customer.customer_name ?
                                        <CustAutoCompleteList type="name" />
                                        : null
                                    }
                                </Box>
                                <input type="submit" name="submit" value="continue" className="hidden" />
                            </Grid>
                        </Grid>
                        <Grid container style={{ marginTop: '10px' }} alignItems="stretch">

                            {storeData?.data?.configs?.business_type === "fashion_apparel" ?
                                (
                                    <Grid item>
                                        <Box pr={0} className="position-relative" >
                                            <TextField
                                                id="outlined-comment"
                                                label="Additional Comment"
                                                placeholder='Additional Comment'
                                                value={checkoutData.customer.additional_comment}
                                                onChange={this.changeAdditionalComment}
                                                variant="outlined"
                                                size="small"
                                                autoFocus
                                            // inputProps={{
                                            //     autoComplete: "nope"
                                            // }}
                                            />
                                        </Box>
                                    </Grid>
                                ) : ""}

                            <Grid item xs>
                                <Box pl={2}>
                                    {storeData.data.salesexes ?
                                        <FormControl variant="outlined" className={'select-sales-person width-100'}>
                                            <TextField
                                                select

                                                size="small"
                                                label="How Did You Hear About Us?"
                                                placeholder='How Did You Hear About Us?'
                                                value={checkoutData.customer.referralsource}
                                                variant="outlined"
                                                onChange={this.handleSource}
                                            >
                                                {customerSourceArray.map(source => (
                                                    <MenuItem value={source} key={source}>{source}</MenuItem>
                                                ))}
                                                {/* <MenuItem value="Google">
                                                    <em>Google</em>
                                                </MenuItem>
                                                <MenuItem value="Social_Media">
                                                    <em>Instagram/Social Media</em>
                                                </MenuItem>
                                                <MenuItem value="wordofmouth">
                                                    <em>Word of Mouth</em>
                                                </MenuItem>
                                                <MenuItem value="malldisplay">
                                                    <em>Mall Display</em>
                                                </MenuItem>
                                                <MenuItem value="others">
                                                    <em>Others</em>
                                                </MenuItem> */}
                                            </TextField>
                                        </FormControl>
                                        : null}
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                    <Box>
                        <Grid container style={{ marginTop: '10px' }} justify="center" alignItems="stretch">

                            <Grid item xs>
                                <Box pl={30}>
                                    <Button variant="outlined" onClick={this.handleContinue} className={'continue-button '} fullWidth size='medium' disabled={isMObileFull} >
                                        Continue
                                    </Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                    <Box mt={2}>
                        <Divider />
                    </Box>
                    <Box>
                        <Grid item xs>
                            <Box pt={3} pr={30}>
                                {storeData.data.salesexes ?
                                    <FormControl variant="outlined" className={'select-sales-person width-100'}>
                                        <TextField
                                            select

                                            size="small"
                                            label="Sales person"
                                            value={checkoutData.customer.salesExec}
                                            variant="outlined"
                                            onChange={this.handleSalesPerson}
                                        >
                                            <MenuItem value="">
                                                <em>None</em>
                                            </MenuItem>
                                            {storeData.data.salesexes.map(exec => (
                                                <MenuItem value={exec.person_id} key={exec.person_id}>{exec.first_name + " " + exec.last_name}</MenuItem>
                                            ))}
                                        </TextField>
                                    </FormControl>
                                    : null}
                            </Box>
                        </Grid>
                    </Box>
                </form>
            </Grid>
        )
    }
}

CheckoutCustomer.propTypes = {
    updateCustId: PropTypes.func.isRequired,
    updateCPhone: PropTypes.func.isRequired,
    updateCPhoneCode: PropTypes.func.isRequired,
    updateCReferralSource: PropTypes.func.isRequired,
    updateCName: PropTypes.func.isRequired,
    updateSalesExe: PropTypes.func.isRequired,
    toogleDummyBill: PropTypes.func.isRequired,
    updateCAdditionalComment: PropTypes.func.isRequired
}
const mapStateToProps = state => ({
    checkoutData: state.checkoutData,
    storeData: state.storeData,
});
export default connect(mapStateToProps, { updateCustId, updateCPhone, updateCPhoneCode, updateCReferralSource, updateCName, updateSalesExe, toogleDummyBill, updateCAdditionalComment })((CheckoutCustomer))
