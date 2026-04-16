import React, { useState } from 'react';

import PropTypes from 'prop-types';

import { connect } from "react-redux";

import { Card, Box, Grid, Avatar, Button, Fab, Tooltip, Typography, IconButton, withStyles } from '@material-ui/core';
import { HighlightOff, Loyalty, PanTool } from "@material-ui/icons";
import LocalShippingIcon from '@material-ui/icons/LocalShipping';

import SummaryPopup from './Summary/SummaryPopup';
import Success from '../CheckOutPage/Success/Success';
import SuspendCartBlock from '../../pages/sales-record/suspendedCart'
import ReturnPopup from '../CheckOutPage/Return/ReturnPopup';
import EditPopup from '../CheckOutPage/Edit/EditPopup';

import cartHelper from '../../Helper/cartHelper';
import StoreHelper from '../../Helper/storeHelper';

import { prepareCheckout, clearCart, suspendCart, clearCustomer, clearBilling, updatePaymentMode, clearToken } from '../../redux/action/cartAction';
import { openDeliveryBox, clearDelivery } from '../../redux/action/deliveryAction'
import { handleMiscellaneousBox } from '../../redux/action/InterAction';
import { clearReturningProducts } from '../../redux/action/returnAction';
import { clearEditProducts } from '../../redux/action/editAction';
import { pageTitle, returnIsActive, editIsActive } from '../../redux/action/themeAction';
import { clearAppliedDiscount, openDiscountBox } from '../../redux/action/discountAction';
import { clear_customer_data, clearMembershipID } from '../../redux/action/customerAction';


import DiscountCoupon from '../CheckOutPage/discountCoupon/discountCoupon';
import SalesPersonPopup from './Summary/SalesPersonPopup';
import TotalSummary from './Summary/TotalSummary'
import ApplyAsCoupon from './discountCoupon/applyAsCoupon'
import PaymentTypeBtn from './Summary/Payments/PaymentTypeBtn';
import CheckoutDrawer from './Drawer/CheckoutDrawer';


import ApplyDelivery from './discountCoupon/ApplyDelivery';
import CheckoutActionsButtons from './CheckoutActionButtons'
import { clearPackaging } from '../../redux/action/miscellaneousAction';
import { loadQueueCart, toggleQueueCart } from '../../redux/action/queueCartAction';
import QueueCartBlock from './QueueCart/QueueCartBlock';
import { cleaPosPaymentsData } from '../../redux/action/paymentsAction';
import { Alert } from '@material-ui/lab';
import toast from 'react-hot-toast';
import ExchangePopup from './Exchange/ExchangePopup';
import { clearExchangeData } from '../../redux/action/exchangeActions';

import CartHelper from '../../Helper/cartHelper';
const Checkoutpage = (props) => {
  const [uiState, setUiState] = useState({
    open: false,
    successPopup: false,
    popup_type: '',
    opensuspended: false,
    openDiscountCoupon: false,
    openSalesPersonPopup: false,
    openCheckout: false,
    checkoutStep: 'customer'
  });

  // handleClickOpen = (data) => {
  //   const { exchange, cartProduct } = this.props
  //   var checkoutData = {};
  //   var summary = cartHelper.getBillSummary();

  //   checkoutData.total_qty = cartHelper.getTotalQty();
  //   checkoutData.subtotal = summary.beforeDiscount;
  //   checkoutData.discount = summary.discountAmount;
  //   checkoutData.totaltax = summary.taxamount;

  //   if (!cartHelper.isEmpty(this.props.returnData)) {
  //     var currentTotal = Number(cartHelper.getTotalAmount());
  //     var paidTotal = Number(this.props.returnData.sales_data.nettotal);

  //     checkoutData.payment_amount = currentTotal - paidTotal;

  //   } else if (exchange?.data) {

  //     const oldProductsTotal = cartProduct
  //       .filter(product => product.isExchange) // Filter products marked for exchange
  //       .reduce((total, product) => {
  //         const rulesAppliedData = CartHelper.getRulesAppliedData(product);
  //         const discountedPrice = rulesAppliedData?.price || product.price;
  //         const tax_amount = CartHelper.getRulesAppliedData(product);
  //         console.log("Tax Amount", tax_amount) // Use discounted price if available, otherwise original price
  //         return total + discountedPrice * product.qty;
  //       }, 0);

  //     const newProductsTotal = cartProduct
  //       .filter(product => !product.isExchange) // Filter products not marked for exchange (newly added)
  //       .reduce((total, product) => {
  //         const rulesAppliedData = CartHelper.getRulesAppliedData(product);
  //         const discountedPrice = rulesAppliedData?.price || product.price; // Use discounted price if available, otherwise original price
  //         return total + discountedPrice * product.qty;
  //       }, 0);
  //     let differenceAmount = newProductsTotal - oldProductsTotal;

  //     checkoutData.payment_amount = Number(differenceAmount).toFixed(0);
  //     let beforeDiscount = 0;
  //     cartProduct.forEach((product) => {
  //       beforeDiscount += product.qty * (product?.isExchange) ? -CartHelper.getPrice(product) : CartHelper.getPrice(product);
  //     });
  //     checkoutData.subtotal = Number(beforeDiscount).toFixed(2); //cartHelper.getTotalAmount();
  //   } else {
  //     checkoutData.payment_amount = cartHelper.getTotalAmount();
  //   }
  //   //checkoutData.payment_type = 'CASH';
  //   checkoutData.card_no = '';

  //   //Customer Credit Amount
  //   checkoutData.paid_amt = Number(checkoutData.payment_amount);
  //   checkoutData.credit_amt = 0;

  //   this.props.prepareCheckout(checkoutData);


  //   if (data !== 'info')
  //     this.setState({ openCheckout: true, popup_type: data })


  //   // need to refactor the following code
  //   if (cartHelper.isNewSale() && data !== 'info') {
  //     if (!cartHelper.isCustomerPopupSkipable()) {
  //       this.setState({ openSalesPersonPopup: true, popup_type: data });
  //     }
  //     // else {
  //     //   this.setState({ open: true, popup_type: data });
  //     // }

  //     // to open the checkout drawer
  //   } else if (data === 'info') {
  //     this.setState({ open: true, popup_type: data });

  //   }

  // };

  const handleClickOpen = (data) => {

    const { exchange, cartProduct } = props;

    let checkoutData = {};
    let summary = cartHelper.getBillSummary();

    checkoutData.total_qty = cartHelper.getTotalQty();
    checkoutData.subtotal = summary.beforeDiscount;
    checkoutData.discount = summary.discountAmount;
    checkoutData.totaltax = summary.taxamount;

    // RETURN BILL
    if (!cartHelper.isEmpty(props.returnData)) {

      let currentTotal = Number(cartHelper.getTotalAmount());
      let paidTotal = Number(props.returnData.sales_data.nettotal);

      checkoutData.payment_amount = currentTotal - paidTotal;

    }

    // EXCHANGE BILL
    else if (exchange?.data) {

      let exchangeTotal = 0;
      let beforeDiscount = 0;
      cartProduct.forEach((product) => {

        const rulesAppliedData = CartHelper.getRulesAppliedData(product);
        const discountedPrice = rulesAppliedData?.price || product.price;

        const lineTotal = discountedPrice * product.qty;

        if (product.isExchange) {

          // returned item
          exchangeTotal -= lineTotal;

          beforeDiscount -= (CartHelper.getPrice(product) * product.qty);

        } else {

          // new item
          exchangeTotal += lineTotal;

          beforeDiscount += (CartHelper.getPrice(product) * product.qty);

        }

      });

      checkoutData.payment_amount = Number(exchangeTotal).toFixed(2);
      checkoutData.subtotal = Number(beforeDiscount).toFixed(2);

      // IMPORTANT: prevent double discount
      checkoutData.discount = 0;

    }

    // NORMAL SALE
    else {

      checkoutData.payment_amount = cartHelper.getTotalAmount();

    }

    checkoutData.card_no = '';

    checkoutData.paid_amt = Number(checkoutData.payment_amount);
    checkoutData.credit_amt = 0;

    props.prepareCheckout(checkoutData);

    if (data !== 'info') {
      setUiState((prev) => ({ ...prev, openCheckout: true, popup_type: data }));
    }

    if (cartHelper.isNewSale() && data !== 'info') {

      if (!cartHelper.isCustomerPopupSkipable()) {
        setUiState((prev) => ({
          ...prev,
          openSalesPersonPopup: true,
          popup_type: data
        }));
      }

    } else if (data === 'info') {

      setUiState((prev) => ({ ...prev, open: true, popup_type: data }));

    }

  };

  const handleClose = (type) => {
    if (type === "close") {
      setUiState((prev) => ({ ...prev, open: false }));
    } else if (type === "back") {
      setUiState((prev) => ({
        ...prev,
        openSalesPersonPopup: true,
        open: false
      }))
    }
    props.updatePaymentMode("");
  };

  const closeSalesPersonPopup = () => {
    setUiState((prev) => ({
      ...prev,
      openSalesPersonPopup: false
    }))
  }

  const handleCheckoutClose = () => {
    const { payments, editData } = props

    if (payments.openTrans.ref_id) {
      // notify user
      toast.error("Close the ongoing payments", { position: 'top-right' })
    } else {

      setUiState((prev) => ({ ...prev, openCheckout: false }))
      props.updatePaymentMode("");
      if (!editData?.sale_id && !editData?.success)
        props.clearCustomer();
    }
  }

  const openSucessPopup = () => {
    setUiState((prev) => ({
      ...prev,
      open: false,
      successPopup: true,
      openCheckout: false

    }));
    props.pageTitle('New Sale');
  }
  const handleSuccess = () => {
    setUiState((prev) => ({
      ...prev,
      successPopup: false
    }))
    props.clearCart();
    props.clearCustomer();
    props.clear_customer_data();
    props.clearMembershipID();
    props.clearAppliedDiscount();
    props.clearReturningProducts();
    props.clearEditProducts();
    props.clearBilling();
    props.updatePaymentMode("");
    props.clearDelivery();
    props.clearPackaging();
    props.clearToken()
    props.cleaPosPaymentsData()
    props.clearExchangeData()
    props.handleMiscellaneousBox(false)

  }
  const clearCart = () => {
    props.clearCart();
    props.clearCustomer();
    props.clear_customer_data();
    props.clearMembershipID();
    props.clearAppliedDiscount();
    props.clearReturningProducts();
    props.clearEditProducts();
    props.clearDelivery();
    props.clearPackaging();
    props.handleMiscellaneousBox(false);
    props.openDiscountBox(false);
    props.clearToken()
    props.clearExchangeData()
    props.updatePaymentMode("");

  }
  const suspendCart = () => {
    if (!cartHelper.isEmpty(props.cartProduct)) {
      props.suspendCart(props.cartProduct);
      props.clearCart();
      props.clearToken()
      props.clearMembershipID();
    }
  }
  const openSuspendCart = () => {
    setUiState((prev) => ({
      ...prev,
      opensuspended: !prev.opensuspended
    }))
  }
  const closeSuspendCart = () => {
    setUiState((prev) => ({
      ...prev,
      opensuspended: false
    }))
  }
  const toggleReturnPopup = () => {
    props.returnIsActive(!props.theme.returnIsActive);
    props.clearEditProducts();
  }

  const toggleEditPopup = () => {
    props.editIsActive(!props.theme.editIsActive);
    props.clearReturningProducts();
    props.clearExchangeData()
  }

  const newSaleStart = () => {
    props.clearReturningProducts();
    props.clearEditProducts();
    props.clearCart();
    props.clearCustomer();
    props.clear_customer_data();
    props.clearMembershipID();
    props.clearAppliedDiscount();
    props.clearBilling();
    props.pageTitle('New Sale');
    props.clearDelivery()
    props.clearPackaging();
    props.clearToken()
    props.updatePaymentMode("");
    props.clearExchangeData()
    props.handleMiscellaneousBox(false)

  }

  const openDiscountCoupon = () => {
    props.openDiscountBox(!props.discount.open);
  }

  const handleOpenDelivery = () => {
    // * !this.props.delivery.open
    props.openDeliveryBox(!props.delivery.open)

    if (props.discount.open) openDiscountCoupon()
  }



  const continueOnSalesPerson = () => {
    setUiState((prev) => ({
      ...prev,
      openSalesPersonPopup: false,
      open: true
    }))
  }

  const onPaymentSelect = (mode) => {
    handleClickOpen(mode)
  }
  const { cartProduct, theme, discount, productData, displayIconText, delivery, returnData, interAction, toggleQueueCart, queueCart } = props;
  const { popup_type, opensuspended, openCheckout, open, successPopup, openSalesPersonPopup } = uiState;
  const isCartEmpty = cartHelper.isEmpty(cartProduct);

  const isReturnSale = cartHelper.isEmpty(returnData) && returnData?.success

  return (
      <>
        <Box  >

          {/* <Box style={{ backgroundColor: 'blue', height: '100px', widht: '100%' }} >helo price break up</Box> */}

          <Card elevation={0} className={"boxcardfix"} square style={{ borderRadius: '4px' }} >


            {productData && cartHelper.isRulesAppliedAsCoupon() ?
              <ApplyAsCoupon />
              : null}

            <Grid container justify='space-between' >
              {!isReturnSale &&
                <Grid
                  item
                  xs={7}
                  container
                  direction="row"
                  className="left-action-icons"
                  justify="flex-start"
                  style={{ padding: "8px " }}>

                  <CheckoutActionsButtons openSuspendCart={openSuspendCart} />
                </Grid>
              }



              <Grid item xs={isReturnSale ? 12 : 5} container direction="column" justify="space-between" >

                <TotalSummary handleClickOpen={() => handleClickOpen('info')} />
              </Grid>
            </Grid>

            <Grid container style={{ width: '100%' }} direction="row" justify="space-between" alignItems="center" >


              <Grid item spacing={1} container xs={StoreHelper.getPosLayout() === "default" ? 12 : 8}  >
                <Grid container item xs={12} className=" display-flex justify-space-between" >

                  {!isReturnSale && (

                    <PaymentTypeBtn onSelect={onPaymentSelect} />
                  )}
                </Grid>
                <Grid item xs={12} className="right-action-btn" >
                  <Button fullWidth title="Checkout [Ctrl + Enter]" variant="contained" onClick={() => handleClickOpen('checkout')} className="checkoutbutton height-100" id="checkout-btn" disabled={isCartEmpty}>
                    CheckOut
                  </Button>
                </Grid>
              </Grid>

            </Grid>

          </Card>
        </Box>



        <Box>
          {/*Sales Person popup */}
          {/* {openSalesPersonPopup ? <SalesPersonPopup close={closeSalesPersonPopup} open={openSalesPersonPopup} continue={continueOnSalesPerson} /> : null} */}

          {/*summary popup */}
          {open ? <SummaryPopup handleClose={handleClose} open={open} popup_type={popup_type} openSucessPopup={openSucessPopup} />
            : null
          }
          {/*success popup */}
          {successPopup ? <Success success={successPopup} close={handleSuccess} /> : null}

          {/*SuspendCartBlock popup */}
          {opensuspended ? <SuspendCartBlock close={closeSuspendCart} open={openSuspendCart} /> : null}


          {props.queueCart.openQueueCart ? <QueueCartBlock close={() => {
            toggleQueueCart(queueCart.openQueueCart)
          }} open={() => {
            toggleQueueCart(queueCart.openQueueCart)
          }} /> : null}


          {/*return popup */}
          {theme.returnIsActive ? <ReturnPopup toggle={toggleReturnPopup} return={theme.returnIsActive} /> : null}

          {props.exchange.isActive && <ExchangePopup />}

          {/*Edit popup */}
          {theme.editIsActive ? <EditPopup toggle={toggleEditPopup} openEdit={theme.editIsActive} /> : null}

          {discount.open ? <DiscountCoupon toggle={openDiscountCoupon} /> : null}


          {/* this delivery is changed to miselenous with delivery adn other charges */}
          {interAction.openMiscellaneousBox && <ApplyDelivery toggle={handleOpenDelivery} />}

        </Box>




        {/* checkout drawer */}
        <CheckoutDrawer openCheckout={openCheckout} closeCheckout={handleCheckoutClose} popup_type={popup_type} openSucessPopup={openSucessPopup} />
        {/* {openCheckout &&
          <Drawer open={openCheckout} anchor="right" onClose={this.handleCheckoutClose} >
            <Toolbar>
              Checkout <br />
              {this.state.openSalesPersonPopup && 'SalesPersonPopup'}

              {this.state.open && 'bill summary'}

            </Toolbar>
          </Drawer>
        } */}


      </>
    )
};

Checkoutpage.propTypes = {
  prepareCheckout: PropTypes.func.isRequired,
  updatePaymentMode: PropTypes.func.isRequired,
  clearCart: PropTypes.func.isRequired,
  clearReturningProducts: PropTypes.func.isRequired,
  pageTitle: PropTypes.func.isRequired,
  returnIsActive: PropTypes.func.isRequired,
  editIsActive: PropTypes.func.isRequired,
  clearEditProducts: PropTypes.func.isRequired,
  clearAppliedDiscount: PropTypes.func.isRequired,
  openDiscountBox: PropTypes.func.isRequired,
  clearCustomer: PropTypes.func.isRequired,
  clear_customer_data: PropTypes.func.isRequired,
  clearMembershipID: PropTypes.func.isRequired,
  clearBilling: PropTypes.func.isRequired,
}
const mapStateToProps = state => ({
  cartProduct: state.cartProduct,
  productData: state.productData,
  returnData: state.returnData,
  editData: state.editData,
  theme: state.theme,
  discount: state.discount,
  customerData: state.customerData,
  delivery: state.delivery,
  interAction: state.interAction,
  queueCart: state.queueCart,
  state: state,
  payments: state.payments,
  exchange: state.exchange
});

const mapActionsToProps = {
  prepareCheckout,
  updatePaymentMode,
  clearCart,
  suspendCart,
  clearReturningProducts,
  pageTitle,
  returnIsActive,
  editIsActive,
  clearEditProducts,
  clearAppliedDiscount,
  openDiscountBox,
  clearCustomer,
  clear_customer_data,
  clearMembershipID,
  clearBilling,
  openDeliveryBox,
  clearDelivery,
  handleMiscellaneousBox,
  clearPackaging,
  loadQueueCart,
  toggleQueueCart,
  clearToken,
  cleaPosPaymentsData,
  clearExchangeData
}
export default connect(mapStateToProps, mapActionsToProps)(Checkoutpage);
