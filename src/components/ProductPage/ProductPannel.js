import React, { Component } from 'react';
import { withStyles } from "@material-ui/core/styles";
import ProductPage from './Product';
import CategoryList from './CategoryList';
//import RecomdedProduct from './RecomdedProduct';
import { saveCategoryProducts, saveBestsellingProducts, saveRecommendedProducts, saveCategories, saveProductRules } from '../../redux/action/productsAction';
import { AddToCart, updateQty } from '../../redux/action/cartAction';
import { loading, alert } from '../../redux/action/InterAction';
import { connect } from "react-redux";
import PropTypes from 'prop-types';
import { Typography, Grid } from '@material-ui/core';
//import CartHelper from '../../Helper/cartHelper';
import AddToCartHelper from '../../Helper/actionHelper/addToCartHelper';
import { dbProductsData, getProductsFromDb, hashError, emptyProducts } from '../../services/product-service';
import Helper from '../../Helper/storeHelper';

const Styles = theme => ({
  root: {
    flexGrow: 1,
    // backgroundColor: '#f2f2f2'
  }
});

class Productpannel extends Component {

  constructor(props) {
    super(props)

    this.state = {
      showEmptyProductsBlock: false,
      canViewProductsLabel: true,
    }
  }


  componentDidMount() {
    this.props.loading(true);
    this.loadProductsFromDb();
    const { productData } = this.props
    if (productData && productData.category_products && productData.category_products.length === 0) {
      AddToCartHelper.startNewSale();
    } else {
      this.showEmptyProductsBlock();
      this.props.loading(false);
    }
    if (Number(Helper.canViewProductsLabel()) === 1) {
      this.setState({ canViewProductsLabel: false })
    }
  }

  loadProductsFromDb = () => {
    getProductsFromDb();
    let timer = setInterval(() => {
      if (dbProductsData && dbProductsData.data && dbProductsData.data.length > 0) {
        //console.log(dbProductsData);
        this.props.saveProductRules(dbProductsData.rules);
        this.props.saveCategoryProducts(dbProductsData.data);
        this.props.saveBestsellingProducts(dbProductsData.data);
        this.props.saveRecommendedProducts(dbProductsData.data);
        this.props.loading(false);
        this.showEmptyProductsBlock();
        clearInterval(timer);
      }
      if (hashError || emptyProducts) {
        this.showEmptyProductsBlock();
        this.props.loading(false);
        clearInterval(timer);
      }
    }, 1000)
  }

  showEmptyProductsBlock = () => {
    if (dbProductsData && dbProductsData.data && dbProductsData.data.length === 0) {
      this.setState({
        showEmptyProductsBlock: false
      })
    } else {
      this.setState({
        showEmptyProductsBlock: true
      })
    }
  }

  AddToCartProduct = (product) => {
    const nextProduct = {
      ...product,
      qty: 1,
    };
    AddToCartHelper.validatePrice(nextProduct);
  }

  render() {
    const stylescroll = {
      overflowY: 'scroll',
      height: 'calc(100vh - 64px)',
      margin: 0,
      padding: 0,
      width: 'auto',
      justifyContent: 'space-around',
    }
    const { classes, productData } = this.props;
    var category_products = productData.category_products;
    var bestsellings = productData.bestsellings;
    var recommended = productData.recommended;
    const { showEmptyProductsBlock } = this.state;


    // console.log(this.state.canViewProductsLabel);

    return (
      <>
        <div className={classes.root} style={stylescroll}>
          <CategoryList />

          {this.state.canViewProductsLabel && category_products !== undefined && category_products.length !== 0 ?
            <ProductPage key={'category-products'} products={category_products} AddToCart={this.AddToCartProduct} multirows={true} row={2} />
            :
            null
          }
          {this.state.canViewProductsLabel && bestsellings !== undefined && bestsellings.length !== 0 ?
            <ProductPage key={'bestsellings-products'} products={bestsellings} title={'Best Selling Products'} AddToCart={this.AddToCartProduct} />
            :
            null
          }
          {this.state.canViewProductsLabel && recommended !== undefined && recommended.length !== 0 ?
            <ProductPage key={'recommended-products'} products={recommended} title={'Recommended Products'} AddToCart={this.AddToCartProduct} />
            :
            null
          }
          {showEmptyProductsBlock ?
            <Grid className="height-100" container direction="row" alignItems="center" justify="center">
              <Grid item className="empty-products align-center-important">
                <Typography variant="h6" component="span">No items available</Typography>
              </Grid>
            </Grid>
            : null}
        </div>
      </>
    )
  }
}

Productpannel.propTypes = {
  saveCategoryProducts: PropTypes.func.isRequired,
  saveBestsellingProducts: PropTypes.func.isRequired,
  saveRecommendedProducts: PropTypes.func.isRequired,
  saveCategories: PropTypes.func.isRequired,
  saveProductRules: PropTypes.func.isRequired,
  AddToCart: PropTypes.func.isRequired,
  loading: PropTypes.func.isRequired,
  alert: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
  productData: state.productData,
  cartProduct: state.cartProduct,

});

const mapActionsToProps = {
  saveCategoryProducts,
  saveBestsellingProducts,
  saveRecommendedProducts,
  saveCategories,
  saveProductRules,
  AddToCart,
  updateQty,
  loading,
  alert
};

export default connect(mapStateToProps, mapActionsToProps)(withStyles(Styles)(Productpannel));
