import React, { Component } from 'react'
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
//import LinearProgress from '@material-ui/core/LinearProgress';

import { connect } from "react-redux";
import { Box } from '@material-ui/core';

class LoadingBox extends Component {
    constructor(props) {
        super(props)

        this.state = {

        }
    }

    render() {
        const { interAction } = this.props;
        return (
            <Dialog
                open={interAction.loading}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"

            >
                {/* <LinearProgress/> */}
                <DialogContent id="alert-dialog-description" className="padding-7">
                    <Box pr={2} pl={2}>
                        <Grid
                            container
                            direction="row"
                            justify="center"
                            alignItems="center"
                        >
                            <CircularProgress className="progress" color="secondary" /> <Typography variant="h6" className="padding-15">  Loading...</Typography>
                        </Grid>
                    </Box>
                </DialogContent>
            </Dialog>
        )
    }
}

const mapStateToProps = state => ({
    interAction: state.interAction,
});
export default connect(mapStateToProps, null)(LoadingBox)
