import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Box, Button, Card, CardHeader, CardContent } from '@material-ui/core';
import { useDispatch, useSelector } from "react-redux";
import CartHelper from '../../Helper/cartHelper'
import StoreHelper from '../../Helper/storeHelper'
import { pageTitle } from '../../redux/action/themeAction';
import { toggleEditProductPopup, loadEditableProduct } from '../../redux/action/productConfigAction';
import { DataGrid } from '@material-ui/data-grid';
import { dbProductsData, getProductsFromDb } from "../../services/product-service"
import EditProduct from "./EditProduct"
import SearchProduct from "./SearchProduct"


function Product() {
    const dispatch = useDispatch();
    const productConfig = useSelector(state => state.productConfig);
    const [products, setProducts] = useState([]);
    const [canCreateProduct] = useState(() => StoreHelper.hasPermission("items", "EDIT"));
    const intervalTimerRef = useRef(null);

    const updateProductsFromDb = useCallback(() => {
        const productsData = (dbProductsData.data && dbProductsData.data.length > 0) ? dbProductsData.data : [];
        setProducts(productsData);
    }, []);

    const updateCollection = useCallback((collections) => {
        setProducts(collections);
    }, []);

    useEffect(() => {
        dispatch(pageTitle('Products'));
        getProductsFromDb()
        intervalTimerRef.current = setInterval(() => {
            if (dbProductsData && dbProductsData.data && dbProductsData.data.length > 0) {
                updateProductsFromDb();
                clearInterval(intervalTimerRef.current);
                intervalTimerRef.current = null;
            }
        });

        return () => {
            if (intervalTimerRef.current) {
                clearInterval(intervalTimerRef.current);
            }
        };
    }, [dispatch, updateProductsFromDb]);

    const viewProduct = useCallback((item) => {
        dispatch(toggleEditProductPopup(true));
        dispatch(loadEditableProduct(item));
    }, [dispatch]);

    const renderPrice = useCallback((e) => {
        let price = 0;
        const item = e.row;
        if (item.prices.length > 0) {
            const lastIndex = item.prices.length - 1;
            const lastPrice = item.prices[lastIndex];
            price = lastPrice.mrp;
        } else {
            price = item.price;
        }
        return CartHelper.getCurrencyFormatted(Number(price).toFixed(2));
    }, []);

    const renderAction = useCallback((e) => {
        return (
            <Button className="background-blue" variant="contained" size="small" onClick={() => viewProduct(e.row)}>
                Edit
            </Button>
        );
    }, [viewProduct]);

    const columns = useMemo(() => {
        const baseColumns = [
            { field: 'barcode', headerName: 'Barcode', flex: 1 },
            { field: 'name', headerName: 'Item Name', flex: 1 },
            { field: 'price', headerName: 'Price', flex: 1, renderCell: renderPrice },
            { field: 'tax', headerName: 'Tax', flex: 1 },
            {
                field: 'qty', headerName: 'Qty', flex: 1, valueGetter: function (params) {
                    return params?.row?.stock[0]?.quantity ?? "";
                },
            },
            { field: 'cat_name', headerName: 'Category', flex: 1 }
        ];

        if (canCreateProduct) {
            baseColumns.push({ field: 'action', headerName: 'Action', renderCell: renderAction });
        }

        return baseColumns;
    }, [canCreateProduct, renderAction, renderPrice]);

    return (
        <>
            <Box p={2} className="height-100-overflow">
                <Card>
                    <CardHeader action={<SearchProduct updateCollection={updateCollection} />} />
                    <CardContent style={{ padding: '0' }} >
                        <DataGrid className="no-border-radius data-grid-border" rows={products || []} columns={columns} autoHeight={true} pageSize={20} rowsPerPageOptions={[20, 40, 60, 80, 100]} />
                    </CardContent>
                </Card>
            </Box>

            {productConfig.editProdPopup ?
                <EditProduct updateCollection={updateCollection} />
                : null
            }
        </>
    );
}

export default Product;
