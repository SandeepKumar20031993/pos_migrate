import React, { Component } from 'react'
import { Box, Button, Grid, IconButton, TextField, Typography } from '@material-ui/core'
import { Close, Search } from '@material-ui/icons';
import { connect } from "react-redux";
import PropTypes from 'prop-types';
import { updateCPhone, updateCName, updateSalesExe, clearCustomer } from '../../redux/action/cartAction';
import { loadCustomer, save_customer_data, clear_customer_data } from '../../redux/action/customerAction';
import RewardContainer from '../CheckOutPage/CreditPoints/RewardContainer';
import CartHelper from '../../Helper/cartHelper';
import CustAutoCompleteList from '../Search/customer/CustAutoCompleteList';
//import StoreHelper from '../../Helper/storeHelper';


export class CustomerRight extends Component {
    constructor(props) {
        super(props)

        this.state = {
            isMobileValid: false
        }
    }

    componentDidMount() {
        const { checkoutData } = this.props
        var phone_number = checkoutData.customer.phone_number
        this.checkMobileValid(phone_number)
    }

    checkMobileValid = (phone_number) => {
        if (!isNaN(phone_number) && phone_number.length === 10) {
            this.setState({
                isMobileValid: true
            })
        } else {
            this.setState({
                isMobileValid: false
            })
        }
    }

    handleCustomerSubmit = (e) => {
        e.preventDefault()
        this.props.clear_customer_data();
        const { checkoutData } = this.props
        const phone = checkoutData.customer.phone_number;
        if (phone && phone.length === 10) {
            var form = {}
            form.phone = phone
            this.props.loadCustomer(form)
                .then(res => res.json())
                .then(customer => {
                    this.props.save_customer_data(customer);
                    let first_name = (customer && customer.data && customer.data.first_name) ? customer.data.first_name : "";
                    if (first_name) {
                        let last_name = (customer.data.last_name) ? customer.data.last_name : ""
                        let name = first_name + " " + last_name
                        this.props.updateCName(name);
                    }
                });
        }
    }

    handlePhone = (e) => {
        this.props.updateCPhone(e.target.value)
        this.checkMobileValid(e.target.value)
    }

    clearMobile = () => {
        this.props.clearCustomer()
    }

    clearCustomer = () => {
        this.props.clearCustomer()
        this.props.clear_customer_data();
    }

    componentDidUpdate() {
        clearTimeout(this.timeoutTimer);
        this.timeoutTimer = setTimeout(() => {
            const { checkoutData } = this.props
            var phone_number = checkoutData.customer.phone_number
            this.checkMobileValid(phone_number)
        }, 500)
    }

    render() {
        const { checkoutData, customerData } = this.props
        const { isMobileValid } = this.state
        const phone = (checkoutData.customer.phone_number) ? checkoutData.customer.phone_number : ""
        return (
            <Box p={2}>
                <Grid container direction="column" spacing={1}>
                    <Grid item xs>
                        <Typography variant="subtitle2" component="span" className="bold-i">
                            Check customer's lifetime sale
                        </Typography>
                    </Grid>

                    <Grid item xs>
                        <form onSubmit={this.handleCustomerSubmit} autoComplete="off">
                            <Grid container>
                                <Grid item xs className="position-relative">
                                    <TextField
                                        size="small"
                                        name="phone"
                                        value={phone}
                                        variant="outlined"
                                        label="Mobile"
                                        className="width-100"
                                        onChange={this.handlePhone}
                                        error={!isMobileValid}
                                    />
                                    {phone ?
                                        <CustAutoCompleteList type="phone" />
                                        : null
                                    }
                                    {phone && !isMobileValid ?
                                        <Typography variant="caption" >Mobile number is not valid!</Typography>
                                        : null}
                                </Grid>

                                {phone && CartHelper.isEmpty(customerData.custrecord) ?
                                    <Grid item className="position-relative">
                                        <div className="clear-mobile-icon-btn">
                                            <IconButton size="small" onClick={() => this.clearMobile()}><Close /></IconButton>
                                        </div>
                                    </Grid>
                                    : null
                                }

                                <Grid item >
                                    {customerData && !CartHelper.isEmpty(customerData.custrecord) ?
                                        <Button
                                            type="button"
                                            variant="outlined"
                                            size="large"
                                            onClick={() => this.clearCustomer()}
                                        >
                                            <Close />
                                        </Button>
                                        :
                                        <Button type="submit" variant="outlined" size="large">
                                            <Search />
                                        </Button>
                                    }
                                </Grid>
                            </Grid>
                        </form>
                    </Grid>
                    {customerData && !CartHelper.isEmpty(customerData.custrecord) ?
                        <Grid item xs>
                            <RewardContainer />
                        </Grid>
                        : null
                    }
                </Grid>
            </Box>
        )
    }
}

CustomerRight.propTypes = {
    updateCPhone: PropTypes.func.isRequired,
    updateCName: PropTypes.func.isRequired,
    updateSalesExe: PropTypes.func.isRequired,
    clearCustomer: PropTypes.func.isRequired,
    clear_customer_data: PropTypes.func.isRequired,
    loadCustomer: PropTypes.func.isRequired,
    save_customer_data: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
    checkoutData: state.checkoutData,
    storeData: state.storeData,
    customerData: state.customerData,
});

const mapActionsToProps = {
    updateCPhone,
    updateCName,
    updateSalesExe,
    clearCustomer,
    clear_customer_data,
    loadCustomer,
    save_customer_data
}

export default connect(mapStateToProps, mapActionsToProps)(CustomerRight)
