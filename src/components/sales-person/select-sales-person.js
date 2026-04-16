import React, { Component } from 'react'
import { Box, Grid, FormControl, MenuItem, TextField, Typography } from '@material-ui/core'
import { connect } from "react-redux";
import PropTypes from 'prop-types';
import { updateSalesExe } from '../../redux/action/cartAction';

export class SelectSalesPerson extends Component {
    constructor(props) {
        super(props)

        this.state = {

        }
    }

    handleSalesPerson = event => {
        this.props.updateSalesExe(event.target.value)
    }

    render() {
        const { checkoutData, storeData, place } = this.props
        return (
            <>
                {place === "rightPanel" ?
                    <Box p={2}>
                        <Grid container direction="column" spacing={1}>
                            <Grid item xs>
                                <Typography variant="subtitle2" component="span" className="bold-i">
                                    Select sales person
                                </Typography>
                            </Grid>
                            <Grid item xs>
                                <Box>
                                    {storeData && storeData.data && storeData.data.salesexes ?
                                        <FormControl variant="outlined" className={'select-sales-person width-100'}>
                                            <TextField
                                                select
                                                label="Sales person"
                                                value={checkoutData.customer.salesExec}
                                                variant="outlined"
                                                size="small"
                                                onChange={this.handleSalesPerson}
                                            >
                                                <MenuItem value="">
                                                    <em>None</em>
                                                </MenuItem>
                                                {storeData.data.salesexes.map(exec => (
                                                    <MenuItem value={exec.person_id} key={exec.person_id}>{exec.first_name + " " + exec.last_name}</MenuItem>
                                                ))}
                                            </TextField>
                                        </FormControl>
                                        : null}
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                    :
                    null
                }
            </>
        )
    }
}

SelectSalesPerson.propTypes = {
    updateSalesExe: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
    checkoutData: state.checkoutData,
    storeData: state.storeData,
});

const mapActionsToProps = {
    updateSalesExe
}
export default connect(mapStateToProps, mapActionsToProps)(SelectSalesPerson)
