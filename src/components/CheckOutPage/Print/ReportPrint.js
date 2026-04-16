import React, { Component } from "react";
import { Box, Container, Divider, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@material-ui/core";

import StoreHelper from '../../../Helper/storeHelper'
import CartHelper from '../../../Helper/cartHelper'

export class ReportPrint extends Component {

    render() {
        var langs = StoreHelper.getLangs();
        let { reports, timeRange } = this.props;
        const payments = reports?.payments_modes
        const total = reports?.totals;

        let rows = {
            'Total Bills': total?.total_bills,
            'Total Items Sold': total?.total_items_sold,
            // 'Total MRP': total?.total_mrp,
            'Subtotal': total?.total_subtotal,
            'Total Tax': total?.total_tax,
            'Total Net Sales Amount': total?.total_net_total,
            'Total Taxable Amount': total?.total_taxable_tax,
            'Total CGST': total?.total_sgst,
            'Total SGST': total?.total_cgst,
        }

        return (
            <Box className="custom-font printable-area" p={1}>
                {StoreHelper.showLogoInBill() &&
                    StoreHelper.getCompanyLogo() ? (
                    <Box pb={1} className="align-center-important">
                        <img
                            className="print-logo"
                            src={StoreHelper.getCompanyLogo()}
                            alt="Logo"
                        />
                    </Box>
                ) : null}
                {StoreHelper.showBrandNameInBill() && StoreHelper.getBrandName() &&
                    <Box p={0} className="align-center-important">
                        <Typography
                            className="custom-font print-heading"
                            variant="h2"
                            component="h2">
                            <strong>{StoreHelper.getBrandName()}</strong> {StoreHelper.getBrandName()}
                        </Typography>
                    </Box>
                }
                {StoreHelper.getCompany() !== "null" ? (
                    <Box p={0} className="align-center-important">
                        <Typography
                            className="custom-font print-heading"
                            variant="h6"
                            component="b">
                            <strong>{StoreHelper.getCompany()}</strong>
                        </Typography>
                    </Box>
                ) : null}

                <Box p={0} className="align-center-important">
                    <Typography
                        className="custom-font"
                        variant="body2"
                        component="b">
                        {StoreHelper.getConfigAddress() !== "null"
                            ? StoreHelper.getConfigAddress()
                            : ""}
                    </Typography>
                </Box>
                <Box p={0} className="align-center-important">
                    <Typography
                        className="custom-font"
                        variant="body2"
                        component="b">
                        {StoreHelper.getUserCity() !== "null"
                            ? StoreHelper.getUserCity()
                            : ""}
                        {StoreHelper.getUserPincode() !== "null"
                            ? StoreHelper.getUserPincode()
                            : ""}
                    </Typography>
                </Box>

                {StoreHelper.getConfigPhone() !== "null" ? (
                    <Box p={0} className="align-center-important">
                        <Typography
                            className="custom-font"
                            variant="body2"
                            component="b">
                            {"Phone:"}
                            {StoreHelper.getConfigPhone()}
                        </Typography>
                    </Box>
                ) : null}
                {StoreHelper.showEmailInBill() &&
                    StoreHelper.getConfigEmail() !== "null" ? (
                    <Box p={0} className="align-center-important">
                        <Typography
                            className="custom-font"
                            variant="body2"
                            component="b">
                            {StoreHelper.getConfigEmail()}
                        </Typography>
                    </Box>
                ) : null}
                {StoreHelper.showWebsiteInBill() &&
                    StoreHelper.getConfigWebsite() !== "null" ? (
                    <Box p={0} className="align-center-important">
                        <Typography
                            className="custom-font"
                            variant="body2"
                            component="b">
                            {StoreHelper.getConfigWebsite()}
                        </Typography>
                    </Box>
                ) : null}
                {StoreHelper.getGSTNo() !== "null" ? (
                    <Box p={0} className="align-center-important">
                        <Typography
                            className="custom-font"
                            variant="body2"
                            component="b">
                            {langs.GST ? langs.GST : "GST"}
                            {":"}
                            {StoreHelper.getGSTNo()}
                        </Typography>
                    </Box>
                ) : null}

                <Divider />

                <Typography variant="h6" align="center">{reports?.date_range}</Typography>
                <Typography variant="h6" align="center">Time : {timeRange?.startTime} to {timeRange?.endTime}</Typography>


                <TableContainer component={Container} maxWidth={"sm"} >
                    <Typography>Total Amount</Typography>
                    <Table aria-label="Total amount table" size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    <Typography className="custom-font" variant="body2" component="b">

                                        Name
                                    </Typography>
                                </TableCell>
                                <TableCell align="right">
                                    <Typography className="custom-font" variant="body2" component="b">
                                        Value ({StoreHelper.getCurrencySymbol()})
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {Object.keys(rows).map((row, index) => (

                                <TableRow key={'totals-report print-bill' + index}>
                                    <TableCell component="th" scope="row">
                                        <Typography className="custom-font" variant="body2" component="b">

                                            {row}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="right">
                                        <Typography className="custom-font" variant="body2" component="b">
                                            {rows[row]}
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ))}

                        </TableBody>
                    </Table>


                    <Typography style={{ marginTop: '10px' }}>Payment Modes</Typography>

                    <Table aria-label="simple table" size="small" >

                        <TableHead>
                            <TableRow>
                                <TableCell><Typography className="custom-font" variant="body2" component="b">Type</Typography></TableCell>
                                <TableCell align="right"><Typography className="custom-font" variant="body2" component="b">Value ({StoreHelper.getCurrencySymbol()})</Typography> </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {Object.keys(payments).map((payment, index) => (

                                <TableRow key={'payment-type-total-rpint' + index}>
                                    <TableCell component="th" scope="row">
                                        <Typography className="custom-font" variant="body2" component="b">{payment}</Typography>

                                    </TableCell>
                                    <TableCell align="right"> <Typography className="custom-font" variant="body2" component="b">{payments[payment]}</Typography></TableCell>
                                </TableRow>
                            ))}


                        </TableBody>

                    </Table>
                </TableContainer>

            </Box>
        );
    }
}

export default ReportPrint;
