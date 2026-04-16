import React, { useEffect, useRef, useState } from 'react'
import { Avatar, Dialog, DialogContent, DialogActions, Grid, Typography, Box, Button } from '@material-ui/core';
import { HighlightOff } from "@material-ui/icons";
import { connect } from "react-redux";
import PropTypes from 'prop-types';
import { loadEditProducts, clearEditProducts, saveEditInvoiceNo } from '../../../redux/action/editAction';
import { restoreCartProduct, clearCart } from '../../../redux/action/cartAction';
import CartHelper from '../../../Helper/cartHelper';
import { loading, alert } from '../../../redux/action/InterAction';
import { pageTitle } from '../../../redux/action/themeAction';
import AddDiscHelper from '../../../Helper/actionHelper/addDiscHelper';

const EditPopup = (props) => {
    const [invoice, setInvoice] = useState('');
    const textInput = useRef(null);

    useEffect(() => {
        textInput.current?.focus();
        const editData = props.editData;

        if (!CartHelper.isEmpty(editData)) {
            if (editData.success) {
                props.clearCart();
                props.pageTitle('Edit Sale');
                props.saveEditInvoiceNo(invoice);
                editData.data.forEach(product => {
                    props.restoreCartProduct(product);
                });
                AddDiscHelper.restoreAddDiscount(editData, invoice);
                props.loading(false);
                props.toggle();
            } else {
                props.loading(false);
                props.alert(true, editData.message);
                props.clearEditProducts();
                props.toggle();
            }
        }
    }, [props.editData]);

    const handleInvoice = event => {
        setInvoice(event.target.value);
    };

    const submitInvoice = event => {
        event.preventDefault();
        var form = {
            orderno: invoice
        }
        props.loadEditProducts(form);
        props.loading(true);
    };

    return (
            <React.Fragment>
                <Dialog open={props.openEdit} scroll={'body'} className={'dialog'} onClose={props.toggle}>
                    <DialogActions>
                        <Avatar onClick={props.toggle} className={'popup-close-button'}>
                            <HighlightOff />
                        </Avatar>
                    </DialogActions>
                    <DialogContent className={'display-in-center'}>
                        <Grid container direction="row" justify={'center'} alignItems="center" spacing={2}>
                            <Grid item xs={12} className={'align-center'}>
                                <Typography variant="h5" className="bold-i">Edit Invoice</Typography>
                            </Grid>
                            <Grid item xs={12} className={'align-center'}>
                                <Typography variant="h6">Enter or Scan invoice number </Typography>
                            </Grid>
                            <Grid item xs={12} className={'align-center'}>
                                <Box>
                                    <form onSubmit={submitInvoice} className="display-flex justify-center">
                                        <input type="text" name={'orderid'} className={'input orderid'} placeholder={'Invoice number'} value={invoice} onChange={handleInvoice} ref={textInput} />
                                        <Button variant="contained" color="secondary" type="submit">Load</Button>
                                    </form>
                                </Box>
                            </Grid>
                            <Grid item xs={12}></Grid>
                        </Grid>
                    </DialogContent>
                </Dialog>
            </React.Fragment>
        );
}


EditPopup.propTypes = {
    loadEditProducts: PropTypes.func.isRequired,
    clearEditProducts: PropTypes.func.isRequired,
    restoreCartProduct: PropTypes.func.isRequired,
    clearCart: PropTypes.func.isRequired,
    loading: PropTypes.func.isRequired,
    alert: PropTypes.func.isRequired,
    pageTitle: PropTypes.func.isRequired,
    saveEditInvoiceNo: PropTypes.func.isRequired,
}
const mapStateToProps = state => ({
    cartProduct: state.cartProduct,
    productData: state.productData,
    editData: state.editData
});
export default connect(mapStateToProps, {
    loadEditProducts,
    clearEditProducts,
    restoreCartProduct,
    clearCart,
    loading,
    alert,
    pageTitle,
    saveEditInvoiceNo
})(EditPopup)
