import React, { Component } from 'react';
import { Box, Grid, TextField, Typography, MenuItem } from '@material-ui/core';
import { updateOtherPaymentCash, updateOtherPaymentCard, updateOtherPaymentCardNo, updateOtherPaymentOther, updateOtherPaymentOtherType, updateOtherPaymentUPI } from '../../../../redux/action/cartAction';
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import StoreHelper from '../../../../Helper/storeHelper'


class OtherPayment extends Component {

    componentDidMount() {
        // const { checkoutData } = this.props
        // var net_amount = checkoutData.data.payment_amount
        //this.props.updateOtherPaymentOther(Number(net_amount));
    }

    updateOtherPaymentCash = (event) => {
        var diff = this.getDiffAmt("cash", event.target.value);

        if (diff >= 0) {
            this.props.updateOtherPaymentCash(event.target.value);
        }
    }

    updateOtherPaymentUPI = (event) => {
        var diff = this.getDiffAmt("upi", event.target.value);

        if (diff >= 0) {
            this.props.updateOtherPaymentUPI(event.target.value);
        }
    }

    updateOtherPaymentCard = (event) => {
        var diff = this.getDiffAmt("card", event.target.value);

        if (diff >= 0) {
            this.props.updateOtherPaymentCard(event.target.value);
        }
    }

    updateOtherPaymentOther = (event) => {
        var diff = this.getDiffAmt("other", event.target.value);

        if (diff >= 0) {
            this.props.updateOtherPaymentOther(event.target.value);
        }
    }

    getDiffAmt = (field, eventValue) => {
        const { checkoutData } = this.props
        var net_amount = Number(checkoutData.data.payment_amount)

        var cash = checkoutData.otherPayment.cash
        var upi = checkoutData.otherPayment.upi
        var card = checkoutData.otherPayment.card
        var other = checkoutData.otherPayment.other
        var OtherPaymentTotal = 0

        if (field === 'cash') {
            OtherPaymentTotal = Number(eventValue) + Number(upi) + Number(card) + Number(other)
        }
        if (field === 'upi') {
            OtherPaymentTotal = Number(cash) + Number(card) + Number(eventValue) + Number(other)
        }
        if (field === 'card') {
            OtherPaymentTotal = Number(cash) + Number(upi) + Number(eventValue) + Number(other)
        }
        if (field === 'other') {
            OtherPaymentTotal = Number(cash) + Number(upi) + Number(card) + Number(eventValue)
        }
        var diff = net_amount - OtherPaymentTotal;
        return diff
    }


    render() {
        const { checkoutData, updateOtherPaymentCardNo, updateOtherPaymentOtherType } = this.props;
        const otherPaymentOptions = StoreHelper.getOtherPaymentOptions()

        return (
            <>
                <Grid container item xs={12} alignItems="center" className="align-left">
                    <Grid item xs={3}>
                        <Box p={1}>
                            <Typography variant="subtitle2" component="span">CASH</Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={9}>
                        <Box pr={1} pl={1}>
                            <TextField
                                variant="outlined"
                                value={checkoutData.otherPayment.cash}
                                onChange={(event) => this.updateOtherPaymentCash(event)}
                                placeholder="AMOUNT"
                                autoFocus
                                inputProps={{
                                    className: "padding-7 width-100"
                                }}
                                className="width-100"
                            />
                        </Box>
                    </Grid>

                    {/* upi paymetn row */}
                    <Grid item xs={3}>
                        <Box p={1}>
                            <Typography variant="subtitle2" component="span">UPI</Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={9}>
                        <Box pr={1} pl={1}>
                            <TextField
                                variant="outlined"
                                value={checkoutData.otherPayment.upi}
                                onChange={(event) => this.updateOtherPaymentUPI(event)}
                                placeholder="AMOUNT"
                                inputProps={{
                                    className: "padding-7 width-100"
                                }}
                                className="width-100"
                            />
                        </Box>
                    </Grid>

                    {/* upi payment row end */}

                    {/*  card payment row */}
                    <Grid item xs={3}>
                        <Box p={1}>
                            <Typography variant="subtitle2" component="span">CARD</Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={5}>
                        <Box pr={1} pl={1}>
                            <TextField
                                variant="outlined"
                                value={checkoutData.otherPayment.card}
                                onChange={(event) => this.updateOtherPaymentCard(event)}
                                placeholder="AMOUNT"
                                inputProps={{
                                    className: "padding-7 width-100"
                                }}
                            />
                        </Box>
                    </Grid>
                    <Grid item xs={4}>
                        <Box pr={1} pl={0}>
                            <TextField
                                variant="outlined"
                                value={checkoutData.otherPayment.cardNo}
                                onChange={(event) => updateOtherPaymentCardNo(event.target.value)}
                                placeholder="CARD NO"
                                inputProps={{
                                    className: "padding-7 width-100"
                                }}
                            />
                        </Box>
                    </Grid>
                    {/* card payment row end */}

                    <Grid item xs={3}>
                        <Box p={1}>
                            <Typography variant="subtitle2" component="span">OTHER</Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={5}>
                        <Box pr={1} pl={1}>
                            <TextField
                                variant="outlined"
                                value={checkoutData.otherPayment.other}
                                onChange={(event) => this.updateOtherPaymentOther(event)}
                                placeholder="AMOUNT"
                                inputProps={{
                                    className: "padding-7 width-100"
                                }}
                            />
                        </Box>
                    </Grid>
                    <Grid item xs={4}>
                        <Box pr={1} pl={0}>
                            <TextField
                                select
                                variant="outlined"
                                value={checkoutData.otherPayment.otherType}
                                onChange={(event) => updateOtherPaymentOtherType(event.target.value)}
                                placeholder="TYPE"
                                className="width-100"
                                inputProps={{
                                    className: "padding-7 width-100"
                                }}
                            >
                                <MenuItem value={"OTHER"}>{"SELECT"}</MenuItem>
                                {otherPaymentOptions.map((options, index) => (
                                    <MenuItem value={options.toUpperCase()} key={index}>                    {options.toUpperCase()}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Box>
                    </Grid>
                </Grid>
            </>
        )
    }

}

OtherPayment.propTypes = {
    updateOtherPaymentCash: PropTypes.func.isRequired,
    updateOtherPaymentCard: PropTypes.func.isRequired,
    updateOtherPaymentCardNo: PropTypes.func.isRequired,
    updateOtherPaymentOther: PropTypes.func.isRequired,
    updateOtherPaymentOtherType: PropTypes.func.isRequired,
}
const mapStateToProps = state => ({
    cartProduct: state.cartProduct,
    checkoutData: state.checkoutData,
    returnData: state.returnData,
    editData: state.editData
});
export default connect(mapStateToProps,
    {
        updateOtherPaymentCash,
        updateOtherPaymentCard,
        updateOtherPaymentCardNo,
        updateOtherPaymentOther,
        updateOtherPaymentOtherType,
        updateOtherPaymentUPI
    })(OtherPayment);