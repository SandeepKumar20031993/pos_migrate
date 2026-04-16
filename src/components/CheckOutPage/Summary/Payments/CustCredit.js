import React, { Component } from 'react'
import { Box, Grid, TextField } from '@material-ui/core';
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import { updatePaidAmt, updateCreditAmt } from '../../../../redux/action/cartAction';

class CustCredit extends Component {

    componentDidMount() {
        const { checkoutData } = { ...this.props }
        var payment_amount = Number(checkoutData.data.payment_amount)
        this.props.updatePaidAmt(0)
        this.props.updateCreditAmt(payment_amount)
    }

    updatePaidAmt = (event) => {
        const { checkoutData } = { ...this.props }
        let currentPaid = Number(event.target.value)
        var payment_amount = Number(checkoutData.data.payment_amount)
        if (payment_amount) {
            if (currentPaid <= payment_amount) {
                let diff = payment_amount - currentPaid
                this.props.updatePaidAmt(currentPaid)
                this.props.updateCreditAmt(diff)
            } else {
                this.props.updatePaidAmt(payment_amount)
                this.props.updateCreditAmt(0)
            }
        }
    }
    componentWillUnmount() {
        const { checkoutData } = { ...this.props }
        var payment_amount = Number(checkoutData.data.payment_amount)
        this.props.updatePaidAmt(payment_amount)
        this.props.updateCreditAmt(0)
    }

    render() {
        const { checkoutData } = this.props
        var paymentData = checkoutData.data
        return (
            <>
                {paymentData ?
                    <Box p={2}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <TextField
                                    id="outlined-paid"
                                    label="Paid amount"
                                    value={paymentData.paid_amt}
                                    variant="outlined"
                                    size="small"
                                    type="text"
                                    autoFocus
                                    className="background-white"
                                    onChange={this.updatePaidAmt}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    id="outlined-remaining"
                                    label="Balance amount"
                                    value={paymentData.credit_amt}
                                    variant="outlined"
                                    size="small"
                                    type="number"
                                    disabled={true}
                                    className="background-white"
                                />
                            </Grid>
                        </Grid>
                    </Box>
                    : null
                }
            </>
        )
    }
}


CustCredit.propTypes = {
    updatePaidAmt: PropTypes.func.isRequired,
    updateCreditAmt: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
    checkoutData: state.checkoutData
});

const mapActionsToProps = {
    updatePaidAmt,
    updateCreditAmt
}

export default connect(mapStateToProps, mapActionsToProps)(CustCredit);
