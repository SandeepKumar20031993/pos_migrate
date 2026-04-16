import React, { Component } from 'react'
import { Dialog, DialogContent, DialogActions, Box, Grid, Typography, TextField, MenuItem, Button } from '@material-ui/core';
import { connect } from "react-redux";
import PropTypes from 'prop-types';
import { toogleLocationPopup, setLocation, updateLocationId, updateLocationName } from '../../redux/action/storeCounterAction';
// import storeHelper from '../../Helper/storeHelper';
// import cartHelper from '../../Helper/cartHelper';

class StoreLocations extends Component {
    constructor(props) {
        super(props)

        this.state = {
            location: "",
            error: false
        }
    }

    handleLocationChange = (event) => {
        this.setState({
            location: event.target.value
        })
    }

    saveLocations = () => {
        const { location } = this.state
        if (location.loc_id && location.loc_name) {
            this.props.setLocation(location)
            this.props.updateLocationId(location.loc_id)
            this.props.updateLocationName(location.loc_name)
            this.props.toogleLocationPopup(false)
            window.location.reload()
        } else {
            this.setState({
                error: true
            })
        }
    }

    render() {
        const { storeCounter, storeData } = this.props
        const { location, error } = this.state
        return (
            <Dialog
                open={(storeCounter.location && storeCounter.location.popup) ? storeCounter.location.popup : false}
                fullWidth={true}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                className="width-100"
            >
                <DialogContent id="alert-dialog-description" className="padding-7 width-100">
                    <Grid container direction="row" justify="space-between" >
                        <Grid item xs={12}>
                            <Box className="width-100" p={1}>
                                <Typography variant="h6" component="span">{'Please select store'}</Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12}>
                            {storeData && storeData.data && storeData.data.data && storeData.data.data.storeLocs ?
                                <Box className="width-100" p={1}>
                                    <TextField
                                        select
                                        label="Select store location"
                                        value={location}
                                        variant="outlined"
                                        onChange={this.handleLocationChange}
                                        className="width-100"
                                        error={error}
                                    >
                                        {storeData.data.data.storeLocs.map((loc, index) => (
                                            <MenuItem value={loc} key={index}>{loc.loc_name}</MenuItem>
                                        ))}

                                    </TextField>
                                </Box>
                                : null}
                        </Grid>
                    </Grid>
                    <DialogActions>
                        <Button onClick={this.saveLocations}>{'Save'}</Button>
                    </DialogActions>
                </DialogContent>
            </Dialog>
        )
    }
}

StoreLocations.propTypes = {
    toogleLocationPopup: PropTypes.func.isRequired,
    setLocation: PropTypes.func.isRequired,
    updateLocationId: PropTypes.func.isRequired,
    updateLocationName: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
    storeCounter: state.storeCounter,
    storeData: state.storeData,
});
export default connect(mapStateToProps, { toogleLocationPopup, setLocation, updateLocationId, updateLocationName })(StoreLocations)
