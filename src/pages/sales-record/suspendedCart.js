import React, { useCallback } from 'react'
import { Card, Box, Grid, Typography, CardActionArea, CardContent, Button, IconButton } from '@material-ui/core';
import { Delete } from '@material-ui/icons';
import CartHelper from '../../Helper/cartHelper';
import { useDispatch, useSelector } from "react-redux";
import { restoreCartProduct, removeFromSuspended, clearSuspendedCart } from '../../redux/action/cartAction'
import { alert } from '../../redux/action/InterAction'

function SuspendedCart(props) {
    const dispatch = useDispatch()
    const suspendedCart = useSelector((state) => state.suspendedCart)
    const cartProduct = useSelector((state) => state.cartProduct)

    const restoreSuspendedCart = useCallback((cartitems, index) => {
        if (CartHelper.isEmpty(cartProduct)) {
            cartitems.forEach(item => {
                dispatch(restoreCartProduct(item));
            })
            dispatch(removeFromSuspended(index));
            props.close();
        } else {
            dispatch(alert(true, 'Please clear or suspend your current cart then restore it.'))
        }
    }, [cartProduct, dispatch, props])

    const removeItem = useCallback((index) => {
        dispatch(removeFromSuspended(index));
    }, [dispatch])

    const clearAllSuspendedCart = useCallback(() => {
        dispatch(clearSuspendedCart());
    }, [dispatch])

    return (
        <Box className={'suspendedCart-block'} p={1}>
            {suspendedCart.length > 0 ?
                <>
                    {suspendedCart.map((suspCart, index) => (
                        <Grid container spacing={1} key={index} >
                            <Grid item xs={12}>
                                <Card >
                                    <CardContent className={'padding-0 position-relative'}>
                                        <Box className={'remove-Item'}>
                                            <IconButton aria-label="delete" onClick={() => removeItem(index)}>
                                                <Delete fontSize="small" />
                                            </IconButton>
                                        </Box>
                                    </CardContent>
                                    <CardActionArea onClick={() => restoreSuspendedCart(suspCart, index)}>
                                        <Grid container alignItems="center">
                                            <Grid item xs={3}>
                                                <Box p={2}>
                                                    {'Suspended Cart:-'}{index + 1}
                                                </Box>
                                            </Grid>
                                            <Grid item xs={8} container>
                                                {suspCart.map((item, itemIndex) => (
                                                    <Grid item xs={6} key={itemIndex}>
                                                        <Box className={'items'} >
                                                            <Typography variant="body1" component="span">{itemIndex + 1}-{item.name}</Typography>
                                                        </Box>
                                                    </Grid>
                                                ))}
                                            </Grid>
                                            <Grid item xs={1}>

                                            </Grid>
                                        </Grid>
                                    </CardActionArea>
                                </Card>
                            </Grid>
                        </Grid>
                    ))}
                    <Grid container justify="flex-end">
                        <Box>
                            <Button color="secondary" onClick={clearAllSuspendedCart}>Clear All</Button>
                        </Box>
                    </Grid>
                </>
                :
                <Grid container spacing={1} justify="center">
                    <Box p={2}>{' You have not suspended any cart.'}</Box>
                </Grid>
            }
        </Box>
    )
}

export default SuspendedCart
