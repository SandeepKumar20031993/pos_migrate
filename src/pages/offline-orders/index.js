import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { Box, Paper, Button, Typography } from '@material-ui/core';
import { connect } from "react-redux";
import PropTypes from 'prop-types';
// import CartHelper from '../../Helper/cartHelper'
import StoreHelper from '../../Helper/storeHelper'
import { pageTitle } from '../../redux/action/themeAction';
import { alert, loading } from '../../redux/action/InterAction'
import { syncOfflineOrder, removeOfflineOrder } from '../../redux/action/offlineAction'
import { DataGrid } from '@material-ui/data-grid';
import { offlineOrderData, getOfflineOrderFromDb, removeOfflineOrderInIndexDB, clearOfflineOrderInIndexDB } from "../../services/offline-service"


class index extends Component {
    constructor(props) {
        super(props)

        this.state = {
            syncOrder: false,
            orders: []
        }
    }

    componentDidMount() {
        this.props.pageTitle('Offline Orders Log');
        getOfflineOrderFromDb();
        this.intervalTimer = setInterval(() => {
            if (offlineOrderData && offlineOrderData.length > 0) {
                this.updateOrdersFromDb();
                clearInterval(this.intervalTimer);
            }
        })
    }

    componentDidUpdate() {
        clearTimeout(this.timeoutTimer);
        this.timeoutTimer = setTimeout(() => {
            this.updateOrdersFromDb();
            clearTimeout(this.timeoutTimer);
        }, 1000);
    }

    componentWillUnmount() {
        clearTimeout(this.timeoutTimer);
        clearInterval(this.intervalTimer);
    }

    updateOrdersFromDb = () => {
        let orderData = (offlineOrderData && offlineOrderData.length > 0) ? offlineOrderData : []
        this.setState({
            orders: orderData
        })
    }

    handleGetRowId = (e) => {
        return (e.off_ref_no) ? e.off_ref_no : Math.random();
    }

    renderPayment = (e) => {
        let row = e.row
        let paymentAmt = row.payments.payment_amount;
        return StoreHelper.getCurrencyFormatted(paymentAmt)
    }

    renderPaymentType = (e) => {
        return e.row.payments.payment_type;
    }

    renderCartItem = (e) => {
        let row = e.row
        let cart = (row.cart && row.cart.length > 0) ? row.cart : [];
        let itemNames = []
        cart.forEach((item) => {
            itemNames.push(item.name);
        });
        let joinedNames = itemNames.join(', ');
        return (
            <Typography variant="body2" component="span" className="wrap-text">
                {joinedNames}
            </Typography>
        );
    }

    syncOrder = (order) => {
        if (order) {
            this.props.loading(true);
            let orderData = { ...order };
            delete orderData['id'];
            this.props.syncOfflineOrder(orderData)
                .then(res => res.json())
                .then(resData => {
                    this.props.loading(false);
                    if (resData.success) {
                        removeOfflineOrderInIndexDB(order);
                        setTimeout(() => {
                            this.updateOrdersFromDb();
                        }, 2000);
                    } else {
                        if (resData.msg) {
                            this.props.alert(true, resData.msg)
                        } else {
                            this.props.alert(true, "Facing some issue while syncing.")
                        }
                    }
                })
                .catch(err => {
                    this.props.loading(false);
                    this.props.alert(true, "Something went wrong.")
                })
        }
    }

    clearAllOfflineOrder = () => {
        clearOfflineOrderInIndexDB()
        setTimeout(() => {
            this.updateOrdersFromDb();
        }, 2000);
    }

    renderAction = (e) => {
        return (
            <Button className="background-blue" variant="contained" size="small" onClick={() => this.syncOrder(e.row)}>
                Sync Order
            </Button>
        )
    }



    render() {
        const { orders } = this.state;
        const columns =
            [
                { field: 'off_ref_no', headerName: 'Order No', flex: 1 },
                { field: 'order_date', headerName: 'Order Date', flex: 1 },
                { field: 'payment_type', headerName: 'Payment Type', flex: 1, renderCell: (this.renderPaymentType) },
                { field: 'payment_amount', headerName: 'Payment Amount', flex: 1, renderCell: (this.renderPayment) },
                { field: 'cart', headerName: 'Cart Items', flex: 1, renderCell: (this.renderCartItem) },
                { field: 'action', headerName: 'Action', flex: 1, renderCell: (this.renderAction) }
            ];

        return (
            <Box p={1} className="height-100-overflow">
                <Box p={2} pt={0}>
                    <Paper square={true}>
                        <Box>
                            <DataGrid className="no-border-radius data-grid-border" rows={(orders) ? orders : []} getRowId={this.handleGetRowId} columns={columns} autoHeight={true} pageSize={20} rowsPerPageOptions={[20, 40, 60]} />
                        </Box>
                    </Paper>
                </Box>
                {/* <Box p={2} pt={0}>
                    <Grid container>
                        <Grid item xs>
                        </Grid>
                        <Grid item>
                            {orders && orders.length > 0 ?
                                <Button variant="contained" onClick={() => this.clearAllOfflineOrder()}>Clear ALL Offline Orders</Button>
                                : null
                            }
                        </Grid>
                        <Grid item xs>
                        </Grid>
                    </Grid>
                </Box> */}
            </Box >
        )
    }
}

index.propTypes = {
    pageTitle: PropTypes.func.isRequired,
    alert: PropTypes.func.isRequired,
    loading: PropTypes.func.isRequired,
    syncOfflineOrder: PropTypes.func.isRequired,
    removeOfflineOrder: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
    interAction: state.interAction,
    offlineData: state.offlineData
});

const mapActionsToProps = {
    pageTitle,
    alert,
    loading,
    syncOfflineOrder,
    removeOfflineOrder
}
export default connect(mapStateToProps, mapActionsToProps)(withRouter(index))