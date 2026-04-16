import React, { Component } from 'react'
import { Box } from '@material-ui/core';
import CustomerRight from './customer-right';
import SelectSalesPerson from '../sales-person/select-sales-person';

export class rightpanel extends Component {

    render() {
        return (
            <Box className="position-relative">
                <Box className="extras-block">
                    <div className="display-flex flex-column height-100">
                        <div className="flex-1">
                            <CustomerRight />
                            <SelectSalesPerson place="rightPanel" />
                        </div>
                    </div>
                </Box>
            </Box>
        )
    }
}

export default rightpanel
