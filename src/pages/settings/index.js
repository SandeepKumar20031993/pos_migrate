import React, { useEffect, useState } from 'react'
import { Box, Paper, Tab, Tabs } from '@material-ui/core'
import { useDispatch } from "react-redux";
import { loading, customLoading } from '../../redux/action/InterAction';
import GeneralSettings from "../../components/settings/general"
import OfflineSettings from "../../components/settings/offline"
import ProductsSettings from "../../components/settings/products"
import POSSettings from "../../components/settings/posPayment"
import TabPanel from "../../components/theme/TabPanel"


import StoreHelper from '../../Helper/storeHelper'
function SettingsPage() {
    const dispatch = useDispatch();
    const [activeTab, setActiveTab] = useState("GENERAL");

    useEffect(() => {
        dispatch(loading(false))
        dispatch(customLoading(false, ""))
    }, [dispatch]);

    const changeTab = (event, value) => {
        setActiveTab(value)
    };

    const isPOSPayments = StoreHelper.isPineLabsPaymentsAllowed();
    return (
            <Box p={2}>
                <Paper square>
                    <Tabs
                        variant="scrollable"
                        value={activeTab}
                    onChange={changeTab}
                        className="background-lite-gray"
                    >
                        <Tab label="GENERAL" value="GENERAL" />
                        <Tab label="CATALOG" value="CATALOG" />
                        <Tab label="SALES" value="SALES" />
                        {isPOSPayments &&
                            <Tab label="POS Payments" value="POS" />
                        }
                    </Tabs>
                    <TabPanel value="GENERAL" index={activeTab}>
                        <Box p={3}>
                            <GeneralSettings />
                        </Box>
                    </TabPanel>
                    <TabPanel value="CATALOG" index={activeTab}>
                        <Box p={3}>
                            <ProductsSettings />
                        </Box>
                    </TabPanel>
                    <TabPanel value="SALES" index={activeTab}>
                        <Box p={3}>
                            <OfflineSettings />
                        </Box>
                    </TabPanel>
                    {isPOSPayments &&
                        <TabPanel value="POS" index={activeTab}>
                            <POSSettings />
                        </TabPanel>
                    }
                </Paper>
            </Box>
    )
}

export default SettingsPage
