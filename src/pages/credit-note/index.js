import React, { useCallback, useEffect, useState } from 'react'
import { Box, Paper, Grid, Button, Typography, TextField } from '@material-ui/core';
import { useDispatch, useSelector } from "react-redux";
import CartHelper from '../../Helper/cartHelper'
import { pageTitle } from '../../redux/action/themeAction';
import { loading, alert } from '../../redux/action/InterAction';
import { clearCart } from '../../redux/action/cartAction';
import { toggleCreditPopup, toggleCreditSuccessPopup, createCreditNote, saveCreditRes, clearCreditData, updatePhoneInCredData } from '../../redux/action/creditAction';
import CreditPopup from './creditPopup';
import CreditSuccessPopup from './creditSuccessPopup';
import { clearAppliedDiscount } from '../../redux/action/discountAction';
import CartProduct from '../../components/CheckOutPage/CartProduct';


function CreditNote() {
    const dispatch = useDispatch();
    const cartProduct = useSelector((state) => state.cartProduct);
    const credit = useSelector((state) => state.credit);
    const [toggleDiscount] = useState(false);
    const [isMobileValid, setIsMobileValid] = useState(false);

    const clearCreditNoteData = useCallback(() => {
        dispatch(clearCart());
        dispatch(clearCreditData());
        dispatch(clearAppliedDiscount());
    }, [dispatch]);

    const validateMobile = useCallback(() => {
        const phone_number = (credit.credData && credit.credData.customer && credit.credData.customer.phone_number) ? credit.credData.customer.phone_number : "";
        if (!isNaN(phone_number) && phone_number.length === 10) {
            setIsMobileValid(true);
        } else {
            setIsMobileValid(false);
        }
    }, [credit]);

    useEffect(() => {
        dispatch(pageTitle('Credit note'));
        clearCreditNoteData();
        dispatch(toggleCreditPopup(true));
        validateMobile();

        return () => {
            clearCreditNoteData();
            dispatch(clearCreditData());
        };
    }, [clearCreditNoteData, dispatch, validateMobile]);

    const handleSendRequest = useCallback(() => {
        const phone_number = (credit.credData && credit.credData.customer && credit.credData.customer.phone_number) ? credit.credData.customer.phone_number : "";
        const formData = {};
        formData.cart = [];

        cartProduct.forEach((product, index) => {
            const discountedData = CartHelper.getRulesAppliedData(product);
            formData.cart[index] = { ...product };
            formData.cart[index].price = Number(discountedData.price).toFixed(2);
            formData.cart[index].finalprice = Number(discountedData.price).toFixed(2);
            formData.cart[index].discount = Number(discountedData.percentage_off_discount).toFixed(4);
        });

        formData.sale_id = credit.credData.sale_id;
        formData.refinvno = credit.invoice;
        formData.customer_id = credit.credData.customer.person_id;
        formData.phone = phone_number;
        dispatch(loading(true));
        dispatch(createCreditNote(formData))
            .then(res => res.json())
            .then(res => {
                if (res.success) {
                    dispatch(saveCreditRes(res));
                    dispatch(loading(false));
                    dispatch(toggleCreditSuccessPopup(true));
                } else {
                    dispatch(loading(false));
                    dispatch(alert(true, res.msg));
                }
            }, () => {
                dispatch(loading(false));
            });
    }, [cartProduct, credit, dispatch]);

    const handleSubmit = useCallback((e) => {
        e.preventDefault();
        const phone_number = (credit.credData && credit.credData.customer && credit.credData.customer.phone_number) ? credit.credData.customer.phone_number : "";
        if (!isNaN(phone_number) && phone_number.length === 10) {
            handleSendRequest();
        }
    }, [credit, handleSendRequest]);

    const togglePopup = useCallback(() => {
        dispatch(toggleCreditPopup(!credit.popup));
        validateMobile();
    }, [credit.popup, dispatch, validateMobile]);

    const toggleSuccessPopup = useCallback(() => {
        dispatch(toggleCreditSuccessPopup(!credit.success));
        clearCreditNoteData();
    }, [clearCreditNoteData, credit.success, dispatch]);

    const changePhone = useCallback((e) => {
        const phone_number = e.target.value;
        dispatch(updatePhoneInCredData(e.target.value));
        if (!isNaN(phone_number) && phone_number.length === 10) {
            setIsMobileValid(true);
        } else {
            setIsMobileValid(false);
        }
    }, [dispatch]);

    const mobile = (credit.credData && credit.credData.customer && credit.credData.customer.phone_number) ? credit.credData.customer.phone_number : "";
    const total = CartHelper.getTotalAmount();
    return (
            <>
                <Box className="container">
                    <Grid container direction="row" className="height-100">
                        <Grid item xs={12} md={6}>
                            <Box p={3} className="position-relative align-center">
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={6} className="height-100">
                            <Paper className="height-100" square={true}>
                                <Box p={3} className="height-100 overflow-auto request-product-max-height">

                                    <CartProduct />
                                </Box>
                                {!CartHelper.isEmpty(cartProduct) ?
                                    <form onSubmit={handleSubmit}>
                                        <Grid container direction="row" justify="flex-end" className="fixed-in-bottom width-100 z-index-99">
                                            <Grid item xs={6}>
                                                <Box boxShadow={2} p={2} pr={3} className="width-100 background-white">
                                                    <Grid container direction="row" justify="space-between">
                                                        <Grid item xs>
                                                            <TextField
                                                                required
                                                                id="mobile-number"
                                                                variant="outlined"
                                                                size="small"
                                                                label="Mobile"
                                                                type="number"
                                                                value={mobile}
                                                                onChange={changePhone}
                                                                error={!isMobileValid}
                                                            />

                                                            {!isMobileValid ?
                                                                <Typography variant="caption" component="p" >Enter valid mobile number</Typography>
                                                                : null}
                                                        </Grid>
                                                        <Grid item xs className="align-right">
                                                            <Typography variant="h6" component="p">Total: {CartHelper.getCurrencyFormatted(total)}</Typography>
                                                        </Grid>
                                                    </Grid>
                                                </Box>

                                                <Box boxShadow={2} p={2} pr={3} className="width-100 background-white display-flex justify-space-between">

                                                    <Grid container direction="row">
                                                        <Grid item xs>
                                                            <Grid container direction="row" spacing={2}>

                                                                <Grid item>
                                                                    <Button
                                                                        type="button"
                                                                        size="large"
                                                                        color="secondary"
                                                                        onClick={() => dispatch(clearCart())}
                                                                    >
                                                                        Clear All
                                                                    </Button>
                                                                </Grid>

                                                            </Grid>
                                                        </Grid>
                                                        <Grid item>
                                                            <Button
                                                                size="large"
                                                                variant="contained"
                                                                color="secondary"
                                                                className="color-white"
                                                                type="submit"
                                                            >
                                                                Generate Credit Note
                                                            </Button>
                                                        </Grid>
                                                    </Grid>
                                                </Box>
                                            </Grid>
                                        </Grid>
                                    </form>
                                    :
                                    <Grid container direction="row" justify="flex-end" className="fixed-in-bottom width-100 z-index-99">
                                        <Grid item xs={6}>
                                            <Box className="width-100 align-right background-white" boxShadow={1} p={2} pr={3}>
                                                <Button size="large" variant="contained" color="secondary" className="color-white" onClick={togglePopup}>
                                                    Load Invoice
                                                </Button>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                }
                            </Paper>
                        </Grid>
                    </Grid>
                </Box>
                {credit.popup ? <CreditPopup toggle={togglePopup} /> : null}
                {credit.success ? <CreditSuccessPopup toggle={toggleSuccessPopup} /> : null}
                {toggleDiscount ?
                    <Box className="fixed-in-bottom width-100 z-index-99">
                        <Grid container direction="row">
                            <Grid item xs={6}></Grid>
                            <Grid className="position-relative" item xs={6}>
                            </Grid>
                        </Grid>
                    </Box>
                    : null}
            </>
        )
}

export default CreditNote
