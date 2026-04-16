import React, { useState } from "react";
import { withRouter } from "react-router-dom";

import { connect } from "react-redux";

import {
    Box,
    Button,
    Card,
    CardContent,
    Drawer,
    Grid,
    IconButton,
    Paper,
    Toolbar,
    Typography,
    withStyles,
} from "@material-ui/core";
import {
    updateCartPrice, prepareCheckout
} from "../../../redux/action/cartAction";
import {
    isDiscountCouponApplied,
    applyCoupon,
    applyPercentoff,
    applyFlatoff,
    clearAppliedDiscount,
} from '../../../redux/action/discountAction';
import Discount from '../discountCoupon/discount/Discount';

// ICons
import CloseIcon from '@material-ui/icons/Close';

import CheckoutCustomer from "./CheckoutCustomer";
import BillSummery from "../Summary/BillSummery";
import RewardContainer from "../CreditPoints/RewardContainer";
import CartHelper from "../../../Helper/cartHelper";
import StoreHelper from "../../../Helper/storeHelper";
import Customerrecord from "../Summary/customerrecord";
import PaymentBill from "../Summary/PaymentBill";

import {
    loadCustomer,
    save_customer_data,
} from "../../../redux/action/customerAction";

import RewardHelper from "../../../Helper/rewardHelper";

import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import RewardPointBox from "../CreditPoints/RewardPointBox";
import MapStoreCard from "../CreditPoints/MapStoreCard";

// ** Styles for
const Styles = (theme) => ({
    drawer: {
        maxWidth: "540px",
        minWidth: "520px",
        height: "100%",
        backgroundColor: "#f2f2f2",
    },

    topBar: {
        display: "inline-flex",
        justifyContent: "space-between",
        backgroundColor: "#fff",
        padding: "10px 16px",
        height: "50px",
        marginBottom: '4px',
        borderBottom: '1px solid ##f2f2f2',
    },
    closeButton: {
        color: '#111',
        backgroundColor: '#fff',
        '&:hover': {
            color: '#fff',
            backgroundColor: '#E74C3C'
        }
    }
});

const CheckoutDrawer = (props) => {
    const [showBoxes, setShowBoxes] = useState(false);

    const isRewardBlockVisible = () => {
        var isVisible = false;
        if (
            CartHelper.isCustomerLoaded() &&
            StoreHelper.isCustomerRewardEnable() &&
            StoreHelper.getPosLayout() !== "grocery"
        ) {
            isVisible = true;
        }
        return isVisible;
    };

    const continueCustomer = () => {
        const { checkoutData, customerData } = props;
        var form = {};
        form.phone = checkoutData.customer.phone_number;
        form.countrycode = checkoutData.customer.countrycode;
        form.referralsource = checkoutData.customer.referralsource;
        if (form.countrycode == 0) {
            form.countrycode = "91";
        }
        let memberShipId = customerData.membershipId;
        //console.log("Meme ship "+memberShipId);
        if (memberShipId) {
            form.membershipId = memberShipId;
        }
        props
            .loadCustomer(form)
            .then((res) => res.json())
            .then((res) => {
                if (res.success) {
                    console.log("Mem ID " + memberShipId);
                    if (memberShipId != 0 && res.data.package_id != memberShipId) {
                        alert("Customer is not mapped with the selected group");
                        return;
                    }
                    props.save_customer_data(res);
                    setShowBoxes(true);
                    applyRules()
                } else {
                    setShowBoxes(true);
                }
            })
            .catch((err) => {
                setShowBoxes(true);
            });
    };

    const prepareCheckoutData = () => {
        var checkoutData = {};
        var summary = CartHelper.getBillSummary();
        console.log("bill 2", summary);
        checkoutData.total_qty = CartHelper.getTotalQty();
        checkoutData.subtotal = summary.beforeDiscount;
        checkoutData.discount = summary.discountAmount;
        checkoutData.totaltax = summary.taxamount;
        if (!CartHelper.isEmpty(props.returnData) || !CartHelper.isEmpty(props.exchange)) {
            var currentTotal = Number(CartHelper.getTotalAmount());
            var paidTotal = Number(props.returnData.sales_data.nettotal);
            checkoutData.payment_amount = currentTotal - paidTotal;
        } else {
            checkoutData.payment_amount = CartHelper.getTotalAmount();
        }
        checkoutData.payment_type = 'CASH';
        checkoutData.card_no = '';
        props.prepareCheckout(checkoutData);
    }

    const applyRules = () => {
        const { storeData, customerData, cartProduct } = props
        var custRecord = (customerData?.custrecord?.data) ? customerData?.custrecord?.data : "";
        console.log("custRecord", custRecord);
        console.log("custRewards", storeData?.data?.customer_rewards);
        var b2c_rule = storeData?.data?.customer_rewards
            .find(rewards => rewards.pkg_id === custRecord?.package_id)?.b2c_rule_details;
        console.log("b2c_rule", b2c_rule);
        const discount_type = b2c_rule?.discount_type === 'flat' ? 'FLAT' : "PERCENT";
        var discount_amount = b2c_rule?.discount;
        var rule_apply_on = b2c_rule?.rule_apply_on;
        const is_active = Number(b2c_rule?.is_active);
        var cartProducts = cartProduct;
        console.log("cart", is_active);
        if (is_active === 1) {
            if (rule_apply_on === "all_product") {
                cartProducts.forEach((product) => {
                    if (
                        discount_type === "PERCENT" &&
                        (Number(discount_amount) <= 0 || Number(discount_amount) > 100)
                    ) {
                        alert("wrong data entered");
                        return;
                    } else if (
                        discount_type === "FLAT" &&
                        (Number(discount_amount) <= 0 ||
                            Number(discount_amount) > product.finalprice)
                    ) {
                        alert("wrong data entered");
                        return;
                    } else {
                        //alert("perfect data entered");
                        //return;
                        var tax = Number(product.tax);
                        //const { newPrice } = this.state;
                        var price = Number(product.finalprice);


                        var detailPrice = CartHelper.getDetailPriceFromNewPriceEDitable(
                            tax,
                            price,
                            discount_type,
                            Number(discount_amount),
                            product
                        );
                        console.log(detailPrice);
                        var priceUpdatedProduct = { ...product, ...detailPrice };
                        props.updateCartPrice(priceUpdatedProduct);
                        // prepareCheckoutData()

                    }
                });
            } else if (rule_apply_on === "cart") {
                // const { flatoff, percentoff } = props.discount;
                var flatoff = discount_type === 'FLAT' ? discount_amount : '';
                var percentoff = discount_type === 'PERCENT' ? discount_amount : "";
                if (flatoff || percentoff) {
                    if (percentoff && (!flatoff)) {
                        if (Number(percentoff) > 0 && Number(percentoff) <= 100) {
                            props.applyPercentoff(percentoff);
                        }
                        props.applyCoupon("");
                        props.applyFlatoff("");
                        props.isDiscountCouponApplied(true);
                    } else if (flatoff && (!percentoff)) {

                        const discountableAmount = CartHelper.getDefaultRuleAppliedTotal();
                        if (Number(flatoff) > 0) {
                            flatoff = (flatoff <= discountableAmount) ? flatoff : discountableAmount
                            props.applyFlatoff(flatoff);
                        }
                        props.applyCoupon("");
                        props.applyPercentoff("");
                        props.isDiscountCouponApplied(true);

                    }
                } else {
                    props.clearAppliedDiscount();
                }
                // prepareCheckoutData()

            }
            prepareCheckoutData()
        }
    }
    const isRulesAppliedAsCoupon = CartHelper.isRulesAppliedAsCoupon();

    const { openCheckout, classes, customerData } = props;

    var isMapped = RewardHelper.isPackageMapped(customerData);

    let { step } = props;
    // onClose={props.closeCheckout}


    // console.log("customerda", customerData);
    // console.log("showBoxes", showBoxes);
    // console.log("isMapped", isMapped);

    return (
            <Drawer
                open={openCheckout}
                anchor="right"
            onClose={props.closeCheckout}>
                <Box
                    container
                    direction="row"
                    justifyContent="flex-start"
                    alignItems="flex-start"
                    className={classes.drawer}
                >

                    <Box
                        width={'100%'}
                        className={classes.topBar}
                    >
                        <Typography variant="h6" >Checkout</Typography>
                        <Button
                            size="medium"
                        className={classes.closeButton} onClick={props.closeCheckout}
                        >
                            <CloseIcon />
                        </Button>
                    </Box>

                    {/* if the user wants to fast checkout then customer inputs are not required */}
                {props.popup_type !== "fastcheckout" && (
                        <>
                            <Card elevation={0}>
                                <CardContent>
                                    {/* to load the customer entry and sales data  handleContinue */}
                                <CheckoutCustomer continue={continueCustomer} />
                                </CardContent>
                            </Card>

                            {/* this is to show the rewards of the customer */}
                        {isRewardBlockVisible() &&
                                (showBoxes ? (
                                    <Box mt={'8px'}>
                                        {isMapped ? <RewardPointBox /> : <MapStoreCard />}
                                    </Box>
                                ) : null)}

                            {/* this is to show coupons applied  */}
                            {isRulesAppliedAsCoupon && (
                                <Customerrecord />
                            )}
                        </>
                    )}

                    {/* bill summary  */}
                    <Card elevation={0} style={{ marginTop: 8 }} >
                        <CardContent>
                            <BillSummery />
                        </CardContent>
                    </Card>

                    <Card elevation={0} style={{ marginTop: 8, marginBottom: 8, }}>
                        <CardContent>
                            <Typography className={"payment-option-title"} gutterBottom>
                                Payment Options
                            </Typography>
                            <Grid item xs={12} className={"payment-content"}>
                            <PaymentBill openSucessPopup={props.openSucessPopup} />
                            </Grid>
                        </CardContent>
                    </Card>

                </Box>
            </Drawer>
    );
}

const mapStateToProps = (state) => ({
    customerData: state.customerData,
    checkoutData: state.checkoutData,
    cartProduct: state.cartProduct,
    storeData: state.storeData,

});

const mapActionsToProps = {
    loadCustomer,
    save_customer_data,
    updateCartPrice,
    prepareCheckout,
    applyPercentoff,
    applyFlatoff,
    isDiscountCouponApplied,
    applyCoupon,
    clearAppliedDiscount
};

export default connect(
    mapStateToProps,
    mapActionsToProps
)(withStyles(Styles)(withRouter(CheckoutDrawer)));
