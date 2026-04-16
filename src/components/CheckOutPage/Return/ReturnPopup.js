import React, { useEffect, useRef, useState } from 'react'
import { withRouter } from 'react-router-dom';
import { Avatar, Dialog, DialogContent, DialogActions, Grid, Typography, Box, Button, Switch } from '@material-ui/core';
import { HighlightOff } from "@material-ui/icons";
import { connect } from "react-redux";
import PropTypes from 'prop-types';
import { loadReturningProducts, clearReturningProducts, saveReturingInvoiceNo, enableReturnProcess, saveReturingData, startRuleCalculation, switchCompleteReturn } from '../../../redux/action/returnAction';
import { restoreCartProduct, clearCart } from '../../../redux/action/cartAction';
import CartHelper from '../../../Helper/cartHelper';
import StoreHelper from '../../../Helper/storeHelper';
import { loading, alert } from '../../../redux/action/InterAction';
import { pageTitle } from '../../../redux/action/themeAction';
import AddDiscHelper from '../../../Helper/actionHelper/addDiscHelper';
import { clearExchangeData } from '../../../redux/action/exchangeActions';

const ReturnPopup = (props) => {
    const [invoice, setInvoice] = useState('');
    const [checked, setChecked] = useState(false);
    const [complete, setComplete] = useState(false);
    const textInput = useRef(null);

    useEffect(() => {
        props.clearReturningProducts();
        props.clearExchangeData();
    }, []);

    useEffect(() => {
        textInput.current?.focus();
        var returnData = props.returnData;

        if (!CartHelper.isEmpty(returnData)) {
            if (returnData.success) {
                props.clearCart();
                props.pageTitle('Return Sale');
                props.saveReturingInvoiceNo(invoice);
                returnData.data.forEach(product => {
                    props.restoreCartProduct(product);
                });
                AddDiscHelper.restoreAddDiscount(returnData, invoice);
                props.startRuleCalculation(false);
                props.switchCompleteReturn(complete);
                props.loading(false);
                props.toggle();
            } else {
                props.loading(false);
                props.alert(true, returnData.message);
                props.clearReturningProducts();
                props.toggle();
            }
        }
    }, [props.returnData]);

    const handleInvoice = event => {
        setInvoice(event.target.value);
    };

    const submitInvoice = event => {
        event.preventDefault();
        var form = {
            orderno: invoice,
        }
        props.loading(true);
        props.loadReturningProducts(form)
            .then(res => res.json())
            .then(res => {
                if (res.success) {

                    // console.log("res::", res);
                    if (["RETURN", 'EXCHANGE'].includes(res?.sale_status)) {
                        props.alert(true, `Invoice ${res?.invoice_no} status is ${res?.sale_status} `);

                    } else {
                        res.startRule = false
                        props.saveReturingData(res);
                        if (complete) {
                            props.history.push(`${process.env.PUBLIC_URL}/complete-return`);
                        }
                    }
                    props.loading(false);
                } else {
                    props.loading(false);
                    props.alert(true, res.message);
                    props.clearReturningProducts();
                    props.toggle();
                }
            }, err => {
                props.loading(false);
                props.clearReturningProducts();
                props.toggle();
            })

    };

    const switchbarcode = () => {
        setChecked((prev) => !prev);
        setInvoice("_UNKNOWN");
        var form = {
            customer: {},
            data: [],
            invoice: '',
            rules: {},
            sale_id: '',
            sales_data: { applyDisWithoutTax: "0", dis_type: null, discount: "0", nettotal: "0", subtotal: "0 ", tax: "0" },
            success: true,
            barcode_return: true
        }

        props.enableReturnProcess(form);
    };

    const handleComplete = () => {
        setComplete((prev) => !prev);
    };

    return (
            <React.Fragment>
                <Dialog open={props.return} scroll={'body'} className={'dialog'} onClose={props.toggle}>
                    <DialogActions>
                        <Avatar onClick={props.toggle} className={'popup-close-button'}>
                            <HighlightOff />
                        </Avatar>
                    </DialogActions>
                    <DialogContent className={'display-in-center'}>
                        <Grid container direction="row" justify={'center'} alignItems="center" spacing={2}>
                            <Grid item xs={12} className={'align-center'}>
                                <Typography variant="h5" className="bold-i">Return Invoice</Typography>
                            </Grid>
                            <Grid item xs={12} className={'align-center'}>
                                <Typography variant="h6">Enter or Scan invoice number </Typography>
                            </Grid>

                            <Grid item xs={12} className={'align-center'}>
                                <Box >
                                    <Switch value={complete} onChange={handleComplete} />
                                    <span>Complete Return</span>
                                </Box>
                            </Grid>

                            <Grid item xs={12} className={'align-center'}>
                                <Box>
                                    <form onSubmit={submitInvoice} className="display-flex justify-center">
                                        <input type="text" name={'orderid'} className={'input orderid'} placeholder={'Invoice number'} value={invoice} onChange={handleInvoice} ref={textInput} />
                                        <Button variant="contained" color="secondary" type="submit">Load</Button>
                                    </form>
                                </Box>
                            </Grid>

                            {StoreHelper.isBarcodeReturn() === 1 ?
                                <Box pb={3}>
                                    <Switch value={checked} onChange={switchbarcode} />
                                    <span>Return by barcode scan</span>
                                </Box>
                                : null}

                        </Grid>
                    </DialogContent>
                </Dialog>
            </React.Fragment>
        );
}


ReturnPopup.propTypes = {
    loadReturningProducts: PropTypes.func.isRequired,
    clearReturningProducts: PropTypes.func.isRequired,
    restoreCartProduct: PropTypes.func.isRequired,
    enableReturnProcess: PropTypes.func.isRequired,
    clearCart: PropTypes.func.isRequired,
    loading: PropTypes.func.isRequired,
    alert: PropTypes.func.isRequired,
    pageTitle: PropTypes.func.isRequired,
    saveReturingInvoiceNo: PropTypes.func.isRequired,
    saveReturingData: PropTypes.func.isRequired,
    startRuleCalculation: PropTypes.func.isRequired,
    switchCompleteReturn: PropTypes.func.isRequired,
}
const mapStateToProps = state => ({
    cartProduct: state.cartProduct,
    productData: state.productData,
    returnData: state.returnData
});
export default connect(mapStateToProps, {
    loadReturningProducts,
    clearReturningProducts,
    restoreCartProduct,
    clearCart,
    enableReturnProcess,
    loading,
    alert,
    pageTitle,
    saveReturingInvoiceNo,
    saveReturingData,
    startRuleCalculation,
    clearExchangeData,
    switchCompleteReturn
})(withRouter(ReturnPopup))
