import React, { Component } from 'react';
import { Typography, Box, Grid } from '@material-ui/core';
import CartHelper from '../../Helper/cartHelper'
import StoreHelper from '../../Helper/storeHelper'
import Barcode from "react-barcode"

export class PrintCreditNote extends Component {
    constructor(props) {
        super(props)

        this.state = {

        }
    }

    componentDidMount() {

    }

    render() {
        var credit = CartHelper.getCreditData();
        var langs = StoreHelper.getLangs()
        var cartItems = CartHelper.getCartItems();
        // var summary = CartHelper.getBillSummary();
        var nettotal = CartHelper.getTotalAmount();

        return (
            <Box className="custom-font printable-area" p={1}>
                <>
                    <Box p={0} className="align-center-important">
                        <Typography className="custom-font print-heading" variant="h6" component="b">{StoreHelper.getCompany() !== 'null' ? StoreHelper.getCompany() : ""}</Typography>
                    </Box>
                    <Box p={0} className="align-center-important">
                        <Typography className="custom-font" variant="body2" component="b">{StoreHelper.getConfigAddress() !== "null" ? StoreHelper.getConfigAddress() : ""}</Typography>
                    </Box>
                    <Box p={0} className="align-center-important">
                        <Typography className="custom-font" variant="body2" component="b">{StoreHelper.getUserCity() !== 'null' ? StoreHelper.getUserCity() : ""}{StoreHelper.getUserPincode() !== "null" ? StoreHelper.getUserPincode() : ""}</Typography>
                    </Box>
                    <Box p={0} className="align-center-important">
                        <Typography className="custom-font" variant="body2" component="b">{"Phone: "}{StoreHelper.getConfigPhone() !== "null" ? StoreHelper.getConfigPhone() : ""}</Typography>
                    </Box>
                    <Box p={0} className="align-center-important">
                        <Typography className="custom-font" variant="body2" component="b">{langs.GST ? langs.GST : 'GST'}{':'}{StoreHelper.getGSTNo() !== 'null' ? StoreHelper.getGSTNo() : ""}</Typography>
                    </Box>
                    <Box p={2} className="align-center-important">
                        <Typography className="custom-font print-heading" variant="h6" component="b">{"Credit Note"}</Typography>
                    </Box>

                    <Box p={0} className="align-left background-white">
                        <table className="inv-table" colSpan={12}>
                            <tbody>
                                <tr className="inv-table-row">
                                    <td className="inv-table-data-left" colSpan={6}>
                                        <Typography className="custom-font" variant="subtitle2" component="b">{"CN NO: "}</Typography>
                                    </td>
                                    <td className="inv-table-data-left" colSpan={6}>
                                        <Typography className="custom-font" variant="subtitle2" component="b">{(credit.crRes && credit.crRes.creditnote_no) ? credit.crRes.creditnote_no : ""}</Typography>
                                    </td>
                                </tr>
                                {credit && credit.invoice ?
                                    <tr className="inv-table-row">
                                        <td className="inv-table-data-left" colSpan={6}>
                                            <Typography className="custom-font" variant="subtitle2" component="b">{"INVOICE: "}</Typography>
                                        </td>
                                        <td className="inv-table-data-left" colSpan={6}>
                                            <Typography className="custom-font" variant="subtitle2" component="b">{credit.invoice}</Typography>
                                        </td>
                                    </tr>
                                    : null
                                }
                                {credit.credData && credit.credData.customer && credit.credData.customer.phone_number ?
                                    <tr className="inv-table-row">
                                        <td className="inv-table-data-left" colSpan={6}>
                                            <Typography className="custom-font" variant="subtitle2" component="b">{"Mobile: "}</Typography>
                                        </td>
                                        <td className="inv-table-data-left" colSpan={6}>
                                            <Typography className="custom-font" variant="subtitle2" component="b">{credit.credData.customer.phone_number}</Typography>
                                        </td>
                                    </tr>
                                    : null}
                            </tbody>
                        </table>
                        <table className="inv-table background-white" colSpan={12}>
                            <tbody>
                                <tr className="inv-table-row">
                                    <th className="inv-table-data inv-table-data-left" colSpan={5}>
                                        <Typography className="custom-font" variant="subtitle2" component="b">{'Description'}</Typography>
                                    </th>
                                    <th className="inv-table-head inv-table-data-right" colSpan={2}>
                                        <Typography className="custom-font" variant="subtitle2" component="b">{'Rate'}</Typography>
                                    </th>
                                    <th className="inv-table-head inv-table-data-right" colSpan={2}>
                                        <Typography className="custom-font" variant="subtitle2" component="b">{'Qty'}</Typography>
                                    </th>
                                    <th className="inv-table-head inv-table-data-right" colSpan={3}>
                                        <Typography className="custom-font" variant="subtitle2" component="b">{'Amount'}</Typography>
                                    </th>
                                </tr>

                                {cartItems.map(product => (
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
                                            <Typography className="custom-font" variant="body2" component="b">{CartHelper.getCurrencyFormatted(Number(product.finalprice).toFixed(2))}</Typography>
                                        </td>
                                        <td className="inv-table-data inv-table-data-right" colSpan={2}>
                                            <Typography className="custom-font" variant="body2" component="b">{Number(product.qty).toFixed(3)}</Typography>
                                        </td>
                                        <td className="inv-table-data inv-table-data-right" colSpan={3}>
                                            <Typography className="custom-font" variant="body2" component="b">{CartHelper.getCurrencyFormatted(Number(product.finalprice * product.qty).toFixed(2))}</Typography>
                                        </td>
                                    </tr>
                                ))}

                                {/* <tr className="inv-table-row">
                                    <td colSpan={5}></td>
                                    <td className="inv-table-data align-right" colSpan={4}>
                                        <Typography className="custom-font" variant="subtitle2" component="b">{'Subtotal'}</Typography>
                                    </td>
                                    <td className="inv-table-data align-right" colSpan={3}>
                                        <Typography className="custom-font" variant="subtitle2" component="b">{CartHelper.getCurrencyFormatted(summary.subtotal)}</Typography>
                                    </td>
                                </tr>

                                <tr className="inv-table-row">
                                    <td colSpan={5}></td>
                                    <td className="inv-table-data align-right" colSpan={4}>
                                        <Typography className="custom-font" variant="subtitle2" component="b">{'Tax'}</Typography>
                                    </td>
                                    <td className="inv-table-data align-right" colSpan={3}>
                                        <Typography className="custom-font" variant="subtitle2" component="b">{CartHelper.getCurrencyFormatted(summary.taxamount)}</Typography>
                                    </td>
                                </tr> */}

                                <tr className="inv-table-row">
                                    <td colSpan={5}></td>
                                    <td className="inv-table-data align-right" colSpan={4}>
                                        <Typography className="custom-font print-heading" variant="h6" component="b">{'Net Amount'}</Typography>
                                    </td>
                                    <td className="inv-table-data align-right" colSpan={3}>
                                        <Typography className="custom-font print-heading" variant="h6" component="b">{CartHelper.getCurrencyFormatted(nettotal)}</Typography>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </Box>


                    <Box p={1} />

                    <Box p={1} />
                    <Box>
                        {(credit.crRes && credit.crRes.creditnote_no) ?
                            <Grid container direction="row" justify="center" >
                                <Grid item>
                                    <Barcode value={credit.crRes.creditnote_no} height={50} fontSize={12} />
                                </Grid>
                            </Grid>
                            : null
                        }
                    </Box>
                    {/* <Box p={0} className="align-left">
                        <Typography className="custom-font" variant="body2" component="b">{StoreHelper.getReturnPolicy()}</Typography>
                    </Box> */}
                </>
            </Box>
        )
    }
}

export default PrintCreditNote;
