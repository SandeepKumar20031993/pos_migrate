import React from 'react'
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom'
import { clearCart, suspendCart } from '../../redux/action/cartAction';
import PropTypes from 'prop-types';

class ShortKeys extends React.Component {
    constructor() {
        super();

        this.state = {

        };
        window.addEventListener("keydown", this.shortKeys)
    }

    shortKeys = (e) => {
        //Alt key + keydown events

        if (e.altKey === true) {
            //S key press
            if (e.altKey === true && e.keyCode === 83) {
                //console.log('Alt + S');
                document.getElementById('searchByName').focus();
            }

            //B key press
            if (e.altKey === true && e.keyCode === 66) {
                //console.log('Alt + B');
                document.getElementById('searchByBarcode').focus();
            }

            //I key press
            if (e.altKey === true && e.keyCode === 73) {
                //console.log('Alt + I');
                document.getElementById('summary-info-btn').click();
            }

            // Enter key press
            if (e.altKey === true && e.keyCode === 13) {
                //console.log('Alt + Enter');
                document.getElementById('checkout-btn').click();
            }

            //C key press
            if (e.altKey === true && e.keyCode === 67) {
                //console.log('Alt + C');
                document.getElementById('cart-clear-btn').click();
            }

            //M key press
            if (e.altKey === true && e.keyCode === 77) {
                //console.log('Alt + M');
                document.getElementById('menu-icon-btn').click();
            }

            //N key press
            if (e.altKey === true && e.keyCode === 78) {
                //console.log('Alt + M');
                document.getElementById('new-sale-btn').click();
            }

            //R key press
            if (e.altKey === true && e.keyCode === 82) {
                //console.log('Alt + R');
                document.getElementById('return-start-btn').click();
            }

            //D key press
            if (e.altKey === true && e.keyCode === 68) {
                //console.log('Alt + D');
                document.getElementById('discount-btn').click();
            }
        }
        if (e.ctrlKey === true && e.shiftKey === true && e.keyCode === 83) {
            //console.log('suspendCart');
            if (this.props.cartProduct && this.props.cartProduct.length > 0) {
                this.props.suspendCart(this.props.cartProduct);
                this.props.clearCart();
            }
        }
        //Enter key press
        if (e.ctrlKey === true && e.keyCode === 13) {
            //console.log('Alt + Enter');
            document.getElementById('checkout-btn').click();
        }
    }

    render() {
        return (
            <>
            </>
        )
    }
}

ShortKeys.propTypes = {
    clearCart: PropTypes.func.isRequired,
    suspendCart: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
    cartProduct: state.cartProduct,
});

const mapActionToProps = {
    clearCart,
    suspendCart
};

export default connect(mapStateToProps, mapActionToProps)(withRouter(ShortKeys))
