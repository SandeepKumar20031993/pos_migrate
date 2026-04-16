import React, { Component } from 'react'
import { Grid, Switch, IconButton, Button, TextField } from '@material-ui/core';
import { LocalOffer } from '@material-ui/icons';

class itemDiscount extends Component {
    constructor(props) {
        super(props)

        this.state = {
            openDisBox: false,
            discountSwitch: false,
            discountValue: ""
        }
    }


    openDisBox = () => {
        this.setState({
            openDisBox: !this.state.openDisBox
        })
    }
    handleDiscountSwitch = () => {
        this.setState({
            discountSwitch: !this.state.discountSwitch
        })
    }

    handleDiscount = (event) => {
        this.setState({
            discountValue: event.target.value
        })
    }

    saveDiscount = () => {
    }

    render() {
        const { openDisBox, discountSwitch, discountValue } = this.state
        return (
            <Grid spacing={1} container direction="row" justify="flex-end" alignItems="center">
                {openDisBox ?
                    <React.Fragment>
                        <Grid item>
                            {'FLAT'}
                            <Switch
                                checked={discountSwitch}
                                onChange={this.handleDiscountSwitch}
                                color="default"
                                size="small"
                            />
                            {'%'}
                        </Grid>
                        <Grid item>
                            <Grid container direction="row" justify="flex-end" alignItems="center">
                                <TextField
                                    className="width-100-px"
                                    label="Discount"
                                    variant="outlined"
                                    size="small"
                                    value={discountValue}
                                    onChange={this.handleDiscount}
                                />
                                <Button variant="contained" color="secondary" onClick={this.saveDiscount}>
                                    Save
                                </Button>
                            </Grid>
                        </Grid>
                    </React.Fragment>
                    : null
                }
                <Grid item>
                    <IconButton size="small" onClick={this.openDisBox}>
                        <LocalOffer fontSize="inherit" />
                    </IconButton>
                </Grid>
            </Grid>
        )
    }
}

export default itemDiscount
