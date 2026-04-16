import React, { Component } from 'react';
import { Typography, Box, Grid, Button } from '@material-ui/core';
import { connect } from "react-redux";
import PropTypes from 'prop-types';
import FetchProducts from '../ProductPage/FetchProducts';
import CartItems from '../CheckOutPage/CartItems/CartItems';
import CartHelper from '../../Helper/cartHelper';
import StoreHelper from '../../Helper/storeHelper';
import { clearAppliedDiscount } from '../../redux/action/discountAction'
import { startRuleCalculation } from '../../redux/action/returnAction';
import SearchByBarcode from '../Search/searchByBarcode';
import { toogleCreateProduct } from '../../redux/action/productsAction';


class LeftPanel extends Component {
    componentDidUpdate() {
        const { returnData } = this.props;
        if (!CartHelper.isEmpty(returnData)) {
            var isChanged = CartHelper.isReturingCartChanged();
            if (isChanged && !CartHelper.isEmpty(returnData.rules) && !returnData.startRule) {
                this.props.startRuleCalculation(true);
            }
        }
    }

    openCreateProductPopup = () => {
        this.props.toogleCreateProduct(true)
    }

    render() {
        const { returnData, editData } = this.props;
        return (
            <Box p={1} pb={0}>
                <FetchProducts />
                <Box mt={1} mb={2} className="position-relative" >
                    <Grid container className="width-100" alignItems="center" spacing={2}>
                        <Grid item xs>
                            <SearchByBarcode />
                        </Grid>
                        {StoreHelper.canCreateProduct() ?
                            <Grid item>
                                <Button variant="outlined" className="new-product-button background-blue" onClick={this.openCreateProductPopup}>Add New Product</Button>
                            </Grid>
                            : null
                        }
                    </Grid>
                </Box>
                <Box className="cartitems-block">
                    <Box className="selectedproduct">
                        <>
                            {!CartHelper.isEmpty(returnData) && returnData.success ?
                                <Typography variant='subtitle1' component='span' className={'exchanging-label'}>Exchanging Invoice #{returnData.invoice}</Typography>
                                : null}
                            {!CartHelper.isEmpty(editData) && editData.success ?
                                <Typography variant='subtitle1' component='span' className={'exchanging-label'}>Editing Invoice #{editData.invoice}</Typography>
                                : null}
                        </>
                        <CartItems view="table" />
                    </Box>
                </Box>
            </Box>
        )
    }
}


LeftPanel.propTypes = {
    clearAppliedDiscount: PropTypes.func.isRequired,
    startRuleCalculation: PropTypes.func.isRequired,
    toogleCreateProduct: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
    cartProduct: state.cartProduct,
    productData: state.productData,
    returnData: state.returnData,
    editData: state.editData,
    discount: state.discount,
});

const mapActionsToProps = {
    clearAppliedDiscount,
    startRuleCalculation,
    toogleCreateProduct
};
export default connect(mapStateToProps, mapActionsToProps)(LeftPanel);