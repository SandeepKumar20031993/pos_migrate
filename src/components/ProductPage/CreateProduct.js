import React, { Component } from 'react'
import {
  Dialog, DialogTitle, DialogActions, DialogContent,
  Grid, Button, TextField, MenuItem, IconButton,
  FormControl, InputLabel, Select
} from '@material-ui/core';

import { Close } from '@material-ui/icons';
import { connect } from "react-redux";
import PropTypes from 'prop-types';

import storeHelper from '../../Helper/storeHelper';

import {
  toogleCreateProduct,
  createProduct,
  fetchCategory
} from '../../redux/action/productsAction';

import { loading, alert } from '../../redux/action/InterAction';

import { fetchAndRefreshedProducts } from '../../services/product-service';

export class CreateProduct extends Component {

  constructor(props) {
    super(props)

    this.state = {
      name: "",
      barcode: "",
      costprice: "1",
      mrp: "",
      sale_price: "",
      user_id: "",
      inventory: 0,
      unit: "",
      hsncode: "",
      location: "",
      category_id: "",
      tax_group_id: ""
    }
  }

  componentDidMount() {

    this.setState({
      location: storeHelper.getLocationId(),
      user_id: storeHelper.getUserId()
    });

  }

  closePopup = () => {
    this.props.toogleCreateProduct(false)
  }

  update = (name, e) => {

    let value = e.target.value;

    if (["mrp", "inventory", "tax_group_id", "category_id", "sale_price"].includes(name)) {
      value = value === "" ? "" : Number(value);
    }

    this.setState({ [name]: value });

  }

  saveProduct = (e) => {

    e.preventDefault();

    const {
      name,
      barcode,
      costprice,
      mrp,
      user_id,
      location,
      inventory,
      unit,
      hsncode,
      category_id,
      tax_group_id,
      sale_price
    } = this.state;

    const locationIdNum = parseInt(location, 10);
    const inventoryNum =
      inventory === "" || inventory === null || inventory === undefined
        ? 0
        : parseInt(inventory, 10);
    const mrpNum = mrp === "" ? "" : parseFloat(mrp);
    const costPriceNum = costprice === "" ? "" : parseFloat(costprice);
    const salePriceNum = sale_price === "" ? "" : parseFloat(sale_price);

    const payload = {
      name: name?.trim(),
      barcode: barcode?.trim(),
      costprice: costPriceNum,
      mrp: mrpNum,
      user_id,
      location,
      location_id: Number.isFinite(locationIdNum) ? locationIdNum : location,
      inventory: Number.isFinite(inventoryNum) ? inventoryNum : 0,
      unit,
      hsncode: hsncode?.trim(),
      cat_id: category_id,
      category_id: category_id || null,
      tax_group_id,
      sale_price: salePriceNum
    };

    console.log("Create Product Payload:", payload);

    if (!this.isFilledAllData(payload)) {
      this.props.alert(true, "Please fill all required fields");
      return;
    }

    this.props.loading(true);

    this.props.createProduct(payload)
      .then(async (res) => {
        const text = await res.text();
        try {
          return JSON.parse(text);
        } catch (parseError) {
          throw new Error(text || "Invalid server response");
        }
      })
      .then(response => {

        this.props.loading(false);

        if (response && response.success) {

          fetchAndRefreshedProducts();
          this.closePopup();

        } else {

          console.error("API ERROR:", response);
          this.props.alert(true, response?.msg || response?.message || "Failed to create product");

        }

      })
      .catch((error) => {

        console.error("REQUEST ERROR:", error);

        this.props.loading(false);
        this.props.alert(true, error?.message || "Something went wrong");

      });

  };

  isFilledAllData = (state) => {

    const notRequired = ['inventory', 'costprice', 'sale_price', 'cat_id', 'category_id', 'hsncode'];

    return Object.keys(state).every(key => {

      if (notRequired.includes(key)) return true;

      return state[key] !== "" && state[key] !== null && state[key] !== undefined;

    });

  }

  render() {

    const { productData, storeData } = this.props

    const {
      name,
      barcode,
      mrp,
      sale_price,
      inventory,
      unit,
      hsncode,
      category_id,
      tax_group_id
    } = this.state

    const tax_groups = storeHelper.getTaxGroups();
    const categories = storeHelper.getCategories();

    const unitsString = storeData?.data?.configs?.item_units || "";
    const unitsArray = unitsString.split(',');

    return (

      <Dialog
        fullWidth
        maxWidth="sm"
        open={productData.createPopup || false}
        scroll="body"
        className="create-product"
      >

        <form onSubmit={this.saveProduct} autoComplete="off">

          <DialogActions>

            <IconButton className="popup-close-button" onClick={this.closePopup}>
              <Close />
            </IconButton>

          </DialogActions>

          <DialogTitle>Create a new product</DialogTitle>

          <DialogContent>

            <Grid container spacing={2}>

              <Grid item xs={6}>
                <TextField
                  required
                  fullWidth
                  label="Name"
                  variant="outlined"
                  value={name}
                  onChange={(e) => this.update("name", e)}
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  required
                  fullWidth
                  label="Barcode"
                  variant="outlined"
                  value={barcode}
                  onChange={(e) => this.update("barcode", e)}
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  required
                  fullWidth
                  label="MRP"
                  type="number"
                  variant="outlined"
                  value={mrp}
                  onChange={(e) => this.update("mrp", e)}
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Sale Price"
                  type="number"
                  variant="outlined"
                  value={sale_price}
                  onChange={(e) => this.update("sale_price", e)}
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="HSN Code"
                  variant="outlined"
                  value={hsncode}
                  onChange={(e) => this.update("hsncode", e)}
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  required
                  select
                  fullWidth
                  label="Unit"
                  variant="outlined"
                  value={unit}
                  onChange={(e) => this.update("unit", e)}
                >
                  {unitsArray.map((u, i) => (
                    <MenuItem key={i} value={u}>{u}</MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Inventory"
                  type="number"
                  variant="outlined"
                  value={inventory}
                  onChange={(e) => this.update("inventory", e)}
                />
              </Grid>

              <Grid item xs={6}>

                <FormControl fullWidth variant="outlined">

                  <InputLabel>Category</InputLabel>

                  <Select
                    native
                    value={category_id}
                    onChange={(e) => this.update("category_id", e)}
                    label="Category"
                  >

                    <option value="">Select Category</option>

                    {categories?.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}

                  </Select>

                </FormControl>

              </Grid>

              <Grid item xs={12}>

                <FormControl fullWidth variant="outlined">

                  <InputLabel>Tax Group</InputLabel>

                  <Select
                    native
                    required
                    value={tax_group_id}
                    onChange={(e) => this.update("tax_group_id", e)}
                    label="Tax Group"
                  >

                    <option value="">Select Tax Group</option>

                    {tax_groups?.map(tax => (
                      <option key={tax.id} value={tax.id}>
                        {tax.group_name} CGST:{tax.taxes?.CGST} SGST:{tax.taxes?.SGST}
                      </option>
                    ))}

                  </Select>

                </FormControl>

              </Grid>

            </Grid>

          </DialogContent>

          <DialogActions>

            <Button
              type="submit"
              variant="contained"
              color="secondary"
              size="large"
            >
              Save
            </Button>

          </DialogActions>

        </form>

      </Dialog>
    )
  }
}

CreateProduct.propTypes = {
  toogleCreateProduct: PropTypes.func.isRequired,
  createProduct: PropTypes.func.isRequired,
  fetchCategory: PropTypes.func.isRequired,
  loading: PropTypes.func.isRequired,
  alert: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  productData: state.productData,
  storeData: state.storeData
});

const mapActionToProps = {
  toogleCreateProduct,
  createProduct,
  fetchCategory,
  loading,
  alert
};

export default connect(mapStateToProps, mapActionToProps)(CreateProduct);
