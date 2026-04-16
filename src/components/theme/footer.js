import React, { Component } from 'react'
import LoadingBox from './LoadingBox';
import StoreLocations from './storeLocations';
import CustomLoadingBox from './CustomLoadingBox';
import AlertBox from './AlertBox'
import CancelPopup from '../../pages/cancel-invoice/cancelInvoicePopup'
import { connect } from "react-redux";
import Sync from '../CheckOutPage/offline/sync'
import CreateProduct from '../ProductPage/CreateProduct'
import PricePopup from '../CheckOutPage/CartItems/PricePopup';
import QtyPopup from '../CheckOutPage/CartItems/QtyPopup';
import ShortKeys from './ShortKeys';

class footer extends Component {
    render() {
        const { theme, productData, productConfig } = this.props
        return (
            <React.Fragment>
                <StoreLocations />
                {productConfig && productConfig.pricePopup ? <PricePopup /> : null}
                {productConfig && productConfig.qtyPopup ? <QtyPopup /> : null}
                {productData && productData.createPopup ? <CreateProduct /> : null}
                <LoadingBox />
                <CustomLoadingBox />
                <AlertBox />
                {theme.cancelIsActive ? <CancelPopup open={theme.cancelIsActive} /> : null}
                <Sync />
                <ShortKeys />
            </React.Fragment>
        )
    }
}

const mapStateToProps = state => ({
    theme: state.theme,
    productData: state.productData,
    productConfig: state.productConfig
});

export default connect(mapStateToProps, null)(footer)