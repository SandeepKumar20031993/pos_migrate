import React, { Component } from 'react'
import { connect } from "react-redux";
import PropTypes from 'prop-types';
import { Box } from '@material-ui/core';
import { loadCustomer, save_customer_data } from '../../../redux/action/customerAction';
import MapStoreCard from "./MapStoreCard"
import RewardPointBox from "./RewardPointBox"
import RewardHelper from "../../../Helper/rewardHelper"


class RewardContainer extends Component {

    constructor (props) {
        super(props)

        this.state = {
            showBoxes: false
        }
    }

    componentDidMount() {
        const { checkoutData } = this.props
        var form = {}
        form.phone = checkoutData.customer.phone_number
        this.props.loadCustomer(form)
            .then(res => res.json())
            .then(res => {
                if (res.success) {
                    this.setState({ showBoxes: true });
                    this.props.save_customer_data(res);
                } else {
                    this.setState({ showBoxes: true });
                }
            }).catch(err => {
                this.setState({ showBoxes: true });
            });
    }

    render() {
        const { showBoxes } = this.state
        const { customerData } = this.props
        var isMapped = RewardHelper.isPackageMapped(customerData);

        return (
            <>
                {showBoxes ?
                    <Box mt={2}>
                        {isMapped ?
                            <RewardPointBox />
                            :
                            <MapStoreCard />
                        }
                    </Box>
                    : null
                }
            </>
        )
    }

}


RewardContainer.propTypes = {
    loadCustomer: PropTypes.func.isRequired,
    save_customer_data: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
    storeData: state.storeData,
    customerData: state.customerData,
    checkoutData: state.checkoutData
});

const mapActionsToProps = {
    loadCustomer,
    save_customer_data
}


export default connect(mapStateToProps, mapActionsToProps)(RewardContainer);
