import React, { Component } from "react";
import { Box, Card, CircularProgress, Typography } from "@material-ui/core";
import CheckoutButton from "../CheckOutPage/CheckoutPage";
import { withStyles } from "@material-ui/core/styles";
import Chooseproduct from "../CheckOutPage/Chooseproduct";
import SearchByBarcode from "../Search/searchByBarcode";
// import CartHelper from '../../Helper/cartHelper';
import { connect } from "react-redux";
import CartProduct from "../CheckOutPage/CartProduct";
import { Router } from "react-router-dom/cjs/react-router-dom";
import QueueBustingButtons from "../CheckOutPage/QueueBustingButtons";
import { Alert } from "@material-ui/lab";
import StoreHelper from "../../Helper/storeHelper";
import {
  getCashRegisterApi,
  loadCashRegisterData,
} from "../../redux/action/cashRegisterAction";

const Styles = (theme) => ({
  root: {
    flexGrow: 1,
  },
  fixCheckout: {
    position: "fixed",
    bottom: 0,
    width: "33.33333%",
    right: 0,
  },
  selectedproduct: {
    boxSizing: "border-box",
    overflow: "hidden",
    position: "relative",
    paddingTop: 1,
    paddingRight: "8px",
    paddingLeft: "8px",
  },
});

class SelectedProduct extends Component {
  constructor(props) {
    super(props);

    this.state = {
      checkoutBlockHeight: "264px",
      path: "",
      showCashRegisterAlert: false,
      fetchingCashRegister: false,
    };
  }

  componentDidMount() {
    const height = this.checkoutElement.clientHeight;
    this.setState({
      checkoutBlockHeight: height + 130 + "px",
    });

    this.getPath();

    this.checkCashRegisterCond();
  }
  getPath() {
    let path = window.location.pathname?.split("/").pop();

    this.setState({ path });
  }

  checkCashRegisterCond() {
    const isCashRegisterEnabled = StoreHelper.isCashRegsiterEnabled();
    if (isCashRegisterEnabled) {
      var { cashRegister } = this.props;
      if (!cashRegister?.isRegisterOpen) {
        if (cashRegister?.isLoaded) {
          this.setState({ showCashRegisterAlert: true });
        } else {
          this.fetchCashregister();
        }
      }
    }
  }

  fetchCashregister = async () => {
    this.setState({ fetchingCashRegister: true });
    let result = await this.props
      .getCashRegisterApi({})
      .then((result) => {
        return result.json();
      })
      .catch((err) => {
        console.error("error while fetching cash register");
        return null;
      });
    if (result?.success) {
      this.props.loadCashRegisterData(result?.data);
    } else {
      this.props.loadCashRegisterData(null);
    }
    this.setState({ fetchingCashRegister: false });
  };

  render() {
    const { checkoutBlockHeight } = this.state;
    var stylescroll = {
      overflowY: "scroll",
      height: "calc(100vh - " + checkoutBlockHeight + ")",
      margin: 0,
      padding: 0,
      width: "auto",
      justifyContent: "space-around",
    };

    const { classes, checkoutData } = this.props;
    const { path } = this.state;

    return (
      <>
        <Box
          mt={1}
          className="position-relative"
          style={{ paddingLeft: "4px", paddingRight: "4px" }}>
          <SearchByBarcode />
        </Box>
        <Box style={stylescroll}>
          <Box className={classes.selectedproduct}>
            {checkoutData?.token && checkoutData?.token?.id && (
              <Box
                style={{
                  backgroundColor: "#f2f2f2",
                  width: "100%",
                  borderRadius: "4px",
                  padding: "4px 8px",
                  margin: "8px 0",
                }}>
                <Typography style={{ color: "red", textAlign: "right" }}>
                  {checkoutData?.token?.token_no}
                </Typography>
              </Box>
            )}
            {/* <Chooseproduct /> */}
            <CartProduct />
          </Box>
          <Box className={classes.fixCheckout}>
            <div
              className="position-relative height-100"
              ref={(checkoutElement) => {
                this.checkoutElement = checkoutElement;
              }}>
              {this.state.fetchingCashRegister ? (
                <Box>
                  <Card
                    elevation={0}
                    className={"boxcardfix"}
                    square
                    style={{ borderRadius: "4px" }}>
                    {" "}
                    <CircularProgress size={25} /> Loading Cash register
                  </Card>
                </Box>
              ) : this.state.showCashRegisterAlert ? (
                <Box>
                  <Card
                    elevation={0}
                    className={"boxcardfix"}
                    square
                    style={{ borderRadius: "4px" }}>
                      <Alert severity="error"> <a href={`${process.env.PUBLIC_URL}/cash-register`}>Open Cash Register To bill</a></Alert>
                  </Card>
                </Box>
              ) : path === "token" ? (
                <QueueBustingButtons />
              ) : (
                <CheckoutButton />
              )}
            </div>
          </Box>
        </Box>
      </>
    );
  }
}
const mapStateToProps = (state) => ({
  cartProduct: state.cartProduct,
  customerData: state.customerData,
  checkoutData: state.checkoutData,
  discount: state.discount,
  cashRegister: state.cashRegister,
});

const mapActionsToProps = {
  getCashRegisterApi,
  loadCashRegisterData,
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(withStyles(Styles)(SelectedProduct));
