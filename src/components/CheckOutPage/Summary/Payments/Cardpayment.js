import React, { Component } from 'react';
import { Grid, Box, TextField } from '@material-ui/core';
import { connect } from "react-redux";
import PropTypes from 'prop-types';
//import CartHelper from '../../../../Helper/cartHelper'
import { updateCardNo } from '../../../../redux/action/cartAction'

class CardPayment extends Component {
    constructor(props) {
        super(props)

        this.state = {

        }
    }

    render() {
        const { checkoutData } = this.props
        return (
            <Grid item xs={12}>
                <Box pl={3} pr={3}>
                    <TextField
                        variant="outlined"
                        value={checkoutData.data.card_no}
                        label="Last 4 Digit of Card no"
                        autoFocus
                        onChange={(event) => this.props.updateCardNo(event.target.value)}
                    />
                </Box>
            </Grid>
        )
    }
}
//properties defines
CardPayment.propTypes = {
    updateCardNo: PropTypes.func.isRequired
}
//maping state to props
const mapStateToProps = state => ({
    checkoutData: state.checkoutData
});

export default connect(mapStateToProps, { updateCardNo })(CardPayment);