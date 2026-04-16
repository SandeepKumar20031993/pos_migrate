import React, { Component } from 'react'
import { Box, Typography } from '@material-ui/core';
import CartHelper from '../../../Helper/cartHelper'
import StoreHelper from "../../../Helper/storeHelper";

class taxDetails extends Component {

    isTaxVisible = (taxDetails) => {
        // Always true if tax_data exists — we want to show even 0% taxes
        if (taxDetails && taxDetails.tax_data && taxDetails.tax_data.length > 0) {
            return true;
        }
        return false;
    }

    // Check if any tax rate is greater than 0
    hasNonZeroTax = (taxDetails) => {
        if (!taxDetails || !taxDetails.tax_data) return false;
        return taxDetails.tax_data.some(tax => parseFloat(tax.tax_percent) > 0);
    }


    render() {
        const taxDetails = CartHelper.getTaxDetailsToPrint()
        const inv_template = StoreHelper.getInvTemp();
        const showCgstSgst = this.hasNonZeroTax(taxDetails);


        const totalCgst = taxDetails.tax_data.reduce((sum, rate) => {
            const per = Number(((parseFloat(rate.tax_total) || 0) / 2).toFixed(2));
            return sum + per;
        }, 0);


        const totalSgst = taxDetails.tax_data.reduce((sum, rate) => {
            const per = Number(((parseFloat(rate.tax_total) || 0) / 2).toFixed(2));
            return sum + per;
        }, 0);


        const totalTaxAmt = taxDetails.tax_data.reduce((sum, rate) => {
            return sum + (parseFloat(rate.tax_total) || 0);
        }, 0);


        const TaxableAmount = taxDetails.tax_data.reduce((sum, rate) => {
            return sum + (parseFloat(rate.slab_total) || 0);
        }, 0);


        return (
            <>
                {!CartHelper.isEmpty(taxDetails) && this.isTaxVisible(taxDetails) ? (
                    <Box p={0} className="align-left background-white">
                        <table className="inv-table" colSpan={12}>
                            <tbody>
                                {/* Table Header */}
                                <tr className="inv-table-row">
                                    {inv_template === "enterPrise" && (
                                        <th className="inv-table-data inv-table-data-left" colSpan={2}>
                                            <Typography className="custom-font" variant="body2" component="p">
                                                HSN CODE
                                            </Typography>
                                        </th>
                                    )}
                                    <th className="inv-table-data inv-table-data-left" colSpan={2}>
                                        <Typography className="custom-font" variant="body2" component="p">Tax%</Typography>
                                    </th>
                                    <th className="inv-table-data inv-table-data-left" colSpan={2}>
                                        <Typography className="custom-font" variant="body2" component="p">Taxable Amt</Typography>
                                    </th>
                                    {/* Only show CGST & SGST headers if tax > 0 */}
                                    {inv_template === "enterPrise" && showCgstSgst && (
                                        <>
                                            <th className="inv-table-data inv-table-data-left" colSpan={2}>
                                                <Typography className="custom-font" variant="body2" component="p">CGST(Rs)</Typography>
                                            </th>
                                            <th className="inv-table-data inv-table-data-left" colSpan={2}>
                                                <Typography className="custom-font" variant="body2" component="p">SGST(Rs)</Typography>
                                            </th>
                                        </>
                                    )}
                                    <th className="inv-table-data inv-table-data-left" colSpan={2}>
                                        <Typography className="custom-font" variant="body2" component="p">Tax Amt</Typography>
                                    </th>
                                    {taxDetails.tax_names?.length > 0 &&
                                        taxDetails.tax_names.map((name, i) => (
                                            <th key={i} className="inv-table-data inv-table-data-left" colSpan={2}>
                                                <Typography className="custom-font" variant="body2" component="p">
                                                    {name}%
                                                </Typography>
                                            </th>
                                        ))}
                                </tr>


                                {/* Table Body */}
                                {taxDetails.tax_data.map((tax, index) => (
                                    <tr className="inv-table-row" key={index}>
                                        {inv_template === "enterPrise" && (
                                            <td className="inv-table-data inv-table-data-left" colSpan={2}>
                                                <Typography variant="body2" component="p">
                                                    {tax.hsn_code || "-"}
                                                </Typography>
                                            </td>
                                        )}


                                        {/* Tax % */}
                                        <td className="inv-table-data inv-table-data-left" colSpan={2}>
                                            <Typography variant="body2" component="p">
                                                {Number(tax.tax_percent).toFixed(2)}
                                            </Typography>
                                        </td>


                                        {/* Taxable Amount */}
                                        <td className="inv-table-data inv-table-data-left" colSpan={2}>
                                            <Typography variant="body2" component="p">
                                                {CartHelper.getCurrencyFormatted(tax.slab_total || 0)}
                                            </Typography>
                                        </td>


                                        {/* CGST & SGST - only show if tax > 0 */}
                                        {inv_template === "enterPrise" && showCgstSgst && (
                                            <>
                                                <td className="inv-table-data inv-table-data-left" colSpan={2}>
                                                    <Typography variant="body2" component="p">
                                                        {CartHelper.getCurrencyFormatted((tax.tax_total / 2) || 0)}
                                                    </Typography>
                                                </td>
                                                <td className="inv-table-data inv-table-data-left" colSpan={2}>
                                                    <Typography variant="body2" component="p">
                                                        {CartHelper.getCurrencyFormatted((tax.tax_total / 2) || 0)}
                                                    </Typography>
                                                </td>
                                            </>
                                        )}


                                        {/* Tax Amount */}
                                        <td className="inv-table-data inv-table-data-left" colSpan={2}>
                                            <Typography variant="body2" component="p">
                                                {CartHelper.getCurrencyFormatted(tax.tax_total || 0)}
                                            </Typography>
                                        </td>


                                        {/* Additional Tax Rates */}
                                        {tax.tax_rates?.length > 0 &&
                                            tax.tax_rates.map((rate, i) => (
                                                <td key={i} className="inv-table-data inv-table-data-left" colSpan={2}>
                                                    <Typography variant="body2" component="p">
                                                        {CartHelper.getCurrencyFormatted((tax.tax_total / 2) || 0)}
                                                    </Typography>
                                                </td>
                                            ))}
                                    </tr>
                                ))}


                                {/* Total Row */}
                                {inv_template === "enterPrise" && (
                                    <tr className="inv-table-row">
                                        <td className="inv-table-data-right" colSpan={2}>
                                            <Typography className="custom-font" variant="body2" component="p">Total</Typography>
                                        </td>
                                        <td className="inv-table-data-left" colSpan={2}></td>
                                        <td className="inv-table-data-left" colSpan={2}>
                                            <Typography className="custom-font" variant="body2" component="p">
                                                {CartHelper.getCurrencyFormatted(TaxableAmount.toFixed(2))}
                                            </Typography>
                                        </td>
                                        {/* Only show CGST/SGST totals if tax > 0 */}
                                        {showCgstSgst && (
                                            <>
                                                <td className="inv-table-data-left" colSpan={2}>
                                                    <Typography className="custom-font" variant="body2" component="p">
                                                        {CartHelper.getCurrencyFormatted(totalCgst.toFixed(2))}
                                                    </Typography>
                                                </td>
                                                <td className="inv-table-data-left" colSpan={2}>
                                                    <Typography className="custom-font" variant="body2" component="p">
                                                        {CartHelper.getCurrencyFormatted(totalSgst.toFixed(2))}
                                                    </Typography>
                                                </td>
                                            </>
                                        )}
                                        <td className="inv-table-data-left" colSpan={2}>
                                            <Typography className="custom-font" variant="body2" component="p">
                                                {CartHelper.getCurrencyFormatted(totalTaxAmt.toFixed(2))}
                                            </Typography>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </Box>
                ) : null}
            </>
        )
    }
}


export default taxDetails
