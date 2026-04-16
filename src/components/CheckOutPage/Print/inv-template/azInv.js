import React, { Component } from 'react';
import { Typography } from '@material-ui/core';
import CartHelper from '../../../../Helper/cartHelper'
import AdditionalDiscountSummery from '../../discountCoupon/AdditionalDiscountSummery'
import { getSessionValue } from '../../../../Helper/sessionStorage';
import StoreHelper from './../../../../Helper/storeHelper'

export class AZInvoice extends Component {
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
    /*     getTaxNames: function (products) {
            var TaxNamesArray = []
            products.forEach(product => {
                if (TaxNamesArray.length === 0 && JSON.stringify(TaxNamesArray) !== JSON.stringify(product.tax_names)) {
                    TaxNamesArray = product.tax_names
                }
            });
            return TaxNamesArray;
        }, */

    getTaxSlab = (product, data) => {
        let myarr = product.tax_names_rates;
        if (myarr) {
            let arraycontainsdata = (myarr.hasOwnProperty(data));
            if (arraycontainsdata) {
                let arraycontainsdata = (product.price) ? product.price * Number(myarr[data]) / 100 : 0;

                return Number(arraycontainsdata).toFixed(2);
                //return product.item_calc_tax / 2 ;
            }
        }

        return "0.00";

    }

    render() {
        var billingData = CartHelper.getBillingData();
        let showUnit = getSessionValue('configs_show_unit_invoice');//StoreHelper.getFromSession('show_unit_invoice');
        let quantity_decimal = StoreHelper.quantityDecimal() ?? 2;

        // console.log("p",billingData);
        return (
            <>
                {!CartHelper.isEmpty(billingData) && billingData.success ?
                    <table className="inv-table background-white" colSpan={12}>
                        <tbody>
                            <tr className="inv-table-row" style={{ borderBottom: "2px solid #333" }}>
                                <th className="inv-table-data inv-table-data-left" colSpan={2}>
                                    <Typography className="custom-font" variant="subtitle2" component="b">{'Description Of Goods'}</Typography>
                                </th>
                                <th className="inv-table-head inv-table-data-right" colSpan={1}>
                                    <Typography className="custom-font" variant="subtitle2" component="b">{'HSN Code'}</Typography>
                                </th>
                                <th className="inv-table-head inv-table-data-right" colSpan={1}>
                                    <Typography className="custom-font" variant="subtitle2" component="b">{'Qty'}</Typography>
                                </th>
                                <th className="inv-table-head inv-table-data-right" colSpan={1}>
                                    <Typography className="custom-font" variant="subtitle2" component="b">{'Rate'}</Typography>
                                </th>
                                <th className="inv-table-head inv-table-data-right" colSpan={1}>
                                    <Typography className="custom-font" variant="subtitle2" component="b">{'Per'}</Typography>
                                </th>
                                <th className="inv-table-head inv-table-data-right" colSpan={1}>
                                    <Typography className="custom-font" variant="subtitle2" component="b">{'Amount'}</Typography>
                                </th>

                                <th className="inv-table-head inv-table-data-right" colSpan={1}>
                                    <Typography className="custom-font" variant="subtitle2" component="b">{'GST'}</Typography>
                                </th>
                                <th className="inv-table-head inv-table-data-right" colSpan={1}>
                                    <Typography className="custom-font" variant="subtitle2" component="b">{'CGST'}</Typography>
                                </th>
                                <th className="inv-table-head inv-table-data-right" colSpan={1}>
                                    <Typography className="custom-font" variant="subtitle2" component="b">{'SGST'}</Typography>
                                </th>
                                <th className="inv-table-head inv-table-data-right" colSpan={2}>
                                    <Typography className="custom-font" variant="subtitle2" component="b">{'Total'}</Typography>
                                </th>

                            </tr>

                            {billingData.data.map(product => (
                                <tr key={product.id} className="inv-table-row " m={2} pt={3} >
                                    <td className="inv-table-data inv-table-data-left" colSpan={2}>
                                        <Typography className="custom-font" variant="body2" component="b">{product.name}</Typography>

                                    </td>

                                    <td className="inv-table-data inv-table-data-right" colSpan={1}>
                                        {product.hsn_code && product.hsn_code !== '111' ?
                                            <Typography className="custom-font" variant="body2" component="b">
                                                {product.hsn_code}
                                            </Typography>
                                            : null}
                                    </td>
                                    <td className="inv-table-data inv-table-data-right" colSpan={1}>
                                        <Typography className="custom-font" variant="body2" component="b">{Number(product.qty).toFixed(quantity_decimal)}</Typography>

                                    </td>
                                    <td className="inv-table-data inv-table-data-right" colSpan={1}>
                                        <Typography className="custom-font" variant="body2" component="b">{this.getPrice(product).toFixed(2)}</Typography>
                                    </td>

                                    <td className="inv-table-data inv-table-data-right" colSpan={1}>
                                        <Typography className="custom-font" variant="body2" component="b">{product.unit}</Typography>
                                    </td>

                                    <td className="inv-table-data inv-table-data-right" colSpan={1}>
                                        <Typography className="custom-font" variant="body2" component="b">{Number(product.finalprice).toFixed(2)}</Typography>
                                    </td>


                                    <td className="inv-table-data inv-table-data-right" colSpan={1}>
                                        <Typography className="custom-font" variant="body2" component="b">{product.tax}{' %'}</Typography>
                                    </td>
                                    <td className="inv-table-data inv-table-data-right" colSpan={1}>
                                        <Typography className="custom-font" variant="body2" component="b">{this.getTaxSlab(product, 'CGST')}</Typography>
                                    </td>
                                    <td className="inv-table-data inv-table-data-right" colSpan={1}>
                                        <Typography className="custom-font" variant="body2" component="b">{this.getTaxSlab(product, 'SGST')}</Typography>
                                    </td>
                                    <td className="inv-table-data inv-table-data-right" colSpan={1}>
                                        <Typography className="custom-font" variant="body2" component="b">{Number(product.finalprice * Number(product.qty)).toFixed(2)}</Typography>
                                        {/* {showUnit &&
                                            <Typography className="custom-font" variant="body2" component="b">{product.unit}</Typography>
                                        } */}
                                    </td>

                                </tr>
                            ))}



                            <tr className="inv-table-row " >
                                <td className="inv-table-data inv-table-data-right" colSpan={2}>
                                    <Typography className="custom-font" variant="body2" component="b">{'Total'}</Typography>

                                </td>

                                <td className="inv-table-data inv-table-data-right" colSpan={1}>
                                </td>

                                <td className="inv-table-data inv-table-data-right" colSpan={1}>
                                    <Typography className="custom-font" variant="body2" component="b"> {this.getTotalQty(billingData.data)}</Typography>
                                </td>
                                <td className="inv-table-data inv-table-data-right" colSpan={1}>
                                </td>

                                <td className="inv-table-data inv-table-data-right" colSpan={1}>
                                </td>

                                <td className="inv-table-data inv-table-data-right" colSpan={1}>
                                </td>
                                <td className="inv-table-data inv-table-data-right" colSpan={1}>
                                    <Typography className="custom-font" variant="body2" component="b">{ }</Typography>
                                </td>
                                <td className="inv-table-data inv-table-data-right" colSpan={1}>
                                </td>
                                <td className="inv-table-data inv-table-data-right" colSpan={1}>
                                </td>
                                <td className="inv-table-data inv-table-data-right" colSpan={1}>
                                    <Typography className="custom-font" variant="body2" component="b">{CartHelper.getCurrencyFormatted(billingData.sales_data.nettotal)}</Typography>
                                </td>
                            </tr>





                            {/*                             <tr className="inv-table-row">
                                <td colSpan={5}></td>
                                <td className="inv-table-data align-right" colSpan={4}>
                                    <Typography className="custom-font" variant="subtitle2" component="b">{'Subtotal'}</Typography>
                                </td>
                                <td className="inv-table-data align-right" colSpan={3}>
                                    <Typography className="custom-font" variant="subtitle2" component="b">{CartHelper.getCurrencyFormatted(billingData.sales_data.subtotal)}</Typography>
                                </td>
                            </tr>
                            {billingData.sales_data.applyDisWithoutTax === "0" ?
                                <AdditionalDiscountSummery page="invoice" columnSpan={[5, 4, 3]} />
                                : null}
                            <tr className="inv-table-row">
                                <td colSpan={5}></td>
                                <td className="inv-table-data align-right" colSpan={4}>
                                    <Typography className="custom-font" variant="subtitle2" component="b">{'Tax'}</Typography>
                                </td>
                                <td className="inv-table-data align-right" colSpan={3}>
                                    <Typography className="custom-font" variant="subtitle2" component="b">{CartHelper.getCurrencyFormatted(billingData.sales_data.tax)}</Typography>
                                </td>
                            </tr>
                            {billingData.sales_data.applyDisWithoutTax === "1" ?
                                <AdditionalDiscountSummery page="invoice" columnSpan={[5, 4, 3]} />
                                : null}

                            <tr className="inv-table-row">
                                <td colSpan={5}></td>
                                <td className="inv-table-data align-right" colSpan={4}>
                                    <Typography className="custom-font print-heading" variant="h6" component="b">{'Paid Amount '}</Typography>
                                </td>
                                <td className="inv-table-data align-right" colSpan={3}>
                                    <Typography className="custom-font print-heading" variant="h6" component="b">{CartHelper.getCurrencyFormatted(billingData.sales_data.nettotal)}</Typography>
                                </td>
                            </tr>
                            <tr className="inv-table-row">
                                <td colSpan={5}></td>
                                <td className="inv-table-data align-right" colSpan={4}>
                                    <Typography className="custom-font" variant="body2" component="span">{'Total qty'}</Typography>
                                </td>
                                <td className="inv-table-data align-right" colSpan={3}>
                                    <Typography className="custom-font" variant="body2" component="span">{this.getTotalQty(billingData.data)}</Typography>
                                </td>
                            </tr> */}
                        </tbody>
                    </table>
                    : null}
            </>
        )
    }
}

export default AZInvoice;
