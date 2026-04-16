import React, { Component } from 'react'
import { Box, Grid, Typography } from '@material-ui/core';

export class UnAuthorised extends Component {
    render() {
        return (
            <Box p={3} className="container">
                <Box p={3} className="height-100">
                    <Grid className="height-100" container direction="row" alignItems="center" justify="center">
                        <Grid item className="empty-products align-center-important">
                            <Typography variant="h6" component="span">You are not authorised.</Typography>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        )
    }
}

export default UnAuthorised
