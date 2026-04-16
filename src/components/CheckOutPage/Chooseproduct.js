import React, { useEffect } from "react";
import {
  Card,
  CardMedia,
  Grid,
  Typography,
  Box,
  Button,
  IconButton,
  Icon,
  Chip,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import { withStyles } from "@material-ui/core/styles";
import {
  updateQty,
  decreaseQty,
  removeCartItem,
  changeQty,
  updateCartPrice,
  updatePaymentMode,
} from "../../redux/action/cartAction";
//import { clearReturningProducts } from '../../redux/action/returnAction';
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
// import Price from '../CheckOutPage/CartItems/Price';
import EditablePrice from "../CheckOutPage/CartItems/EditablePrice";
//import ItemDiscount from '../CheckOutPage/discountCoupon/itemDiscount';
import CartHelper from "../../Helper/cartHelper";
import { clearAppliedDiscount } from "../../redux/action/discountAction";
import { clear_customer_data } from "../../redux/action/customerAction";
import { startRuleCalculation } from "../../redux/action/returnAction";
import { Alert } from "@material-ui/lab";

import Helper from '../../Helper/storeHelper';
import { green, red } from "@material-ui/core/colors";

const Styles = (theme) => ({
  Chooseitem: {
    position: "relative",
    border: "1px solid #f2f2f2",
    padding: 5,
    marginTop: 4,
  },
  chooseimg: {
    width: "100%",
    backgroundSize: "contain",
    height: "100%",
  },
  qtybox: {
    float: "left",
    width: 65,
    height: 25,
    fontSize: 14,
    textAlign: "center",
    background: "#f2f2f2",
    border: "1px solid #f2f2f2",
    position: "relative",
    borderRadius: '4px'
  },
  taxbox: {
    background: "#f3b7b7",
    border: "1px solid #888",
    padding: "0 7px",
  },
  buttonminus: {
    float: "left",
    height: 25,
    background: "#fff",
    width: 25,
    boxShadow: "none",
    border: "2px solid #6f6b6b",
    marginRight: 5,
    fontWeight: "bold",
    fontSize: 18,
    boxSizing: "border-box",
  },
  buttonplus: {
    float: "left",
    height: 25,
    background: "#fff",
    width: 25,
    boxShadow: "none",
    border: "2px solid #6f6b6b",
    marginLeft: 5,
    fontWeight: "bold",
    fontSize: 18,
    boxSizing: "border-box",
  },
  nametax: {
    fontSize: 15,
    fontWeight: "bold",
    marginRight: 5,
    color: "#7b7b7b",
  },
  productname: {
    color: "#5d5c5c",
  },
  removeItem: {
    padding: "0",
    width: 30,
    minWidth: "auto",
    float: "right",
    borderRadius: "50%",
    height: 30,
    color: 'gray',
    '&:hover': {
      color: '#EE4B2B'
    }
  },
});

function ChooseProduct({ classes }) {
  const dispatch = useDispatch();
  const cartProduct = useSelector((state) => state.cartProduct);
  const returnData = useSelector((state) => state.returnData);
  const editData = useSelector((state) => state.editData);

  useEffect(() => {
    dispatch(clear_customer_data());
  }, [dispatch]);

  const clearDiscCust = () => {
    dispatch(updatePaymentMode(""));
    if (CartHelper.isNewSale()) {
      dispatch(clearAppliedDiscount());
      dispatch(clear_customer_data());
    }
  };

  const handleUpdateQty = (product, event) => {
    if (event === "plus") {
      dispatch(updateQty(product));
    } else {
      dispatch(decreaseQty(product));
    }
    clearDiscCust();
  };

  const handleRemoveItem = (index, product) => {
    dispatch(removeCartItem(index, product));
    clearDiscCust();
  };

  const handleQty = (product, event) => {
    const nextProduct = {
      ...product,
      qty: event.target.value,
    };
    dispatch(changeQty(nextProduct));
    clearDiscCust();
  };

  const handleUpdatePrice = (product) => {
    dispatch(updateCartPrice(product));
  };

  useEffect(() => {
    if (!CartHelper.isEmpty(returnData)) {
      var isChanged = CartHelper.isReturingCartChanged();
      if (
        isChanged &&
        !CartHelper.isEmpty(returnData.rules) &&
        !returnData.startRule
      ) {
        dispatch(startRuleCalculation(true));
        //console.log("start  Rule Calculation"); 
      }
    }

    // console.log("isTaxChangeable", Number(Helper.isTaxChangeable()));
    if (Number(Helper.isTaxChangeable()) === 1) {
      // if (    true  ) {


      const min_tax_changeable_amt = Helper.taxLimitValue();
      const min_tax_changeable_percent = Helper.taxLimitPercentage();

      // console.log("min_tax_changeable_amt",min_tax_changeable_amt);
      // console.log("min_tax_changeable_percent",min_tax_changeable_percent);

      if (min_tax_changeable_amt && min_tax_changeable_percent) {
        cartProduct.forEach((product) => {

          const rulesAppliedData = CartHelper.getRulesAppliedData(product);
          var dicountedPrice = rulesAppliedData.price;

          var detailPrice;

          if (!product.original_tax) {
            detailPrice = { original_tax: product.tax };
            //console.log("original_tax_set for first time",product.tax);
          } else {
            detailPrice = {};
          }
          // console.log("original_tax",product.original_tax);

          if (dicountedPrice < min_tax_changeable_amt) {

            const tax = min_tax_changeable_percent;
            const newPrice = product.finalprice;
            const discount_type = product.item_dis_type;
            const discount_amount = product.item_discount_amount;
            detailPrice = {
              ...detailPrice,
              ...CartHelper.changeTaxForNewPrice(
              tax,
              newPrice,
              discount_type,
              discount_amount,
              product
            ),
            };
            detailPrice.id = product.id;
          } else {

            const tax = product.original_tax || product.tax;
            const newPrice = product.finalprice;
            const discount_type = product.item_dis_type;
            const discount_amount = product.item_discount_amount;
            detailPrice = {
              ...detailPrice,
              ...CartHelper.changeTaxForNewPrice(
              tax,
              newPrice,
              discount_type,
              discount_amount,
              product
            ),
            };
            detailPrice.id = product.id;
          }

          //  console.log("detailPrice",detailPrice);

          for (var k = 0; k < cartProduct.length; k++) {
            if (detailPrice.id === cartProduct[k].id) {

              if (detailPrice.tax === cartProduct[k].tax && detailPrice.original_tax === undefined) {
                // console.log("product no tax change ", detailPrice.id);     
              } else {
                // console.log("product tax change ", detailPrice.id); 
                const priceUpdatedProduct = { ...product, ...detailPrice };
                handleUpdatePrice(priceUpdatedProduct);
              }

            }
          }

        });



      }

    }
  }, [cartProduct, dispatch, returnData]);

  return (
      <>
        <>
          {!CartHelper.isEmpty(returnData) && returnData.success ? (
            <Typography
              variant="subtitle1"
              component="span"
              className={"exchanging-label"}
            >
              Exchanging Invoice #{returnData.invoice}
            </Typography>
          ) : null}
          {!CartHelper.isEmpty(editData) && editData.success ? (
            <Typography
              variant="subtitle1"
              component="span"
              className={"exchanging-label"}
            >
              Editing Invoice #{editData.invoice}
            </Typography>
          ) : null}
        </>

        {cartProduct.map((product, index) => (
          <Card elevation={0} className={classes.Chooseitem} key={index}>
            <Grid container direction="row">
              <Grid item lg={2} md={2} sm={2} xs={2}>
                {product.item_image ? (
                  <CardMedia
                    className={classes.chooseimg}
                    image={product.item_image}
                  />
                ) : (
                  <CardMedia
                    className={classes.chooseimg}
                    image={`${process.env.PUBLIC_URL}/assets/images/shop-placeholder.png`}
                  />
                )}
              </Grid>
              <Grid item lg={10} md={10} sm={10} xs={10} pl={1}>
                <Grid container direction="row">
                  <Grid item xs={11}>
                    {product.item_dis_type === "PERCENT" ? (
                      <Box pl={2}>
                        <Alert severity="info">
                          {" "}
                          {"Add. Discount Applied of "}
                          {product.item_discount_amount}
                          {"%"}{" "}
                        </Alert>
                      </Box>
                    ) : (
                      <></>
                    )}

                    {product.item_dis_type === "FLAT" ? (
                      <Box pl={2}>
                        <Alert severity="info">
                          {" "}
                          {"Add. Discount Applied of "}
                          {CartHelper.getCurrencyFormatted(product.item_discount_amount.toFixed(2))}

                        </Alert>
                      </Box>
                    ) : (
                      <></>
                    )}

                    <Box pl={2}>
                      <Typography
                        variant="subtitle2"
                        component="strong"
                        className={classes.productname}
                      >
                        {product.name}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={1}>
                    <Button
                      className={classes.removeItem}
                      onClick={() => handleRemoveItem(index, product)}
                    >
                      <DeleteIcon />
                    </Button>
                  </Grid>
                </Grid>
                <Grid container direction="row">
                  <Grid
                    item
                    lg={8}
                    md={8}
                    sm={8}
                    xs={9}
                    container
                    alignItems="center"
                  >
                    <Box pl={2} display={'inline-flex'} justifyContent={'space-between'} alignItems={'center'} >

                      {/* <input
                        type="button"
                        value={"-"}
                        className={classes.buttonminus}
                        data-field="quantity"
                        onClick={() => handleUpdateQty(product, "minus")}
                      /> */}


                      <IconButton size="small" onClick={() => handleUpdateQty(product, "minus")}>

                        <Icon style={{ color: red[400], cursor: 'pointer' }}>remove_circle</Icon>
                      </IconButton>


                      <input
                        type="number"
                        value={Number(product.qty)}
                        name="quantity"
                        className={classes.qtybox}
                        onChange={(e) => handleQty(product, e)}
                        step="any"
                      />

                      <IconButton size="small" onClick={() => handleUpdateQty(product, "plus")} style={{ margin: '0' }} >
                        <Icon style={{ color: green[400], cursor: 'pointer' }}>add_circle</Icon>
                      </IconButton>

                      {/* <input
                        type="button"
                        value={"+"}
                        className={classes.buttonplus}
                        data-field="quantity"
                        onClick={() => handleUpdateQty(product, "plus")}
                      /> */}
                    </Box>

                    {/* {StoreHelper.isStockValidationCheckEnabled() &&
                      CartHelper.isNewSale() &&
                      CartHelper.getQTHFromStock(product) !== "0.00" ? (
                      <Box pl={2}>
                        {CartHelper.getQTHFromStock(product) > 0 ? (
                          <Typography
                            variant="caption"
                            component="span"
                            color="secondary"
                          >
                            QTH:{CartHelper.getQTHFromStock(product)}
                          </Typography>
                        ) : (
                          <Typography variant="caption" component="span">
                            QTH:{CartHelper.getQTHFromStock(product)}
                          </Typography>
                        )}
                      </Box>
                    ) : null} */}

                  </Grid>
                  <Grid item lg={4} md={4} sm={4} xs={3}>
                    <Chip style={{ backgroundColor: red[300], color: 'white', borderRadius: '8px' }} size="small" label={"Tax " + Math.round(product.tax) + "%"} />
                    {/* <Box>
                      <Typography
                        variant="subtitle1"
                        component="span"
                        className={classes.nametax}
                      >
                        Tax
                      </Typography>
                      <Typography
                        variant="subtitle1"
                        component="span"
                        className={classes.taxbox}
                      >
                        {Math.round(product.tax) + "%"}
                      </Typography>
                    </Box> */}
                  </Grid>
                </Grid>

                {/* <Price product={product} /> */}
                <EditablePrice
                  product={product}
                  updatePrice={handleUpdatePrice}
                />



                {/* <ItemDiscount product={product} /> */}
              </Grid>
            </Grid>
          </Card>
        ))}
      </>
    );
}

ChooseProduct.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default withStyles(Styles)(ChooseProduct);
