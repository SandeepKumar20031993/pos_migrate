import React, { useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import { Box, Paper, Grid, List, ListItem, Divider, Typography, Table, TableBody, TableCell, TableHead, TableRow, TableFooter, Button, Dialog, DialogContent, DialogActions } from '@material-ui/core';
import { connect } from "react-redux";
import PropTypes from 'prop-types';
import CartHelper from '../../Helper/cartHelper'
import StoreHelper from '../../Helper/storeHelper'
import { pageTitle } from '../../redux/action/themeAction';
import { alert, loading } from '../../redux/action/InterAction';
import { returnOrder, clearReturningProducts } from "../../redux/action/returnAction";
import { clearCart } from "../../redux/action/cartAction";
import ProductList from './ReturnProductList'
import { clearExchangeData } from '../../redux/action/exchangeActions';


const CompleteReturn = (props) => {
    const [confirmBox, setConfirmBox] = React.useState(false);

    const { returnData, history, pageTitle: setPageTitle, loading: setLoading, alert: showAlert, returnOrder: handleReturn, clearReturningProducts, clearCart: clearCartAction, clearExchangeData } = props;

    useEffect(() => {
        if (!CartHelper.isEmpty(returnData) && returnData.completeReturn) {
            setPageTitle('Complete Return')
            clearCartAction();
        } else {
            history.push(`${process.env.PUBLIC_URL}/`);
        }
    }, []);

    const openConfirm = () => {
        setConfirmBox(true)
    }

    const handleReturnNow = () => {
        var formData = {}
        formData.sale_id = returnData.sale_id
        formData.location_id = StoreHelper.getLocationId()
        formData.sale_status = "COMPLETERETURN"
        setLoading(true);
        handleReturn(formData)
            .then(res => res.json())
            .then(res => {
                if (res.success) {
                    setLoading(false);
                    showAlert(true, "Order returned successfully");
                    history.push(`${process.env.PUBLIC_URL}/`);
                    clearReturningProducts();
                    setPageTitle('New Sale')
                } else {
                    setLoading(false);
                }
            }, err => {
                setLoading(false);
            })
    }

    const closeConfirm = () => {
        setConfirmBox(false)
    }

    const startNewSale = () => {
        clearReturningProducts();
        clearCartAction();
        clearExchangeData()
        setPageTitle('New Sale')
        history.push(`${process.env.PUBLIC_URL}/`);
    }

    return (
        <>
            {!CartHelper.isEmpty(returnData) && !CartHelper.isEmpty(returnData.data) && returnData.success && returnData.completeReturn ?
                <Box p={2} className="height-100-overflow">
                    <Paper>
                        <List>
                            <ListItem>
                                <Grid container direction="row" justify="space-between" alignItems="center">
                                    <Grid item>
                                        <Typography variant="subtitle1" component="strong">Amount : {CartHelper.getCurrencyFormatted(returnData.customer.amount)}</Typography>
                                    </Grid>
                                    <Grid item>
                                        <Typography variant="h6" component="strong">Returning Invoice : #{returnData.invoice}</Typography>
                                    </Grid>
                                    <Grid item>
                                        <Typography variant="subtitle1" component="strong">Date : {returnData.customer.order_date}</Typography>
                                    </Grid>
                                </Grid>
                            </ListItem>
                            <Divider />
                        </List>
                        {returnData.customer.phone_number || returnData.customer.person_id ?
                            <List>
                                <ListItem>
                                    <Grid container direction="row" justify="center" alignItems="center" spacing={3}>
                                        {returnData.customer.phone_number ?
                                            <Grid item>
                                                <Typography variant="subtitle1" component="strong">Mobile No : {returnData.customer.phone_number}</Typography>
                                            </Grid>
                                            : null}
                                    </Grid>
                                </ListItem>
                                <Divider />
                            </List>
                            : null}
                        <List>
                            <ListItem>
                                <Box p={3} className="width-100">
                                    <Grid container direction="row" className="width-100" spacing={3}>
                                        <Grid item xs>
                                            <Table className="width-100" >
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell variant="body">Name</TableCell>
                                                        <TableCell variant="body" align="right">Barcode</TableCell>
                                                        <TableCell variant="body" align="right">Qty</TableCell>
                                                        <TableCell variant="body" align="right">Price</TableCell>
                                                        <TableCell variant="body" align="right">Tax</TableCell>
                                                        <TableCell variant="body" align="right">Row Total</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {returnData.data.map(product => (
                                                        <ProductList product={product} key={product.id} />
                                                    ))}
                                                </TableBody>
                                                <TableFooter>
                                                    <TableRow>
                                                        <TableCell rowSpan={5} colSpan={4} />
                                                        <TableCell variant="footer" align="right">Subtotal</TableCell>
                                                        <TableCell variant="body" align="right">{CartHelper.getCurrencyFormatted(returnData.sales_data.subtotal)}</TableCell>
                                                    </TableRow>
                                                    {returnData.sales_data.applyDisWithoutTax === "1" ?
                                                        <TableRow>
                                                            <TableCell variant="footer" align="right">Discount</TableCell>
                                                            <TableCell variant="body" align="right">{CartHelper.getCurrencyFormatted(returnData.sales_data.discount)}</TableCell>
                                                        </TableRow>
                                                        : null}
                                                    <TableRow>
                                                        <TableCell variant="footer" align="right">Tax</TableCell>
                                                        <TableCell variant="body" align="right">{CartHelper.getCurrencyFormatted(returnData.sales_data.tax)}</TableCell>
                                                    </TableRow>
                                                    {returnData.sales_data.applyDisWithoutTax === "0" ?
                                                        <TableRow>
                                                            <TableCell variant="footer" align="right">Discount</TableCell>
                                                            <TableCell variant="body" align="right">{CartHelper.getCurrencyFormatted(returnData.sales_data.discount)}</TableCell>
                                                        </TableRow>
                                                        : null}
                                                    <TableRow>
                                                        <TableCell variant="footer" align="right">Net Total</TableCell>
                                                            <TableCell variant="body" align="right" className="bold">
                                                                <Typography variant="h6" component="b">
                                                                    {CartHelper.getCurrencyFormatted(returnData.sales_data.nettotal)}
                                                                </Typography>
                                                            </TableCell>
                                                        </TableRow>
                                                    </TableFooter>
                                                </Table>
                                                <Grid container direction="row" justify="flex-end" alignItems="center">
                                                    <Grid item>
                                                        <Box pt={2} pr={2}>
                                                            <Button size="large" type="button" onClick={this.startNewSale}>Start New Sale</Button>
                                                        </Box>
                                                    </Grid>
                                                    <Grid item >
                                                        <Box pt={2}>
                                                            <Button size="large" type="button" variant="contained" color="secondary" onClick={this.openConfirm}>Return Now</Button>
                                                        </Box>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </ListItem>
                            </List>
                        </Paper>
                    </Box>
                    :
                    null
                }
                <Dialog
                    open={confirmBox}
                    onClose={closeConfirm}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogContent id="alert-dialog-description">
                        <Typography variant="h6">Returning invoice #{returnData.invoice}.</Typography>
                        <Typography variant="subtitle2">Are you sure?</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={closeConfirm}>Not now</Button>
                        <Button onClick={handleReturnNow} color="secondary" variant="contained">Sure, Return</Button>
                    </DialogActions>
                </Dialog>
            </>
        )
}

CompleteReturn.propTypes = {
    pageTitle: PropTypes.func.isRequired,
    alert: PropTypes.func.isRequired,
    loading: PropTypes.func.isRequired,
    returnOrder: PropTypes.func.isRequired,
    clearReturningProducts: PropTypes.func.isRequired,
    clearCart: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
    returnData: state.returnData
});

const mapActionsToProps = {
    pageTitle,
    alert,
    loading,
    returnOrder,
    clearReturningProducts,
    clearCart,
    clearExchangeData
}
export default connect(mapStateToProps, mapActionsToProps)(withRouter(CompleteReturn))
