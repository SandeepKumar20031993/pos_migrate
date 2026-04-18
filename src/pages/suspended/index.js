import React, { useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import { Box, Paper, Grid, Typography, Table, TableHead, TableRow, TableCell, TableBody, IconButton, Button } from '@material-ui/core';
import { Delete } from '@material-ui/icons';
import { connect } from "react-redux";
import PropTypes from 'prop-types';
import { saveDenomination, clearRegister, loadRegister, saveCloseRegister } from '../../redux/action/openCloseRegisterAction';
import { restoreCartProduct, removeFromSuspended, clearSuspendedCart } from '../../redux/action/cartAction'
import CartHelper from '../../Helper/cartHelper'
//import StoreHelper from '../../Helper/storeHelper'
import { pageTitle } from '../../redux/action/themeAction';
import { alert } from '../../redux/action/InterAction';

const Index = ({ suspendedCart, cartProduct, history, pageTitle, alert, restoreCartProduct, removeFromSuspended, clearSuspendedCart }) => {

    useEffect(() => {
        pageTitle('Suspended Sale')
    }, [pageTitle]);

    const restoreSuspendedCart = (cartitems, index) => {
        if (CartHelper.isEmpty(cartProduct)) {
            cartitems.forEach(item => {
                restoreCartProduct(item);
            })
            removeFromSuspended(index);
            history.push(`${process.env.PUBLIC_URL}/`);
        } else {
            alert(true, 'Please clear or suspend your current cart then restore it.')
        }
    }
    const removeItem = (index) => {
        removeFromSuspended(index);
    }
    const clearSuspendedCartAll = () => {
        clearSuspendedCart();
        //this.props.history.push(`${process.env.PUBLIC_URL}/`);
    }

    return (
        <Box p={2} className="height-100-overflow">
            <Paper>
                <form>
                    <Box p={2}>
                        <Grid container direction="row" justify="center" alignItems="center">
                            <Grid item><Typography variant="h5" component="h5">{'Suspended Sale'}</Typography></Grid>
                        </Grid>
                    </Box>
                    <Table className={''} aria-label="simple table">
                        {suspendedCart.length > 0 ?
                            <TableHead>
                                <TableRow>
                                    <TableCell align="left" >{'SN'}</TableCell>
                                    <TableCell align="left" >{'Products'}</TableCell>
                                    <TableCell align="left" >{'Qty'}</TableCell>
                                    <TableCell align="right" style={{ width: 210 }}>{'Action'}</TableCell>
                                </TableRow>
                            </TableHead>
                            : null}
                        <TableBody>
                            {suspendedCart.map((susp_cart, index) => (
                                <TableRow key={index} >
                                    <TableCell align="left" >
                                        {index + 1}
                                    </TableCell>
                                    <TableCell align="left" >
                                        <Grid container direction="row">
                                            {susp_cart.map((item, i) => (
                                                <Grid item xs={3} key={i}>
                                                    <Box className={'items'} p={1} key={i}>
                                                        <Typography variant="body1" component="span">{i + 1}-{item.name}{'--'}{CartHelper.getCurrencyFormatted(Number(item.price).toFixed(2))}</Typography>
                                                    </Box>
                                                </Grid>
                                            ))}
                                        </Grid>
                                    </TableCell>
                                    <TableCell align="left" >
                                        {susp_cart.length}
                                    </TableCell>
                                    <TableCell align="left" >
                                        <Grid container direction="row" spacing={1}>
                                            <Grid item >
                                                <Box>
                                                    <Button size="large" variant="contained" color="secondary" type="button" className="color-white" onClick={() => restoreSuspendedCart(susp_cart, index)}>Restore</Button>
                                                </Box>
                                            </Grid>
                                            <Grid item >
                                                <Box>
                                                    <IconButton aria-label="delete" onClick={() => removeItem(index)}>
                                                        <Delete fontSize="small" />
                                                    </IconButton>
                                                </Box>
                                            </Grid>
                                        </Grid>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {suspendedCart.length > 0 ?
                                <TableRow>
                                    <TableCell align="right" colSpan={4}>
                                        <Grid container justify="flex-end">
                                            <Box>
                                                <Button color="secondary" onClick={clearSuspendedCartAll}>Clear All</Button>
                                            </Box>
                                        </Grid>
                                    </TableCell>
                                </TableRow>
                                :
                                <TableRow>
                                    <TableCell align="center" colSpan={4}>
                                        <Grid container justify="center">
                                            <Box p={2}>{' You have not suspended any cart.'}</Box>
                                        </Grid>
                                    </TableCell>
                                </TableRow>
                            }
                        </TableBody>
                    </Table>
                </form>
            </Paper>
        </Box>
    )
}
Index.propTypes = {
    pageTitle: PropTypes.func.isRequired,
    alert: PropTypes.func.isRequired,
    saveDenomination: PropTypes.func.isRequired,
    loadRegister: PropTypes.func.isRequired,
    clearRegister: PropTypes.func.isRequired,
    saveCloseRegister: PropTypes.func.isRequired,
    restoreCartProduct: PropTypes.func.isRequired,
    removeFromSuspended: PropTypes.func.isRequired,
    clearSuspendedCart: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
    openCloseTill: state.openCloseTill,
    storeData: state.storeData,
    suspendedCart: state.suspendedCart,
    cartProduct: state.cartProduct,
});
export default connect(mapStateToProps, { pageTitle, alert, saveDenomination, clearRegister, loadRegister, saveCloseRegister, restoreCartProduct, removeFromSuspended, clearSuspendedCart })(withRouter(Index))
