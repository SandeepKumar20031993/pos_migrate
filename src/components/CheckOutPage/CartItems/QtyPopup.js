import React, { useState } from "react";
import {
    Avatar,
    Dialog,
    DialogContent,
    DialogActions,
    Grid,
    FormControl,
    TextField,
    Typography,
} from "@material-ui/core";
import { HighlightOff } from "@material-ui/icons";
import { useDispatch, useSelector } from "react-redux";
import AddToCartHelper from "../../../Helper/actionHelper/addToCartHelper";
import {
    openQtyPopup,
    clearQtyData,
} from "../../../redux/action/productConfigAction";

function QtyPopup() {
    const dispatch = useDispatch();
    const productConfig = useSelector((state) => state.productConfig);
    const [qty, setQty] = useState("");

    const handleChange = (e) => {
        setQty(e.target.value);
    };

    const closeQtyPopup = () => {
        dispatch(openQtyPopup(false));
    };

    const addToCartProductWithQty = (product) => {
        AddToCartHelper.addToCartProductWithQty(product);
        closeQtyPopup();
        dispatch(clearQtyData());
    };

    const onSubmit = (e) => {
        e.preventDefault();
        const product = { ...productConfig.qtyProduct };

        if (qty) {
            product.pre_qty = product.qty;
            product.qty = Number(qty);
            addToCartProductWithQty(product);
        }
    };

    return (
        <React.Fragment>
            <Dialog
                open={productConfig.qtyPopup}
                scroll={"body"}
                className={"dialog"}
                onClose={closeQtyPopup}>
                <DialogActions>
                    <Avatar onClick={closeQtyPopup} className={"popup-close-button"}>
                        <HighlightOff />
                    </Avatar>
                </DialogActions>
                <DialogContent>
                    <Grid
                        container
                        direction="row"
                        justify="center"
                        alignItems="center"
                        spacing={2}>
                        <Grid
                            item
                            xs={12}
                            container
                            direction="row"
                            justify="center"
                            alignItems="center">
                            <Typography variant="h6" component="span">
                                {"Please enter quantity."}
                            </Typography>
                        </Grid>
                        <Grid
                            item
                            xs={12}
                            container
                            direction="row"
                            justify="center"
                            alignItems="center">
                            <form autoComplete="off" onSubmit={onSubmit}>
                                <FormControl component="fieldset">
                                    <TextField
                                        id="qty-input"
                                        label="Enter Quantity"
                                        variant="outlined"
                                        value={qty}
                                        onChange={handleChange}
                                        autoFocus
                                    />
                                </FormControl>
                                <button type="submit" className="hidden"></button>
                            </form>
                        </Grid>
                    </Grid>
                </DialogContent>
            </Dialog>
        </React.Fragment>
    );
}

export default QtyPopup;
