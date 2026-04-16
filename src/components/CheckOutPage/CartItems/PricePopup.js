import React, { useState } from "react";
import {
    Avatar,
    Dialog,
    DialogContent,
    DialogActions,
    Grid,
    FormControl,
    FormLabel,
    RadioGroup,
    FormControlLabel,
    Radio,
} from "@material-ui/core";
import { HighlightOff } from "@material-ui/icons";
import { useDispatch, useSelector } from "react-redux";
import {
    openPricePopup,
    saveSelectedPrice,
    clearMultiPriceData,
} from "../../../redux/action/productConfigAction";
import CartHelper from "../../../Helper/cartHelper";
import AddToCartHelper from "../../../Helper/actionHelper/addToCartHelper";

function PricePopup() {
    const dispatch = useDispatch();
    const productConfig = useSelector((state) => state.productConfig);
    const [selectedRowPrice, setSelectedRowPrice] = useState("");

    const handleChange = (e) => {
        setSelectedRowPrice(e.target.value);
    };

    const closePricePopup = () => {
        dispatch(openPricePopup(false));
    };

    const addThisProductToCart = (updatedProduct) => {
        AddToCartHelper.validateQty(updatedProduct);
        closePricePopup();
        dispatch(clearMultiPriceData());
    };

    const selectedPrice = (price) => {
        dispatch(saveSelectedPrice(price));
        const updatedProduct = CartHelper.getProductUpdatedPrice(
            productConfig.product,
            price
        );
        addThisProductToCart(updatedProduct);
    };

    const onSubmit = (e) => {
        e.preventDefault();

        if (!selectedRowPrice) {
            return;
        }

        const matchedPrice = (productConfig.product?.prices || []).find(
            (price) => String(price.mrp) === String(selectedRowPrice)
        );

        if (matchedPrice) {
            selectedPrice(matchedPrice);
        }
    };

    return (
        <React.Fragment>
            <Dialog
                open={productConfig.pricePopup}
                scroll={"body"}
                className={"dialog"}
                onClose={closePricePopup}>
                <DialogActions>
                    <Avatar onClick={closePricePopup} className={"popup-close-button"}>
                        <HighlightOff />
                    </Avatar>
                </DialogActions>
                <DialogContent>
                    <Grid
                        container
                        direction="row"
                        justify="flex-start"
                        alignItems="flex-start"
                        spacing={0}>
                        <form noValidate autoComplete="off" onSubmit={onSubmit}>
                            <FormControl component="fieldset">
                                <FormLabel component="legend">Select Price</FormLabel>
                                <RadioGroup
                                    aria-label="Prices"
                                    name="prices"
                                    value={selectedRowPrice}
                                    onChange={handleChange}>
                                    {(productConfig.product?.prices || []).map((price, index) => (
                                        <FormControlLabel
                                            key={index}
                                            value={String(price.mrp)}
                                            control={<Radio color="secondary" />}
                                            label={`${CartHelper.getCurrencyFormatted(price.mrp)}  ${
                                                price?.label ? price?.label : ""
                                            }`}
                                        />
                                    ))}
                                </RadioGroup>
                            </FormControl>
                            <button type="submit" className="hidden"></button>
                        </form>
                    </Grid>
                </DialogContent>
            </Dialog>
        </React.Fragment>
    );
}

export default PricePopup;
