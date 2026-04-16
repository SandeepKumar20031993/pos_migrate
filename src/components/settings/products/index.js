import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Box, Button, Grid } from '@material-ui/core';
import { useDispatch } from "react-redux";
import { pageTitle } from '../../../redux/action/themeAction';
import { loading } from '../../../redux/action/InterAction';
import { getProductsFromDb, dbProductsData, clearProductData } from '../../../services/product-service';


function ProductsSettings() {
    const dispatch = useDispatch();
    const [totalCount, setTotalCount] = useState(0);
    const timerRef = useRef(10000);
    const intervalTimerRef = useRef(null);

    const stopPolling = useCallback(() => {
        clearInterval(intervalTimerRef.current);
        intervalTimerRef.current = null;
    }, []);

    const updateProductsCount = useCallback(() => {
        stopPolling();
        intervalTimerRef.current = setInterval(() => {
            if (dbProductsData && dbProductsData.data && dbProductsData.data.length > 0) {
                setTotalCount(dbProductsData.data.length);
                stopPolling();
                dispatch(loading(false));
            }
            timerRef.current -= 1000;
            if (timerRef.current <= 0) {
                stopPolling();
                dispatch(loading(false));
            }
        }, 1000)
    }, [dispatch, stopPolling]);

    useEffect(() => {
        getProductsFromDb();
        dispatch(pageTitle('Catalog Settings'));
        updateProductsCount();
        return () => {
            stopPolling();
        };
    }, [dispatch, stopPolling, updateProductsCount]);

    const syncProducts = () => {
        dispatch(loading(true));
        clearProductData();
        setTotalCount(0);
        timerRef.current = 10000;
        sessionStorage.removeItem("indexdb_refreshed");
        getProductsFromDb();
        updateProductsCount();
    }

    return (
            <Box>
                <Grid container spacing={2}>
                    <Grid item xs={3}>
                        Total Product Count
                    </Grid>
                    <Grid item xs={9}>
                        {totalCount}
                    </Grid>
                    <Grid item xs={3}>
                        Sync Products
                    </Grid>
                    <Grid item xs={9}>
                        <Button variant="contained" color="secondary" onClick={syncProducts}>Sync Now</Button>
                    </Grid>
                </Grid>
            </Box>
        )
}

export default ProductsSettings
