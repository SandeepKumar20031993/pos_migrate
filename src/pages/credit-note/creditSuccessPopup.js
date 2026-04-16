import React, { useRef } from 'react'
import { Avatar, Dialog, DialogContent, DialogActions, Grid, Typography, Box, Button } from '@material-ui/core';
import { HighlightOff, CheckCircle } from "@material-ui/icons";
import { useSelector } from "react-redux";
import ReactToPrint from 'react-to-print';
import CartHelper from '../../Helper/cartHelper';
import PrintCreditNote from './PrintCreditNote';

function CreditSuccessPopup({ toggle }) {
    const credit = useSelector((state) => state.credit);
    const componentRef = useRef(null);
    const credit_number = credit?.crRes?.creditnote_no;

    return (
        <React.Fragment>
            <Dialog open={credit.success} scroll={'body'} className={'dialog'}>
                <DialogActions>
                    <Avatar onClick={toggle} className={'popup-close-button'}>
                        <HighlightOff />
                    </Avatar>
                </DialogActions>
                <DialogContent>
                    <Grid container direction="row" justify={'center'} alignItems="center" spacing={2}>
                        <Grid item xs={12} className={'align-center color-green'}>
                            <CheckCircle />
                        </Grid>
                        <Grid item xs={12} className={'align-center color-green'}>
                            <Typography variant="h5" component="h5">Credit note generated successfully</Typography>
                            {credit_number ?
                                <Typography variant="h6" component="h6">Use `{credit_number}` to avail discount on next sale.</Typography>
                                : null
                            }
                        </Grid>
                        <Grid item xs={12} className={'align-center'}>
                            <Box className="width-100">
                                <ReactToPrint
                                    trigger={() => <Button size="large" variant="contained" color="secondary" className={'print-button'} disabled={CartHelper.isEmpty(credit.credData) || CartHelper.isEmpty(credit.crRes)}>PRINT CREDIT NOTE</Button>}
                                    content={() => componentRef.current}
                                />
                                <div style={{ display: "none" }}><PrintCreditNote ref={componentRef} /></div>
                            </Box>
                        </Grid>
                    </Grid>
                </DialogContent>
            </Dialog>
        </React.Fragment>
    )
}

export default CreditSuccessPopup
