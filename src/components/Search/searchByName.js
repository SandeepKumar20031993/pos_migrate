import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Grid,
  Box,
  Typography,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@material-ui/core";
import CartHelper from "../../Helper/cartHelper";
import storeHelper from "../../Helper/storeHelper";
import { Search } from "@material-ui/icons";
import AddToCartHelper from "../../Helper/actionHelper/addToCartHelper";
import { dbProductsData } from "../../services/product-service";
import store from "../../store";
import { updateMembershipID } from "../../redux/action/customerAction";
import Autosuggest from "react-autosuggest";
import { Alert } from "@material-ui/lab";
import { GridCloseIcon } from "@material-ui/data-grid";
import { getSessionValue } from "../../Helper/sessionStorage";

const SearchByName = () => {
  const [value, setValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [quantity] = useState(1);
  const [outOfStockMessage, setOutOfStockMessage] = useState("");

  const storeData = useSelector((state) => state.storeData);
  const cartProduct = useSelector((state) => state.cartProduct);
  const dispatch = useDispatch();

  const escapeRegexCharacters = (str) => {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  };

  const getSuggestions = (value) => {
    const inputValue = escapeRegexCharacters(value.trim()).toLowerCase();
    const inputLength = inputValue.length;
    if (inputValue === "" || inputLength === 0) {
      return [];
    }
    const regex = new RegExp(inputValue, "i");
    const productData = dbProductsData.data;

    return productData.filter(
      (product) =>
        regex.test(product.name) ||
        regex.test(product.cat_name) ||
        regex.test(product.sku) ||
        regex.test(product.tags)
    );
  };

  const getSuggestionValue = (suggestion) => {
    return suggestion.name;
  };

  const renderSuggestion = (suggestion) => {
    return (
      <div>
        <Grid container direction="row" justifyContent="space-between" alignItems="center">
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
                    <Typography
                      variant="caption"
                      component="span"
                      color="textSecondary"
                    >
                      {" (in " + suggestion.cat_name + ")"}
                    </Typography>
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
                noWrap={true}
              >
                {suggestion.barcode}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={3}>
            <Box pl={1} className="align-right-important">
              <Typography
                variant="caption"
                component="span"
                color="textSecondary"
                noWrap={true}
              >
                {CartHelper.getPriceFromPrices(suggestion)}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </div>
    );
  };

  const addToCartSuggestedItem = (event, { suggestion }) => {
    // 1. Prepare product data
    const inputQty = Number(quantity) || 1;
    const product = { ...suggestion, qty: inputQty, add_qty: inputQty };

    // 2. Get the config value
    const invTracking = getSessionValue("configs_show_outofstock_in_pos");

    // 3. STRICT CHECK: Ensure it only runs if enabled
    const isTrackingEnabled = invTracking === true || invTracking === "1" || invTracking === "true";

    if (isTrackingEnabled) {
      const loc = storeHelper.getLocationName();
      const stockForLocation = product?.stock?.find(
        (stock) => stock.location_name === loc
      );

      const availableQty = stockForLocation ? stockForLocation.quantity : 0;
      const cartItem = cartProduct.find((item) => item.id === product.id);

      // Calculate current cart amount + what is being added now
      const currentCartQty = cartItem ? cartItem.qty : 0;

      if (currentCartQty + inputQty > availableQty) {
        setOutOfStockMessage(
          `Out of stock! Available quantity for ${loc}: ${availableQty}`
        );
        return; // Stop here if out of stock
      }
    }

    // 4. If tracking is disabled OR stock is available, proceed
    setOutOfStockMessage(""); // Clear any previous error
    AddToCartHelper.validatePrice(product);
    setValue("");
  };


  const onChange = (event, { newValue }) => {
    setValue(newValue);
  };

  const onKeyDown = (event) => {
    if (event.key === "Enter") {
      setValue("");
    }
  };

  const onSuggestionsFetchRequested = ({ value }) => {
    setSuggestions(getSuggestions(value).slice(0, 20));
  };

  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  const shouldRenderSuggestions = (value) => {
    return value.trim().length > 2;
  };

  const setMemberShipId = (e) => {
    if (AddToCartHelper.cartHasProducts()) {
      const userConfirmed = window.confirm(
        "This action will clear the cart. Are you sure you want to proceed?"
      );
      if (!userConfirmed) {
        return;
      }
    }
    AddToCartHelper.clearCart();
    dispatch(updateMembershipID(e.target.value));
  };

  const handleCloseAlert = () => {
    setOutOfStockMessage("");
  };

  const inputStyle = {
    height: 40,
    width: "80%",
    position: "relative",
    fontSize: 14,
    padding: "0 0 0 40px",
    border: "1px solid #e0e0e0",
    borderRadius: 4,
  };

  const autosuggestStyle = {
    color: "#000",
    position: "relative",
  };

  const searchIconStyle = {
    position: "absolute",
    zIndex: 1,
    top: 9,
    left: 9,
    color: "#ccc",
  };

  const inputProps = {
    placeholder: "Search product by name, category, sku...[ Alt+S ]",
    value,
    onChange: onChange,
    onKeyDown: onKeyDown,
    style: inputStyle,
    id: "searchByName",
  };

  return (
    <div style={autosuggestStyle}>
      <Search style={searchIconStyle} />
      <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={onSuggestionsFetchRequested}
        onSuggestionsClearRequested={onSuggestionsClearRequested}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        inputProps={inputProps}
        onSuggestionSelected={addToCartSuggestedItem}
        highlightFirstSuggestion={true}
        shouldRenderSuggestions={shouldRenderSuggestions}
      />
      {outOfStockMessage && (
        <div className="out-of-stock-overlay">
          <Alert
            severity="error"
            style={{ fontSize: "18px" }}
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="large"
                onClick={handleCloseAlert}
              >
                <GridCloseIcon fontSize="inherit" />
              </IconButton>
            }
          >
            {outOfStockMessage}
          </Alert>
        </div>
      )}
      {storeData?.data?.customer_rewards?.length ? (
        <div className="add-product-btn">
          <FormControl>
            <InputLabel id="membership-select-label">Select Group</InputLabel>
            <Select
              labelId="membership-select-label"
              id="membership-select"
              value={store.getState().customerData.membershipId || 0}
              onChange={setMemberShipId}
              label="Select Group"
            >
              <MenuItem value={0}>Select Group</MenuItem>
              {storeData.data.customer_rewards.map((membership) => (
                <MenuItem key={membership.pkg_id} value={membership.pkg_id}>
                  {membership.pkg_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      ) : null}
    </div>
  );
};

export default SearchByName;