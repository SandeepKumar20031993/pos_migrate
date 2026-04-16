import React, { Component } from "react";
import { Box, Typography } from "@material-ui/core";
import CartHelper from "../../../../Helper/cartHelper";
//import AdditionalDiscountSummery from "../../discountCoupon/AdditionalDiscountSummery";
import { getSessionValue } from "../../../../Helper/sessionStorage";
// import StoreHelper from "../../../../Helper/storeHelper";
import StoreHelper from "../../../../Helper/storeHelper";

export class RetailInvoice extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  getTotalOfItems = (items) => {
    var total = 0;
    if (items) {
      items.forEach((item) => {
        total += Number(item.actualMrp) * Number(item.qty);
      });
    }
    return CartHelper.getCurrencyFormatted(total.toFixed(2));
  };

  getTotalSavedAmount = () => {
    var billingData = CartHelper.getBillingData();
    var mrptotal = 0;
    var total = 0;
    if (billingData && billingData.data) {
      billingData.data.forEach((item) => {
        mrptotal += Number(item.actualMrp) * Number(item.qty);
        // let price = CartHelper.getItemPrice(item);
        let price = (Number(item.item_price) * Number(item.qty)).toFixed(2);
        total += Number(price);
      });
    }
    var diff = mrptotal - total;
    var totalSavedAmt = diff;
    return totalSavedAmt;
  };

  getTotalQty = (items) => {
    var qty = 0;
    if (items) {
      items.forEach((item) => {
        qty += Number(item.qty);
      });
    }
    return qty.toFixed(3);
  };

  render() {
    var billingData = CartHelper.getBillingData();
    var totalSavedAmt = this.getTotalSavedAmount();
    let showUnit = getSessionValue("configs_show_unit_invoice"); //StoreHelper.getFromSession('show_unit_invoice');
    let quantity_decimal = StoreHelper.quantityDecimal() ?? 2;
    return (
      <>
        {!CartHelper.isEmpty(billingData) && billingData.success ? (
          <table className="inv-table background-white" colSpan={12}>
            <tbody>
              <tr className="inv-table-row" style={{ borderBottom: "2px solid #333" }}>
                <th className="inv-table-data inv-table-data-left" colSpan={4}>
                  <Typography
                    className="custom-font"
                    variant="subtitle2"
                    component="b"
                  >
                    <strong>Description</strong>
                  </Typography>
                </th>
                <th className="inv-table-head inv-table-data-right" colSpan={2}>
                  <Typography
                    className="custom-font"
                    variant="subtitle2"
                    component="b"
                  >
                    <strong>MRP</strong>
                  </Typography>
                </th>
                {/* <th className="inv-table-head inv-table-data-right" colSpan={1}>
                  <Typography
                    className="custom-font"
                    variant="subtitle2"
                    component="b"
                  >
                    {"Price"}
                  </Typography>
                </th> */}
                <th className="inv-table-head inv-table-data-right" colSpan={2}>
                  <Typography
                    className="custom-font"
                    variant="subtitle2"
                    component="b"
                  >
                    <strong>Qty</strong>
                  </Typography>
                </th>
                <th className="inv-table-head inv-table-data-right" colSpan={2}>
                  <Typography
                    className="custom-font"
                    variant="subtitle2"
                    component="b"
                  >
                    <strong>Dis</strong>

                  </Typography>
                </th>
                <th className="inv-table-head inv-table-data-right" colSpan={2}>
                  <Typography
                    className="custom-font"
                    variant="subtitle2"
                    component="b"
                  >
                    <strong>Amount</strong>
                  </Typography>
                </th>
              </tr>
              {billingData.data.map((product) => (
                <tr key={product.id} className="inv-table-row">
                  <td
                    className="inv-table-data inv-table-data-left"
                    colSpan={4}
                  >
                    <Typography
                      className="custom-font"
                      variant="body2"
                      component="b"
                    >
                      {product.name}
                    </Typography>

                    {product.hsn_code && product.hsn_code !== "111" ? (
                      <Typography
                        className="custom-font"
                        variant="caption"
                        component="span"
                      >
                        <br />
                        HSN:{product.hsn_code}
                      </Typography>
                    ) : null}
                  </td>
                  <td className="inv-table-data inv-table-data-right"
                    colSpan={2}
                  >
                    <Typography
                      className="custom-font"
                      variant="body2"
                      component="b"
                    >
                      {
                        Number(product.actualMrp).toFixed(2)
                      }
                    </Typography>
                  </td>
                  {/* <td
                    className="inv-table-data inv-table-data-right"
                    colSpan={1}
                  >
                    <Typography
                      className="custom-font"
                      variant="body2"
                      component="b"
                    >
                      {CartHelper.getCurrencyFormatted(
                        Number(product.item_price).toFixed(2)
                      )}
                    </Typography>
                  </td> */}
                  <td
                    className="inv-table-data inv-table-data-right"
                    colSpan={2}
                  >
                    <Typography
                      className="custom-font"
                      variant="body2"
                      component="b">
                      {Number(product.qty).toFixed(quantity_decimal)}
                    </Typography>
                    {showUnit && (
                      <Typography
                        className="custom-font"
                        variant="body2"
                        component="b"
                      >
                        {product.unit}
                      </Typography>
                    )}
                  </td>
                  <td
                    className="inv-table-data inv-table-data-right"
                    colSpan={2}
                  >
                    {/* <Typography className="custom-font" variant="body2" component="b">{CartHelper.getItemDisAmtWithCurrency(product)}</Typography> */}
                    <Typography
                      className="custom-font"
                      variant="body2"
                      component="b"
                    >
                      {(
                        Number(product?.actualMrp - product?.item_price) *
                        Number(product?.qty)
                      ).toFixed(2)}
                    </Typography>
                  </td>
                  <td
                    className="inv-table-data inv-table-data-right"
                    colSpan={2}
                  >
                    {/* <Typography
                      className="custom-font"
                      variant="body2"
                      component="b"
                    >
                      {CartHelper.getItemPriceWithCurrency(product)}
                    </Typography> */}
                    <Typography
                      className="custom-font"
                      variant="body2"
                      component="b"
                    >
                      {(
                        Number(product?.item_price) * Number(product.qty)
                      ).toFixed(2)}
                    </Typography>
                  </td>
                </tr>
              ))}

              <tr className="inv-table-row">
                <td colSpan={4}></td>
                <td className="inv-table-data align-right" colSpan={4}>
                  <Typography
                    className="custom-font"
                    variant="subtitle2"
                    component="b"
                  >
                    <strong>Total</strong>

                  </Typography>
                </td>
                <td className="inv-table-data align-right" colSpan={4}>
                  <Typography
                    className="custom-font"
                    variant="subtitle2"
                    component="b"
                  >
                    <strong> {this.getTotalOfItems(billingData.data)}</strong>
                  </Typography>
                </td>
              </tr>

              {Number(totalSavedAmt) > 0 ? (
                <tr className="inv-table-row">
                  <td colSpan={4}></td>
                  <td className="inv-table-data align-right" colSpan={4}>
                    <Typography className="" variant="subtitle2" component="b">
                      <strong>Discount</strong>
                    </Typography>
                  </td>
                  <td className="inv-table-data align-right" colSpan={4}>
                    <Typography className="" variant="subtitle2" component="b">
                      <strong>
                        {CartHelper.getCurrencyFormatted(
                          totalSavedAmt.toFixed(2)
                        )}
                      </strong>
                    </Typography>
                  </td>
                </tr>
              ) : null}

              {billingData.sales_data.applyDisWithoutTax === "0" &&
                Number(billingData.sales_data.tax) !== 0 ? (
                <tr className="inv-table-row">
                  <td colSpan={4}></td>
                  <td className="inv-table-data align-right" colSpan={4}>
                    <Typography
                      className="custom-font"
                      variant="subtitle2"
                      component="b"
                    >
                      <strong>{`Tax ${Number(billingData.sales_data.tax) >= 0 ? '(+)' : '(-)'}`}</strong>
                    </Typography>
                  </td>
                  <td className="inv-table-data align-right" colSpan={4}>
                    <Typography
                      className="custom-font"
                      variant="subtitle2"
                      component="b"
                    >
                      {CartHelper.getCurrencyFormatted(
                        Math.abs(billingData.sales_data.tax)
                      )}
                    </Typography>
                  </td>
                </tr>
              ) : null}

              {/* {billingData.sales_data.applyDisWithoutTax === "0" && Number(billingData.sales_data.tax) > 0 ?
                                <tr className="inv-table-row">
                                    <td colSpan={4}></td>
                                    <td className="inv-table-data align-right" colSpan={4}>
                                        <Typography className="custom-font" variant="subtitle2" component="b">{'Tax'}</Typography>
                                    </td>
                                    <td className="inv-table-data align-right" colSpan={4}>
                                        <Typography className="custom-font" variant="subtitle2" component="b">{CartHelper.getCurrencyFormatted(billingData.sales_data.tax)}</Typography>
                                    </td>
                                </tr>
                                : null} */}

              {/* <AdditionalDiscountSummery page="invoice" columnSpan={[4, 4, 4]} /> */}

              {Number(billingData.sales_data?.misc_charge) > 0 && (
                <tr className="inv-table-row">
                  <td colSpan={4}></td>
                  <td className="inv-table-data align-right" colSpan={4}>
                    <Typography
                      className="custom-font"
                      variant="subtitle2"
                      component="b"
                    >
                      <strong>Packaging Charge</strong>

                    </Typography>
                  </td>
                  <td className="inv-table-data align-right" colSpan={4}>
                    <Typography
                      className="custom-font"
                      variant="subtitle2"
                      component="b"
                    >
                      {CartHelper.getCurrencyFormatted(
                        billingData.sales_data.misc_charge
                      )}
                    </Typography>
                  </td>
                </tr>
              )}

              {Number(billingData.sales_data.delivery_charge) > 0 && (
                <tr className="inv-table-row">
                  <td colSpan={4}></td>
                  <td className="inv-table-data align-right" colSpan={4}>
                    <Typography
                      className="custom-font"
                      variant="subtitle2"
                      component="b"
                    >
                      <strong>Delivery Charge</strong>

                    </Typography>
                  </td>
                  <td className="inv-table-data align-right" colSpan={4}>
                    <Typography
                      className="custom-font"
                      variant="subtitle2"
                      component="b"
                    >
                      {CartHelper.getCurrencyFormatted(
                        billingData.sales_data.delivery_charge
                      )}
                    </Typography>
                  </td>
                </tr>
              )}

              <tr className="inv-table-row">
                <td colSpan={4}></td>
                <td className="inv-table-data align-right" colSpan={4}>
                  <Typography
                    className="custom-font"
                    component="b"
                    style={{ fontWeight: "bold" }}
                  >
                    <strong>To Be Paid </strong>
                  </Typography>
                </td>
                <td className="inv-table-data align-right" colSpan={4}>
                  <Typography
                    className="custom-font"
                    component="b"
                  >
                    <strong>
                      {CartHelper.getCurrencyFormatted(
                        billingData.sales_data.nettotal
                      )}
                    </strong>
                  </Typography>
                </td>
              </tr>

              <tr className="inv-table-row">
                <td colSpan={4}></td>
                <td className="inv-table-data align-right" colSpan={4}>
                  <Typography
                    className="custom-font"
                    variant="body2"
                    component="span"
                  >
                    <strong>Total qty</strong>
                  </Typography>
                </td>
                <td className="inv-table-data align-right" colSpan={4}>
                  <Typography
                    className="custom-font"
                    variant="body2"
                    component="span"
                  >
                    <strong> {this.getTotalQty(billingData.data)} </strong>
                  </Typography>
                </td>
              </tr>

              {Number(totalSavedAmt) > 0 ? (
                <tr className="inv-table-row">
                  <td className="align-left" colSpan={12}>
                    <Box pt={2} style={{ fontWeight: "bold" }}>
                      {totalSavedAmt ? (
                        <Typography
                          className="custom-font print-heading"
                          style={{ fontWeight: "bold" }}
                          component="h2"
                        >
                          <strong>You saved:
                            {CartHelper.getCurrencyFormatted(
                              totalSavedAmt.toFixed(2)
                            )}
                          </strong>
                        </Typography>
                      ) : null}
                    </Box>
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        ) : null
        }
      </>
    );
  }
}

export default RetailInvoice;
