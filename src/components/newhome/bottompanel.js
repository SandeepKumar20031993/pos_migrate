import React, { Component } from 'react'
import { Box, Grid } from '@material-ui/core'
import CheckoutPage from '../CheckOutPage/CheckoutPage'
//import BottomSummary from './bottomSummary'

export class bottompanel extends Component {
    render() {
        return (
            <div className="background-white">
                <Grid container className="bottom-block">
                    {/* <Grid item xs>
                        <BottomSummary />
                    </Grid> */}
                    <Grid item xs className="checkout-block position-relative">
                        <Box className="fixCheckout">
                            <CheckoutPage displayIconText={true} />
                        </Box>
                    </Grid>
                </Grid>
            </div>
        )
    }
}

export default bottompanel
