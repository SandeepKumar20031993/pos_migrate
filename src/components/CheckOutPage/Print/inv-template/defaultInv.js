import React, { Component } from 'react';
import { Typography } from '@material-ui/core';
import CartHelper from '../../../../Helper/cartHelper'
import AdditionalDiscountSummery from '../../discountCoupon/AdditionalDiscountSummery'
import { getSessionValue } from '../../../../Helper/sessionStorage';
import StoreHelper from './../../../../Helper/storeHelper'

export class DefaultInvoice extends Component {
    constructor(props) {
        super(props)

        this.state = {

        }
    }

    getTotalQty = (items) => {
        var qty = 0
        if (items) {
            items.forEach(item => {
                qty += Number(item.qty)
            })
        }
        return qty.toFixed(3);
    }

    getPrice = (item) => {
        let price = Number(item.price);
        if (CartHelper.isApplyingDiscountAfterTax()) {
            let mrp = Number(item.mrp);
            let discount_Amount = (mrp / 100) * Number(item.discount);
            let priceWithTax = mrp - discount_Amount;
            let taxPercent = Number(item.tax);
            var taxAmount = priceWithTax - (priceWithTax * (100 / (100 + taxPercent)));
            price = mrp - taxAmount;
        }
        return price
    }

    render() {
        var billingData = CartHelper.getBillingData();
        let showUnit = getSessionValue('configs_show_unit_invoice');//StoreHelper.getFromSession('show_unit_invoice');
        let quantity_decimal = StoreHelper.quantityDecimal() ?? 2;
        const netTotal = Number(billingData.sales_data.nettotal)
        const taxPercent = Number(billingData.data[0]?.tax || 0)

        const correctSubtotal = netTotal / (1 + taxPercent / 100)

        return (
            <>
                {!CartHelper.isEmpty(billingData) && billingData.success ?
                    <table className="inv-table background-white" colSpan={12}>
                        <tbody>
                            <tr className="inv-table-row" style={{ borderBottom: "2px solid #333" }}>
                                <th className="inv-table-data inv-table-data-left" colSpan={5}>
                                    <Typography className="custom-font" variant="subtitle2" component="b">
                                        <strong>{'Description'}</strong>
                                    </Typography>
                                </th>
                                <th className="inv-table-head inv-table-data-right" colSpan={2}>
                                    <Typography className="custom-font" variant="subtitle2" component="b"><strong>MRP</strong></Typography>
                                </th>
                                <th className="inv-table-head inv-table-data-right" colSpan={2}>
                                    <Typography className="custom-font" variant="subtitle2" component="b"><strong>Rate</strong></Typography>
                                </th>
                                <th className="inv-table-head inv-table-data-right" colSpan={2}>
                                    <Typography className="custom-font" variant="subtitle2" component="b"><strong>Qty</strong></Typography>
                                </th>
                                <th className="inv-table-head inv-table-data-right" colSpan={3}>
                                    <Typography className="custom-font" variant="subtitle2" component="b"><strong>Amount</strong></Typography>
                                </th>
                            </tr>

                            {billingData.data.map(product => (
                                <tr key={product.id} className="inv-table-row">
                                    <td className="inv-table-data inv-table-data-left" colSpan={5}>
                                        <Typography className="custom-font" variant="body2" component="b">{product.name}</Typography>

                                        {product.hsn_code && product.hsn_code !== '111' ?
                                            <Typography className="custom-font" variant="caption" component="span">
                                                <br />HSN:{product.hsn_code}
                                            </Typography>
                                            : null}
                                    </td>
                                    <td className="inv-table-data inv-table-data-right" colSpan={2}>
                                        <Typography className="custom-font" variant="body2" component="b">{((product.actualMrp))}</Typography>
                                    </td>
                                    <td className="inv-table-data inv-table-data-right" colSpan={2}>
                                        <Typography className="custom-font" variant="body2" component="b">{(product.item_price)}</Typography>
                                    </td>
                                    <td className="inv-table-data inv-table-data-right" colSpan={2}>
                                        <Typography className="custom-font" variant="body2" component="b">{Number(product.qty).toFixed(quantity_decimal)}</Typography>
                                        {showUnit &&
                                            <Typography className="custom-font" variant="body2" component="b">{product.unit}</Typography>
                                        }
                                    </td>
                                    <td className="inv-table-data inv-table-data-right" colSpan={3}>
                                        <Typography className="custom-font" variant="body2" component="b">{(Number((product.item_price) * Number(product.qty)).toFixed(2))}</Typography>
                                    </td>
                                </tr>
                            ))}
                            <tr className="inv-table-row">
                                <td colSpan={5}></td>
                                <td className="inv-table-data align-right" colSpan={4}>
                                    <Typography className="custom-font" variant="body2" component="span"><strong>Total Qty</strong></Typography>
                                </td>
                                <td className="inv-table-data align-right" colSpan={3}>
                                    <Typography className="custom-font" variant="body2" component="span"><strong>{this.getTotalQty(billingData.data)}</strong> </Typography>
                                </td>
                            </tr>





                            <tr className="inv-table-row">
                                <td colSpan={5}></td>
                                <td className="inv-table-data align-right" colSpan={4}>
                                    <Typography className="custom-font" variant="subtitle2" component="b"><strong>Subtotal</strong></Typography>
                                </td>
                                <td className="inv-table-data align-right" colSpan={3}>
                                    {/* <Typography className="custom-font" variant="subtitle2" component="b"><strong>{CartHelper.getCurrencyFormatted(correctSubtotal.toFixed(2))}</strong></Typography> */}
                                    <Typography className="custom-font" variant="subtitle2" component="b"><strong>{CartHelper.getCurrencyFormatted(billingData.sales_data.subtotal)}</strong></Typography>
                                </td>
                            </tr>
                            {billingData.sales_data.applyDisWithoutTax === "0" ?
                                <AdditionalDiscountSummery page="invoice" columnSpan={[5, 4, 3]} />
                                : null}
                            <tr className="inv-table-row">
                                <td colSpan={5}></td>
                                <td className="inv-table-data align-right" colSpan={4}>
                                    <Typography className="custom-font" variant="subtitle2" component="b"><strong>{`Tax ${Number(billingData.sales_data.tax) >= 0 ? '(+)' : ''}`}</strong></Typography>
                                </td>
                                <td className="inv-table-data align-right" colSpan={3}>
                                    <Typography className="custom-font" variant="subtitle2" component="b"><strong>{CartHelper.getCurrencyFormatted(Math.abs(billingData.sales_data.tax))}</strong></Typography>
                                </td>
                            </tr>

                            {/* <tr className="inv-table-row">
                                <td colSpan={5}></td>
                                <td className="inv-table-data align-right" colSpan={4}>
                                    <Typography variant="subtitle2"><strong>Discount</strong></Typography>
                                </td>
                                <td className="inv-table-data align-right" colSpan={3}>
                                    <Typography variant="subtitle2">
                                        <strong>{CartHelper.getCurrencyFormatted(billingData.sales_data.discount)}</strong>
                                    </Typography>
                                </td>
                            </tr> */}

                            {Number(billingData.sales_data?.applyDisWithoutTax) === 1 ?
                                <AdditionalDiscountSummery page="invoice" columnSpan={[5, 4, 3]} />
                                : null}

                            {Number(billingData.sales_data?.misc_charge) > 0 && <tr className="inv-table-row">
                                <td colSpan={4}></td>
                                <td className="inv-table-data align-right" colSpan={4}>
                                    <Typography className="custom-font" variant="subtitle2" component="b"><strong>Packaging Charge</strong></Typography>
                                </td>
                                <td className="inv-table-data align-right" colSpan={4}>
                                    <Typography className="custom-font" variant="subtitle2" component="b"><strong>{CartHelper.getCurrencyFormatted(billingData.sales_data.misc_charge)}</strong></Typography>
                                </td>
                            </tr>}

                            {Number(billingData.sales_data?.delivery_charge) > 0 && <tr className="inv-table-row">
                                <td colSpan={4}></td>
                                <td className="inv-table-data align-right" colSpan={4}>
                                    <Typography className="custom-font" variant="subtitle2" component="b"><strong>Delivery Charge</strong></Typography>
                                </td>
                                <td className="inv-table-data align-right" colSpan={4}>
                                    <Typography className="custom-font" variant="subtitle2" component="b"><strong>{CartHelper.getCurrencyFormatted(billingData.sales_data.delivery_charge)}</strong></Typography>
                                </td>
                            </tr>}

                            {/* misc_charge
 */}

                            <tr className="inv-table-row">
                                <td colSpan={5}></td>
                                <td className="inv-table-data align-right" colSpan={4}>
                                    <Typography className="custom-font print-heading" variant="h6" component="b"><strong>Total Amount</strong>{' '}</Typography>
                                </td>
                                <td className="inv-table-data align-right" colSpan={3}>
                                    <Typography className="custom-font print-heading" variant="h6" component="b"><strong>{CartHelper.getCurrencyFormatted(billingData.sales_data.nettotal)}</strong></Typography>
                                </td>
                            </tr>

                        </tbody>
                    </table>
                    : null}
            </>
        )
    }
}

export default DefaultInvoice;
