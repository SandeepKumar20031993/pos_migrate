import React, { Component } from 'react'
import { withRouter } from 'react-router-dom';
import { Avatar, Dialog, DialogContent, DialogActions, Grid, Typography, Box, Button } from '@material-ui/core';
import { HighlightOff } from "@material-ui/icons";
import { connect } from "react-redux";
import PropTypes from 'prop-types';
import { loadReturningProducts, clearReturningProducts, saveReturingInvoiceNo } from '../../redux/action/returnAction';
import { clearCart } from '../../redux/action/cartAction';
import CartHelper from '../../Helper/cartHelper';
import { loading, alert } from '../../redux/action/InterAction';
import { openCancelPopup } from '../../redux/action/themeAction'
import { loadCancelInvoiceData, clearCancelInvoice, saveCancelInvoice } from '../../redux/action/cancelAction'

class cancelInvoicePopup extends Component {
    constructor(props) {
        super(props)
        this.state = {
            invoice: '',
        }
    }
    componentDidMount() {
        this.props.clearCancelInvoice();
    }

    handleInvoice = event => {
        this.setState({
            invoice: event.target.value
        })
    }

    submitInvoice = event => {
        event.preventDefault();
        var form = {
            orderno: this.state.invoice
        }
        this.props.loadCancelInvoiceData(form);
        this.props.saveCancelInvoice(this.state.invoice);
        this.props.loading(true);
    }

    componentDidUpdate() {
        var cancelData = this.props.cancelData;
        if (!CartHelper.isEmpty(cancelData)) {
            if (cancelData.success) {
                this.props.loading(false);
                this.props.openCancelPopup(false);
                this.props.history.push(`${process.env.PUBLIC_URL}/cancelinvoice`);
            } else {
                if (cancelData.message !== undefined) {
                    this.props.loading(false);
                    this.props.alert(true, cancelData.message)
                    this.props.openCancelPopup(false);
                    this.props.clearCancelInvoice();
                }
            }
        }
    }


    render() {
        const { invoice } = this.state;
        const { theme, openCancelPopup } = this.props

        return (
            <React.Fragment>
                <Dialog open={this.props.open} scroll={'body'} className={'dialog'} onClose={() => openCancelPopup(!theme.cancelIsActive)}>
                    <DialogActions>
                        <Avatar onClick={() => openCancelPopup(!theme.cancelIsActive)} className={'popup-close-button'}>
                            <HighlightOff />
                        </Avatar>
                    </DialogActions>
                    <DialogContent className={'display-in-center'}>
                        <Grid container direction="row" justify={'center'} alignItems="center" spacing={2}>
                            <Grid item xs={12} className={'align-center'}>
                                <Typography variant="h5" className="bold-i">Cancel Invoice</Typography>
                            </Grid>
                            <Grid item xs={12} className={'align-center'}>
                                <Typography variant="h6">Enter or Scan invoice number </Typography>
                            </Grid>
                            <Grid item xs={12} className={'align-center'}>
                                <Box>
                                    <form onSubmit={this.submitInvoice} className="display-flex justify-center">
                                        <input type="text" name={'orderid'} className={'input orderid'} placeholder={'Invoice number'} value={invoice} onChange={this.handleInvoice} ref={this.textInput} />
                                        <Button variant="contained" color="secondary" type="submit">Load</Button>
                                    </form>
                                </Box>
                            </Grid>
                            <Grid item xs={12}></Grid>
                        </Grid>
                    </DialogContent>
                </Dialog>
            </React.Fragment>
        )
    }
}

cancelInvoicePopup.propTypes = {
    openCancelPopup: PropTypes.func.isRequired,
    loadReturningProducts: PropTypes.func.isRequired,
    clearReturningProducts: PropTypes.func.isRequired,
    clearCart: PropTypes.func.isRequired,
    loading: PropTypes.func.isRequired,
    alert: PropTypes.func.isRequired,
    saveReturingInvoiceNo: PropTypes.func.isRequired,
    loadCancelInvoiceData: PropTypes.func.isRequired,
    clearCancelInvoice: PropTypes.func.isRequired,
    saveCancelInvoice: PropTypes.func.isRequired
}
const mapStateToProps = state => ({
    cartProduct: state.cartProduct,
    productData: state.productData,
    returnData: state.returnData,
    cancelData: state.cancelData,
    theme: state.theme
});
export default connect(mapStateToProps, {
    openCancelPopup,
    loadReturningProducts,
    clearReturningProducts,
    clearCart,
    loading,
    alert,
    saveReturingInvoiceNo,
    loadCancelInvoiceData,
    clearCancelInvoice,
    saveCancelInvoice
})(withRouter(cancelInvoicePopup))