import React, { Component } from 'react'
import { Box, Typography } from '@material-ui/core'
import { connect } from "react-redux";
//import PropTypes from 'prop-types';
import CartHelper from '../../../../Helper/cartHelper'

class PaymentLabel extends Component {
    render() {
        const { checkoutData, returnData } = this.props
        return (
            <Box className={'align-left'} pl={2}    >
                <Typography gutterBottom variant="subtitle2" component="p" className="payment-label">
                    {CartHelper.isEmpty(returnData) ?
                        <>{checkoutData.data.payment_type ? 'Paying by ' + checkoutData.data.payment_type : null}</>
                        :
                        <>{checkoutData.data.payment_type ? 'Returning by ' + checkoutData.data.payment_type : null}</>
                    }
                </Typography>
            </Box>
        )
    }
}

const mapStateToProps = state => ({
    checkoutData: state.checkoutData,
    returnData: state.returnData,
});
export default connect(mapStateToProps, null)(PaymentLabel);


