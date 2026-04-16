import React, { Component } from "react";
//import ReactDOM from 'react-dom'
import {
    Box,
    Grid,
    Paper,
    Button,
    TextField,
    FormGroup,
    FormLabel,
    Card,
    CardContent,
} from "@material-ui/core";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import CartHelper from "../../../Helper/cartHelper";
import { loading, alert, handleMiscellaneousBox } from "../../../redux/action/InterAction";

// Delivery Redux Actions
import {
    openDeliveryBox,
    applyDelivery,
} from "../../../redux/action/deliveryAction";

// import StoreHelper from "../../Helper/storeHelper";
import StoreHelper from "../../../Helper/storeHelper";
import { applyPackaging } from "../../../redux/action/miscellaneousAction";

class ApplyDelivery extends Component {
    constructor (props) {
        super(props);

        this.state = {
            delivery: this.props.delivery?.delivery,
            packaging: this.props.miscellaneous.packaging,
        };
    }
    handleDelivery = (event) => {
        this.setState({ delivery: event.target.value });
    };

    handleSubmit = (event) => {
        event.preventDefault();

        this.props.applyDelivery(Number(this.state.delivery));
        this.props.handleMiscellaneousBox(false)

    };

    handleApplyPackaging = () => {
        this.props.applyPackaging(Number(this.state.packaging))
        this.props.handleMiscellaneousBox(false)
    }

    componentDidMount() {
        const delivery = this.props.delivery;
        if (delivery.deliveryApplied) {
            this.setState({ delivery: delivery.delivery });
        }
    }

    resetFields = () => { };

    render() {
        const isMiscellaneousChargesEnables = Boolean(Number(StoreHelper.isMiscellaneousChargesEnables()));
        const isDeliveryChargesEnables = Boolean(Number(StoreHelper.isDeliveryChargesEnables()));

        return (
            <Card
                style={{ padding: "16px 8px" }}
                className={"discountCoupon-Box"}
                id={"applyDelivery-Box"}>
                <CardContent style={{ padding: 2 }}>
                    {isDeliveryChargesEnables && (
                        <Grid
                            container
                            direction="row"
                            spacing={1}
                            justify="space-between"
                            style={{ marginBottom: 4 }}>
                            <form onSubmit={this.handleSubmit}>

                                <TextField
                                    autoFocus
                                    id="deliveryCharges"
                                    variant="outlined"
                                    type="number"
                                    size="small"
                                    label="Delivery"
                                    onChange={this.handleDelivery}
                                    value={this.state.delivery}
                                />

                                <Button
                                    type="submit"
                                    variant="contained"
                                    style={{ backgroundColor: "#f2f2f2" }}>
                                    {" "}
                                    Apply{" "}
                                </Button>
                            </form>
                        </Grid>
                    )}

                    {isMiscellaneousChargesEnables && (
                        <Grid
                            container
                            direction="row"
                            style={{ marginTop: "24px" }}
                            spacing={1}
                            justify="space-between">
                            <form onSubmit={this.handleApplyPackaging} >

                                <TextField
                                    autoFocus
                                    id="Miscellaneous"
                                    variant="outlined"
                                    type="number"
                                    size="small"
                                    label="Packaging"
                                    onChange={(event) => {
                                        this.setState({ packaging: event.target.value });
                                    }}
                                    value={this.state.packaging}
                                />

                                <Button
                                    type="submit"
                                    variant="contained"
                                    style={{ backgroundColor: "#f2f2f2" }}>
                                    {" "}
                                    Apply{" "}
                                </Button>
                            </form>
                        </Grid>
                    )}
                </CardContent>
            </Card>
        );
    }
}
ApplyDelivery.propTypes = {
    loading: PropTypes.func.isRequired,
    alert: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
    cartProduct: state.cartProduct,
    checkoutData: state.checkoutData,
    delivery: state.delivery,
    packaging: state.packaging,
    state: state,
    miscellaneous: state.miscellaneous
});

const mapActionsToProps = {
    openDeliveryBox,
    applyDelivery,

    loading,
    alert,
    applyPackaging,
    handleMiscellaneousBox
};
export default connect(mapStateToProps, mapActionsToProps)(ApplyDelivery);
