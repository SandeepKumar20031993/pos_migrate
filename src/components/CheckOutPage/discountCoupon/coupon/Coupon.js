import React, { useEffect, useState } from 'react'
import { Box, Grid, Typography, Card, CardContent, TextField, Switch } from '@material-ui/core';
import { useDispatch, useSelector } from "react-redux";
import { isDiscountCouponApplied, applyCoupon, isCreditNoteCoupon, updateInvoice } from '../../../../redux/action/discountAction';
import { updateCPhone } from '../../../../redux/action/cartAction';


const Coupon = () => {
    const dispatch = useDispatch();
    const discount = useSelector((state) => state.discount);
    const checkoutData = useSelector((state) => state.checkoutData);
    const [isMobileValid, setIsMobileValid] = useState(false);

    const coupon = discount.coupon;
    const invoice = discount.invoice;
    const flatoff = discount.flatoff;
    const percentoff = discount.percentoff;
    const is_credit_note = discount.is_credit_note;
    const mobile = checkoutData?.customer?.phone_number || "";

    useEffect(() => {
        setIsMobileValid(!isNaN(mobile) && String(mobile).length === 10);
    }, [mobile]);

    const handleCouponSwitch = () => {
        dispatch(isCreditNoteCoupon(Boolean(!is_credit_note)));
    };

    const handleCoupon = (event) => {
        dispatch(isDiscountCouponApplied(false));
        dispatch(applyCoupon(event.target.value));
    };

    const changePhone = (event) => {
        dispatch(updateCPhone(event.target.value));
    };

    const changeInvoice = (event) => {
        dispatch(updateInvoice(event.target.value));
    };

    return (
        <Box className={'width-100'}>
            <Card className={'width-100'}>
                <CardContent>
                    <Box>
                        <Grid container direction="row" justifyContent="space-between" alignItems="center">
                            <Grid item>
                                <Typography variant={'h6'} component="span" className={'color-lite'}>{'Coupon'}
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Typography variant={'body2'} component="span" className={'color-lite switch-button'}>
                                    <Switch
                                        checked={is_credit_note}
                                        onChange={handleCouponSwitch}
                                        color="default"
                                        size="small"
                                        disabled={flatoff !== '' || percentoff !== ''}
                                    />
                                    {'Credit'}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Box>
                    {is_credit_note ?
                        <Box>
                            <Box>
                                <TextField
                                    id="discount-coupon"
                                    name="coupon"
                                    className={'width-100'}
                                    size="small"
                                    label="Credit Note No"
                                    value={coupon || ""}
                                    onChange={handleCoupon}
                                    disabled={flatoff !== '' || percentoff !== ''}
                                />
                            </Box>
                            {coupon && coupon !== '' ?
                                <Box pt={2}>
                                    <TextField
                                        required={coupon !== ''}
                                        id="invoice-number"
                                        name="invoice"
                                        className={'width-100'}
                                        size="small"
                                        label="Invoice No"
                                        value={invoice || ""}
                                        onChange={changeInvoice}
                                        error={!invoice}
                                    />
                                </Box>
                                : null
                            }
                        </Box>
                        :
                        <Box>
                            <Box>
                                <TextField
                                    id="discount-coupon"
                                    name="coupon"
                                    className={'width-100'}
                                    size="small"
                                    label="Coupon"
                                    value={coupon || ""}
                                    onChange={handleCoupon}
                                    disabled={flatoff !== '' || percentoff !== ''}
                                />
                            </Box>
                            {coupon && coupon !== '' ?
                                <Box pt={2}>
                                    <TextField
                                        required={coupon !== ''}
                                        id="mobile-number"
                                        name="phone"
                                        className={'width-100'}
                                        size="small"
                                        label="Mobile"
                                        type="number"
                                        value={mobile || ""}
                                        onChange={changePhone}
                                        error={!isMobileValid}
                                    />
                                </Box>
                                : null
                            }
                        </Box>
                    }
                </CardContent>
            </Card>
        </Box>
    )
}

export default Coupon
