import React, { Fragment } from "react";

import { connect } from "react-redux";

//  Material ui imports
import {
  Avatar,
  Box,
  Fab,
  Grid,
  IconButton,
  Tooltip,
  Typography,
  withStyles,
} from "@material-ui/core";
import { Close, HighlightOff, Loyalty, PanTool } from "@material-ui/icons";

import LocalShippingIcon from "@material-ui/icons/LocalShipping";

import cartHelper from "../../Helper/cartHelper";

// Redux actions imports
import {
  prepareCheckout,
  clearCart,
  suspendCart,
  clearCustomer,
  clearBilling,
  updatePaymentMode,
  clearToken
} from "../../redux/action/cartAction";
import {
  openDeliveryBox,
  clearDelivery,
} from "../../redux/action/deliveryAction";
import { clearReturningProducts } from "../../redux/action/returnAction";
import { clearEditProducts } from "../../redux/action/editAction";
import {
  pageTitle,
  returnIsActive,
  editIsActive,
} from "../../redux/action/themeAction";
import {
  clearAppliedDiscount,
  openDiscountBox,
} from "../../redux/action/discountAction";
import { clear_customer_data, clearMembershipID } from "../../redux/action/customerAction";
import StoreHelper from "../../Helper/storeHelper";
import { alert, handleMiscellaneousBox } from '../../redux/action/InterAction'
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import { clearPackaging } from "../../redux/action/miscellaneousAction";

import CloudQueueIcon from '@material-ui/icons/CloudQueue';
import { saveToQueueCart, toggleQueueCart } from "../../redux/action/queueCartAction";
import { clearExchangeData } from "../../redux/action/exchangeActions";

const Styles = (theme) => ({
  deliveryButton: {
    width: "40px",
    height: "40px",
    border: "2px solid #c2c2c2",
    "&:hover": {
      // border: "1px solid blue",
      border: "2px solid #f2f2f2",
      backgroundColor: '##f2f2f2'
    },
    [theme.breakpoints.down("sm")]: {
      width: "40px",
      height: "40px",
    },
  },
  testBox: {
    backgroundColor: "blue",
    width: '50px',
    height: '50px'
  }
});

const CheckoutActionsButtons = (props) => {
  const clearCart = () => {
    props.clearCart();
    props.clearCustomer();
    props.clear_customer_data();
    props.clearMembershipID();
    props.clearAppliedDiscount();
    props.clearReturningProducts();
    props.clearEditProducts();
    props.clearDelivery();
    props.openDiscountBox(false);
    props.clearPackaging();
    props.clearExchangeData();
    props.handleMiscellaneousBox(false);
    props.toggleQueueCart(false);
    props.clearToken();
  };

  const suspendCart = () => {
    if (!cartHelper.isEmpty(props.cartProduct)) {
      props.suspendCart(props.cartProduct);
      props.clearCustomer();
      props.clearCart();
      props.clearToken();
    }
  };

  const handleQueueCart = () => {
    if (!cartHelper.isEmpty(props.cartProduct)) {
      props
        .saveToQueueCart(props.cartProduct)
        .then((res) => res.json())
        .then((result) => {
          if (result?.success) {
            props.alert(true, `Your Token is ${result?.data?.token}`);
          }
        })
        .catch(() => {
          props.alert(true, `Something went wrong`);
        });

      props.clearCustomer();
      props.clearCart();
      props.clearToken();
    }
  };

  const openDiscountCoupon = () => {
    if (props.delivery.open) props.openDeliveryBox(false);

    props.handleMiscellaneousBox(false);
    props.openDiscountBox(!props.discount.open);
  };

  const handleOpenMiscellaneous = () => {
    if (props.discount.open) openDiscountCoupon();
    props.handleMiscellaneousBox(!props.interAction.openMiscellaneousBox);
  };

  const showQueueBustingButton = () => {
    const isQueueBustingEnabled = StoreHelper.isQueueBustingEnabled();
    const { exchange } = props;
    const isExchanging = exchange.data && exchange.data.success ? true : false;
    if (!Boolean(Number(isQueueBustingEnabled))) return false;
    if (isExchanging) return false;
    return true;
  };

  const showDiscountButton = () => {
    const { exchange } = props;
    const isExchanging = exchange.data && exchange.data.success ? true : false;
    if (isExchanging) return false;
    return true;
  };

  const {
    cartProduct,
    discount,
    displayIconText,
    exchange,
    classes,
  } = props;
  const isExchanging = exchange.data ? true : false;
  const isCartEmpty = cartHelper.isEmpty(cartProduct);
  const isMiscellaneousButton = StoreHelper.isMiscellaneousButton();

  return (
      <Fragment>
        <Grid item xs>
          <Box className="display-flex">
            <Tooltip title="Clear Cart [Alt+C]" aria-label="Clear Cart">
              <span className="display-flex flex-column align-items-center">
                <Fab
                  className={"fab-button-on-checkout"}
                  id="cart-clear-btn"
                  onClick={clearCart}
                  disabled={isCartEmpty}>
                  <Close disabled={isCartEmpty} className={"close-icon checkout-action-icon"} />
                  {/* <HighlightOff className={"close-icon"} /> */}

                </Fab>
                {displayIconText ? (
                  <label htmlFor="cart-clear-btn" className="cursor-pointer">
                    <Typography
                      variant="subtitle2"
                      component="strong"
                      className="bold-i">
                      Clear Cart
                    </Typography>
                  </label>
                ) : null}
              </span>
            </Tooltip>
          </Box>
        </Grid>
        {!isExchanging &&
          <Grid item xs>
            <Box className="display-flex">
              <Tooltip
                title="Double click to suspend cart [Ctrl+Shift+S]"
                aria-label="Suspend Cart">
                <span className="display-flex flex-column align-items-center">
                  <Fab
                    className={"fab-button-on-checkout"}
                    id="cart-suspend-btn"
                    onDoubleClick={suspendCart}
                    onClick={props.openSuspendCart}>
                    <Avatar className={"checkout-icons"}>
                      <PanTool className={"hand-icon checkout-action-icon"} />
                    </Avatar>
                  </Fab>
                  {displayIconText ? (
                    <label htmlFor="cart-suspend-btn" className="cursor-pointer">
                      <Typography
                        variant="subtitle2"
                        component="strong"
                        className="bold-i">
                        Suspend Cart
                      </Typography>
                    </label>
                  ) : null}
                </span>
              </Tooltip>
            </Box>
          </Grid>
        }
        {showQueueBustingButton() &&
          <Grid item xs>
            <Box className="display-flex">
              <Tooltip
                title="Open Queued carts"
                aria-label="Queued Cart">
                <span className="display-flex flex-column align-items-center">
                  <Fab
                    className={"fab-button-on-checkout"}
                    id="cart-queued-btn"
                    onClick={() => { props.toggleQueueCart(!props.queueCart.openQueueCart) }}
                    onDoubleClick={handleQueueCart}
                  >
                    <Avatar className={"checkout-icons"}>
                      <CloudQueueIcon className={"cloud-queue-icon checkout-action-icon"} />
                    </Avatar>
                  </Fab>
                  {displayIconText ? (
                    <label htmlFor="cart-suspend-btn" className="cursor-pointer">
                      <Typography
                        variant="subtitle2"
                        component="strong"
                        className="bold-i">
                        Queue Cart
                      </Typography>
                    </label>
                  ) : null}
                </span>
              </Tooltip>
            </Box>
          </Grid>}
        {/* <Grid item xs>
          <Box className="display-flex">
            {!cartHelper.isEmpty(returnData) && returnData.success !== undefined ?
              <Tooltip title="New Sale [Alt+N]" aria-label="New Sale">
                <span className="display-flex flex-column align-items-center">
                  <Fab className={'fab-button-on-checkout'} id="new-sale-btn" onClick={this.newSaleStart}>
                    <Avatar className={'checkout-icons'}>
                      <Description className={'reply-icon'} />
                    </Avatar>
                  </Fab>
                  {displayIconText ?
                    <label htmlFor="new-sale-btn" className="cursor-pointer">
                      <Typography variant="subtitle2" component="strong" className="bold-i">New Sale</Typography>
                    </label>
                    : null
                  }
                </span>
              </Tooltip>
              : null
            }
            {!cartHelper.isEmpty(editData) && editData.success !== undefined ?
              <Tooltip title="New Sale [Alt+N]" aria-label="New Sale">
                <span className="display-flex flex-column align-items-center">
                  <Fab className={'fab-button-on-checkout'} id="new-sale-btn" onClick={this.newSaleStart}>
                    <Avatar className={'checkout-icons'}>
                      <Description className={'reply-icon'} />
                    </Avatar>
                  </Fab>
                  {displayIconText ?
                    <label htmlFor="new-sale-btn" className="cursor-pointer">
                      <Typography variant="subtitle2" component="strong" className="bold-i">New Sale</Typography>
                    </label>
                    : null
                  }
                </span>
              </Tooltip>
              : null
            }
            {cartHelper.isEmpty(returnData) && cartHelper.isEmpty(editData) ?
              <Tooltip title="Return item [Alt+R]" aria-label="Return item">
                <span className="display-flex flex-column align-items-center">
                  <Fab className={'fab-button-on-checkout'} id="return-start-btn" onClick={this.toggleReturnPopup}>
                    <Avatar className={'checkout-icons'}>
                      <Reply className={'reply-icon'} />
                    </Avatar>
                  </Fab>
                  {displayIconText ?
                    <label htmlFor="return-start-btn" className="cursor-pointer">
                      <Typography variant="subtitle2" component="strong" className="bold-i">Return</Typography>
                    </label>
                    : null
                  }
                </span>
              </Tooltip>
              : null
            }
          </Box>
        </Grid> */}

        {showDiscountButton() &&
          <Grid item xs>
            <Box className="display-flex">
              <Tooltip
                title="Discount Coupon [Alt+D]"
                aria-label="Discount Coupon">
                <span className="display-flex flex-column align-items-center">
                  <Fab
                    className={"fab-button-on-checkout"}
                    id="discount-btn"
                    onClick={openDiscountCoupon}
                    disabled={isCartEmpty}>
                    <Loyalty className={"loyalty-tag-icon checkout-action-icon"} />
                  </Fab>
                  {displayIconText ? (
                    <label htmlFor="discount-btn" className="cursor-pointer">
                      <Typography
                        variant="subtitle2"
                        component="strong"
                        className="bold-i">
                        Discount
                      </Typography>
                    </label>
                  ) : null}
                </span>
              </Tooltip>
            </Box>
          </Grid>}
        {isMiscellaneousButton

          &&
          <Grid item xs>
            <Tooltip
              title="Miscellaneous Charges"
              aria-label="Delivery">
              <span className="display-flex flex-column align-items-center">



                <IconButton
                  onClick={handleOpenMiscellaneous}
                  className={classes.deliveryButton}
                  // classes={'checkout-delivery-button'}
                  size="small"
                  disabled={isCartEmpty}>
                  <MoreHorizIcon />
                </IconButton>

                {displayIconText ? (
                  <label htmlFor="discount-btn" className="cursor-pointer">
                    <Typography
                      variant="subtitle2"
                      component="strong"
                      className="bold-i">
                      Miscellaneous
                    </Typography>
                  </label>
                ) : null}
              </span>
            </Tooltip>
          </Grid>}

      </Fragment>
    );
};

const mapStateToProps = (state) => ({
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
  exchange: state.exchange,
});
const mapActionsToProps = {
  clearCart,
  suspendCart,
  clearReturningProducts,

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
  saveToQueueCart,
  toggleQueueCart,
  clearToken,
  alert,
  clearExchangeData
};
export default connect(
  mapStateToProps,
  mapActionsToProps
)(withStyles(Styles)(CheckoutActionsButtons));
