import React, { Component } from 'react'
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { alert } from '../../redux/action/InterAction';

import { connect } from "react-redux";
import PropTypes from 'prop-types';

class AlertBox extends Component {
    constructor(props) {
        super(props)

        this.state = {

        }
    }

    closeAlert = () => {
        this.props.alert(false, '');
    }

    render() {
        const { interAction } = this.props
        return (
            <Dialog
                open={interAction.alert}
                onClose={this.closeAlert}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogContent id="alert-dialog-description">
                    <Grid
                        container
                        direction="row"
                        justify="center"
                        alignItems="center"
                    >
                        <Typography variant="h6">{interAction.alertMessage}</Typography>
                    </Grid>
                </DialogContent>
                <DialogActions align="center">
                    <Grid
                        container
                        direction="row"
                        justify="center"
                        alignItems="center"
                    >
                        <Grid item xs>
                            <Button onClick={this.closeAlert}>Close</Button>
                        </Grid>
                    </Grid>
                </DialogActions>
            </Dialog>

        )
    }
}

AlertBox.propTypes = {
    alert: PropTypes.func.isRequired,
}
const mapStateToProps = state => ({
    interAction: state.interAction,
});
export default connect(mapStateToProps, { alert })(AlertBox)
