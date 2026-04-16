import React, { Component } from 'react';
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
const Styles = theme => ({




});

class ResultComponent extends Component {
    constructor(props) {
        super(props)

        this.state = {

        }
        this.textInput = React.createRef();
    }
    componentDidUpdate() {
        const { customerData } = this.props
        if (!customerData.redeemamount) {
            this.textInput.current.focus();
        }
    }

    render() {
        let { result } = this.props;
        return (
            <div className="result">
                <input className="Calculaterinput" type="text" value={result} onChange={e => this.props.onChange(e.target.value)} ref={this.textInput} />
            </div>
        )
            ;
    }
}

const mapStateToProps = state => ({
    checkoutData: state.checkoutData,
    customerData: state.customerData
});

const mapActionsToProps = {

}

export default connect(mapStateToProps, mapActionsToProps)(withStyles(Styles)(ResultComponent));