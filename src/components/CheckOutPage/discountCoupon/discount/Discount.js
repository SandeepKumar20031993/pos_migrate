import React, { useState, useEffect } from 'react';
import { Box, Grid, Typography, Card, CardContent, TextField, Switch } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import {
    isDiscountCouponApplied,
    applyCoupon,
    applyPercentoff,
    applyFlatoff,
    clearAppliedDiscount,
    fetchCoupon,
} from '../../../../redux/action/discountAction';
import CartHelper from '../../../../Helper/cartHelper';
import { loading, alert } from '../../../../redux/action/InterAction';
import StoreHelper from '../../../../Helper/storeHelper';

const Discount = () => {
    const dispatch = useDispatch();
    const discount = useSelector((state) => state.discount);
    const { coupon, flatoff, percentoff, apply } = discount;

    const [discountSwitch, setDiscountSwitch] = useState(true);
    const [globalDiscountEnabled, setGlobalDiscountEnabled] = useState(false);

    useEffect(() => {
        // Use the correct helper and do not compare to 1, just use the boolean
        setGlobalDiscountEnabled(StoreHelper.isEnableGlobalDiscount());
        if (apply && flatoff !== '') {
            setDiscountSwitch(true);
        }
    }, [apply, flatoff]);

    const handleDiscountSwitch = () => {
        dispatch(applyFlatoff(""));
        dispatch(applyPercentoff(""));
        setDiscountSwitch((prev) => !prev);
        if (!apply) dispatch(clearAppliedDiscount());
    };

    const handleFlatoff = (event) => {
        dispatch(isDiscountCouponApplied(false));
        let discount = Number(event.target.value);
        const discountableAmount = CartHelper.getDefaultRuleAppliedTotal();
        if (discount > 0) {
            discount = discount <= discountableAmount ? discount : discountableAmount;
            dispatch(applyFlatoff(discount));
        }
        if (discount) {
            dispatch(applyPercentoff(""));
        } else {
            dispatch(clearAppliedDiscount());
        }
    };

    const handlePercentof = (event) => {
        dispatch(isDiscountCouponApplied(false));
        const percent = Number(event.target.value);
        if (percent > 0 && percent <= 100) {
            dispatch(applyPercentoff(percent));
        }
        if (event.target.value) {
            dispatch(applyFlatoff(""));
        } else {
            dispatch(clearAppliedDiscount());
        }
    };

    const discountableAmount = CartHelper.getDefaultRuleAppliedTotal();

    // Only render if global discount is enabled
    if (!globalDiscountEnabled) return null;

    return (
        <Box className="width-100">
            <Card className="width-100">
                <CardContent>
                    <Box>
                        <Grid container direction="row" justifyContent="space-between" alignItems="center">
                            <Grid item>
                                <Typography variant="h6" component="span" className="color-lite">
                                    Discount
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Typography variant="body2" component="span" className="color-lite switch-button">
                                    %
                                    <Switch
                                        checked={discountSwitch}
                                        onChange={handleDiscountSwitch}
                                        color="default"
                                        size="small"
                                        disabled={coupon !== ''}
                                    />
                                    FLAT
                                </Typography>
                            </Grid>
                        </Grid>
                    </Box>

                    <Box>
                        {discountSwitch ? (
                            <TextField
                                id="flatoff"
                                type="number"
                                label="Flat off"
                                value={flatoff}
                                onChange={handleFlatoff}
                                disabled={coupon !== ''}
                                helperText={`Max discount will be ${CartHelper.getCurrencyFormatted(discountableAmount.toFixed(2))}`}
                            />
                        ) : (
                            <TextField
                                id="percentoff"
                                type="number"
                                label="% off"
                                value={percentoff}
                                onChange={handlePercentof}
                                disabled={coupon !== ''}
                            />
                        )}
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
};

Discount.propTypes = {
    isDiscountCouponApplied: PropTypes.func,
    applyCoupon: PropTypes.func,
    applyPercentoff: PropTypes.func,
    clearAppliedDiscount: PropTypes.func,
    applyFlatoff: PropTypes.func,
    fetchCoupon: PropTypes.func,
    loading: PropTypes.func,
    alert: PropTypes.func,
};

export default Discount;