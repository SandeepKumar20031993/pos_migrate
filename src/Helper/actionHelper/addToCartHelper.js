import store from "../../store";
import CartHelper from "../cartHelper";
import {
    AddToCart,
    updateQty,
    clearCart,
    AddToCartWithQty,
    updateProductWithQty,
    clearCustomer,
    clearBilling,
} from "../../redux/action/cartAction";
import {
    openPricePopup,
    saveMultiPriceProduct,
    openQtyPopup,
    saveQtyProduct,
} from "../../redux/action/productConfigAction";
import { clearReturningProducts } from "../../redux/action/returnAction";
import { clearEditProducts } from "../../redux/action/editAction";
import { clear_customer_data, clearMembershipID } from "../../redux/action/customerAction";
import { clearAppliedDiscount } from "../../redux/action/discountAction";
import { clearExchangeData } from "../../redux/action/exchangeActions";

const helpers = {
    validatePrice: function (product) {
        if (product.prices && product.prices.length === 1) {
            var price = product.prices[0];
            let memberShipId = store.getState().customerData.membershipId;
            console.log("Membership ID" + memberShipId);
            if ((typeof memberShipId !== "undefined") && memberShipId) {
                console.log(product.group_prices);
                if (typeof product.group_prices !== "undefined") {
                    var updatedProduct = CartHelper.getCustomerGroupProductPrice(product, price, memberShipId);
                } else
                    var updatedProduct = CartHelper.getProductUpdatedPrice(product, price);
            } else {
                var updatedProduct = CartHelper.getProductUpdatedPrice(product, price);
            }
            this.validateQty(updatedProduct);
        } else if (product.prices && product.prices.length > 1) {
            store.dispatch(saveMultiPriceProduct(product));
            store.dispatch(openPricePopup(true));
        } else {
            this.validateQty(product);
        }
    },
    validateQty: function (product) {
        var isLooseProduct = this.isLooseProduct(product);
        if (isLooseProduct) {
            store.dispatch(saveQtyProduct(product));
            store.dispatch(openQtyPopup(true));
        } else {
            this.addThisProductToCart(product);
        }
    },
    addThisProductToCart: function (cartprod) {
        const product = CartHelper.getProductWithRules(cartprod);
        var cartProducts = store.getState().cartProduct;
        console.log("cartpro", product);
        let cartProduct = cartProducts?.find(
            (prod) => prod.barcode === product.barcode && prod.price === product.price
        );

        if (cartProduct) {
            if (product?.add_qty) store.dispatch(updateProductWithQty(product));
            else store.dispatch(updateQty(product));
        } else {
            if (product?.add_qty)
                store.dispatch(AddToCartWithQty(product));
            else
                store.dispatch(AddToCart(product));
        }

        // ** olg
        // if (cartProduct) {
        //     if (Number(product?.accept_weight)) store.dispatch(updateProductWithQty(product));
        //     else store.dispatch(updateQty(product));
        // } else {
        //     if (Number(product?.accept_weight) && product?.add_qty)
        //         store.dispatch(AddToCartWithQty(product));
        //     else
        //         store.dispatch(AddToCart(product));
        // }

        // old --

        // if (cartProducts.length !== 0) {
        //     let isExist = 0;
        //     cartProducts.forEach(prod => {
        //         console.log("forEach", prod);
        //         if (prod.barcode === product.barcode && prod.price === product.price) {
        //             if (product?.accept_weight) {
        //                 store.dispatch(updateProductWithQty(product));
        //             }
        //             else {

        //                 store.dispatch(updateQty(product));
        //             }

        //             isExist = 1;
        //         }
        //     })
        //     if (!isExist) {

        //         if (product?.accept_weight && product?.qty) {
        //             store.dispatch(AddToCartWithQty(product));

        //         } else {

        //             store.dispatch(AddToCart(product));
        //         }

        //     }
        // } else {
        //     if (product?.accept_weight && product?.qty) {
        //         store.dispatch(AddToCartWithQty(product));

        //     } else {

        //         store.dispatch(AddToCart(product));
        //     }
        // }
    },
    addToCartProductWithQty: function (cartprod) {
        const product = CartHelper.getProductWithRules(cartprod);
        var cartProducts = store.getState().cartProduct;
        if (cartProducts.length !== 0) {
            let isExist = 0;
            cartProducts.forEach((prod) => {
                if (prod.barcode === product.barcode && prod.price === product.price) {
                    store.dispatch(updateProductWithQty(product));
                    isExist = 1;
                }
            });
            if (!isExist) {
                store.dispatch(AddToCartWithQty(product));
            }
        } else {
            store.dispatch(AddToCartWithQty(product));
        }
    },
    clearCart: function () {
        store.dispatch(clearCart());
    },
    isLooseProduct: function (product) {
        var isLooseProduct = false;
        if (product && product.attributes && product.attributes.length > 0) {
            product.attributes.forEach((attr) => {
                if (attr && attr.attribute_code && attr.attribute_value) {
                    if (
                        attr.attribute_code === "product_type" &&
                        attr.attribute_value.toLowerCase() === "loose"
                    ) {
                        isLooseProduct = true;
                    }
                }
            });
        }
        return isLooseProduct;
    },
    cartHasProducts: function () {
        var cartProducts = store.getState().cartProduct;
        return (cartProducts.length) ? true : false;
    },
    startNewSale: function () {
        store.dispatch(clearCart());
        store.dispatch(clearCustomer());
        store.dispatch(clear_customer_data());
        store.dispatch(clearMembershipID());
        store.dispatch(clearAppliedDiscount());
        store.dispatch(clearReturningProducts());
        store.dispatch(clearExchangeData());

        store.dispatch(clearEditProducts());
        store.dispatch(clearBilling());
    },
};
export default helpers;
