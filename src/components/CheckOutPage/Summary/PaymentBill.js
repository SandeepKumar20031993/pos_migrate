/* eslint-disable no-unused-vars */
import React, { Component } from "react";
import { Button, Grid, Card, Box, Typography, Input } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import PaymentLabel from "./Payments/PaymentLabel";
import Cashpayment from "./Payments/Cashpayment";
import Walletpayment from "./Payments/Walletpayment";
import Cardpayment from "./Payments/Cardpayment";
import Otherpayment from "./Payments/Otherpayment";
import Calculater from "../../Calculater/CalculaterIndex";
import { connect } from "react-redux";
import {
    generateBill,
    generateDummyBill,
    updateGeneratedBill,
    updateEditedBill,
    loadBillingData,
    saveInvoiceInBilling,
    clearOtherPayment,
    loadDummyBillingData,
    saveBillResponse,
    saveBillingData,
    generateExchangeOrder,
    getSaleInvNo,
} from "../../../redux/action/cartAction";
import PropTypes from "prop-types";
import CartHelper from "../../../Helper/cartHelper";
import StoreHelper from "../../../Helper/storeHelper";
import {
    saveOfflineOrder,
    saveOfflineBillingData,
    saveOfflineResponseData,
} from "../../../redux/action/offlineAction";
import CustomerCredit from "./Payments/CustCredit";
import { updateAndSaveOfflineOrderInIndexDB } from "../../../services/offline-service";
import PaymentTypeBtn from "./Payments/PaymentTypeBtn";

import CircularProgress from "@material-ui/core/CircularProgress";

// Icons
import ReceiptIcon from "@material-ui/icons/Receipt";
import { Alert } from "@material-ui/lab";
import {
    cancelPLPayment,
    checkPLPaymentStatus,
    checkPaymentStatus,
    close_optnTrans,
    initiatePLPayment,
    initiatePayment,
    setPaymentData,
    setPinelabsPtrID,
    setPinelabsTransID,
} from "../../../redux/action/paymentsAction";
import TenderedAmountComponent from "./Payments/TenderedAmount";
import { loading } from "../../../redux/action/InterAction";
import { clearProductData, getProductsFromDb } from "../../../services/product-service";

const Styles = (theme) => ({
    gb_button: {
        color: "#fff",
        width: "80%",
        background: "#d91e18",
        fontWeight: "bold",
        fontSize: 18,
        height: 45,
        textTransform: "none !important",
        marginTop: "8px",
        boxSizing: "border-box",
        "&:hover": {
            backgroundColor: "red",
        },
        "&::disabled": {
            backgroundColor: "#f2f2f2",
        },
    },
    customecard: {
        minHeight: 120,
        width: "100%",
        border: "1px solid #f2f2f2",
        left: 35,
        display: "flex",
        margin: "0 auto",
        // boxShadow: '0 0 10px 5px #f2f2f2'
    },
});

class PaymentBill extends Component {
    constructor(props) {
        super(props);

        this.state = {
            disableGenerateBtn: false,
            paymentLoading: false,
            errorMsg: "",
            successMSg: "",
            pay_ref_id: null,
            plPaymentStatus: "",
        };
        this.intervalId = null;
    }

    generateBill = () => {
        this.setState({
            disableGenerateBtn: true,
        });

        var formData = CartHelper.getFormData();

        // online path
        if (StoreHelper.isOnline()) {
            if (
                CartHelper.isEmpty(this.props.returnData) &&
                CartHelper.isEmpty(this.props.editData) &&
                CartHelper.isEmpty(this.props.exchange.data)
            ) {
                const { checkoutData } = this.props;
                if (checkoutData.dummyBill) {
                    this.props
                        .generateDummyBill(formData)
                        .then((res) => res.json())
                        .then((resData) => {
                            this.handleResponse(resData, formData);
                            // sync products after successfully handling response
                            this.autosyncproduct();
                        })
                        .catch((err) => {
                            // still try offline fallback if needed
                            this.generateOfflineBill(formData);
                        });
                } else {
                    this.props
                        .generateBill(formData)
                        .then((res) => res.json())
                        .then((resData) => {
                            this.handleResponse(resData, formData);
                            // sync products after successfully handling response
                            this.autosyncproduct();
                        })
                        .catch((error) => {
                            this.generateOfflineBill(formData);
                        });
                }
            } else if (!CartHelper.isEmpty(this.props.returnData)) {
                this.props
                    .updateGeneratedBill(formData)
                    .then((res) => res.json())
                    .then((resData) => {
                        this.handleResponse(resData, formData);
                        this.autosyncproduct();
                    })
                    .catch((err) => {
                        this.generateOfflineBill(formData);
                    });
            } else if (!CartHelper.isEmpty(this.props.editData)) {
                this.props
                    .updateEditedBill(formData)
                    .then((res) => res.json())
                    .then((resData) => {
                        this.handleResponse(resData, formData);
                        this.autosyncproduct();
                    })
                    .catch((err) => {
                        this.generateOfflineBill(formData);
                    });
            } else if (!CartHelper.isEmpty(this.props.exchange)) {
                this.props
                    .generateExchangeOrder(formData)
                    .then((res) => res.json())
                    .then((resData) => {
                        this.handleResponse(resData, formData);
                        this.autosyncproduct();
                    })
                    .catch((err) => {
                        this.generateOfflineBill(formData);
                    });
            }
        } else {
            // offline path
            this.generateOfflineBill(formData);
        }
    };

    /**
     * Sync latest products (clears product cache, fetches DB, shows loader)
     */
    autosyncproduct = async () => {
        // use redux action mapped to props (if available)
        const setLoading =
            this.props && typeof this.props.loading === "function"
                ? this.props.loading
                : null;

        try {
            if (setLoading) setLoading(true);

            // clear local cache (do NOT change shared product-service)
            clearProductData();
            sessionStorage.removeItem("indexdb_refreshed");

            // try to call getProductsFromDb (it may or may not return a promise)
            // we await it in case it returns a Promise — awaiting a non-promise is safe.
            try {
                await getProductsFromDb();
            } catch (err) {
                // if common file doesn't return a promise or errors, swallow and continue
                console.warn("getProductsFromDb warning:", err);
            }

            // If the product refresh takes longer or the shared file is sync/callback-based,
            // we still want to remove the loader after a short delay to avoid spinner stuck.
            setTimeout(() => {
                if (setLoading) setLoading(false);
            }, 1500);
        } catch (err) {
            // log and continue — product sync failure shouldn't block UI
            console.error("autosyncproduct error:", err);
            if (setLoading) setLoading(false);
        } finally {
            // ensure loader is turned off eventually (fallback)
            if (setLoading) {
                // already turned off above after timeout; but keep safe guard
                setTimeout(() => {
                    setLoading(false);
                }, 3000);
            }
        }
    };

    handleCreateSale = async (formData) => {
        let location_id = StoreHelper.getLocationId();

        let resp = await this.props
            .getSaleInvNo({ location: location_id })
            .then((res) => {
                return res.json();
            })
            .catch((err) => {
                console.error("Error while getting saleInvNo");
                return null;
            });

        if (resp?.success) {
            const responseData = {
                invoice_num: resp?.invoice_number,
                success: true,
            };

            this.props.saveBillResponse(responseData);

            formData.inv_number = resp?.invoice_number;

            this.props.saveInvoiceInBilling(resp?.invoice_number);
            let billingdata = CartHelper.generateInvoiceData(formData, responseData);
            this.props.saveBillingData(billingdata);
            this.props.openSucessPopup();
            this.props
                .generateBill(formData)
                .then((res) => res.json())
                .then((resData) => {
                    if (resData?.success) {
                    } else {
                        this.generateOfflineBill(formData);
                    }
                })
                .catch((error) => {
                    console.log("generateBill error", error);
                    this.generateOfflineBill(formData);
                });
        } else {
            this.generateOfflineBill(formData);
        }
    };

    handleResponse = (resData, formData) => {
        if (resData) {
            this.props.saveBillResponse(resData);
        }

        // NOTE: do NOT directly clear and call getProductsFromDb here.
        // We rely on autosyncproduct() which is already invoked after successful API flows.
        // This avoids racing with other components that expect dbProductsData.data to exist.

        this.loadBillingData(formData, resData);
    };

    loadBillingData = (formData, responseData = null) => {
        const currentResponseData = responseData || this.props.checkoutData.responseData;
        var isSuccess = currentResponseData?.success;

        if (isSuccess !== undefined && isSuccess) {
            var invoice_num = currentResponseData.invoice_num;
            this.props.saveInvoiceInBilling(invoice_num);
            let billingdata = CartHelper.generateInvoiceData(formData, currentResponseData);
            this.props.saveBillingData(billingdata);
            this.props.openSucessPopup();
        }
    };

    generateOfflineBill = (formData) => {
        formData.off_ref_no = CartHelper.getOfflineInvoiceNo();
        this.props.saveOfflineOrder(formData);
        updateAndSaveOfflineOrderInIndexDB(formData);

        var offlineBillingData = CartHelper.getOfflineBillingData(formData);
        var offlineResponse = CartHelper.getOfflineResponseData(formData);

        this.props.saveOfflineBillingData(offlineBillingData);
        this.props.saveOfflineResponseData(offlineResponse);

        // Refresh products after offline bill (async callback inside setTimeout)
        setTimeout(async () => {
            try {
                clearProductData();
                sessionStorage.removeItem("indexdb_refreshed");

                // await is safe even if getProductsFromDb doesn't return a Promise
                try {
                    await getProductsFromDb();
                } catch (err) {
                    console.warn("getProductsFromDb failed during offline refresh", err);
                }
            } finally {
                // always load billing UI state after attempting refresh
                this.loadBillingData(formData);
            }
        }, 1000);
    };

    isDisableGenerateBtn = () => {
        var isDisble = false;
        const { checkoutData } = this.props;
        const payment_type = checkoutData.data.payment_type
            ? checkoutData.data.payment_type
            : "";
        const { disableGenerateBtn } = this.state;
        if (disableGenerateBtn) {
            isDisble = true;
            return isDisble;
        }
        var net_amount = Number(checkoutData.data.payment_amount);
        var cash = checkoutData.otherPayment.cash;
        var upi = checkoutData.otherPayment.upi;
        var card = checkoutData.otherPayment.card;
        var other = checkoutData.otherPayment.other;

        var OtherPaymentTotal =
            Number(cash) + Number(upi) + Number(card) + Number(other);

        if (payment_type === "OTHER" && net_amount !== OtherPaymentTotal) {
            isDisble = true;
        }

        let cus_no = checkoutData?.customer?.phone_number;

        if (cus_no?.length && cus_no?.length !== 10) {
            isDisble = true;
        }

        return isDisble;
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

    handlePayment = async (type) => {
        const { checkoutData } = this.props;

        const payment_type = checkoutData.data.payment_type
            ? checkoutData.data.payment_type
            : "";

        this.setState({ errorMsg: "", successMSg: "" });

        this.setState({ paymentLoading: true });

        if (payment_type === "POS-PL") {
            this.pinelabsPayments(type);
        } else if (payment_type === "POS") {
            this.wordlinePayment(type);
        }
    };

    pinelabsPayments = async (type) => {
        const { checkoutData } = this.props;
        const default_pinelabs_terminal = StoreHelper.getDefaultPineLabsTerminal();

        const amount = checkoutData.data.payment_amount;
        let tran_no = new Date();
        const payload = {
            imei_no: default_pinelabs_terminal?.terminal_imei,
            msp_code: default_pinelabs_terminal?.terminal_msp,
            amount,
            tran_no: "galla-" + tran_no.getTime(),
            mode: type,
        };
        // console.log("default_pinelabs_terminal", default_pinelabs_terminal);
        // return
        const response = await this.props
            .initiatePLPayment(payload)
            .then((response) => response.json())
            .catch((error) => {
                console.log("error", error);
                return null;
            });

        if (response?.success && response?.data?.ResponseMessage === "APPROVED") {
            this.props.setPinelabsPtrID({
                ref_id: response?.data?.PlutusTransactionReferenceID,
                amount,
            });
            this.setState({
                pay_ref_id: response?.data?.PlutusTransactionReferenceID,
                plPaymentStatus: response?.message,
            });
            setTimeout(() => {
                this.checkPinelabsStatus();
            }, 5000);
        } else {
            this.setState({ paymentLoading: false });

            console.error("error ", response);
            this.setState({
                errorMsg: response?.message ?? "something went wrong",
                paymentLoading: false,
            });
        }
    };

    checkPinelabsStatus = async () => {
        const { payments } = this.props;

        if (!payments?.pineLabs?.ptrID) {
            return;
        }
        const default_pinelabs_terminal = StoreHelper.getDefaultPineLabsTerminal();

        const payload = {
            imei_no: default_pinelabs_terminal?.terminal_imei,
            msp_code: default_pinelabs_terminal?.terminal_msp,
            ptrID: payments?.pineLabs?.ptrID,
        };
        const response = await this.props
            .checkPLPaymentStatus(payload)
            .then((response) => response.json());
        this.setState({ plPaymentStatus: response?.message });
        if (response?.success) {
            this.setState({ paymentLoading: false, pay_ref_id: null });

            // guard TransactionData and .find usage
            let trans_data = Array.isArray(response?.data?.TransactionData)
                ? response.data.TransactionData
                : [];
            let trans_ = trans_data.find((item) => item?.Tag === "TransactionLogId");

            if (trans_ && trans_.Value) {
                this.props.setPinelabsTransID("pinelabs-" + trans_.Value);
            } else {
                console.warn("Pinelabs TransactionLogId not found in response", response);
            }

            this.generateBill();
        } else {
            if (this.state.paymentLoading) {
                setTimeout(() => {
                    this.checkPinelabsStatus();
                }, 5000);
            } else {
                this.setState({ paymentLoading: false });
            }
        }
    };
    handleCancelPLPayments = async () => {
        const { checkoutData, payments } = this.props;

        const trans_amount = checkoutData.data.payment_amount;

        const default_pinelabs_terminal = StoreHelper.getDefaultPineLabsTerminal();

        const payload = {
            imei_no: default_pinelabs_terminal?.terminal_imei,
            msp_code: default_pinelabs_terminal?.terminal_msp,
            ptrID: payments?.pineLabs?.ptrID,
            trans_amount,
        };
        const resp = await this.props
            .cancelPLPayment(payload)
            .then((result) => {
                return result.json();
            })
            .catch((err) => {
                console.error("erro while cancelling transaction", err);
                return null;
            });
        if (resp?.success) {
            this.setState({ paymentLoading: false });
            this.props.close_optnTrans();
        } else {
            this.setState({ errorMsg: resp?.message });
        }
    };

    wordlinePayment = async (type) => {
        const { checkoutData } = this.props;
        const amount = checkoutData.data.payment_amount;

        let actionID = StoreHelper.getWordlinePOSActionID(type);
        const tid = StoreHelper.getWordLinePOSTid();

        if (!tid) {
            this.setState({ errorMsg: "cant find TID" });
            console.error("Cant find TID ");
            return;
        }
        let payment = {
            tid,
            amount: Number(amount),
            organization_code: "Retail ",
            type: `${type}`,
            actionId: `${actionID}`,
        };

        let response = await this.props
            .initiatePayment({ payment })
            .then((response) => response.json());

        if (response && response.success) {
            let data = {
                paymentType: type,
                urn: response.data.urn,
                tid,
            };
            this.props.setPaymentData(data);
            setTimeout(() => {
                this.checkPaymentStatus();
            }, 5000);
        } else {
            this.setState({
                errorMsg: response.message ?? "something went wrong",
                paymentLoading: false,
            });
        }
    };

    // start
    checkPaymentStatus = async () => {
        const payments = this.props.payments;

        const tid = StoreHelper.getWordLinePOSTid();
        let payload = {
            data: {
                urn: payments.urn,
                tid: tid,
                additional_attribute1: "",
                request_urn: "",
            },
        };
        const res = await this.props
            .checkPaymentStatus(payload)
            .then((response) => response.json());
        // stop to check the status of the payment if any of the folowing cond if true
        if (res.data.response_code === 1) {
            this.setState({ paymentLoading: false });
            console.log("no Records", res.data.response_message);
        } else if (res.data.status === "EXPIRED") {
            console.log("expired");
            this.setState({ paymentLoading: false, errorMsg: "EXPIRED" });
        } else if (
            res.data.status === "CANCELLED" ||
            res.data.status === "Failed"
        ) {
            this.setState({ paymentLoading: false, errorMsg: "CANCELLED" });
        } else if (res.data.response_code === 0 && res.data.status === "success") {
            this.setState({
                paymentLoading: false,
                successMSg: res.data.response_message,
            });
            this.props.setPaymentData(res.data);
            this.generateBill();
        } else if (res.data.status === "INITIATE") {
            setTimeout(() => {
                this.checkPaymentStatus();
            }, 5000);
        } else {
            this.setState({
                paymentLoading: false,
                successMSg: "",
                errorMsg: "Time out",
            });
        }
    };

    /**
     * This method is to check for the customer details entered or not when payment mode is CREDIT
     * @returns boolean
     */
    checkForCust() {
        let customer = this.props.checkoutData.customer;
        const payment_type = this.props.checkoutData.data.payment_type;
        if (payment_type === "CREDIT") {
            if (
                customer?.phone_number !== "" &&
                customer?.phone_number?.length === 10
            ) {
                return true;
            }
            return false;
        }
        return true;
    }

    checkForCond() {
        const { checkoutData } = this.props;
        let customer = checkoutData.customer;
        const payment_type = checkoutData.data.payment_type;
        const isPOSPaymentsEnabled = StoreHelper.isPOSPaymentsEnabled();
        const isPineLabsPaymentsAllowed = StoreHelper.isPineLabsPaymentsAllowed();

        if (payment_type === "CREDIT") {
            return this.checkForCust();
        }
        if (payment_type === "POS" && isPOSPaymentsEnabled) {
            return false;
        }
        if (payment_type === "POS-PL" && isPineLabsPaymentsAllowed) {
            return false;
        }
        return true;
    }

    componentWillUnmount() {
        const { classes, checkoutData, payments } = this.props;
        const payment_type = checkoutData.data.payment_type
            ? checkoutData.data.payment_type
            : "";
        // &&
        // payment_type === 'POS-PL'
        if (payments?.openTran?.ref_id) {
            this.handleCancelPLPayments();
        }
    }
    componentDidUpdate() {
        //this.props.openSucessPopup();
    }

    render() {
        const { classes, checkoutData, payments } = this.props;
        const { paymentLoading, errorMsg, successMSg } = this.state;
        const payment_type = checkoutData.data.payment_type
            ? checkoutData.data.payment_type
            : "";

        const creditCheckOk = this.checkForCust();
        const showGenerateButton = this.checkForCond();

        const pinelabsPaymentModes = StoreHelper.getPineLabsPaymentsModes();

        const default_pinelabs_terminal = StoreHelper.getDefaultPineLabsTerminal();

        return (
            <React.Fragment>
                <PaymentTypeBtn />
                {creditCheckOk}
                {payment_type ? (
                    <Grid
                        container
                        direction="row"
                        className={""}
                        justify="center"
                        alignItems="center"
                        style={{ marginTop: 8 }}>
                        <Grid item xs>
                            <Card elevation={0} className={classes.customecard}>
                                <Grid container>
                                    <Grid item xs={12}>
                                        <PaymentLabel />
                                    </Grid>
                                    {payment_type === "CASH" || payment_type === "UPI" ? (
                                        <Grid item xs={12}>
                                            <Cashpayment />
                                            {payment_type === "CASH" ?
                                                <TenderedAmountComponent />
                                                : null}
                                        </Grid>
                                    ) : null}
                                    {payment_type === "CARD" ? <Cardpayment /> : null}
                                    {this.isWalletActive() ? (
                                        <Grid container item xs={12}>
                                            <Walletpayment />
                                        </Grid>
                                    ) : null}
                                    {payment_type === "OTHER" ? <Otherpayment /> : null}
                                    {payment_type === "CREDIT" && creditCheckOk ? (
                                        <Grid item xs={12}>
                                            <CustomerCredit />
                                        </Grid>
                                    ) : null}

                                    {!paymentLoading && payment_type === "POS" && (
                                        <Grid container>
                                            <Grid item xs={3}>
                                                <Button
                                                    variant="outlined"
                                                    className={
                                                        payment_type === "POS" ? "payment-active" : ""
                                                    }
                                                    onClick={() => {
                                                        this.handlePayment("SALE-UPI");
                                                    }}

                                                // disabled={isDisabled}
                                                >
                                                    UPI
                                                </Button>
                                            </Grid>
                                            <Grid item xs={3}>
                                                <Button
                                                    variant="outlined"
                                                    className={
                                                        payment_type === "POS" ? "payment-active" : ""
                                                    }
                                                    onClick={() => {
                                                        this.handlePayment("SALE");
                                                    }}
                                                // disabled={isDisabled}
                                                >
                                                    SALE
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    )}

                                    {/* for pinelabs payment options */}
                                    {!paymentLoading && payment_type === "POS-PL" && (
                                        <Grid container justify="center">
                                            {default_pinelabs_terminal ? (
                                                <>
                                                    {pinelabsPaymentModes &&
                                                        pinelabsPaymentModes?.length ? (
                                                        pinelabsPaymentModes?.map((item, index) => (
                                                            <Grid
                                                                key={"pinelab_payment_types" + index}
                                                                item
                                                                xs={3}>
                                                                <Button
                                                                    variant="outlined"
                                                                    className={
                                                                        payment_type === "POS-PL"
                                                                            ? "payment-active"
                                                                            : ""
                                                                    }
                                                                    onClick={() => {
                                                                        this.handlePayment(item?.value);
                                                                    }}

                                                                // disabled={isDisabled}
                                                                >
                                                                    {item?.name}
                                                                </Button>
                                                            </Grid>
                                                        ))
                                                    ) : (
                                                        <Alert severity="error">
                                                            No Payment Modes Added
                                                        </Alert>
                                                    )}
                                                </>
                                            ) : (
                                                <Alert severity="warning">
                                                    Select Terminal from settings
                                                </Alert>
                                            )}
                                        </Grid>
                                    )}

                                    {showGenerateButton && (
                                        <Grid item xs={12}>
                                            <Button
                                                startIcon={<ReceiptIcon />}
                                                variant="contained"
                                                className={classes.gb_button}
                                                onClick={this.generateBill}
                                                disabled={this.isDisableGenerateBtn()}>
                                                Generate Bill
                                            </Button>
                                        </Grid>
                                    )}

                                    {!creditCheckOk ? (
                                        <Alert severity="warning">
                                            Enter Customer number for Credit Note
                                        </Alert>
                                    ) : null}

                                    {paymentLoading && (
                                        <Box
                                            display={"flex"}
                                            flexDirection={"column"}
                                            justifyContent={"center"}
                                            alignItems={"center"}
                                            width={"100%"}>
                                            <CircularProgress style={{ color: "green" }} />
                                            <Box style={{ color: "red" }}>
                                                {" "}
                                                Do not close or refresh the page
                                            </Box>
                                            {payment_type === "POS-PL" && (
                                                <>
                                                    <Typography variant="body2">
                                                        {" "}
                                                        Ref id:{this.state?.pay_ref_id}
                                                    </Typography>
                                                    <Typography>
                                                        Status: &nbsp; {this.state.plPaymentStatus}
                                                    </Typography>
                                                    <Button
                                                        type="button"
                                                        onClick={this.handleCancelPLPayments}>
                                                        Cancel Transaction
                                                    </Button>
                                                </>
                                            )}
                                        </Box>
                                    )}

                                    <Grid item style={{ margin: "8px 12px" }}>
                                        {errorMsg && errorMsg !== "" ? (
                                            <Alert severity="warning">{errorMsg} </Alert>
                                        ) : null}

                                        {successMSg && successMSg !== "" ? (
                                            <Alert severity="success">{successMSg} </Alert>
                                        ) : null}
                                    </Grid>

                                    {/* <Grid item >
                                        {payments?.openTrans?.ref_id && <>Open Trans Ref Id:{payments?.openTrans?.ref_id} </>}
                                    </Grid> */}
                                </Grid>
                            </Card>
                        </Grid>
                        {/* {CartHelper.isNewSale() && payment_type === "CASH" ?
                            <Grid item xs>
                                <Calculater />
                            </Grid>
                            : null
                        } */}
                    </Grid>
                ) : null}
            </React.Fragment>
        );
    }
}
PaymentBill.propTypes = {
    generateBill: PropTypes.func.isRequired,
    updateGeneratedBill: PropTypes.func.isRequired,
    updateEditedBill: PropTypes.func.isRequired,
    loadBillingData: PropTypes.func.isRequired,
    saveInvoiceInBilling: PropTypes.func.isRequired,
    saveOfflineOrder: PropTypes.func.isRequired,
    saveOfflineBillingData: PropTypes.func.isRequired,
    saveOfflineResponseData: PropTypes.func.isRequired,
    clearOtherPayment: PropTypes.func.isRequired,
    generateDummyBill: PropTypes.func.isRequired,
    loadDummyBillingData: PropTypes.func.isRequired,
    saveBillResponse: PropTypes.func.isRequired,
    saveBillingData: PropTypes.func.isRequired,
    initiatePayment: PropTypes.func.isRequired,
    setPaymentData: PropTypes.func.isRequired,
};
const mapStateToProps = (state) => ({
    cartProduct: state.cartProduct,
    checkoutData: state.checkoutData,
    returnData: state.returnData,
    editData: state.editData,
    state: state,
    payments: state.payments,
    exchange: state.exchange,

});

const mapActionsToProps = {
    generateBill,
    updateGeneratedBill,
    updateEditedBill,
    loadBillingData,
    saveInvoiceInBilling,
    saveOfflineOrder,
    saveOfflineBillingData,
    saveOfflineResponseData,
    clearOtherPayment,
    generateDummyBill,
    loadDummyBillingData,
    saveBillResponse,
    saveBillingData,
    initiatePayment,
    setPaymentData,
    checkPaymentStatus,
    initiatePLPayment,
    checkPLPaymentStatus,
    cancelPLPayment,
    setPinelabsPtrID,
    setPinelabsTransID,
    close_optnTrans,
    generateExchangeOrder,
    getSaleInvNo,
    loading, // make loading available if you wired it in redux
};
export default connect(
    mapStateToProps,
    mapActionsToProps
)(withStyles(Styles)(PaymentBill));
