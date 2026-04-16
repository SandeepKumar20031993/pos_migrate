import React, { Component } from 'react'
import { Box, Paper, Grid, Button } from '@material-ui/core';
//import { ArrowForwardIos } from '@material-ui/icons';
import { connect } from "react-redux";
import PropTypes from 'prop-types';
import CartHelper from '../../Helper/cartHelper'
import StoreHelper from '../../Helper/storeHelper'
import { pageTitle } from '../../redux/action/themeAction';
import { clearCart } from '../../redux/action/cartAction';
import { sendStockRequest } from '../../redux/action/productsAction'
import Chooseproduct from '../../components/CheckOutPage/Chooseproduct';
import SearchByBarcode from '../../components/Search/searchByBarcode';

class index extends Component {
    componentDidMount() {
        //this.props.clearCart();
        this.props.pageTitle('Stock Request');
    }

    handleSendRequest = () => {
        var formData = {}
        formData.user = StoreHelper.getUserId()
        formData.location = StoreHelper.getLocationId()
        formData.cart = this.props.cartProduct
        this.props.sendStockRequest(formData);
        var count = 0
        let counter = setInterval(() => {
            const { interAction } = this.props
            if (interAction.alert) {
                this.props.clearCart();
                clearInterval(counter);
            }
            if (count >= 10) {
                clearInterval(counter);
            }
            count = count + 1
        }, 500);
    }

    render() {
        const { clearCart, cartProduct } = this.props
        return (
            <Box className="container">
                <Grid container direction="row" className="height-100">
                    <Grid item xs={12} md={6} className="height-100">
                        <Box p={3} className="position-relative">
                            <SearchByBarcode />
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={6} className="height-100">
                        <Paper className="height-100" square={true}>
                            <Box p={3} className="height-100 overflow-auto request-product-max-height">
                                <Chooseproduct />
                            </Box>
                            {!CartHelper.isEmpty(cartProduct) ?
                                <Grid container direction="row" justify="flex-end" className="fixed-in-bottom width-100 z-index-99">
                                    <Grid item xs={6}>
                                        <Box className="width-100 align-right background-white display-flex justify-space-between" boxShadow={1} p={2} pr={3}>
                                            <Button size="large" onClick={() => clearCart()}>
                                                Clear All
                                            </Button>
                                            <Button size="large" variant="contained" color="secondary" onClick={this.handleSendRequest}>
                                                Send Request
                                            </Button>
                                        </Box>
                                    </Grid>
                                </Grid>
                                : null}
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        )
    }
}

index.propTypes = {
    pageTitle: PropTypes.func.isRequired,
    clearCart: PropTypes.func.isRequired,
    sendStockRequest: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
    salesRecord: state.salesRecord,
    cartProduct: state.cartProduct,
    interAction: state.interAction,
});
export default connect(mapStateToProps, { pageTitle, clearCart, sendStockRequest })(index)