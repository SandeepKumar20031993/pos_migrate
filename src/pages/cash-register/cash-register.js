import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
    Box,
    CircularProgress,
} from "@material-ui/core";

import {
    getCashRegisterApi,
    loadCashRegisterData,
} from "../../redux/action/cashRegisterAction";
import { pageTitle } from '../../redux/action/themeAction';

import CashRegisterComponentOpened from "../../components/CashRegister/CashRegisterComponentOpened";
import CashRegisterComponentClosed from "../../components/CashRegister/CashRegisterComponentClosed";

import StoreHelper from "../../Helper/storeHelper";
import { Alert } from "@material-ui/lab";

function CashRegister() {
    const dispatch = useDispatch();
    const cashRegister = useSelector((state) => state.cashRegister);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState(null);

    const fetchCashregister = useCallback(async () => {
        setIsLoading(true);
        setMessage(null);

        const result = await dispatch(getCashRegisterApi({}))
            .then((result) => {
                return result.json();
            })
            .catch(() => {
                console.error("error while fetching cash register");
                return null;
            });

        if (result?.success) {
            dispatch(loadCashRegisterData(result?.data));
        } else {
            dispatch(loadCashRegisterData(null));
            setMessage(result?.msg);
        }
        setIsLoading(false);
    }, [dispatch]);

    useEffect(() => {
        fetchCashregister();
        dispatch(pageTitle('Cash Register'));
    }, [dispatch, fetchCashregister]);

    const isCashRegisterEnabled = StoreHelper.isCashRegsiterEnabled();

    if (!isCashRegisterEnabled)
        return (
            <Box
                display={"inline-flex"}
                width={"100%"}
                height={"100%"}
                alignItems={"center"}
                justifyContent={"center"}>
                <Alert severity="warning">
                    Cash Register is Disabled from Admin!. Please contact system Admin
                </Alert>
            </Box>
        );

    if (isLoading)
        return (
            <Box
                style={{
                    width: "100%",
                    display: "inline-flex",
                    justifyContent: "center",
                }}>
                <CircularProgress size={25} />
            </Box>
        );

    return (
        <>
            {message && <Box
                display={"inline-flex"}
                width={"100%"}
                alignItems={"center"}
                justifyContent={"center"}
                className="my-1"
                spacing={4} style={{ padding: "16px 16px" }}>
                <Alert severity="warning" width={"100%"}>
                    {message}
                </Alert>
            </Box>}

            {cashRegister?.isRegisterOpen ? (
                <CashRegisterComponentOpened
                    fetchCashregister={fetchCashregister}
                />
            ) : (
                <CashRegisterComponentClosed
                    fetchCashregister={fetchCashregister}
                />
            )}
        </>
    );
}

export default CashRegister;
