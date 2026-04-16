import React, { Component } from 'react'
import { Card, Box, Grid, Typography, CardActionArea, CardContent, Button, IconButton } from '@material-ui/core';
import { Delete } from '@material-ui/icons';
import { connect } from "react-redux";
import { loadQueueCart, toggleQueueCart } from '../../../redux/action/queueCartAction';
import { alert } from '../../../redux/action/InterAction';
import CartHelper from '../../../Helper/cartHelper';
import { loadToken, restoreCartProduct } from '../../../redux/action/cartAction';

class QueueCartBlock extends Component {
    constructor(props) {
        super(props)

        this.state = {

        }
    }
    componentDidMount() {
        this.props.loadQueueCart()
    }

    componentDidCatch() {

    }
    restoreQueueCart = (data, index) => {
        let path = window.location.pathname?.split('/').pop();
        if (path === 'token') {
            return;
        }
        if (CartHelper.isCartEmpty()) {
            this.props.loadToken({
                id: data?.id, token_no: data?.token_no
            })
            let cartitems = data?.cart
            cartitems.forEach(item => {
                this.props.restoreCartProduct(item);
            })
            // this.props.removeFromSuspended(index);
            this.props.toggleQueueCart(false);
        } else {
            this.props.alert(true, 'Please clear or suspend your current cart then restore it.')
        }

    }
    removeItem = (item) => {
        console.log("remove :", item);
    }
    clearSuspendedCart = () => {
        console.log('clear cart');
    }

    render() {
        const { queueCart } = this.props;
        let queueCarts = queueCart && queueCart?.data ? queueCart?.data : [];
        // console.log("queueCarts", queueCarts);
        return (
            <Box className={'suspendedCart-block'} p={1}>
                {queueCarts && queueCarts.length > 0 ?
                    <>
                        <Typography style={{ marginBottom: '10px' }} >Queued carts</Typography>
                        {queueCarts?.map((item, index) => (
                            <Grid container spacing={1} key={index} >
                                <Grid item xs={12}>
                                    <Card >
                                        <CardContent className={'padding-0 position-relative'}>
                                            <Box className={'remove-Item'}>
                                                {/* <IconButton aria-label="delete" onClick={() => this.removeItem(item)}>
                                                    <Delete fontSize="small" />
                                                </IconButton> */}
                                            </Box>
                                        </CardContent>
                                        <CardActionArea onClick={() => { this.restoreQueueCart(item) }}>
                                            <Grid container alignItems="center">
                                                <Grid item xs={3}>
                                                    <Box p={2}>
                                                        {item?.token_no}
                                                    </Box>
                                                </Grid>
                                                <Grid item xs={8} container>
                                                    {item?.cart.map((item, i) => (
                                                        <Grid item xs={6} key={i}>
                                                            <Box className={'items'} >
                                                                <Typography variant="body1" component="span">{i + 1}-{item.name}</Typography>
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
                        {/* <Grid container justify="flex-end">
                            <Box>
                                <Button color="secondary" onClick={this.clearSuspendedCart}>Clear All</Button>
                            </Box>
                        </Grid> */}

                    </>
                    :
                    <Grid container spacing={1} justify="center">
                        <Box p={2}>{' You have not Queued any cart.'}</Box>
                    </Grid>
                }
            </Box>

        )
    }
}

const mapStateToProps = state => ({
    queueCart: state.queueCart,
});


const mapActionsToProps = {
    alert,
    loadQueueCart,
    restoreCartProduct,
    toggleQueueCart,
    loadToken
}
export default connect(mapStateToProps, mapActionsToProps)(QueueCartBlock)
