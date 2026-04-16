import React, { useState, useEffect, useCallback } from 'react';
import {
  Dialog, DialogTitle, DialogActions, DialogContent,
  Grid, Button, TextField, IconButton, FormControl, InputLabel, Select,
  MenuItem
} from '@material-ui/core';
import { Close } from '@material-ui/icons';
import { useDispatch, useSelector } from "react-redux";

import StoreHelper from '../../Helper/storeHelper';
import CartHelper from '../../Helper/cartHelper';

import {
  toggleEditProductPopup
} from '../../redux/action/productConfigAction';
import {
  fetchCategory,
  updateProduct   // <-- add this
} from '../../redux/action/productsAction';
import {
  loading,
  alert
} from '../../redux/action/InterAction';
import {
  dbProductsData,
  getProductsFromDb
} from '../../services/product-service';

// import UrlHelper from "../../Helper/urlHelper";
// import { post, put } from "../../Helper/http"; // assuming you have these

const EditProduct = ({ updateCollection }) => {
  const dispatch = useDispatch();
  const productConfig = useSelector((state) => state.productConfig);
  const storeCounter = useSelector((state) => state.storeCounter);
  const [formData, setFormData] = useState({
    item_id: "",
    name: "",
    barcode: "",
    costprice: "",
    mrp: "",
    user_id: StoreHelper.getUserId(),
    inventory: 0,
    hsncode: "",
    location_id: StoreHelper.getLocationId(),
    category_id: "",
    categoryName: "",
    tax_group_id: "",
    mode: "update",
  });

  const [categories, setCategories] = useState([]);
  const tax_groups = StoreHelper.getTaxGroups();
  const [locations, setLocations] = useState([]);

  /** Load categories from API */
  const loadCategories = useCallback(async () => {
    try {
      const res = await dispatch(fetchCategory());

      if (!res.ok) {
        const text = await res.text(); // fallback to text
        console.error("Bad response from categories API:", text);
        setCategories([]);
        return;
      }

      let response;
      try {
        response = await res.json();
      } catch (jsonErr) {
        const text = await res.text();
        console.error("Categories API did not return JSON:", text);
        setCategories([]);
        return;
      }

      console.log("Categories response:", response);

      if (response?.success && Array.isArray(response?.cats)) {
        setCategories(response.cats);
      } else {
        setCategories([]);
      }
    } catch (err) {
      console.error("Error loading categories:", err);
      setCategories([]);
    }
  }, [dispatch]);



  /** Flatten categories with parents and children */
  const getFlatCategories = useCallback(() => {
    let flatCats = [];

    categories.forEach(parentCat => {
      // Add parent category if valid
      if (parentCat.id && parentCat.name) {
        flatCats.push({ id: parentCat.id, name: parentCat.name });
      }

      // Add children categories if valid
      if (Array.isArray(parentCat.childs)) {
        parentCat.childs.forEach(child => {
          if (child.id && child.child) {
            flatCats.push({ id: child.id, name: child.child });
          }
        });
      }
    });

    return flatCats;
  }, [categories]);


  /** Populate form fields for editing */
  const populateFormData = useCallback((product) => {
    if (!product || CartHelper.isEmpty(product)) return;

    const prices = product.prices || [];
    const lastPrice = prices.length > 0 ? prices[prices.length - 1] : {};

    setFormData({
      item_id: product.id || product.item_id || "",
      name: product.name || "",
      barcode: product.barcode || "",
      costprice: String(lastPrice?.costprice || product.cost_price || ""),
      mrp: String(lastPrice?.mrp || product.mrp || ""),
      user_id: StoreHelper.getUserId(),
      inventory: Number(product.qty || 0),
      hsncode: product.hsn_code || "",
      location_id: storeCounter?.location?.loc_id || StoreHelper.getLocationId(),
      category_id: product.category_id || "",
      categoryName: "",
      tax_group_id: product.tax_group_id || "",
      mode: "update",
    });

    // Set categoryName once categories are loaded (with a delay)
    setTimeout(() => {
      const flatCats = getFlatCategories();
      const matchedCat = flatCats.find(c => String(c.id) === String(product.category_id));
      if (matchedCat) {
        setFormData(prev => ({ ...prev, categoryName: matchedCat.name }));
      }
    }, 200);
  }, [getFlatCategories, storeCounter?.location?.loc_id]);

  /** Load locations from StoreHelper AND sync selected location */
  useEffect(() => {
    if (!productConfig.editProdPopup) {
      return;
    }

    loadCategories();

    const normalizeLocations = (raw) => {
      try {
        const data = typeof raw === 'string' ? JSON.parse(raw) : raw;
        if (!data) return [];
        if (Array.isArray(data)) return data;
        if (Array.isArray(data?.data)) return data.data;
        if (Array.isArray(data?.locations)) return data.locations;
        if (typeof data === 'object') return Object.values(data);
        return [];
      } catch {
        return [];
      }
    };

    const toLocationOption = (loc, index) => {
      const idRaw = loc?.id ?? loc?.location_id ?? loc?.value ?? index;
      const id = String(idRaw);
      const name = loc?.name ?? loc?.location_name ?? loc?.title ?? loc?.label ?? `Location ${id}`;
      return { id, name };
    };

    const raw = StoreHelper.getAllLocations();
    console.log("Raw locations from StoreHelper:", raw);

    const list = normalizeLocations(raw).map(toLocationOption);
    console.log("Normalized locations:", list);

    setLocations(list);

    const selectedLocId = storeCounter?.location?.loc_id || StoreHelper.getLocationId();
    const selected = selectedLocId && list.find(l => l.id === String(selectedLocId)) ? String(selectedLocId) : (list[0]?.id ?? '');
    setFormData(prev => ({ ...prev, location_id: selected }));

    if (productConfig.editableProduct) {
      populateFormData(productConfig.editableProduct);
    }
  }, [loadCategories, populateFormData, productConfig.editProdPopup, productConfig.editableProduct, storeCounter?.location]);

  /** Handlers for form */
  const closePopup = () => dispatch(toggleEditProductPopup(false));

  const handleChange = (name, e) => {
    setFormData(prev => ({ ...prev, [name]: e }));
  };

  /** Data validation */
  const isFilledAllData = () => {
    const required = ['name', 'costprice', 'mrp', 'tax_group_id'];
    return required.every(field => (formData[field] !== "" && formData[field] !== null));
  };

  /** Handle save */

  const saveProduct = async () => {
    if (!isFilledAllData()) {
      dispatch(alert(true, "Please fill required fields"));
      return;
    }

    const itemIdNum = parseInt(formData.item_id, 10);
    if (!Number.isFinite(itemIdNum) || itemIdNum <= 0) {
      dispatch(alert(true, "Invalid item. Please reopen the product and try again."));
      return;
    }

    const locationIdNum = parseInt(formData.location_id, 10);
    if (!Number.isFinite(locationIdNum) || locationIdNum <= 0) {
      dispatch(alert(true, "Location is required."));
      return;
    }

    const inventoryNum = parseInt(formData.inventory, 10);
    if (!Number.isFinite(inventoryNum) || inventoryNum < 0) {
      dispatch(alert(true, "Inventory must be 0 or greater."));
      return;
    }

    const payload = {
      item_id: itemIdNum,
      name: formData.name.trim(),
      barcode: formData.barcode?.trim(),
      costprice: parseFloat(formData.costprice),
      mrp: parseFloat(formData.mrp),
      hsncode: formData.hsncode?.trim(),
      category_id: formData.category_id || null,
      location_id: locationIdNum,
      tax_group_id: formData.tax_group_id,
      inventory: inventoryNum,
    };

    try {
      dispatch(loading(true));

      // ✅ dispatch the thunk
      const res = await dispatch(updateProduct(itemIdNum, payload));
      console.log("SaveProduct response:", res);

      if (res?.success) {
        await getProductsFromDb();
        if (dbProductsData?.data?.length > 0) {
          updateCollection(dbProductsData.data);
        }
        closePopup();
      } else {
        dispatch(alert(true, res?.msg || "Failed to save product"));
      }
    } catch (err) {
      console.error("Error updating product:", err);
      dispatch(alert(true, "Error updating product"));
    } finally {
      dispatch(loading(false));
    }
  };

  return (
    <Dialog fullWidth maxWidth="sm" open={!!productConfig.editProdPopup} scroll="body">
      <form onSubmit={(e) => { e.preventDefault(); saveProduct(); }}>
        <Grid>
          <DialogActions>
            <IconButton onClick={closePopup}><Close /></IconButton>
          </DialogActions>
        </Grid>
        <DialogTitle>{"Editing Product " + (formData.name || formData.barcode || "")}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            {/* Name */}
            <Grid item xs={6}>
              <TextField required fullWidth label="Name" variant="outlined"
                value={formData.name} onChange={e => handleChange("name", e.target.value)} />
            </Grid>
            {/* Barcode */}
            <Grid item xs={6}>
              <TextField fullWidth label="Barcode" variant="outlined"
                value={formData.barcode} onChange={e => handleChange("barcode", e.target.value)} />
            </Grid>
            {/* Cost Price */}
            <Grid item xs={6}>
              <TextField required fullWidth label="Cost Price" type="number" variant="outlined"
                value={formData.costprice} onChange={e => handleChange("costprice", e.target.value)} />
            </Grid>
            {/* MRP */}
            <Grid item xs={6}>
              <TextField required fullWidth label="MRP" type="number" variant="outlined"
                value={formData.mrp} onChange={e => handleChange("mrp", e.target.value)} />
            </Grid>
            {/* Inventory */}
            <Grid item xs={6}>
              <TextField fullWidth label="Inventory" type="number" variant="outlined"
                value={formData.inventory} onChange={(e) => handleChange("inventory", e.target.value)} />
            </Grid>

            {/* Location */}
            <Grid item xs={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="location-label">Location</InputLabel>
                <Select native labelId="location-label"
                  value={formData.location_id}
                  onChange={e => handleChange("location_id", e.target.value)}
                >
                  <option aria-label="None" value="">Select Location</option>
                  {locations.length > 0 ? locations.map(loc => (
                    <option key={`location-${loc.id}`} value={loc.id}>{loc.name}</option>
                  )) : <option value="" disabled>No locations available</option>}
                </Select>
              </FormControl>
            </Grid>

            {/* Tax Group */}
            <Grid item xs={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="tax-group-label">Tax Group</InputLabel>
                <Select native labelId="tax-group-label"
                  value={formData.tax_group_id}
                  onChange={(e) => handleChange("tax_group_id", e.target.value)}
                >
                  <option aria-label="None" value="">Select Tax Group</option>
                  {tax_groups?.map(tax => (
                    <option key={tax.id} value={tax.id}>
                      {tax.group_name} (CGST:{tax.taxes.CGST} SGST:{tax.taxes.SGST})
                    </option>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Category */}
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel id="category-label">Category</InputLabel>
                <Select
                  labelId="category-label"
                  value={formData.category_id}
                  onChange={e => handleChange("category_id", e.target.value)}
                >
                  {getFlatCategories().map(cat => (
                    <MenuItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={closePopup}>Cancel</Button>
          <Button type="submit" color="secondary" variant="contained" disabled={!isFilledAllData()}>
            Save Product
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EditProduct;
