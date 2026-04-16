import React, { Component } from 'react'
import { Box, Grid, Typography, Paper, Card, CardContent, TextField, Switch, Button } from '@material-ui/core';
import { connect } from "react-redux";
import PropTypes from 'prop-types';
import { isDiscountCouponApplied, applyCoupon, applyPercentoff, applyFlatoff, clearAppliedDiscount } from '../../redux/action/discountAction';
import CartHelper from '../../Helper/cartHelper';
import { loading, alert } from '../../redux/action/InterAction'

class DiscountCoupon extends Component {
    constructor(props) {
        super(props)

        this.state = {
            discountSwitch: false,
            disableDiscount: false,
            disableCoupon: false
        }
    }

    componentDidMount() {
        const { apply, flatoff } = this.props.discount;
        if (apply && flatoff !== '') {
            this.setState({
                discountSwitch: true
            })
        }
    }

    handleDiscountSwitch = () => {
        const { apply } = this.props.discount;
        this.setState((prevState) => ({
            discountSwitch: !prevState.discountSwitch
        }));

        if (!apply) {
            this.props.clearAppliedDiscount();
        }
    }

    handleFlatoff = event => {
        const value = event.target.value;
        this.props.isDiscountCouponApplied(false);

        if (Number(value) > 0 && Number(value) <= CartHelper.getTotalAmountWithoutRule()) {
            this.props.applyFlatoff(value);
            this.props.applyPercentoff('');
        } else if (!value) {
            this.props.clearAppliedDiscount();
        }
    }

    handlePercentof = event => {
        const value = event.target.value;
        this.props.isDiscountCouponApplied(false);

        if (Number(value) > 0 && Number(value) <= 100) {
            this.props.applyPercentoff(value);
            this.props.applyFlatoff('');
            this.setState({
                disableCoupon: true
            });
        } else if (!value) {
            this.setState({
                disableCoupon: false
            });
            this.props.clearAppliedDiscount();
        }
    }

    handleDiscountForm = event => {
        event.preventDefault();
        const { discountSwitch } = this.state;
        const { flatoff, percentoff } = this.props.discount;

        if (flatoff !== '' || percentoff !== '') {
            if (!discountSwitch && percentoff !== '') {
                this.props.applyFlatoff('');
            }

            if (discountSwitch && flatoff !== '') {
                this.props.applyPercentoff('');
            }

            this.props.isDiscountCouponApplied(true);
            this.props.toggle();
        }
    }

    clearAppliedDiscount = () => {
        this.props.clearAppliedDiscount();
        this.setState({
            disableCoupon: false,
            disableDiscount: false
        });
        this.props.toggle();
    }

    render() {
        const { discountSwitch } = this.state
        const { apply, coupon, flatoff, percentoff } = this.props.discount

        return (
            <Box className={'discountCoupon-Box'} id={'discountCoupon-Box'}>
                <Paper>
                    <Box p={1}>
                        <form onSubmit={this.handleDiscountForm} className={'discountCoupon-form'}>
                            <Grid container direction="row" spacing={1} justifyContent="center">
                                <Grid item xs={12} container alignItems='center' justifyContent="space-between">
                                    <Card className={'width-100'}>
                                        <CardContent>
                                            <Box>
                                                <Grid container direction="row" justifyContent="space-between">
                                                    <Box pr={1}>
                                                        <Typography variant={'h6'} component="span" className={'color-lite'}>{'Discount'}</Typography>
                                                    </Box>
                                                    <Typography variant={'body2'} component="span" className={'color-lite switch-button'}>
                                                        {'%'}
                                                        <Switch
                                                            checked={discountSwitch}
                                                            onChange={this.handleDiscountSwitch}
                                                            color="default"
                                                            size="small"
                                                            disabled={coupon !== ''}
                                                        />
                                                        {'FLAT'}
                                                    </Typography>
                                                </Grid>
                                            </Box>

                                            {discountSwitch ? (
                                                <TextField
                                                    id="flatoff"
                                                    label="Flat off"
                                                    value={flatoff}
                                                    onChange={this.handleFlatoff}
                                                    disabled={coupon !== ''}
                                                    helperText={"Max discount will be " + CartHelper.getCurrencyFormatted(CartHelper.getTotalAmountWithoutRule())}
                                                />
                                            ) : (
                                                <TextField
                                                    id="percentoff"
                                                    label="% off"
                                                    value={percentoff}
                                                    onChange={this.handlePercentof}
                                                    disabled={coupon !== ''}
                                                />
                                            )}
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid item xs={12} container justifyContent="flex-end">
                                    {apply ? (
                                        <Button type="button" variant="outlined" onClick={this.clearAppliedDiscount}>Clear</Button>
                                    ) : (
                                        <Button type="submit" variant="outlined">Apply</Button>
                                    )}
                                </Grid>
                            </Grid>
                        </form>
                    </Box>
                </Paper>
            </Box>
        )
    }
}

DiscountCoupon.propTypes = {
    isDiscountCouponApplied: PropTypes.func.isRequired,
    applyCoupon: PropTypes.func.isRequired,
    applyPercentoff: PropTypes.func.isRequired,
    clearAppliedDiscount: PropTypes.func.isRequired,
    applyFlatoff: PropTypes.func.isRequired,
    loading: PropTypes.func.isRequired,
    alert: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
    suspendedCart: state.suspendedCart,
    cartProduct: state.cartProduct,
    discount: state.discount,
});

const mapActionsToProps = {
    isDiscountCouponApplied,
    applyCoupon,
    applyPercentoff,
    applyFlatoff,
    clearAppliedDiscount,
    loading,
    alert
}

export default connect(mapStateToProps, mapActionsToProps)(DiscountCoupon);
