import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { Box, Paper, Grid, List, ListItem, Divider, Typography, Table, TableBody, TableCell, TableHead, TableRow, TableFooter, Button } from '@material-ui/core';
//import { ArrowForwardIos } from '@material-ui/icons';
import { connect } from "react-redux";
import PropTypes from 'prop-types';
import CartHelper from '../../Helper/cartHelper'
import StoreHelper from '../../Helper/storeHelper'
import { pageTitle, openCancelPopup } from '../../redux/action/themeAction';
import { alert, loading } from '../../redux/action/InterAction';
import { saveCancelInvoice, loadCancelInvoiceData, clearCancelInvoice, cancelNow } from '../../redux/action/cancelAction';
import ProductList from './productList'


class index extends Component {
    constructor(props) {
        super(props)

        this.state = {
        }
    }

    componentDidMount() {
        if (StoreHelper.canCancelInvoice() === 1) {
            this.props.pageTitle('Cancel Invoice')
            const { cancelData } = this.props
            if (CartHelper.isEmpty(cancelData.data)) {
                this.props.openCancelPopup(true);
            }
        }
    }
    handleCancelNow = () => {
        const { cancelData } = this.props
        var formData = {}
        formData.sale_id = cancelData.sale_id
        formData.user = StoreHelper.getUserId()
        this.props.cancelNow(formData);
        this.props.loading(true);
        //this.props.clearCancelInvoice();
    }

    componentDidUpdate() {
        if (StoreHelper.canCancelInvoice() === 1) {
            const { cancelData } = this.props
            if (cancelData.message !== undefined && cancelData.message !== '') {
                this.props.loading(false);
                this.props.alert(true, cancelData.message)
                this.props.clearCancelInvoice();
                //this.props.history.push(`${process.env.PUBLIC_URL}/`);
            }
        }
    }

    render() {
        const { cancelData } = this.props
        return (
            <>
                {StoreHelper.canCancelInvoice() === 1 ?
                    <>
                        {!CartHelper.isEmpty(cancelData) && cancelData.success && !CartHelper.isEmpty(cancelData.data) ?
                            <Box p={2} className="height-100-overflow">
                                <Paper>
                                    <List>
                                        <ListItem>
                                            <Grid container direction="row" justify="space-between" alignItems="center">
                                                <Grid item>
                                                    <Typography variant="subtitle1" component="strong">Amount : {CartHelper.getCurrencyFormatted(cancelData.customer.amount)}</Typography>
                                                </Grid>
                                                <Grid item>
                                                    <Typography variant="h6" component="strong">Invoice : #{cancelData.invoice}</Typography>
                                                </Grid>
                                                <Grid item>
                                                    <Typography variant="subtitle1" component="strong">Date : {cancelData.customer.order_date}</Typography>
                                                </Grid>
                                            </Grid>
                                        </ListItem>
                                        <Divider />
                                    </List>
                                    {cancelData.customer.phone_number || cancelData.customer.person_id ?
                                        <List>
                                            <ListItem>
                                                <Grid container direction="row" justify="center" alignItems="center" spacing={3}>
                                                    {cancelData.customer.phone_number ?
                                                        <Grid item>
                                                            <Typography variant="subtitle1" component="strong" className="color-lite">Mobile No : {cancelData.customer.phone_number}</Typography>
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
                                                                {cancelData.data.map(product => (
                                                                    <ProductList product={product} key={product.id} />
                                                                ))}
                                                            </TableBody>
                                                            <TableFooter>
                                                                <TableRow>
                                                                    <TableCell rowSpan={5} colSpan={4} />
                                                                    <TableCell variant="footer" align="right">Subtotal</TableCell>
                                                                    <TableCell variant="body" align="right">{CartHelper.getCurrencyFormatted(cancelData.sales_data.subtotal)}</TableCell>
                                                                </TableRow>
                                                                {cancelData.sales_data.applyDisWithoutTax === "1" ?
                                                                    <TableRow>
                                                                        <TableCell variant="footer" align="right">Discount</TableCell>
                                                                        <TableCell variant="body" align="right">{CartHelper.getCurrencyFormatted(cancelData.sales_data.discount)}</TableCell>
                                                                    </TableRow>
                                                                    : null}
                                                                <TableRow>
                                                                    <TableCell variant="footer" align="right">Tax</TableCell>
                                                                    <TableCell variant="body" align="right">{CartHelper.getCurrencyFormatted(cancelData.sales_data.tax)}</TableCell>
                                                                </TableRow>
                                                                {cancelData.sales_data.applyDisWithoutTax === "0" ?
                                                                    <TableRow>
                                                                        <TableCell variant="footer" align="right">Discount</TableCell>
                                                                        <TableCell variant="body" align="right">{CartHelper.getCurrencyFormatted(cancelData.sales_data.discount)}</TableCell>
                                                                    </TableRow>
                                                                    : null}
                                                                <TableRow>
                                                                    <TableCell variant="footer" align="right">Net Total</TableCell>
                                                                    <TableCell variant="body" align="right">{CartHelper.getCurrencyFormatted(cancelData.sales_data.nettotal)}</TableCell>
                                                                </TableRow>
                                                            </TableFooter>
                                                        </Table>
                                                        <Grid container direction="row" justify="flex-end">
                                                            <Grid item>
                                                                <Box pt={2}>
                                                                    <Button size="large" type="button" variant="contained" color="secondary" onClick={this.handleCancelNow}>Cancel Now</Button>
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

                            <Box p={2} className="container">
                                <Paper className="height-100">
                                    <Grid container direction="row" justify="center" alignItems="center" className="height-100">
                                        <Grid item>
                                            <Box p={3}>
                                                <Button size="large" type="button" variant="contained" color="secondary" onClick={() => this.props.openCancelPopup(true)}>Enter Invoice</Button>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Paper>
                            </Box>
                        }
                    </>
                    :
                    <Box p={2} className="container">
                        <Paper className="height-100">
                            <Grid container direction="row" justify="center" alignItems="center" className="height-100">
                                <Grid item>
                                    <Box p={3}>
                                        <Typography variant="subtitle1" component="strong">You are not authorised to cancel any invoice</Typography>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Box>
                }
            </>
        )
    }
}

index.propTypes = {
    pageTitle: PropTypes.func.isRequired,
    openCancelPopup: PropTypes.func.isRequired,
    alert: PropTypes.func.isRequired,
    loading: PropTypes.func.isRequired,
    saveCancelInvoice: PropTypes.func.isRequired,
    loadCancelInvoiceData: PropTypes.func.isRequired,
    clearCancelInvoice: PropTypes.func.isRequired,
    cancelNow: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
    storeData: state.storeData,
    cancelData: state.cancelData,
});
export default connect(mapStateToProps, { pageTitle, openCancelPopup, alert, loading, saveCancelInvoice, loadCancelInvoiceData, clearCancelInvoice, cancelNow })(withRouter(index))
