import React, { useCallback, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { Box, Button, Grid } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { pageTitle } from '../../../redux/action/themeAction';
import { alert, customLoading } from '../../../redux/action/InterAction';
import StoreHelper from '../../../Helper/storeHelper';
import { syncOfflineOrder, removeOfflineOrder, holdSyncing } from '../../../redux/action/offlineAction';

function OfflineSettings() {
    const dispatch = useDispatch();
    const history = useHistory();
    const offlineData = useSelector(state => state.offlineData);
    const timeoutRef = useRef(null);
    const syncOfflineOrdersRef = useRef(null);

    const clearSyncTimeout = useCallback(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
    }, []);

    const startAgainSyncing = useCallback(() => {
        clearSyncTimeout();
        timeoutRef.current = setTimeout(() => {
            timeoutRef.current = null;
            if (syncOfflineOrdersRef.current) {
                syncOfflineOrdersRef.current();
            }
        });
    }, [clearSyncTimeout]);

    const syncOfflineOrders = useCallback(() => {
        dispatch(customLoading(true, "Syncing..."));
        clearSyncTimeout();
        timeoutRef.current = setTimeout(() => {
            timeoutRef.current = null;

            if (StoreHelper.isOnline() && offlineData.orders.length > 0) {
                const msg = "Remaining Order " + offlineData.orders.length;
                dispatch(customLoading(true, msg));
                dispatch(holdSyncing(true));

                const order = offlineData.orders[0];
                dispatch(syncOfflineOrder(order))
                    .then(res => res.json())
                    .then(resData => {
                        if (resData.success) {
                            const orders = (offlineData.orders && offlineData.orders.length > 0) ? offlineData.orders : [];
                            const orderIndex = orders.findIndex(item => item.off_ref_no === order.off_ref_no);

                            if (orderIndex >= 0) {
                                dispatch(removeOfflineOrder(orderIndex));
                                startAgainSyncing();
                            } else {
                                startAgainSyncing();
                            }
                        } else {
                            startAgainSyncing();
                        }
                    })
                    .catch(() => {
                        startAgainSyncing();
                    });
            } else {
                dispatch(holdSyncing(false));
                dispatch(customLoading(false, ""));
            }
        }, 2000);
    }, [clearSyncTimeout, dispatch, offlineData.orders, startAgainSyncing]);

    useEffect(() => {
        syncOfflineOrdersRef.current = syncOfflineOrders;
    }, [syncOfflineOrders]);

    useEffect(() => {
        dispatch(pageTitle('Sales Settings'));
        dispatch(customLoading(false, ""));

        return () => {
            clearSyncTimeout();
            dispatch(holdSyncing(false));
        };
    }, [clearSyncTimeout, dispatch]);

    const syncOrders = useCallback(() => {
        if (StoreHelper.isOnline() && offlineData.orders.length > 0) {
            syncOfflineOrders();
            return;
        }

        if (!StoreHelper.isOnline()) {
            dispatch(alert(true, "Please Connect to internet to sync your order."));
        } else if (offlineData.orders.length === 0) {
            dispatch(alert(true, "Offline orders have been synced."));
        }
    }, [dispatch, offlineData.orders.length, syncOfflineOrders]);

    const goToPage = useCallback((route) => {
        history.push(`${process.env.PUBLIC_URL + '/' + route}`);
    }, [history]);

    const totalCount = offlineData.orders.length;

    return (
        <Box>
            <Grid container spacing={2}>
                <Grid item xs={3}>
                    Total Offline Orders
                </Grid>
                <Grid item xs={9}>
                    {totalCount}
                </Grid>
                <Grid item xs={3}>
                    Sync Offline Order
                </Grid>
                <Grid item xs={9}>
                    <Button variant="contained" color="secondary" onClick={syncOrders}>Sync Now</Button>
                </Grid>
                <Grid item xs={3}>
                    Offline Order Logs
                </Grid>
                <Grid item xs={9}>
                    <Button variant="contained" color="secondary" onClick={() => goToPage('offline-orders')}>View Order Logs</Button>
                </Grid>
            </Grid>
        </Box>
    );
}

export default OfflineSettings;
