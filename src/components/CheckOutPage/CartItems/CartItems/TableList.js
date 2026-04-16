import React from "react";
import { Grid, Typography, Box, IconButton } from "@material-ui/core";
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

function TableList() {
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

    const displayDiscount = (product) => {
        const rulesAppliedData = CartHelper.getRulesAppliedData(product);
        return rulesAppliedData.discount_label;
    };

    const displayRowTotal = (product) => {
        const rulesAppliedData = CartHelper.getRulesAppliedData(product);
        const qty = Number(product.qty);
        let price = Number(rulesAppliedData.price);

        if (CartHelper.isGiftVoucherApplicable()) {
            price = Number(product.finalprice);
        }

        const total = price * qty;
        return total.toFixed(2);
    };

    return (
        <>
            {cartProduct && cartProduct.length > 0 ? (
                <Box className="background-white" p={1}>
                    <table className="cart-table width-100" border="1">
                        <thead>
                            <tr>
                                <th className="cart-td description">Description</th>
                                <th className="cart-td price">Price</th>
                                <th className="cart-td qty">Qty</th>
                                <th className="cart-td discount">Discount</th>
                                <th className="cart-td tax">Tax</th>
                                <th className="cart-td row-total">Row Total</th>
                                <th className="cart-td action"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {cartProduct.map((product, index) => (
                                <tr key={index}>
                                    <td className="cart-td description">
                                        <Typography
                                            variant="subtitle2"
                                            component="strong"
                                            className={"productname"}>
                                            {product.name}
                                        </Typography>
                                        <Typography
                                            variant="caption"
                                            component="p"
                                            className={"productname"}>
                                            {product.barcode}
                                        </Typography>
                                    </td>
                                    <td className="cart-td price">
                                        <EditablePrice
                                            product={product}
                                            updatePrice={handleUpdatePrice}
                                            disableDiscountPercent={true}
                                        />
                                    </td>

                                    <td className="cart-td qty">
                                        <Grid container alignItems="center">
                                            <Grid item>
                                                <Box pl={2}>
                                                    <input
                                                        type="button"
                                                        value={"-"}
                                                        className={"buttonminus"}
                                                        data-field="quantity"
                                                        onClick={() =>
                                                            handleUpdateQty(product, "minus")
                                                        }
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
                                                        onClick={() =>
                                                            handleUpdateQty(product, "plus")
                                                        }
                                                    />
                                                </Box>
                                            </Grid>
                                            {StoreHelper.isStockValidationCheckEnabled() &&
                                                CartHelper.isNewSale() &&
                                                CartHelper.getQTHFromStock(product) !== "0.00" ? (
                                                <Grid item>
                                                    <Box pl={2}>
                                                            {CartHelper.getQTHFromStock(product) > 0 ? (
                                                                <Typography
                                                                    variant="caption"
                                                                    component="span"
                                                                    color="secondary">
                                                                    QTH:{CartHelper.getQTHFromStock(product)}
                                                                </Typography>
                                                            ) : (
                                                                <Typography
                                                                    variant="caption"
                                                                    component="span">
                                                                    QTH:{CartHelper.getQTHFromStock(product)}
                                                                </Typography>
                                                            )}
                                                        </Box>
                                                    </Grid>
                                            ) : null}
                                        </Grid>
                                    </td>
                                    <td className="cart-td discount">
                                        {displayDiscount(product)}
                                    </td>
                                    <td className="cart-td tax">{product.tax}</td>
                                    <td className="cart-td row-total">
                                        <Typography
                                            variant="subtitle1"
                                            component="span"
                                            className="bold-i">
                                            {displayRowTotal(product)}
                                        </Typography>
                                    </td>
                                    <td className="cart-td action">
                                        <IconButton
                                            className={"removeItem"}
                                            onClick={() => handleRemoveItem(index, product)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Box>
            ) : (
                <Box className="background-white align-center" p={1}>
                    <Typography variant="body2" component="span">
                        Cart empty.
                    </Typography>
                </Box>
            )}
        </>
    );
}

export default TableList;
