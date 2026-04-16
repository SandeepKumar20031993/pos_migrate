import React from "react";
import { Card, CardMedia, Grid, Typography, Box, Button } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import { useDispatch, useSelector } from "react-redux";
import {
    updateQty,
    decreaseQty,
    removeCartItem,
    changeQty,
    updateCartPrice,
} from "../../../../redux/action/cartAction";
import EditablePrice from "../EditablePrice";
import CartHelper from "../../../../Helper/cartHelper";
import StoreHelper from "../../../../Helper/storeHelper";
import { clearAppliedDiscount } from "../../../../redux/action/discountAction";
import { clear_customer_data } from "../../../../redux/action/customerAction";

function GridList() {
    const dispatch = useDispatch();
    const cartProduct = useSelector((state) => state.cartProduct);

    const handleUpdateQty = (product, event) => {
        if (event === "plus") {
            dispatch(updateQty(product));
        } else {
            dispatch(decreaseQty(product));
        }

        dispatch(clearAppliedDiscount());
        dispatch(clear_customer_data());
    };

    const handleRemoveItem = (index, product) => {
        dispatch(removeCartItem(index, product));
        dispatch(clearAppliedDiscount());
        dispatch(clear_customer_data());
    };

    const handleQty = (product, event) => {
        const nextProduct = { ...product, qty: event.target.value };
        dispatch(changeQty(nextProduct));
        dispatch(clearAppliedDiscount());
        dispatch(clear_customer_data());
    };

    const handleUpdatePrice = (product) => {
        dispatch(updateCartPrice(product));
    };

    return (
        <>
            {cartProduct.map((product, index) => (
                <Card className={"chooseitem"} key={index}>
                    <Grid container direction="row">
                        <Grid item>
                            {product.item_image ? (
                                <CardMedia
                                    className={"chooseimg"}
                                    image={product.item_image}
                                />
                            ) : (
                                <CardMedia
                                    className={"chooseimg"}
                                    image={`${process.env.PUBLIC_URL}/assets/images/shop-placeholder.png`}
                                />
                            )}
                        </Grid>
                        <Grid item xs>
                            <Grid container direction="row">
                                <Grid item xs>
                                    <Box pl={2}>
                                        <Typography
                                            variant="subtitle2"
                                            component="strong"
                                            className={"productname"}>
                                            {product.name}
                                        </Typography>
                                    </Box>
                                </Grid>

                                <Grid item>
                                    <Button
                                        className={"removeItem"}
                                        onClick={() => handleRemoveItem(index, product)}>
                                        <DeleteIcon />
                                    </Button>
                                </Grid>
                            </Grid>
                            <Grid container direction="row">
                                <Grid item lg={8} md={8} sm={8} xs={9} container alignItems="center">
                                    <Box pl={2}>
                                        <input
                                            type="button"
                                            value={"-"}
                                            className={"buttonminus"}
                                            data-field="quantity"
                                            onClick={() => handleUpdateQty(product, "minus")}
                                        />
                                        <input
                                            type="number"
                                            value={Number(product.qty)}
                                            name="quantity"
                                            className={"qtybox"}
                                            onChange={(e) => handleQty(product, e)}
                                            step="any"
                                        />
                                        <input
                                            type="button"
                                            value={"+"}
                                            className={"buttonplus"}
                                            data-field="quantity"
                                            onClick={() => handleUpdateQty(product, "plus")}
                                        />
                                    </Box>
                                    {StoreHelper.isStockValidationCheckEnabled() &&
                                        CartHelper.isNewSale() &&
                                        CartHelper.getQTHFromStock(product) !== "0.00" ? (
                                        <Box pl={2}>
                                                {CartHelper.getQTHFromStock(product) > 0 ? (
                                                    <Typography
                                                        variant="caption"
                                                        component="span"
                                                        color="secondary">
                                                        QTH:{CartHelper.getQTHFromStock(product)}
                                                    </Typography>
                                                ) : (
                                                    <Typography variant="caption" component="span">
                                                        QTH:{CartHelper.getQTHFromStock(product)}
                                                    </Typography>
                                                )}
                                            </Box>
                                    ) : null}
                                </Grid>
                                <Grid item lg={4} md={4} sm={4} xs={3}>
                                    <Box>
                                        <Typography
                                            variant="subtitle1"
                                            component="span"
                                            className={"nametax"}>
                                            Tax
                                        </Typography>
                                        <Typography
                                            variant="subtitle1"
                                            component="span"
                                            className={"taxbox"}>
                                            {Math.round(product.tax) + "%"}
                                        </Typography>
                                    </Box>
                                </Grid>
                            </Grid>
                            <EditablePrice product={product} updatePrice={handleUpdatePrice} />
                        </Grid>
                    </Grid>
                </Card>
            ))}
        </>
    );
}

export default GridList;
