import React from "react";
import Autosuggest from "react-autosuggest";
import { connect } from "react-redux";
import {
  AddToCart,
  updateQty,
  updateProduct,
} from "../../redux/action/cartAction";
import { Grid, Box, Typography, Tooltip, IconButton } from "@material-ui/core";
import CartHelper from "../../Helper/cartHelper";
import BarcodeIcon from "./qrcode.gif";
import PropTypes from "prop-types";
import { toogleCreateProduct } from "../../redux/action/productsAction";
import storeHelper from "../../Helper/storeHelper";
import { Add } from "@material-ui/icons";
import AddToCartHelper from "../../Helper/actionHelper/addToCartHelper";
import { dbProductsData } from "../../services/product-service";
import store from "../../store";
import { Alert } from "@material-ui/lab";
import { GridCloseIcon } from "@material-ui/data-grid";
import { getSessionValue } from "../../Helper/sessionStorage";

class searchByBarcode extends React.Component {
  constructor() {
    super();
    this.state = {
      value: "",
      suggestions: [],
      enableCreateProductBtn: storeHelper.canCreateProduct(),
      quantity: 1,
      outOfStockMessage: "",
    };
  }

  getSuggestions = (value) => {
    var inputValue = "";
    var getQuantity = 1;

    this.setState({
      quantity: 1,
    });

    if (value.includes("/")) {
      const getValue = value.split("/");
      inputValue = getValue[0].trim().toLowerCase();
      getQuantity = getValue[1];
      this.setState({
        quantity: getQuantity,
      });
    } else {
      inputValue = value.trim().toLowerCase();
    }

    const inputLength = inputValue.length;
    var productData = dbProductsData.data;
    var returnList =
      inputLength === 0
        ? []
        : productData.filter(
          (product) =>
            product.barcode.toLowerCase().slice(0, inputLength) === inputValue
        );

    for (var i = 0; i < returnList.length; ++i) {
      if (returnList[i].barcode.toLowerCase() === inputValue) {
        var temp = returnList[i];
        returnList.splice(i, 1);
        returnList.unshift(temp);
        break;
      }
    }
    return returnList;
  };

  getSuggestionValue = (suggestion) => {
    return suggestion.name;
  };

  renderSuggestion = (suggestion) => {
    return (
      <div>
        <Grid
          container
          direction="row"
          justify="space-between"
          alignItems="center"
        >
          <Grid item xs={6}>
            <Grid container direction="row" alignItems="center">
              <Grid item>
                <Box>
                  {suggestion.item_image ? (
                    <img
                      src={suggestion.item_image}
                      height={30}
                      alt={suggestion.name}
                    />
                  ) : (
                    <img
                      src={`${process.env.PUBLIC_URL}/assets/images/shop-placeholder.png`}
                      height={30}
                      alt={suggestion.name}
                    />
                  )}
                </Box>
              </Grid>
              <Grid item xs>
                <Box pl={2} className="display-grid">
                  <Typography variant="body2" component="span" noWrap={true}>
                    {suggestion.name}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={3}>
            <Box pl={2} className="align-right-important">
              <Typography
                variant="caption"
                component="span"
                color="textSecondary"
              >
                {suggestion.barcode}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={3}>
            <Box pl={2} className="align-right-important">
              <Typography
                variant="caption"
                component="span"
                color="textSecondary"
              >
                {CartHelper.getPriceFromPrices(suggestion)}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </div>
    );
  };

  addToCartSuggestedItem = (event, data) => {
    const { cartProduct } = this.props;
    const product = {
      ...data.suggestion,
    };

    // Ensure quantity is at least 1
    let inputQty = Number(this.state.quantity) || 1;
    product.qty = inputQty;
    product.add_qty = inputQty;

    let invTracking = getSessionValue("configs_show_outofstock_in_pos");

    // USE THE EXACT SAME CHECK AS THE WORKING ONE:
    const isTrackingEnabled = invTracking === true || invTracking === "1" || invTracking === "true";

    if (isTrackingEnabled) {
      var loc = storeHelper.getLocationName();
      let stockForLocation = product?.stock?.find(
        (stock) => stock.location_name === loc
      );

      let availableQty = stockForLocation ? stockForLocation.quantity : 0;
      let cartItem = cartProduct.find((item) => item.id == product.id);
      let currentCartQty = cartItem ? cartItem.qty : 0;

      // Check if current cart + what you want to add exceeds available
      if (currentCartQty + inputQty > availableQty) {
        this.setState({
          outOfStockMessage: `Out of stock! Available quantity for ${loc}: ${availableQty}`,
        });
        return; // Stops here if enabled and out of stock
      }
    }

    // If tracking is disabled OR there is enough stock, proceed:
    this.AddToCartProduct(product);
    this.setState({
      value: "",
      outOfStockMessage: "", // Important: Clear message so it doesn't stay on screen
    });
  };


  AddToCartProduct = (product) => {
    AddToCartHelper.validatePrice(product);
  };

  onChange = (event, { newValue }) => {
    this.setState({
      value: newValue,
    });
  };

  onSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: this.getSuggestions(value).slice(0, 10),
    });
    if (
      this.getSuggestions(value).length === 0 &&
      storeHelper.canCreateProduct()
    ) {
      // this.setState({
      //   enableCreateProductBtn: true
      // })
    } else {
      // this.setState({
      //   enableCreateProductBtn: false
      // })
    }
  };

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: [],
    });
  };

  shouldRenderSuggestions = (value) => {
    return value.trim().length >= 2;
  };

  onKeyDown = (event) => {
    if (event.key === "Enter") {
      this.setState({
        value: "",
      });
    }
  };

  openCreateProductPopup = () => {
    this.props.toogleCreateProduct(true);
  };
  handleCloseAlert = () => {
    this.setState({
      outOfStockMessage: "",
    });
  };
  render() {
    const { value, suggestions, enableCreateProductBtn } = this.state;

    const barcodescan = {
      height: 40,
      width: "100%",
      position: "relative",
      fontSize: 18,
      padding: 12,
      border: "1px solid #e0e0e0",
      borderRadius: 4,
    };

    const inputProps = {
      placeholder: "Enter or Scan Barcode...[ Alt+B ]",
      value,
      onChange: this.onChange,
      onKeyDown: this.onKeyDown,
      style: barcodescan,
      id: "searchByBarcode",
    };

    const autosuggestStyle = {
      color: "#000",
      position: "relative",
    };
    const barcodeIconStyle = {
      position: "absolute",
      zIndex: "1",
      top: "6px",
      width: "29px",
      right: enableCreateProductBtn ? "48px" : "16px",
      pointerEvents: "none",
    };

    // Finally, render it!
    return (
      <div style={autosuggestStyle}>
        <Autosuggest
          suggestions={suggestions}
          onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
          onSuggestionsClearRequested={this.onSuggestionsClearRequested}
          getSuggestionValue={this.getSuggestionValue.bind(this)}
          renderSuggestion={this.renderSuggestion}
          inputProps={inputProps}
          onSuggestionSelected={this.addToCartSuggestedItem}
          highlightFirstSuggestion={true}
          shouldRenderSuggestions={this.shouldRenderSuggestions}
        />
        {this.state.outOfStockMessage && (
          <div className="out-of-stock-overlay">
            <Alert
              severity="error"
              style={{ fontSize: "18px" }}
              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="large"
                  onClick={this.handleCloseAlert}
                >
                  <GridCloseIcon fontSize="inherit" />
                </IconButton>
              }
            >
              {this.state.outOfStockMessage}
            </Alert>
          </div>
        )}
        <React.Fragment>
          <img src={BarcodeIcon} alt="Scan Barcode" style={barcodeIconStyle} />
          {enableCreateProductBtn ? (
            <div className="add-product-btn">
              <Tooltip title="Add new product" aria-label="add">
                <IconButton onClick={this.openCreateProductPopup}>
                  <Add fontSize="inherit" />
                </IconButton>
              </Tooltip>
            </div>
          ) : (
            ""
          )}
        </React.Fragment>
      </div>
    );
  }
}

searchByBarcode.propTypes = {
  AddToCart: PropTypes.func.isRequired,
  updateQty: PropTypes.func.isRequired,
  updateProduct: PropTypes.func.isRequired,
  toogleCreateProduct: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  productData: state.productData,
  cartProduct: state.cartProduct,
});

export default connect(mapStateToProps, {
  AddToCart,
  updateQty,
  updateProduct,
  toogleCreateProduct,
})(searchByBarcode);
