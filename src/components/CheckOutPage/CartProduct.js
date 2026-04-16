import React, { useEffect, useState } from "react";
import {
    Card,
    Typography,
    Box,
    Button,
    IconButton,
    Chip,
    CardContent,
    Snackbar,
    Tooltip,
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
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import EditablePrice from "../CheckOutPage/CartItems/EditablePrice";
import CartHelper from "../../Helper/cartHelper";
import { clearAppliedDiscount } from "../../redux/action/discountAction";
import { clear_customer_data } from "../../redux/action/customerAction";
import { startRuleCalculation } from "../../redux/action/returnAction";
import { Alert } from "@material-ui/lab";
import Helper from "../../Helper/storeHelper";
import IndeterminateCheckBoxIcon from "@material-ui/icons/IndeterminateCheckBox";
import AddBoxIcon from "@material-ui/icons/AddBox";
import SyncIcon from "@material-ui/icons/Sync";
import { Close } from "@material-ui/icons";
import { getWeightScaleValue } from "../../services/api/api-services";

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
        borderRadius: "4px",
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
        color: "#121212",
        fontWeight: 500,
        fontSize: "12px",
        [theme.breakpoints.up("ls")]: {
            fontSize: "14px",
        },
        [theme.breakpoints.up("lg")]: {
            fontSize: "14px",
        },
    },
    removeItem: {
        padding: "0",
        width: 30,
        minWidth: "auto",
        float: "right",
        borderRadius: "50%",
        height: 30,
        color: "gray",
        "&:hover": {
            color: "#EE4B2B",
        },
    },
    productCard: {
        display: "flex",
        maxHeight: "140px",
        marginTop: "2px",
        border: "1px solid #f2f2f2",
        [theme.breakpoints.up("ls")]: {
            maxHeight: "140px",
        },
        [theme.breakpoints.up("lg")]: {
            maxHeight: "120px",
        },
    },
    details: {
        display: "flex",
        flexDirection: "column",
        width: "100%",
    },
    content: {
        width: "full",
        position: "relative",
        padding: "4px",
        display: "inline-flex",
        justifyContent: "space-between",
    },
    cover: {
        width: 40,
        padding: "10px",
        objectFit: "contain",
    },
    controls: {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "space-between",
        paddingLeft: theme.spacing(1),
        paddingBottom: theme.spacing(1),
    },
    playIcon: {
        height: 38,
        width: 38,
    },
});

const CartProduct = ({ classes }) => {
    const dispatch = useDispatch();
    const cartProduct = useSelector((state) => state.cartProduct);
    const returnData = useSelector((state) => state.returnData);
    const editData = useSelector((state) => state.editData);
    const exchange = useSelector((state) => state.exchange);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [readWeight] = useState(false);

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

    const handleOpenSnackbar = () => {
        setOpenSnackbar(true);
    };

    const handleCloseSnackbar = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }
        setOpenSnackbar(false);
    };

    const updateProductQty = (product, event) => {
        if (event === "plus") {
            dispatch(updateQty(product));
        } else {
            dispatch(decreaseQty(product));
        }
        if (!product?.isCreditNote && !product?.isExchange) {
            clearDiscCust();
        }
    };

    const handleQty = (product, value) => {
        const nextQty =
            value <= 0 ? 0 : product.accept_weight ? value : Math.round(value);
        const nextProduct = { ...product, qty: nextQty };

        if (value <= 0) {
            handleOpenSnackbar();
        }

        dispatch(changeQty(nextProduct));
        if (!product?.isCreditNote && !product?.isExchange) {
            clearDiscCust();
        }
    };

    const captureWeight = (product) => {
        getWeightScaleValue()
            .then((resp) => resp.json())
            .then((resp) => {
                handleQty(product, resp.value);
                if (readWeight) {
                    captureWeight(product);
                }
            })
            .catch((error) => {
                console.error("erroe ::", error);
            });
    };

    const removeItem = (index, product) => {
        dispatch(removeCartItem(index, product));
        if (!product?.isCreditNote && !product?.isExchange) {
            clearDiscCust();
        }
    };

    const updatePrice = (product) => {
        dispatch(updateCartPrice(product));
    };

    useEffect(() => {
        if (!CartHelper.isEmpty(returnData)) {
            const isChanged = CartHelper.isReturingCartChanged();
            if (
                isChanged &&
                !CartHelper.isEmpty(returnData.rules) &&
                !returnData.startRule
            ) {
                dispatch(startRuleCalculation(true));
            }
        }

        if (Number(Helper.isTaxChangeable()) !== 1) {
            return;
        }

        const minTaxAmount = Helper.taxLimitValue();
        const minTaxPercent = Helper.taxLimitPercentage();
        const maxTaxAmount = Helper.maxTaxLimitValue();
        const maxTaxPercent = Helper.maxTaxLimitPercentage();

        if (
            !(minTaxAmount && minTaxPercent) &&
            !(maxTaxAmount && maxTaxPercent)
        ) {
            return;
        }

        cartProduct.forEach((product) => {
            const rulesAppliedData = CartHelper.getRulesAppliedData(product);
            const discountedPrice = rulesAppliedData.price;
            const originalTax = product.original_tax || product.tax;
            let detailPrice;

            if (minTaxAmount) {
                const tax =
                    discountedPrice < minTaxAmount ? minTaxPercent : originalTax;
                detailPrice = CartHelper.changeTaxForNewPrice(
                    tax,
                    product.finalprice,
                    product.item_dis_type,
                    product.item_discount_amount,
                    { ...product, original_tax: originalTax }
                );
            } else if (maxTaxAmount) {
                const tax =
                    discountedPrice >= maxTaxAmount ? maxTaxPercent : originalTax;
                detailPrice = CartHelper.changeTaxForNewPrice(
                    tax,
                    product.finalprice,
                    product.item_dis_type,
                    product.item_discount_amount,
                    { ...product, original_tax: originalTax }
                );
            }

            if (!detailPrice) {
                return;
            }
            detailPrice.id = product.id;

            const matchedProduct = cartProduct.find(
                (item) => detailPrice.id === item.id
            );
            if (matchedProduct && detailPrice.tax !== matchedProduct.tax) {
                updatePrice({
                    ...product,
                    original_tax: originalTax,
                    ...detailPrice,
                    id: product.id,
                });
            }
        });
    }, [cartProduct, dispatch, returnData]);

    let freeProduct = null;
    for (const cartItem of cartProduct || []) {
        if (Array.isArray(cartItem.rules)) {
            for (const rule of cartItem.rules) {
                const totalCartVal = CartHelper.getTotalAmount();
                if (
                    rule.free_item === 1 &&
                    Number(totalCartVal) > Number(rule.amt_spend)
                ) {
                    freeProduct = rule.free_product;
                    break;
                }
            }
        }
        if (freeProduct !== null) {
            break;
        }
    }

    return (
        <>
            <>
                {!CartHelper.isEmpty(returnData) && returnData.success ? (
                    <Typography
                        variant="subtitle1"
                        component="span"
                        className={"exchanging-label"}>
                        Returning Invoice #{returnData.invoice}
                    </Typography>
                ) : null}
                {!CartHelper.isEmpty(editData) && editData.success ? (
                    <Typography
                        variant="subtitle1"
                        component="span"
                        className={"exchanging-label"}>
                        Editing Invoice #{editData.invoice}
                    </Typography>
                ) : null}
                {!CartHelper.isEmpty(exchange?.data) && exchange?.data?.success ? (
                    <Typography
                        variant="subtitle1"
                        component="span"
                        className={"exchanging-label"}>
                        Exchanging Invoice #{exchange?.data?.invoice_no}
                    </Typography>
                ) : null}
            </>

            {cartProduct.map((product, index) => (
                <Card
                    elevation={0}
                    className={classes.productCard}
                    key={"cart-product" + index}>
                    <Box
                        className={classes.cover}
                        style={{
                            objectFit: "contain",
                            width: "25%",
                            justifyContent: "center",
                            alignItems: "center",
                        }}>
                        <img
                            alt=""
                            style={{
                                maxHeight: "90px",
                                maxWidth: "65px",
                                borderRadius: "4px",
                            }}
                            src={
                                product.item_image
                                    ? product.item_image
                                    : `${process.env.PUBLIC_URL}/assets/images/shop-placeholder.png`
                            }
                        />
                    </Box>

                    <div className={classes.details}>
                        <CardContent className={classes.content}>
                            <Box style={{ width: "100%" }}>
                                <Typography
                                    component="strong"
                                    className={classes.productname}>
                                    {product.name}
                                </Typography>
                                {Boolean(product?.isExchange) && (
                                    <Chip
                                        label="Exchanging"
                                        style={{
                                            backgroundColor: "#AAAA00",
                                            color: "white",
                                            borderRadius: "8px",
                                        }}
                                        size="small"
                                    />
                                )}
                                {Number(product?.id) === Number(freeProduct) && (
                                    <Chip
                                        label="FREE"
                                        style={{
                                            backgroundColor: "#f53b3b",
                                            color: "white",
                                            borderRadius: "8px",
                                        }}
                                        size="small"
                                    />
                                )}

                                <EditablePrice
                                    product={product}
                                    updatePrice={updatePrice}
                                />
                            </Box>
                            <Box display={"inline-flex"} justifyContent={"space-between"}>
                                <Button
                                    className={classes.removeItem}
                                    onClick={() => removeItem(index, product)}>
                                    <DeleteIcon />
                                </Button>
                            </Box>
                        </CardContent>
                        <div className={classes.controls}>
                            <Chip
                                style={{
                                    backgroundColor: "#f2f2f2",
                                    color: "black",
                                    borderRadius: "8px",
                                }}
                                size="small"
                                label={"Tax " + Math.round(product.tax) + "%"}
                            />

                            <Box
                                display={"inline-flex"}
                                justifyContent={"space-between"}
                                alignItems={"center"}>
                                {!Boolean(Number(product?.accept_weight)) && (
                                    <IconButton
                                        size="small"
                                        onClick={() => updateProductQty(product, "minus")}>
                                        <IndeterminateCheckBoxIcon
                                            color="secondary"
                                            style={{ cursor: "pointer", fontSize: "28px" }}
                                        />
                                    </IconButton>
                                )}
                                <input
                                    type="number"
                                    value={Number(product.qty)}
                                    name="quantity"
                                    onFocusCapture={() => {
                                        return;
                                    }}
                                    onBlurCapture={() => {
                                        return;
                                    }}
                                    className={classes.qtybox}
                                    onChange={(e) => handleQty(product, e.target.value)}
                                    step="any"
                                />

                                {!Boolean(Number(product?.accept_weight)) ? (
                                    <IconButton
                                        size="small"
                                        onClick={() => updateProductQty(product, "plus")}
                                        style={{ margin: "0" }}>
                                        <AddBoxIcon
                                            color="secondary"
                                            style={{ cursor: "pointer", fontSize: "28px" }}
                                        />
                                    </IconButton>
                                ) : (
                                    <Tooltip
                                        title="Get weight from scale"
                                        aria-label="Get weight from scal">
                                        <IconButton
                                            size="small"
                                            onClick={() => {
                                                captureWeight(product);
                                            }}
                                            style={{ margin: "0" }}>
                                            <SyncIcon
                                                color="secondary"
                                                style={{ cursor: "pointer", fontSize: "22px" }}
                                            />
                                        </IconButton>
                                    </Tooltip>
                                )}
                            </Box>
                        </div>
                    </div>
                </Card>
            ))}

            <Snackbar
                anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                }}
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}>
                <Alert
                    action={
                        <React.Fragment>
                            <IconButton
                                size="small"
                                aria-label="close"
                                color="inherit"
                                onClick={handleCloseSnackbar}>
                                <Close fontSize="small" />
                            </IconButton>
                        </React.Fragment>
                    }
                    severity="warning">
                    Qty cannot be 0!
                </Alert>
            </Snackbar>
        </>
    );
};

CartProduct.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(Styles)(CartProduct);
