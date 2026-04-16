import React, { Component } from 'react'
import { Box, Paper, Grid, Typography, Table, TableHead, TableRow, TableCell, TableBody, TextField, TableFooter, Button } from '@material-ui/core';

import { connect } from "react-redux";
import PropTypes from 'prop-types';

import { saveDenomination, clearRegister, loadRegister, saveOpenRegister, saveOpenRegisterData } from '../../redux/action/openCloseRegisterAction';

import CartHelper from '../../Helper/cartHelper'
import StoreHelper from '../../Helper/storeHelper'
import { pageTitle } from '../../redux/action/themeAction';
import { customLoading, alert } from '../../redux/action/InterAction';

class openRegister extends Component {
    constructor(props) {
        super(props)

        this.state = {
        }
    }
    componentDidMount() {
        this.props.pageTitle('Open Register')
        this.props.clearRegister();
        this.props.loadRegister();
        this.saveDenomination();
        let counter = setInterval(() => {
            var opencloseData = this.props.openCloseTill;
            this.saveDenomination();
            if (opencloseData.fetched.success) {
                clearInterval(counter);
            }
        }, 100);
    }

    saveDenomination = () => {
        const { openCloseTill } = this.props;
        if (openCloseTill.fetched.success) {
            const { storeData, openCloseTill } = this.props;
            var denominations = storeData?.data?.configs?.denominations?.split(',');
            if (denominations.length > 0) {
                var denominationsArray = []
                var opening_denom = openCloseTill.fetched.opening_denom
                denominations.forEach((data) => {
                    var denom = {}
                    denom.denom = Number(data);
                    denom.count = 0
                    for (var i in opening_denom) {
                        if (Number(data) === Number(i)) {
                            denom.count = Number(opening_denom[i])
                        }
                    }
                    denom.total = denom.denom * denom.count;
                    denominationsArray.push(denom);
                })
                this.props.saveDenomination(denominationsArray)
            }
        }
    }


    handleQtyChange = (event, index) => {
        const { openCloseTill } = this.props;
        var demonState = openCloseTill.denom
        var denominations = []
        demonState.forEach((demondata, i) => {
            if (i === index) {
                demondata.count = event.target.value
                if (event.target.value !== '') {
                    demondata.count = Number(event.target.value)
                }
                demondata.total = demondata.denom * event.target.value
            }
            denominations.push(demondata);
        })
        this.props.saveDenomination(denominations)

        //CartHelper.getDenominations(event,index)
    }

    handleSubmit = event => {
        event.preventDefault();
        const { openCloseTill } = this.props;
        if (openCloseTill.denom.length > 0) {
            this.props.customLoading(true, "Saving your data");
            var formData = {
                demon_data: openCloseTill.denom,
                emp_id: StoreHelper.getUserId(),
                location_id: StoreHelper.getLocationId()
            }
            this.props.saveOpenRegister(formData)
                .then(res => res.json())
                .then(resData => {
                    if (resData.success) {
                        this.props.clearRegister();
                        this.props.loadRegister();
                        this.props.customLoading(false, "");
                        this.props.alert(true, resData.msg);
                    } else {
                        this.props.customLoading(false, "");
                        this.props.alert(true, resData.msg);
                    }
                })
                .catch(() => {
                    this.props.customLoading(false, "");
                })
        }
    }
    render() {
        const { openCloseTill } = this.props;
        //var denominationsData  = CartHelper.getDenominations();
        const opening_till = CartHelper.getCalculationOfDenoms(openCloseTill.denom);
        var closing_till = 0
        if (openCloseTill.fetched.success) {
            closing_till = Number(openCloseTill.fetched.info.closing_till);
        }

        return (
            <>
                {!CartHelper.isEmpty(openCloseTill.denom) ?
                    <Box p={2} className="height-100-overflow">
                        <Paper>
                            <form onSubmit={this.handleSubmit}>
                                <Box p={2}>
                                    <Grid container direction="row" justify="center" alignItems="center">
                                        <Grid item><Typography variant="h5" component="h5">Opening Till</Typography></Grid>
                                    </Grid>
                                    <Grid container direction="row" justify="center" alignItems="center" spacing={2}>
                                        <Grid item>
                                            <Typography variant="h6" component="span" className="color-lite">Opening Till Total: </Typography>
                                            <Typography variant="h6" component="span" color="secondary">{CartHelper.getCurrencyFormatted(opening_till)}</Typography>
                                        </Grid>
                                        <Grid item>
                                            <Typography variant="h6" component="span" className="color-lite">Closing Till Total: </Typography>
                                            <Typography variant="h6" component="span" color="secondary">{CartHelper.getCurrencyFormatted(closing_till)}</Typography>
                                        </Grid>
                                    </Grid>
                                    <Grid container direction="row" justify="center" alignItems="center">
                                        <Grid item><Typography variant="h6" component="h6">Please enter 0 if no currency count is found!</Typography></Grid>
                                    </Grid>
                                </Box>
                                <Table className={''} size="small" aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell align="left" colSpan={4}>{'Denomination'}</TableCell>
                                            <TableCell align="center" colSpan={4}>{'Currency Count'}</TableCell>
                                            <TableCell align="right" colSpan={4}>{'Currency Value'}</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {openCloseTill.denom.map((data, index) => (
                                            <TableRow key={index}>
                                                <TableCell colSpan={4}>
                                                    {CartHelper.getCurrencyFormatted(Number(data.denom))}
                                                </TableCell>
                                                <TableCell align="center" colSpan={4}>
                                                    <TextField type="number" className="margin-0 " value={data.count} InputLabelProps={{ shrink: true, }} margin="normal" inputProps={{ className: 'align-center-important' }} onChange={(event) => this.handleQtyChange(event, index)} />
                                                </TableCell>
                                                <TableCell align="right" colSpan={4}>{CartHelper.getCurrencyFormatted(data.total)}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                    <TableFooter>
                                        <TableRow>
                                            <TableCell align="right" colSpan={12}><Button size="large" variant="contained" color="secondary" type="submit" className="color-white">Save</Button></TableCell>
                                        </TableRow>
                                    </TableFooter>
                                </Table>
                            </form>
                        </Paper>
                    </Box>
                    : null}
            </>
        )
    }
}

openRegister.propTypes = {
    pageTitle: PropTypes.func.isRequired,
    saveDenomination: PropTypes.func.isRequired,
    loadRegister: PropTypes.func.isRequired,
    clearRegister: PropTypes.func.isRequired,
    saveOpenRegister: PropTypes.func.isRequired,
    saveOpenRegisterData: PropTypes.func.isRequired,
    customLoading: PropTypes.func.isRequired,
    alert: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
    openCloseTill: state.openCloseTill,
    storeData: state.storeData
});

export default connect(mapStateToProps, { pageTitle, customLoading, alert, saveDenomination, clearRegister, loadRegister, saveOpenRegister, saveOpenRegisterData })(openRegister);
