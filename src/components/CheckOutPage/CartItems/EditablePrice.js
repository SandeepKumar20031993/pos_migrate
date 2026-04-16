import React, { useEffect, useMemo, useState } from "react";
import {
  Grid,
  Typography,
  Box,
  IconButton,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
} from "@material-ui/core";
import { Edit } from "@material-ui/icons";
import { withStyles } from "@material-ui/core/styles";
import CartHelper from "../../../Helper/cartHelper";
import StoreHelper from "../../../Helper/storeHelper";
import PropTypes from "prop-types";

import CloseIcon from "@material-ui/icons/Close";

const Styles = (theme) => ({
  firstamount: {
    color: "#000",
    fontSize: 15,
    fontWeight: "bold",
  },
  secondamount: {
    textDecorationLine: "line-through",
    fontSize: 14,
  },
  discountamount: {
    color: "#000",
    fontSize: 15,
    fontWeight: "bold",
  },
});

function EditablePrice({ classes, product, disableDiscountPercent, updatePrice }) {
  const [open, setOpen] = useState(false);
  const [newPrice, setNewPrice] = useState("");
  const [discountAmount, setDiscountAmount] = useState("");
  const [discountType, setDiscountType] = useState("PERCENT");

  useEffect(() => {
    setNewPrice(product.finalprice ?? "");
    setDiscountAmount(product.item_discount_amount ?? "");
    setDiscountType(product.item_dis_type || product.single_discount_type || "PERCENT");
  }, [product]);

  const rulesAppliedData = CartHelper.getRulesAppliedData(product);
  const isEnableGlobalDiscount = StoreHelper.isEnableGlobalDiscount();

  const { dicountedPrice, mrp, displayDiscountPercentage, discountLabel } = useMemo(() => {
    let nextDiscountedPrice = rulesAppliedData?.price;
    const nextMrp = product.finalprice;
    let shouldDisplayDiscountPercentage = true;

    if (CartHelper.isGiftVoucherApplicable()) {
      nextDiscountedPrice = product.finalprice;
      shouldDisplayDiscountPercentage = false;
    }
    if (disableDiscountPercent) {
      shouldDisplayDiscountPercentage = false;
    }

    return {
      dicountedPrice: nextDiscountedPrice,
      mrp: nextMrp,
      displayDiscountPercentage: shouldDisplayDiscountPercentage,
      discountLabel: nextMrp
        ? Number(((nextMrp - nextDiscountedPrice) / nextMrp) * 100).toFixed(2)
        : "0.00",
    };
  }, [disableDiscountPercent, product.finalprice, rulesAppliedData?.price]);

  const editNow = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onPriceChange = (event) => {
    setNewPrice(event.target.value);
  };

  const handleFlatoff = (event) => {
    setDiscountAmount(Number(event.target.value));
    setDiscountType("FLAT");
  };

  const handlePercentof = (event) => {
    setDiscountAmount(Number(event.target.value));
    setDiscountType("PERCENT");
  };

  const handleUpdatePrice = () => {
    const detailPrice = CartHelper.getDetailPriceFromNewPrice(
      Number(product.tax),
      newPrice,
      discountType,
      discountAmount,
      product
    );

    updatePrice({ ...product, ...detailPrice });
    setOpen(false);
  };

  const reCalculateData = () => {
    if (
      discountType === "PERCENT" &&
      (Number(discountAmount) <= 0 || Number(discountAmount) > 100)
    ) {
      alert("wrong percent data entered");
      return;
    }

    if (
      discountType === "FLAT" &&
      (Number(discountAmount) <= 0 || Number(discountAmount) > product.finalprice)
    ) {
      alert("wrong flat data entered");
      return;
    }

    const detailPrice = CartHelper.getDetailPriceFromNewPriceEDitable(
      Number(product.tax),
      rulesAppliedData?.price,
      Number(product.finalprice),
      discountType,
      discountAmount,
      product
    );

    updatePrice({ ...product, ...detailPrice });
    setOpen(false);
  };

  const clearFilter = () => {
    const detailPrice = CartHelper.getDetailPriceFromNewPrice(
      Number(product.tax),
      Number(product?.mrp),
      "",
      0,
      product
    );

    updatePrice({ ...product, ...detailPrice });
    setDiscountAmount("");
    setNewPrice(Number(product.actualMrp));
    setOpen(false);
  };

  return (
      <Box direction="row" style={{ width: 'full' }}>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <BootstrapDialogTitle
            id="customized-dialog-title"
            onClose={handleClose}

          >
            {"Edit  '"} {product.name} {"'"}
          </BootstrapDialogTitle>
          <DialogContent dividers>
            {StoreHelper.isPriceEditable() === 1 && (
              <>
                <Typography variant="button" display="block" gutterBottom>
                  {"Actual MRP  "} {product.actualMrp}
                </Typography>
                <Grid item xs>
                  <Grid container direction="row" alignItems="center" wrap="nowrap">
                    <Box pl={1} pt={1}>
                      <TextField
                        label="Price"
                        variant="outlined"
                        type="number"
                        size="small"
                        value={newPrice}
                        onChange={onPriceChange}
                      />
                    </Box>
                    <Box pl={1} pt={1}>
                      <Button variant="contained" color="secondary" onClick={handleUpdatePrice}>
                        Save
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
                <Divider style={{ marginTop: '16px', marginBottom: '16px' }} light />
              </>
            )}

            {StoreHelper.isEnableGlobalDiscount() && (
              <>
                {/* Item Discount - Flat Off */}
                <Grid item xs={12} sm={6}>
                  <Typography variant="button" display="block" gutterBottom>
                    Item Discount By Flat Off
                  </Typography>
                  <TextField
                    id="flatoff"
                    type="number"
                    label="Flat off"
                    variant="outlined"
                    fullWidth
                    value={
                      discountType === "FLAT"
                        ? discountAmount
                        : ""
                    }
                    onChange={handleFlatoff}
                  />
                </Grid>

                {/* Divider */}
                <Grid item xs={12}>
                  <h2
                    style={{
                      width: "100%",
                      textAlign: "center",
                      borderBottom: "1px solid #c2c2c2",
                      lineHeight: "0.1em",
                      margin: "20px 0",
                    }}
                  >
                    <span style={{ background: "#fff", color: "#777" }}>OR</span>
                  </h2>
                </Grid>

                {/* Item Discount - Percentage Off */}
                <Grid item xs={12} sm={6}>
                  <Typography variant="button" display="block" gutterBottom>
                    Item Discount By Percentage Off
                  </Typography>
                  <TextField
                    id="percentoff"
                    type="number"
                    variant="outlined"
                    label="% off"
                    fullWidth
                    value={
                      discountType === "PERCENT"
                        ? discountAmount
                        : ""
                    }
                    onChange={handlePercentof}
                  />
                </Grid>
              </>
            )}

          </DialogContent>
          <DialogActions>
            {StoreHelper.isEnableGlobalDiscount() && (
              <>
                <Button
                  onClick={reCalculateData}
                  autoFocus
                  variant="outlined"
                  color='action'
                  style={{ backgroundColor: 'green', color: 'white' }}
                >
                  Apply
                </Button>
                <Button variant="contained" color="error" onClick={clearFilter}>
                  Clear Discount
                </Button>
              </>
            )}
          </DialogActions>
        </Dialog>




        <Grid item xs>
          <Grid container direction="row" wrap="nowrap">
            <Box >
              {/* variant="subtitle2" */}
              <Typography style={{ marginRight: '8px', fontSize: '12px' }} gutterBottom component={'span'} >
                {CartHelper.isPriceVarient(product)}
              </Typography>
              <Typography
                variant="body1"
                component="span"
                className={classes.firstamount}
              >

                {CartHelper.getCurrencyFormatted(dicountedPrice)}
              </Typography>
            </Box>
            {parseInt(mrp) > parseInt(dicountedPrice) ? (
              <Box pl={2}>
                <Typography
                  variant="subtitle1"
                  component="span"
                  className={classes.secondamount}
                >
                  {CartHelper.getCurrencyFormatted(mrp)}
                </Typography>
              </Box>
            ) : null}
            {(StoreHelper.isPriceEditable() === 1 || isEnableGlobalDiscount) && (
              <Box pl={2}>
                <IconButton aria-label="edit-button" size="small" onClick={editNow}>
                  <Edit size="small" />
                </IconButton>
              </Box>
            )}
          </Grid>
        </Grid>

        {
          (Number(mrp) > Number(dicountedPrice)) && displayDiscountPercentage ? (
            <Grid item lg={4} md={4} sm={4} xs={3}>
              <Typography
                variant="subtitle1"
                component="span"
                className={classes.discountamount}
              >
                ({discountLabel})%Off
              </Typography>
            </Grid>
          ) : null
        }
      </Box>
    );
}

export default withStyles(Styles)(EditablePrice);

function BootstrapDialogTitle(props) {
  const { children, onClose } = props;
  // 
  return (
    <DialogTitle disableTypography style={{ minWidth: '560px', display: 'inline-flex', justifyContent: 'space-between', alignItems: 'center' }} >
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close" onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};
