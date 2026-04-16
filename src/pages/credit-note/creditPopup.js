import React, { useEffect, useRef } from 'react'
import { Avatar, Dialog, DialogContent, DialogActions, Grid, Typography, Box, Button } from '@material-ui/core';
import { HighlightOff } from "@material-ui/icons";
import { useDispatch, useSelector } from "react-redux";
import { loadCreditProducts, saveCreditData, clearCreditProducts, updateCreditInv } from '../../redux/action/creditAction';
import { restoreCartProduct, clearCart } from '../../redux/action/cartAction';
import { loading, alert } from '../../redux/action/InterAction';
import AddDiscHelper from '../../Helper/actionHelper/addDiscHelper';

function CreditPopup({ toggle }) {
    const dispatch = useDispatch();
    const credit = useSelector((state) => state.credit);
    const textInput = useRef(null);

    useEffect(() => {
        dispatch(clearCreditProducts());
        dispatch(updateCreditInv(""));
    }, [dispatch]);

    useEffect(() => {
        if (textInput.current) {
            textInput.current.focus();
        }
    }, [credit.invoice, credit.popup]);

    const handleInvoice = (event) => {
        dispatch(updateCreditInv(event.target.value));
    };

    const submitInvoice = (event) => {
        event.preventDefault();
        const form = {
            orderno: credit.invoice,
            creditNote: true
        };
        dispatch(loading(true));
        dispatch(loadCreditProducts(form))
            .then(res => res.json())
            .then(res => {
                if (res.data && Array.isArray(res.data) && res.data.length > 0) {
                    dispatch(saveCreditData(res));
                    dispatch(clearCart());
                    res.data.forEach(product => {
                        product.isCreditNote = true;
                        dispatch(restoreCartProduct(product));
                    });
                    AddDiscHelper.restoreAddDiscount(res, res?.invoice_no);
                    dispatch(loading(false));
                    toggle();
                } else {
                    dispatch(loading(false));
                    dispatch(alert(true, res.message || "Error occured to create the credit note."));
                    toggle();
                }
            }, () => {
                dispatch(loading(false));
                toggle();
            });

    };

    return (
        <React.Fragment>
            <Dialog open={credit.popup} scroll={'body'} className={'dialog'} onClose={toggle}>
                <DialogActions>
                    <Avatar onClick={toggle} className={'popup-close-button'}>
                        <HighlightOff />
                    </Avatar>
                </DialogActions>
                <DialogContent className={'display-in-center'}>
                    <Grid container direction="row" justify={'center'} alignItems="center" spacing={2}>
                        <Grid item xs={12} className={'align-center color-green'}>
                            <Typography variant="h4" component="h4">Credit Note</Typography>
                        </Grid>
                        <Grid item xs={12} className={'align-center color-green'}>
                            <Typography variant="h5" component="h5">Enter or Scan invoice number </Typography>
                        </Grid>
                        <Grid item xs={12} className={'align-center'}>
                            <Box>
                                <form onSubmit={submitInvoice} className="display-flex justify-center">
                                    <input type="text" name={'orderid'} className={'input orderid'} placeholder={'Invoice number'} value={credit.invoice || ""} onChange={handleInvoice} ref={textInput} />

                                    <Button variant="contained" color="secondary" type="submit">Load</Button>
                                </form>
                            </Box>
                        </Grid>
                    </Grid>
                </DialogContent>
            </Dialog>
        </React.Fragment>
    )
}

export default CreditPopup
