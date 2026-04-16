import React, { Component } from 'react'
import { Box, Typography } from '@material-ui/core'
import CartHelper from '../../../Helper/cartHelper'
import StoreHelper from "../../../Helper/storeHelper"

class taxDetails extends Component {
    render() {
        const rawTaxDetails = CartHelper.getTaxDetailsToPrint() || { tax_data: [] }
        const inv_template = StoreHelper.getInvTemp()
        const checkoutData = CartHelper.getCheckoutData()
        const subtotal = parseFloat(checkoutData.subtotal) || 0

        const rows = (rawTaxDetails.tax_data && rawTaxDetails.tax_data.length > 0)
            ? rawTaxDetails.tax_data
            : [{ tax_percent: 0, slab_total: 0, tax_total: 0 }]

        const taxDetails = {
            ...rawTaxDetails,
            tax_data: rows
        }

        const showCgstSgst = true // always show columns (you can make conditional if needed)

        // Totals
        const TaxableAmount = taxDetails.tax_data.reduce((sum, rate) => sum + (parseFloat(rate.slab_total) || 0), 0)
        const totalTaxAmt = taxDetails.tax_data.reduce((sum, rate) => sum + (parseFloat(rate.tax_total) || 0), 0)
        const totalCgst = taxDetails.tax_data.reduce((sum, rate) => sum + ((parseFloat(rate.tax_total) || 0) / 2), 0)
        const totalSgst = taxDetails.tax_data.reduce((sum, rate) => sum + ((parseFloat(rate.tax_total) || 0) / 2), 0)

        // console.log("TaxableAmount", TaxableAmount)
        // console.log("totalTaxAmt", totalTaxAmt)

        return (
            <Box p={0} className="align-left background-white">
                <table className="inv-table">
                    <tbody>
                        {/* Header */}
                        <tr className="inv-table-row">
                            <th className="inv-table-data inv-table-data-left" colSpan={2}>
                                <Typography className="custom-font" variant="body2" component="p">Tax%</Typography>
                            </th>
                            <th className="inv-table-data inv-table-data-left" colSpan={2}>
                                <Typography className="custom-font" variant="body2" component="p">Taxable Amt</Typography>
                            </th>
                            <th className="inv-table-data inv-table-data-left" colSpan={2}>
                                <Typography className="custom-font" variant="body2" component="p">Tax Amt</Typography>
                            </th>

                            {/* Now show amounts (Rs) for CGST/SGST */}
                            {showCgstSgst && (
                                <>
                                    <th className="inv-table-data inv-table-data-left" colSpan={2}>
                                        <Typography className="custom-font" variant="body2" component="p">CGST(Rs)</Typography>
                                    </th>
                                    <th className="inv-table-data inv-table-data-left" colSpan={2}>
                                        <Typography className="custom-font" variant="body2" component="p">SGST(Rs)</Typography>
                                    </th>
                                </>
                            )}
                        </tr>

                        {/* Rows */}
                        {taxDetails.tax_data.map((tax, i) => {
                            const taxPercent = Number(parseFloat(tax.tax_percent || 0)).toFixed(2)
                            // Tax values already include negative amounts for exchange items from cartHelper
                            const slabTotal = parseFloat(tax.slab_total || 0)
                            const taxTotal = parseFloat(tax.tax_total || 0)

                            const cgstAmount = taxTotal / 2
                            const sgstAmount = taxTotal / 2

                            return (
                                <tr className="inv-table-row" key={i}>
                                    <td className="inv-table-data inv-table-data-left" colSpan={2}>
                                        <Typography variant="body2" component="p">{taxPercent}</Typography>
                                    </td>
                                    <td className="inv-table-data inv-table-data-left" colSpan={2}>
                                        <Typography variant="body2" component="p">
                                            {CartHelper.getCurrencyFormatted(Number(slabTotal).toFixed(2))}
                                        </Typography>
                                    </td>
                                    <td className="inv-table-data inv-table-data-left" colSpan={2}>
                                        <Typography variant="body2" component="p">
                                            {CartHelper.getCurrencyFormatted(Number(taxTotal).toFixed(2))}
                                        </Typography>
                                    </td>

                                    {showCgstSgst && (
                                        <>
                                            <td className="inv-table-data inv-table-data-left" colSpan={2}>
                                                <Typography variant="body2" component="p">
                                                    {CartHelper.getCurrencyFormatted(Number(cgstAmount).toFixed(2))}
                                                </Typography>
                                            </td>
                                            <td className="inv-table-data inv-table-data-left" colSpan={2}>
                                                <Typography variant="body2" component="p">
                                                    {CartHelper.getCurrencyFormatted(Number(sgstAmount).toFixed(2))}
                                                </Typography>
                                            </td>
                                        </>
                                    )}
                                </tr>
                            )
                        })}


                    </tbody>
                </table>
            </Box>
        )
    }
}

export default taxDetails
