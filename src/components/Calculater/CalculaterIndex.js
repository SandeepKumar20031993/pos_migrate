import React, { Component } from 'react';

import ResultComponent from './Result';
import KeyPadComponent from "./CalCulaterButton";
import { Grid, Card } from '@material-ui/core';
import { withStyles } from "@material-ui/core/styles";

import { connect } from "react-redux";
import PropTypes from 'prop-types';
import { calculateTenderAmount } from '../../redux/action/cartAction';
//import CartHelper from '../../Helper/cartHelper'

const Styles = theme => ({
    calculatercard: {
        width: 248,
        height: '100%',
        minHeight: 143,
        float: 'right',
    }
});

class CalculaterIndex extends Component {

    constructor() {
        super();

        this.state = {
            result: ""
        }
    }

    componentDidMount() {
        this.props.calculateTenderAmount('');
    }

    onClick = button => {
        if (button >= 100 && button <= 2000) {
            this.addthisValue(button);
        }
        else if (button === "CE") {
            this.reset()
        }
        else if (button === "C") {
            this.backspace()
        }
        else {
            this.setState({
                result: this.state.result + button
            })
            this.props.calculateTenderAmount(this.state.result + button);
        }
    };

    onChange = (data) => {
        this.setState({
            result: data
        })
        this.props.calculateTenderAmount(data);
    }

    addthisValue = (value) => {
        var newValue = Number(this.state.result) + Number(value)
        this.setState({
            result: newValue
        })
        this.props.calculateTenderAmount(newValue);
    }

    reset = () => {
        this.setState({
            result: ''
        })
        this.props.calculateTenderAmount('');
    }

    backspace = () => {
        var newValue = this.state.result.toString().slice(0, -1);
        this.setState({
            result: newValue
        })
        this.props.calculateTenderAmount(newValue);
    }


    render() {
        const { classes, checkoutData } = this.props;
        return (
            <>
                <Grid container direction="row">
                    {checkoutData.data.payment_amount > 0 ?
                        <>
                            <Grid item xs={12}>
                                <ResultComponent result={this.state.result} onChange={this.onChange} />
                            </Grid>
                            <Grid item xs={12}>
                                <Card className={classes.calculatercard}>
                                    <KeyPadComponent onClick={this.onClick} />
                                </Card>
                            </Grid>
                        </>
                        : null
                    }
                </Grid>

            </>
        );
    }
}


//properties defines
CalculaterIndex.propTypes = {
    calculateTenderAmount: PropTypes.func.isRequired
}
//maping state to props
const mapStateToProps = state => ({
    checkoutData: state.checkoutData
});
export default connect(mapStateToProps, { calculateTenderAmount })(withStyles(Styles)(CalculaterIndex));