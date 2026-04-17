import React from 'react'
import { Box, Button, Grid, Typography } from '@material-ui/core';

const PaymentDue = () => {
    return (
        <Box p={3} className="container">
            <Box p={3} className="height-100">
                <Grid className="height-100" container direction="row" alignItems="center" justify="center">
                    <Grid item className="empty-products align-center-important">
                        <Typography variant="h6" component="p">Your subscription has been expired.</Typography>
                        <Typography variant="subtitle2" component="p">Please download the Galla App from play store, and recharge/renew your subscription to continue.</Typography>
                        <Box mt={1}>
                            <Button variant="contained" className="background-blue" href="https://play.google.com/store/apps/details?id=com.galla.app" target="_blank" >Go to Galla App</Button>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    )
}

export default PaymentDue
