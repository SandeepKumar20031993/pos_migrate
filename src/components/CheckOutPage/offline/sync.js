import React, { Component } from 'react'
import { connect } from "react-redux";
import PropTypes from 'prop-types';
import StoreHelper from '../../../Helper/storeHelper'
import { Typography } from '@material-ui/core'
import { syncOfflineOrder, removeOfflineOrder } from '../../../redux/action/offlineAction'
import { alert } from '../../../redux/action/InterAction'
import { getOfflineOrderFromDb } from "../../../services/offline-service"

class sync extends Component {
    constructor(props) {
        super(props)
        this.state = {
            status: '',
        }
    }
    componentDidMount() {
        this.handleStartSyncing()
        window.addEventListener('online', this.handleConnectionChange);
        window.addEventListener('offline', this.handleConnectionChange);
        getOfflineOrderFromDb();
    }

    handleStartSyncing = () => {
        this.timer = setInterval(() => {
            if (StoreHelper.isOnline()) {
                this.setOfflineLabel()
                const { offlineData } = this.props
                if (offlineData.orders.length > 0) {
                    this.syncOfflineOrders()
                }
            } else {
                this.setOfflineLabel()
            }
        }, 60000);
    }

    handleConnectionChange = (event) => {
        if (event.type === "online") {
            console.log("You are now back online.");
            this.setOfflineLabel()
            const { offlineData } = this.props
            if (offlineData.orders.length > 0) {
                this.syncOfflineOrders()
            }
        }
        if (event.type === "offline") {
            console.log("You lost connection.");
            this.setOfflineLabel()
        }
    }

    setOfflineLabel = () => {
        const { offlineData } = this.props
        if (StoreHelper.isOnline()) {
            if (offlineData.orders.length > 0) {
                this.setState({ status: offlineData.orders.length + ' OFFLINE' })
            } else {
                this.setState({ status: '' })
            }
        } else {
            if (offlineData.length > 0) {
                this.setState({ status: offlineData.orders.length + ' OFFLINE' })
            } else {
                this.setState({ status: 'OFFLINE' })
            }
        }
    }

    syncOfflineOrders = () => {
        setTimeout(() => {
            const { offlineData } = this.props
            if (StoreHelper.isOnline() && !offlineData.hold && offlineData.orders.length > 0) {
                this.setState({ status: 'Syncing... ' })
                //taking first order
                var order = offlineData.orders[0]
                this.props.syncOfflineOrder(order)
                    .then(res => res.json())
                    .then(resData => {
                        clearInterval(this.timer)
                        this.setOfflineLabel()
                        if (resData.success) {
                            this.removeAndStartSyncing(order);
                        } else {
                            this.startAgainSyncing();
                        }
                    })
                    .catch(err => {
                        clearInterval(this.timer)
                        this.setOfflineLabel()
                        this.startAgainSyncing();
                    })
            } else {
                this.setOfflineLabel()
            }
        }, 5000)
    }

    startAgainSyncing = () => {
        setTimeout(() => {
            this.syncOfflineOrders();
        }, 5000)
    }

    removeAndStartSyncing = (r_order) => {
        if (r_order) {
            const { offlineData } = this.props;
            const orders = (offlineData.orders && offlineData.orders.length > 0) ? offlineData.orders : [];
            const index = orders.findIndex(order => order.off_ref_no === r_order.off_ref_no);
            if (index >= 0) {
                this.props.removeOfflineOrder(index)
                setTimeout(() => {
                    this.syncOfflineOrders();
                })
            } else {
                this.startAgainSyncing();
            }
        } else {
            this.startAgainSyncing();
        }
    }

    subscribeClosingAlert = () => {
        window.onbeforeunload = (e) => {
            e = e || window.event;
            // For IE and Firefox prior to version 4
            if (e) {
                e.returnValue = 'Sure?';
            }
            // For Safari
            this.alertBeforeClosingPage(e);
            return 'Sure?';
        };
    }

    alertBeforeClosingPage = (e) => {
        e.preventDefault();
        const { offlineData } = this.props;
        if (!StoreHelper.isOnline() && offlineData.orders.length > 0) {
            this.props.alert(true, "Please connect to internet to sync the Offline orders.");
        } else if (StoreHelper.isOnline() && offlineData.orders.length > 0) {
            this.props.alert(true, "Please sync the Offline orders before closing.");
        } else {
            this.props.alert(true, "Please make sure, All offline orders have been synced.");
        }
    }


    componentDidUpdate() {
        const { offlineData } = this.props;
        if (offlineData.orders.length > 0) {
            this.subscribeClosingAlert();
        } else {
            if (!StoreHelper.isOnline()) {
                this.subscribeClosingAlert();
            }
        }
    }

    componentWillUnmount() {
        window.removeEventListener('online', this.handleConnectionChange);
        window.removeEventListener('offline', this.handleConnectionChange);
        window.removeEventListener('beforeunload', this.alertBeforeClosingPage);
    }

    render() {
        const { status } = this.state
        return (
            <div className="status-water-mark">
                <Typography variant="h6" component="span">
                    {status}
                </Typography>
            </div>
        )
    }
}
sync.propTypes = {
    syncOfflineOrder: PropTypes.func.isRequired,
    removeOfflineOrder: PropTypes.func.isRequired,
    alert: PropTypes.func.isRequired
}
const mapStateToProps = state => ({
    offlineData: state.offlineData
});
const actions = {
    syncOfflineOrder,
    removeOfflineOrder,
    alert
};
export default connect(mapStateToProps, actions)(sync)
