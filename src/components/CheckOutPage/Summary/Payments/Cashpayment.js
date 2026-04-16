import React, { Component } from 'react';
import { Typography } from '@material-ui/core';
import { connect } from "react-redux";
//import PropTypes from 'prop-types';
import CartHelper from '../../../../Helper/cartHelper'


class CashPayment extends Component {

    componentDidMount() {

    }

    componentDidUpdate() {

    }
    render() {
        const { checkoutData, returnData } = this.props;
        var payment_amount = Number(checkoutData.data.payment_amount);

        // if(customerData.isChecked === true){ 
        //     payment_amount = Number(customerData.redeemtotal);
        // }

        const tender = Number(checkoutData.tender);
        const defferece = tender - payment_amount;

        return (

            <>
                {returnData.barcode_return ?
                    <Typography gutterBottom align="center" className={'payment-label-value'}>
                        Refund amount  :  {CartHelper.getCurrencyFormatted(defferece).split('-')}
                    </Typography>
                    :
                    <>
                        {Number(payment_amount) > Number(tender) ?
                            <Typography gutterBottom align="center" className={'payment-label-value'}>
                                Bill Amount  :  {CartHelper.getCurrencyFormatted(defferece).split('-')}
                            </Typography>
                            :
                            <Typography gutterBottom align="center" className={'payment-label-value'}>
                                Refund amount :  {CartHelper.getCurrencyFormatted(defferece).split('-')}
                            </Typography>
                        }
                    </>
                }
                {/* <Typography align="center" className={'payment-label-value'}>
                    {CartHelper.getCurrencyFormatted(defferece).split('-')}
                </Typography> */}
            </>
        )
    }

}
//properties defines
// CashPayment.propTypes = {
//   generateBill:PropTypes.func.isRequired
// }
//maping state to props
const mapStateToProps = state => ({
    checkoutData: state.checkoutData,
    returnData: state.returnData,
    customerData: state.customerData
});

export default connect(mapStateToProps, null)(CashPayment);