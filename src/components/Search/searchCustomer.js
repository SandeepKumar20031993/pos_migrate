import React from 'react'
import Autosuggest from 'react-autosuggest';
import { connect } from "react-redux";
import { AddToCart, updateQty } from '../../redux/action/cartAction';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import SearchIcon from '@material-ui/icons/Search';
import { dbProductsData } from '../../services/product-service';
//import PropTypes from 'prop-types';


class searchCustomer extends React.Component {
  constructor() {
    super();

    this.state = {
      value: '',
      suggestions: []
    };
  }

  getSuggestions = value => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;
    return inputLength === 0 ? [] : dbProductsData.data.filter(product =>
      product.name.toLowerCase().slice(0, inputLength) === inputValue
    );
  };


  getSuggestionValue = suggestion => {
    return suggestion.name
  };

  renderSuggestion = suggestion => {
    return (
      <div>
        <Grid
          container
          direction="row"
          justify="space-between"
          alignItems="center"
        >
          <Grid item>
            <Grid
              container
              direction="row"
              alignItems="center"
            >
              <Grid item>
                <Box>
                  {suggestion.item_image ?
                    <img src={suggestion.item_image} height={30} alt={suggestion.name} /> : <img src={`${process.env.PUBLIC_URL}/assets/images/shop-placeholder.png`} height={30} alt={suggestion.name} />
                  }
                </Box>
              </Grid>
              <Grid item>
                <Box pl={2}>
                  {suggestion.name}
                </Box>
              </Grid>
            </Grid>
          </Grid>

          <Grid item>
            <Box pl={2}>
              {suggestion.barcode}
            </Box>
          </Grid>

          <Grid item>
            <Box pl={2}>
              {suggestion.finalprice}
            </Box>
          </Grid>
        </Grid>
      </div>
    )
  };

  addToCartSuggestedItem = (event, data) => {
    let product = { ...data.suggestion };
    this.addThisProductToCArt(product);
    //Clearing data of input text 
    this.setState({
      value: ''
    })
  }


  addThisProductToCArt = (product) => {
    const nextProduct = { ...product };

    if (this.props.cartProduct.length !== 0) {
      let isExist = 0;
      this.props.cartProduct.forEach(prod => {
        if (prod.barcode === nextProduct.barcode) {
          this.props.updateQty(nextProduct);
          return isExist = 1;
        }
      });

      if (!isExist) {
        this.props.AddToCart(nextProduct);
      }

    } else {
      this.props.AddToCart(nextProduct);
    }

  }


  onChange = (event, { newValue }) => {
    this.setState({
      value: newValue
    });
  };


  onSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: this.getSuggestions(value).slice(0, 10)
    });
  };


  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  shouldRenderSuggestions = (value) => {
    return value.trim().length > 2;
  }

  render() {
    const { value, suggestions } = this.state;

    const inputStyte = {
      height: 32,
      width: '100%',
      position: 'relative',
      fontSize: 14,
      padding: '0 0 0 32px',
      border: '1px solid #ddd',
      borderRadius: 2,
      maxWidth: 300,
    }
    const autosuggestStyle = {
      color: '#000',
      position: 'relative'
    }
    const searchIconStyle = {
      position: 'absolute',
      zIndex: 1,
      top: 5,
      left: 5,
      color: '#ccc',
    }

    const inputProps = {
      placeholder: 'Search customer by mobile...',
      value,
      onChange: this.onChange,
      style: inputStyte
    };




    // Finally, render it!
    return (
      <div style={autosuggestStyle}>
        <SearchIcon style={searchIconStyle} />
        <Autosuggest
          suggestions={suggestions}
          onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
          onSuggestionsClearRequested={this.onSuggestionsClearRequested}
          getSuggestionValue={this.getSuggestionValue.bind(this)}
          renderSuggestion={this.renderSuggestion}
          inputProps={inputProps}
          onSuggestionSelected={this.addToCartSuggestedItem}
          highlightFirstSuggestion={true}
          shouldRenderSuggestions={this.shouldRenderSuggestions}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  productData: state.productData,
  cartProduct: state.cartProduct
});

export default connect(mapStateToProps, { AddToCart, updateQty })(searchCustomer)
