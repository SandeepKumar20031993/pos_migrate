import React, { useState } from 'react'
import { Box, Tabs, Tab } from '@material-ui/core';
import 'date-fns';
import OnlineSales from "./OnlineSales"
import OfflineSales from "./OfflineSales"
import TabPanel from "../../components/theme/TabPanel"

function SalesRecord() {
    const [activeTab, setActiveTab] = useState("ONLINE")

    const handleChange = (event, value) => {
        setActiveTab(value)
    }

    return (
        <Box p={3}>
            <div>
                <Tabs
                    // orientation="vertical"
                    variant="scrollable"
                    value={activeTab}
                    onChange={handleChange}
                    aria-label="Vertical tabs example"
                    className="background-lite-gray"
                >
                    <Tab label="ONLINE" value="ONLINE" />
                    <Tab label="OFFLINE" value="OFFLINE" />
                    {/* <Tab label="REWARDS" value={2} /> */}
                </Tabs>
                <TabPanel value="ONLINE" index={activeTab}>
                    <OnlineSales />
                </TabPanel>
                <TabPanel value="OFFLINE" index={activeTab}>
                    <OfflineSales />
                </TabPanel>
                {/* <TabPanel value={2} index={activeTab}>
                        Item Three
                    </TabPanel> */}
            </div>
        </Box>
    )
}

export default SalesRecord
