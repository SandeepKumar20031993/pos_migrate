import React, { Component } from "react";
import { connect } from "react-redux";

import { Box, Input, TextField, Typography } from "@material-ui/core";

import CartHelper from '../../../../Helper/cartHelper'

class TenderedAmountComponent extends Component {
    constructor() {

        super();

        this.state = {
            balance: 0
        }

    }


    render() {
        const { checkoutData } = this.props;
        var payment_amount = Number(checkoutData.data.payment_amount);

        return <Box
            display={'inline-flex'}
            alignItems={'center'}

            marginTop={2}
            marginBottom={2}
            style={{ backgroundColor: "#f2f2f2", borderRadius: '8px', paddingRight: '8px' }}
        >
            <TextField
                className=""
                style={{ marginRight: 4 }}
                label="Cash tendered"
                variant="outlined"
                type="number"
                size="small"
                onChange={(e) => {
                    this.setState({ balance: e.target.value - payment_amount })
                }}
            />

            <Typography style={{ marginLeft: 2 }} id="" >Balance : &nbsp; {CartHelper.getCurrencyFormatted(this.state.balance)} </Typography>
        </Box>
    }
}
const mapStateToProps = state => ({
    checkoutData: state.checkoutData,
});

export default connect(mapStateToProps, null)(TenderedAmountComponent)