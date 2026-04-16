import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Button, Grid, Icon } from "@material-ui/core";
import StoreHelper from "../../../../Helper/storeHelper";
import { updatePaymentMode } from "../../../../redux/action/cartAction";
import { green } from "@material-ui/core/colors";

// icons
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";
import PaymentIcon from "@material-ui/icons/Payment";
import AccountBalanceIcon from "@material-ui/icons/AccountBalance";
import MoneyIcon from "@material-ui/icons/Money";
import SubjectIcon from "@material-ui/icons/Subject";

import { cleaPosPaymentsData } from "../../../../redux/action/paymentsAction";
import PhonelinkRingIcon from '@material-ui/icons/PhonelinkRing';
export class PaymentTypeBtn extends Component {
    updatePaymentMode = (mode) => {
        const { checkoutData } = this.props;
        const payment_type = checkoutData.data.payment_type
            ? checkoutData.data.payment_type
            : "";

        if (payment_type !== 'POS') {
            this.props.cleaPosPaymentsData()
        }

        if (payment_type !== mode) {
            this.props.updatePaymentMode(mode);
            if (this.props.onSelect) {
                //  if payment mode is CREDIT then customer number has to be entered
                this.props.onSelect(mode === "CREDIT" ? "checkout" : "fastcheckout");
            }
        } else {
            this.props.updatePaymentMode("");
        }
    };

    isWalletActive = () => {
        const { checkoutData } = this.props;
        const payment_type = checkoutData.data.payment_type
            ? checkoutData.data.payment_type
            : "";
        let wallet_options = StoreHelper.getWalletOptions();
        let options = ["WALLET"];
        if (wallet_options) {
            let parseData = JSON.parse(wallet_options);
            parseData.forEach((option) => {
                if (option && option.name) {
                    options.push(option.name);
                }
            });
        }
        if (options.includes(payment_type)) {
            return true;
        } else {
            return false;
        }
    };

    render() {
        const { checkoutData, cartProduct } = this.props;
        const payment_type = checkoutData.data.payment_type
            ? checkoutData.data.payment_type
            : "";
        const isDisabled = cartProduct && cartProduct.length > 0 ? false : true;
        const isPOSPaymentsEnabled = StoreHelper.isPOSPaymentsEnabled()

        const isPineLabsPaymentsAllowed = StoreHelper.isPineLabsPaymentsAllowed()

        return (
            <React.Fragment>
                <Grid
                    item
                    container
                    spacing={1}
                    justify="space-between"
                    direction="row"
                    className="payment-buttons"
                >
                    {/* <IndianRupeeSymbol /> */}

                    {StoreHelper.isCashAllowed() === 1 ? (
                        <Grid item xs>
                            <Button
                                variant="outlined"
                                // startIcon={ }
                                // color={'#f2f2f2'} size={'30px'}
                                // startIcon={<AttachMoneyIcon key={"payment-button-cash"} />}
                                className={payment_type === "CASH" ? "payment-active" : ""}
                                onClick={() => this.updatePaymentMode("CASH")}
                                disabled={isDisabled}
                            >
                                CASH
                            </Button>
                        </Grid>
                    ) : null}
                    {StoreHelper.isCardAllowed() === 1 ? (
                        <Grid item xs>
                            <Button
                                startIcon={<PaymentIcon />}
                                variant="outlined"
                                className={payment_type === "CARD" ? "payment-active" : ""}
                                onClick={() => this.updatePaymentMode("CARD")}
                                disabled={isDisabled}
                            >
                                CARD
                            </Button>
                        </Grid>
                    ) : null}
                    {StoreHelper.isUPIAllowed() === 1 ? (
                        <Grid item xs>
                            <Button
                                startIcon={<AccountBalanceIcon />}
                                variant="outlined"
                                className={payment_type === "UPI" ? "payment-active" : ""}
                                onClick={() => this.updatePaymentMode("UPI")}
                                disabled={isDisabled}
                            >
                                UPI
                            </Button>
                        </Grid>
                    ) : null}
                    {StoreHelper.isWalletAllowed() === 1 ? (
                        <Grid item xs>
                            <Button
                                variant="outlined"
                                className={this.isWalletActive() ? "payment-active" : ""}
                                onClick={() => this.updatePaymentMode("WALLET")}
                                disabled={isDisabled}
                            >
                                WALLET
                            </Button>
                        </Grid>
                    ) : null}
                    {StoreHelper.isOTHERAllowed() === 1 ? (
                        <Grid item xs>
                            <Button
                                startIcon={<SubjectIcon />}
                                variant="outlined"
                                className={payment_type === "OTHER" ? "payment-active" : ""}
                                onClick={() => this.updatePaymentMode("OTHER")}
                                disabled={isDisabled}
                            >
                                OTHER
                            </Button>
                        </Grid>
                    ) : null}
                    {StoreHelper.isCreditAllowed() === 1 ? (
                        <Grid item xs>
                            <Button
                                startIcon={<MoneyIcon />}
                                variant="outlined"
                                className={payment_type === "CREDIT" ? "payment-active" : ""}
                                onClick={() => this.updatePaymentMode("CREDIT")}
                                disabled={isDisabled}
                            >
                                CREDIT
                            </Button>
                        </Grid>
                    ) : null}

                    {isPOSPaymentsEnabled ? (
                        <Grid item xs>
                            <Button
                                startIcon={<MoneyIcon />}
                                variant="outlined"
                                className={payment_type === "POS" ? "payment-active" : ""}
                                onClick={() => this.updatePaymentMode("POS")}
                                disabled={isDisabled}
                            >
                                POS
                            </Button>
                        </Grid>
                    ) : null}

                    {isPineLabsPaymentsAllowed && <Grid item xs>
                        <Button
                            startIcon={<PhonelinkRingIcon />}
                            variant="outlined"
                            className={payment_type === "POS-PL" ? "payment-active" : ""}
                            onClick={() => this.updatePaymentMode("POS-PL")}
                            disabled={isDisabled}
                        >
                            POS PL
                        </Button>
                    </Grid>}
                </Grid>
            </React.Fragment>
        );
    }
}

PaymentTypeBtn.propTypes = {
    updatePaymentMode: PropTypes.func.isRequired,
    cleaPosPaymentsData: PropTypes.func.isRequired,

};
const mapStateToProps = (state) => ({
    cartProduct: state.cartProduct,
    checkoutData: state.checkoutData,
    exchange: state.exchange,
});

const mapActionsToProps = {
    updatePaymentMode,
    cleaPosPaymentsData
};
export default connect(mapStateToProps, mapActionsToProps)(PaymentTypeBtn);
