import React, { useEffect, useRef, useState } from "react";
import { withRouter } from "react-router-dom";

import {
    Avatar,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    IconButton,
    Typography,
} from "@material-ui/core";

import CloseIcon from "@material-ui/icons/Close";
import { connect } from "react-redux";
import {
    clearExchangeData,
    setExchangeData,
    setExchangeIsActive,
} from "../../../redux/action/exchangeActions";
import { clearReturningProducts, loadReturningProducts } from "../../../redux/action/returnAction";
import { alert, loading } from "../../../redux/action/InterAction";
import { clearCart, restoreCartProduct } from "../../../redux/action/cartAction";

import AddDiscHelper from '../../../Helper/actionHelper/addDiscHelper';


const ExchangePopup = (props) => {
    const [invoice, setInvoice] = useState("");
    const textInput = useRef(null);

    useEffect(() => {
        props.clearExchangeData();
        props.clearCart();
        props.clearReturningProducts();
        textInput.current?.focus();
    }, []);

    const handleClosePopup = () => {
        props.setExchangeIsActive(false)
    };


    const submitInvoice = event => {
        event.preventDefault();
        var form = {
            orderno: invoice
        }
        props.loading(true);
        props.loadReturningProducts(form)
            .then(res => res.json())
            .then(res => {
                if (res.success) {
                    res.startRule = false
                    handleExchangeProducts(res)

                } else {
                    props.loading(false);
                    props.alert(true, res.message);
                    props.clearExchangeData();
                    handleClosePopup();
                }
            }).catch(err => {
                console.error("erro while loading order", err);
                props.loading(false);
                props.clearExchangeData();
                handleClosePopup();
            })

    };

    const handleExchangeProducts = (data) => {
        // Transform products before storing in Redux state to avoid mutations
        const transformedData = {
            ...data,
            data: data.data.map(product => ({
                ...product,
                isExchange: true,
                item_status: "EXCHANGED",
                item_calc_tax: -product.item_calc_tax
            }))
        };

        props.setExchangeData(transformedData);

        transformedData.data.forEach(product => {
            props.restoreCartProduct(product);
        })
        // Pass isExchange=true to skip invoice-level discount and only apply item-level discounts
        AddDiscHelper.restoreAddDiscount(transformedData, transformedData?.invoice_no, true);

        props.loading(false);
    };

    return (
            <Dialog
            open={props.exchange.isActive}
                // scroll={"body"}
                className={"dialog"}
            onClose={handleClosePopup}
                aria-labelledby="simple-dialog-title"
            >
                <DialogTitle disableTypography style={{ display: 'inline-flex', justifyContent: 'space-between', alignItems: 'center' }} >
                    <Typography variant="h5" className="bold-i">Exchange Invoice</Typography>

                <IconButton aria-label="close" onClick={handleClosePopup}>
                        <CloseIcon />
                    </IconButton>

            </DialogTitle>
                <DialogContent className={"display-in-center"}>
                    <Grid
                        container
                        direction="row"
                        justify={"center"}
                        alignItems="center"
                        spacing={2}>

                        <Grid item xs={12} className={"align-center"}>
                            <Typography variant="h6">
                                Enter or Scan invoice number{" "}
                            </Typography>
                        </Grid>

                        <Grid item xs={12} className={"align-center"}>
                            <Box>
                                <form
                                onSubmit={submitInvoice}
                                    className="display-flex justify-center">
                                    <input
                                        type="text"
                                        name={"orderid"}
                                        className={"input orderid"}
                                        placeholder={"Invoice number"}
                                        value={invoice}
                                    onChange={(event) => { setInvoice(event.currentTarget.value) }}
                                    ref={textInput}
                                    />
                                    <Button variant="contained" color="secondary" type="submit">
                                        Load
                                    </Button>
                                </form>
                            </Box>
                        </Grid>

                        {/* {StoreHelper.isBarcodeReturn() === 1 ?
                            <Box pb={3}>
                                <Switch value={this.state.checked} onChange={this.switchbarcode} />
                                <span>Return by barcode scan</span>
                            </Box>
                            : null} */}
                    </Grid>
                </DialogContent>
            </Dialog>
    );
}

const mapStateToProps = (state) => ({
    exchange: state.exchange,
    cartProduct: state.cartProduct,
});

const mapActionsToProps = {
    alert,
    loading,
    clearCart,
    setExchangeData,
    clearExchangeData,
    setExchangeIsActive,
    loadReturningProducts,
    restoreCartProduct,
    clearReturningProducts,
};
export default connect(
    mapStateToProps,
    mapActionsToProps
)(withRouter(ExchangePopup));
