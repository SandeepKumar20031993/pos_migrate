import * as React from "react"
import { Box } from "@material-ui/core";

export default function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`tabpanel-${value}`}
            className="width-100 tabpanel"
            aria-labelledby={`tab-${value}`}
            {...other}
        >
            {value === index && (
                <Box className="background-white">
                    {children}
                </Box>
            )}
        </div>
    );
}