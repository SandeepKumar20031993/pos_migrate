import { Avatar, Box, Button, Card, CircularProgress, Fab, Grid, Tooltip, Typography } from "@material-ui/core";
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";


import cartHelper from '../../Helper/cartHelper';
import StoreHelper from '../../Helper/storeHelper';
import { clearCart } from "../../redux/action/cartAction";
import { saveToQueueCart, toggleQueueCart } from "../../redux/action/queueCartAction";
import { Close } from "@material-ui/icons";
import CloudQueueIcon from '@material-ui/icons/CloudQueue';
import QueueCartBlock from "./QueueCart/QueueCartBlock";
import { alert } from "../../redux/action/InterAction";
import TotalSummary from "./Summary/TotalSummary";
import SummaryPopup from "./Summary/SummaryPopup";

class QueueBustingButtons extends Component {

    constructor(props) {
        super()

        this.state = {
            buttonLoading: false,
            openSummaryPopup: false,
            popup_type: '',
        }
    }
    componentDidMount() {
    }
    clearCart = () => {
        this.props.clearCart();
        this.props.toggleQueueCart(false);


    };

    handleQueueCart = () => {
        this.setState({ buttonLoading: true })
        if (!cartHelper.isEmpty(this.props.cartProduct)) {

            this.props.saveToQueueCart(this.props.cartProduct).then((res) => res.json()).then((result) => {

                if (result?.success) {
                    this.props.alert(true, `Your Token is ${result?.data?.token}`)
                } else {

                    // token
                    this.props.alert(true, result?.msg)

                }
                this.setState({ buttonLoading: false })

            }).catch((err) => {
                this.setState({ buttonLoading: false })
                this.props.alert(true, `Something went wrong`)

            });

            this.props.clearCart();
        }
    }
    getButtonDisabled() {
        const isCartEmpty = cartHelper.isEmpty(this.props.cartProduct);

        return (isCartEmpty || this.state.buttonLoading) ? true : false
    }
    render() {
        const { cartProduct, displayIconText, queueCart, toggleQueueCart } = this.props;
        const { buttonLoading } = this.state
        let isButtonDisabled = this.getButtonDisabled()
        const isCartEmpty = cartHelper.isEmpty(cartProduct);

        const isQueueBustingEnabled = StoreHelper.isQueueBustingEnabled();
        return (
            <Fragment>

                <Box>
                    <Card
                        elevation={0}
                        className={"boxcardfix"}
                        square
                        style={{ borderRadius: "4px" }}>



                        <Grid spacing={1} container>
                            <Grid container item xs={12} alignContent="center"  >
                                <Grid item xs={3} className=" display-flex justify-space-between" >

                                    <Tooltip title="Clear Cart [Alt+C]" aria-label="Clear Cart">
                                        <span className="display-flex flex-column align-items-center">
                                            <Fab
                                                className={"fab-button-on-checkout"}
                                                id="cart-clear-btn"
                                                onClick={() => this.clearCart()}
                                                disabled={isCartEmpty}>
                                                <Close disabled={isCartEmpty} className={"close-icon checkout-action-icon"} />
                                                {/* <HighlightOff className={"close-icon"} /> */}

                                            </Fab>
                                            {displayIconText ? (
                                                <label htmlFor="cart-clear-btn" className="cursor-pointer">
                                                    <Typography
                                                        variant="subtitle2"
                                                        component="strong"
                                                        className="bold-i">
                                                        Clear Cart
                                                    </Typography>
                                                </label>
                                            ) : null}
                                        </span>
                                    </Tooltip>

                                </Grid>
                                <Grid item xs={3} className=" display-flex justify-space-between" >

                                    {isQueueBustingEnabled &&
                                        <Tooltip
                                            title="Open Queued Carts"
                                            aria-label="Suspend Cart">
                                            <span className="display-flex flex-column align-items-center">
                                                <Fab
                                                    className={"fab-button-on-checkout"}
                                                    id="cart-suspend-btn"
                                                    onClick={() => { this.props.toggleQueueCart(!this.props.queueCart.openQueueCart) }}
                                                // onDoubleClick={this.handleQueueCart}
                                                >
                                                    <Avatar className={"checkout-icons"}>
                                                        <CloudQueueIcon className={"cloud-queue-icon checkout-action-icon"} />
                                                    </Avatar>
                                                </Fab>
                                                {displayIconText ? (
                                                    <label htmlFor="cart-suspend-btn" className="cursor-pointer">
                                                        <Typography
                                                            variant="subtitle2"
                                                            component="strong"
                                                            className="bold-i">
                                                            Queue Cart
                                                        </Typography>
                                                    </label>
                                                ) : null}
                                            </span>
                                        </Tooltip>
                                    }

                                </Grid>
                                <Grid item xs={5} container direction="column" justify="space-between" >

                                    <TotalSummary handleClickOpen={() => { this.setState({ openSummaryPopup: true, popup_type: 'info' }) }} />
                                </Grid>
                            </Grid>


                            <Grid item xs={12} className="right-action-btn" >
                                <Button fullWidth title="Checkout" variant="contained" onClick={this.handleQueueCart} className="checkoutbutton height-100" id="checkout-btn" disabled={isButtonDisabled} startIcon={buttonLoading && <CircularProgress size={15} />}>
                                    {buttonLoading ? 'Generating' :
                                        'Generate Token'
                                    }
                                </Button>
                            </Grid>

                        </Grid>
                    </Card>
                </Box>

                {this.props.queueCart.openQueueCart ? <QueueCartBlock close={() => {
                    toggleQueueCart(queueCart.openQueueCart)
                }} open={() => {
                    toggleQueueCart(queueCart.openQueueCart)
                }} /> : null}

                {this.state.openSummaryPopup ? <SummaryPopup handleClose={() => { this.setState({ openSummaryPopup: false }) }} open={this.state.openSummaryPopup} popup_type={this.state.popup_type} openSucessPopup={() => { }} />
                    : null
                }

            </Fragment>
        );
    }
}
const mapStateToProps = (state) => ({
    cartProduct: state.cartProduct,
    queueCart: state.queueCart,
});
const mapActionsToProps = {
    clearCart,

    saveToQueueCart,
    toggleQueueCart,
    alert
};
export default connect(mapStateToProps,
    mapActionsToProps)(QueueBustingButtons);
