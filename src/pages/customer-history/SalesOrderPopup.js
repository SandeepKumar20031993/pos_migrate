import React, { useCallback, useRef } from 'react'
import { Avatar, Dialog, DialogContent, DialogActions, Grid, Typography, Divider, Box, Button } from '@material-ui/core';
import { HighlightOff } from "@material-ui/icons";
import CartHelper from '../../Helper/cartHelper';
import ReactToPrint from 'react-to-print';
import SalesReportPrint from '../../components/SalesReport/Print/SalesReportPrint';

export function SalesOrderPopup({ popup, order, closePopup, printBtn }) {
    const printRef = useRef(null);
    const componentRef = useRef(null);

    const applyDisAfterTax = useCallback((salesOrder) => {
        let isApplying = false;
        if (salesOrder.sales_data.applyDisWithoutTax && Number(salesOrder.sales_data.applyDisWithoutTax)) {
            isApplying = true;
        }
        return isApplying;
    }, []);

    return (
        <React.Fragment>
            <Dialog open={popup} scroll={'body'} className={'dialog'} onClose={closePopup}>
                <DialogActions>
                    <Avatar onClick={closePopup} className={'popup-close-button'}>
                        <HighlightOff />
                    </Avatar>
                </DialogActions>
                <DialogContent>
                    <Box pt={2} pb={1}>
                        <Grid container spacing={2} >
                            <Grid item xs >
                                <Typography variant="body2" component="span">Name</Typography>
                            </Grid>
                            <Grid item xs={2} className="align-right">
                                <Typography variant="body2" component="span">MRP</Typography>
                            </Grid>
                            <Grid item xs={2} className="align-right">
                                <Typography variant="body2" component="span">Price</Typography>
                            </Grid>
                            <Grid item xs={2} className="align-right">
                                <Typography variant="body2" component="span">Qty</Typography>
                            </Grid>
                            <Grid item xs={2} className="align-right">
                                <Typography variant="body2" component="span">Row Total</Typography>
                            </Grid>
                        </Grid>
                    </Box>
                    <Divider />
                    <Box>
                        {order && order.data && order.data.length > 0 ?
                            <>
                                {order.data.map((item, index) => (
                                    <Box key={index}>
                                        <Box pt={1} pb={1}>
                                            <Grid container spacing={2} alignItems="center">
                                                <Grid item xs>
                                                    <Typography variant="body2" component="span">{item.name}</Typography>
                                                </Grid>
                                                <Grid item xs={2} className="align-right">
                                                    <Typography variant="body2" component="span">{CartHelper.getCurrencyFormatted(item.actualMrp)}</Typography>
                                                </Grid>
                                                <Grid item xs={2} className="align-right">
                                                    <Typography variant="body2" component="span">{CartHelper.getCurrencyFormatted(item?.item_price)}</Typography>
                                                </Grid>
                                                <Grid item xs={2} className="align-right">
                                                    <Typography variant="body2" component="span">{item.qty}</Typography>
                                                </Grid>
                                                <Grid item xs={2} className="align-right">
                                                    <Typography variant="body2" component="span">{CartHelper.getCurrencyFormatted(item?.item_price * item?.qty)}</Typography>
                                                </Grid>
                                            </Grid>
                                        </Box>
                                        <Divider />
                                    </Box>
                                ))}
                            </>
                            :
                            null
                        }
                    </Box>
                    {order && order.sales_data && !CartHelper.isEmpty(order.sales_data) ?
                        <Box pt={1}>
                            <Grid container spacing={2}>
                                <Grid item xs className="align-right">
                                    <Typography variant="body2" component="span">Subtotal</Typography>
                                </Grid>
                                <Grid item xs={3} className="align-right">
                                    <Typography variant="body2" component="span">{CartHelper.getCurrencyFormatted(order.sales_data.subtotal)}</Typography>
                                </Grid>
                            </Grid>
                            {!applyDisAfterTax(order) && Number(order.sales_data.discount) > 0 ?
                                <Grid container spacing={2}>
                                    <Grid item xs className="align-right">
                                        <Typography variant="body2" component="span">Discount</Typography>
                                    </Grid>
                                    <Grid item xs={3} className="align-right">
                                        <Typography variant="body2" component="span">{CartHelper.getCurrencyFormatted(order.sales_data.discount)}</Typography>
                                    </Grid>
                                </Grid>
                                :
                                null
                            }
                            {Number(order.sales_data.tax) > 0 ?
                                <Grid container spacing={2} >
                                    <Grid item xs className="align-right">
                                        <Typography variant="body2" component="span">Tax</Typography>
                                    </Grid>
                                    <Grid item xs={3} className="align-right">
                                        <Typography variant="body2" component="span">{CartHelper.getCurrencyFormatted(order.sales_data.tax)}</Typography>
                                    </Grid>
                                </Grid>
                                :
                                null
                            }
                            {applyDisAfterTax(order) && Number(order.sales_data.discount) > 0 ?
                                <Grid container spacing={2}>
                                    <Grid item xs className="align-right">
                                        <Typography variant="body2" component="span">Discount</Typography>
                                    </Grid>
                                    <Grid item xs={3} className="align-right">
                                        <Typography variant="body2" component="span">{CartHelper.getCurrencyFormatted(order.sales_data.discount)}</Typography>
                                    </Grid>
                                </Grid>
                                :
                                null
                            }
                            {Number(order.sales_data?.delivery_charge) > 0 && order.sales_data?.delivery_charge &&
                                <Grid container spacing={2} >
                                    <Grid item xs className="align-right">
                                        <Typography variant="body2" component="span">Delivery Charge</Typography>
                                    </Grid>
                                    <Grid item xs={3} className="align-right">
                                        <Typography variant="body2" component="span">{CartHelper.getCurrencyFormatted(order.sales_data?.delivery_charge)}</Typography>
                                    </Grid>
                                </Grid>}
                            {Number(order.sales_data?.misc_charge) > 0 && order.sales_data?.misc_charge &&
                                <Grid container spacing={2} >
                                    <Grid item xs className="align-right">
                                        <Typography variant="body2" component="span">Packaging Charge</Typography>
                                    </Grid>
                                    <Grid item xs={3} className="align-right">
                                        <Typography variant="body2" component="span">{CartHelper.getCurrencyFormatted(order.sales_data?.misc_charge)}</Typography>
                                    </Grid>
                                </Grid>}
                            <Grid container spacing={2} >
                                <Grid item xs className="align-right">
                                    <Typography variant="subtitle1" component="span" className="bold-i">Total</Typography>
                                </Grid>
                                <Grid item xs={3} className="align-right">
                                    <Typography variant="subtitle1" component="span" className="bold-i">{CartHelper.getCurrencyFormatted(order.sales_data.nettotal)}</Typography>
                                </Grid>
                            </Grid>
                        </Box>
                        : null
                    }
                    {Number(order.sales_data?.credit_balance) !== 0 &&
                        <Box>
                            <Typography> Paid Amount :  {CartHelper.getCurrencyFormatted(Number(order.sales_data?.nettotal) - Number(order.sales_data?.credit_balance))}</Typography>
                            <Typography> Credit balance : {CartHelper.getCurrencyFormatted(order.sales_data?.credit_balance)} </Typography>
                        </Box>
                    }
                </DialogContent>
                {printBtn ?
                    <DialogActions>
                        <Grid item xs className='align-center'>
                            <Box>
                                <ReactToPrint
                                    ref={printRef}
                                    trigger={() => <Button variant="contained" color="secondary" className={'success-page-button print-button'}>PRINT</Button>}
                                    content={() => componentRef.current}
                                />
                            </Box>
                        </Grid>
                    </DialogActions>
                    :
                    null
                }
                <div style={{ display: "none" }}><SalesReportPrint ref={componentRef} /></div>
            </Dialog>
        </React.Fragment>
    )
}

export default SalesOrderPopup
