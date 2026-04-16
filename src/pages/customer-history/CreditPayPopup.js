import React, { useCallback, useState } from 'react'
import { Avatar, Dialog, DialogContent, DialogActions, Grid, Typography, Box, Button, DialogTitle, TextField, MenuItem } from '@material-ui/core';
import { HighlightOff } from "@material-ui/icons";
import CartHelper from '../../Helper/cartHelper';
import { updateCreditPayments } from '../../redux/action/creditAction';
import { useDispatch } from "react-redux";
import { loading, alert } from '../../redux/action/InterAction';

export function CreditPayPopup({ popup, credit, closePopup }) {
    const dispatch = useDispatch();
    const [amountPaid, setAmountPaid] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState("CASH");

    const updateCredit = useCallback(() => {
        const form = {};
        form.phone = credit.customer_phone
        form.opening_bal = credit.credit_amt
        form.paid_amt = amountPaid
        form.closing_bal = credit.credit_amt - amountPaid
        form.payment_method = paymentMethod
        console.log(form);
        if (amountPaid > 0) {
            dispatch(loading(true))
            dispatch(updateCreditPayments(form))
                .then(res => res.json())
                .then(res => {
                    dispatch(loading(false))
                    if (res && res.success) {
                        setAmountPaid(0);
                        console.log(res);
                        dispatch(alert(true, res.msg));

                        closePopup();

                    }
                })
                .catch(() => {
                    dispatch(loading(false))
                })
        } else {
            dispatch(alert(true, "Please Enter the Paid Amount"));
        }

    }, [amountPaid, closePopup, credit, dispatch, paymentMethod]);

    const isDisabled = ((credit.credit_amt - amountPaid) < 0);

    return (
        <React.Fragment>
            <Dialog open={popup} scroll={'body'} className={'dialog'} onClose={closePopup}>
                <DialogActions>
                    <Avatar onClick={closePopup} className={'popup-close-button'}>
                        <HighlightOff />
                    </Avatar>
                </DialogActions>
                <DialogTitle>{"Customer : "} {credit.customer_name}</DialogTitle>

                <DialogContent>
                    <Box pt={1} pb={1}>
                        {credit ?
                            <>
                                <Box >
                                    <Grid container spacing={2} alignItems="center">
                                        <Grid item xs>
                                            <Typography variant="body2" component="span">Total Credit Amount</Typography>
                                        </Grid>
                                        <Grid item xs={3} className="align-right">
                                            <Typography variant="body2" component="span">{CartHelper.getCurrencyFormatted(credit.credit_amt)}</Typography>
                                        </Grid>
                                    </Grid>
                                    <Grid container spacing={2} alignItems="center">
                                        <Grid item xs>
                                            <Typography variant="body2" component="span">Enter Paid Amount</Typography>
                                        </Grid>
                                        <Grid item xs={4} className="align-right">
                                            <TextField
                                                label=""
                                                id="standard-basic"
                                                value={amountPaid}
                                                className="width-100"
                                                size="small"
                                                type="number"
                                                onChange={(e) => setAmountPaid(e.target.value)}
                                            />
                                        </Grid>
                                    </Grid>
                                    <Grid container spacing={2} alignItems="center">
                                        <Grid item xs>
                                            <Typography variant="body2" component="span">Credit Balance</Typography>
                                        </Grid>
                                        <Grid item xs={4} className="align-right">
                                            <Typography variant="body2" component="span">{CartHelper.getCurrencyFormatted(credit.credit_amt - amountPaid)}</Typography>
                                        </Grid>
                                    </Grid>
                                    <Grid container spacing={2} alignItems="center">
                                        <Grid item xs>
                                            <Typography variant="body2" component="span">Payment Method</Typography>
                                        </Grid>
                                        <Grid item xs={4} className="align-right">
                                            <TextField
                                                select
                                                variant="outlined"
                                                value={paymentMethod}
                                                onChange={(event) => setPaymentMethod(event.target.value)}
                                                className="width-100"
                                                inputProps={{
                                                    className: "padding-6 width-100"
                                                }}
                                            >
                                                <MenuItem value="CASH" key="CASH">CASH</MenuItem>
                                                <MenuItem value="CARD" key="CARD">CARD</MenuItem>
                                                <MenuItem value="UPI" key="UPI">UPI</MenuItem>
                                            </TextField>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </>
                            :
                            null
                        }
                    </Box>
                </DialogContent>

                <DialogActions>
                    <Grid item xs className='align-right'>
                        <Box>
                            <Button
                                onClick={updateCredit}
                                className="search-button"
                                variant="contained"
                                color="secondary"
                                size="large"
                                disabled={isDisabled}
                            >
                                Pay
                            </Button>
                        </Box>
                    </Grid>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    )
}

export default CreditPayPopup
