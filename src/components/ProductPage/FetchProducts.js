import { Component } from 'react';
import { saveCategoryProducts, saveBestsellingProducts, saveRecommendedProducts, saveProductRules } from '../../redux/action/productsAction';
import { loading, alert } from '../../redux/action/InterAction';
import { connect } from "react-redux";
import PropTypes from 'prop-types';
import AddToCartHelper from '../../Helper/actionHelper/addToCartHelper';
import { dbProductsData, getProductsFromDb, hashError, emptyProducts } from '../../services/product-service';

class FetchProducts extends Component {

    componentDidMount() {
        this.props.loading(true);
        this.loadProductsFromDb();
        const { productData } = this.props
        if (productData && productData.category_products && productData.category_products.length === 0) {
            AddToCartHelper.startNewSale();
        } else {
            this.props.loading(false);
        }
    }

    loadProductsFromDb = () => {
        getProductsFromDb();
        let timer = setInterval(() => {
            if (dbProductsData && dbProductsData.data && dbProductsData.data.length > 0) {
                // console.log(dbProductsData);
                this.props.saveProductRules(dbProductsData.rules);
                this.props.saveCategoryProducts(dbProductsData.data);
                this.props.saveBestsellingProducts(dbProductsData.data);
                this.props.saveRecommendedProducts(dbProductsData.data);
                this.props.loading(false);
                clearInterval(timer);
            }
            if (hashError || emptyProducts) {
                this.props.loading(false);
                clearInterval(timer);
            }
        }, 1000)
    }

    render() {
        return ("");
    }
}

FetchProducts.propTypes = {
    saveCategoryProducts: PropTypes.func.isRequired,
    saveBestsellingProducts: PropTypes.func.isRequired,
    saveRecommendedProducts: PropTypes.func.isRequired,
    saveProductRules: PropTypes.func.isRequired,
    loading: PropTypes.func.isRequired,
    alert: PropTypes.func.isRequired
}

const mapActionsToProps = {
    saveCategoryProducts,
    saveBestsellingProducts,
    saveRecommendedProducts,
    saveProductRules,
    loading,
    alert
};

export default connect(null, mapActionsToProps)(FetchProducts);