import React, { useEffect, useState } from 'react'
import { Box, Tabs, Tab } from '@material-ui/core';
import 'date-fns';
import GiftCards from "./GiftCards"
import Sales from "./Sales"
import TabPanel from "../../components/theme/TabPanel"
import StoreHelper from '../../Helper/storeHelper'
import CartHelper from '../../Helper/cartHelper'


function CustomerHistory() {
    const [activeTab, setActiveTab] = useState("SALES");
    const [disableSales, setDisableSales] = useState(false);
    const [disableGiftcard, setDisableGiftcard] = useState(false);

    useEffect(() => {
        const permissions = StoreHelper.getPermissions();
        if (!CartHelper.isEmpty(permissions)) {
            if (!StoreHelper.hasAnyPermission("sales", ["ADD", "EDIT"])) {
                setDisableSales(true);
            }
            if (!StoreHelper.hasAnyPermission("giftcards", ["ADD", "EDIT"])) {
                setDisableGiftcard(true);
            }
        }
    }, []);

    const handleChange = (event, value) => {
        setActiveTab(value);
    };

    return (
        <Box p={3} className="height-100-overflow">
            <div className="display-flex">
                <Tabs
                    orientation="vertical"
                    variant="scrollable"
                    value={activeTab}
                    onChange={handleChange}
                    aria-label="Vertical tabs example"
                    className="background-lite-gray"
                >
                    <Tab label="SALES" value="SALES" disabled={disableSales} />
                    <Tab label="GIFTCARDS" value="GIFTCARDS" disabled={disableGiftcard} />
                </Tabs>
                <TabPanel value="SALES" index={activeTab}>
                    <Box p={3}>
                        <Sales />
                    </Box>
                </TabPanel>
                <TabPanel value="GIFTCARDS" index={activeTab}>
                    <Box p={3}>
                        <GiftCards />
                    </Box>
                </TabPanel>
            </div>
        </Box>
    )
}

export default CustomerHistory
