import React, { Component } from "react";
import { Typography, Box, Grid, Divider } from "@material-ui/core";
import CartHelper from "../../../Helper/cartHelper";
import StoreHelper from "../../../Helper/storeHelper";
// import PaymentDetails from "./paymentDetails";
import TaxDetails from "./taxDetails";
import Barcode from "react-barcode";
import { toWords } from "number-to-words";
import OtherInvoice from "../../CheckOutPage/Print/inv-template/otherInv";
import GroceryInvoice from "../../CheckOutPage/Print/inv-template/groceryInv";
import DefaultInvoice from "../../CheckOutPage/Print/inv-template/defaultInv";
import AZInvoice from "../../CheckOutPage/Print/inv-template/azInv";
import TaxInvoice from "../../CheckOutPage/Print/inv-template/taxInv";
import RetailInvoice from "../../CheckOutPage/Print/inv-template/RetailInvoice";
import InvoiceWithoutTax from "../../CheckOutPage/Print/inv-template/invwithouttax";
import { QRCodeCanvas } from 'qrcode.react';
import dayjs from "dayjs";

export class SalesReportPrint extends Component {
  getCreditNoteDetais(billData) {
    // console.log("billData:", billData);
    if (
      billData?.sales_data?.discount_detail &&
      JSON.parse(billData?.sales_data?.discount_detail).length
    ) {
      let detail = JSON.parse(billData?.sales_data?.discount_detail)?.find(
        (item) => item?.type === "creditnote"
      );

      return detail;
    }
    return null;
  }

  capitalizeFirstLetter(string) {
    // return string.charAt(0).toUpperCase() + string.slice(1);
    return string.replace(/\b\w/g, (char) => char.toUpperCase());
  }

  convertToWords = (num) => {
    const [integerPart, fractionalPart] = num.toString().split(".");
    const integerWords = this.capitalizeFirstLetter(toWords(integerPart));
    var fractionalWords = "";
    if (fractionalPart > 0) {
      // console.log(fractionalPart);
      fractionalWords =
        " and " +
        this.capitalizeFirstLetter(toWords(fractionalPart)) +
        " paise ";
    }
    // console.log(fractionalWords);

    // const fractionalWords = fractionalPart ? `and ${fractionalPart.split('').map(toWords).join(' ')} paise` : '';
    return `${integerWords} ${fractionalWords}`;
  };

  renderPolicy = () => {
    let policyText = StoreHelper.getReturnPolicy();
    if (!policyText) policyText = ""; // fallback to empty 
    const formattedText = policyText.replace(/\n/g, "<br/>");
    return { __html: formattedText };
  };

  render() {
    var billingData = CartHelper.getBillingData();
    var responseData = CartHelper.getResponseData();
    var langs = StoreHelper.getLangs();

    // var getCheckoutData = CartHelper.getCheckoutData();
    // console.log("billingData:", responseData);

    // Format the date
    // var responseData = CartHelper.getResponseData();

    // const fixedDateStr = responseData.date.replace(/\//g, "-"); // '2025-08-07T10:23:30.000000Z'
    // const dateObj = new Date(fixedDateStr);

    // // Make sure dateObj is valid
    // if (isNaN(dateObj)) {
    //   console.error("Invalid date format:", fixedDateStr);
    // } else {
    //   const formattedDate = `${dateObj.getDate().toString().padStart(2, '0')}-${(dateObj.getMonth() + 1)
    //     .toString()
    //     .padStart(2, '0')}-${dateObj.getFullYear()} ${dateObj.toLocaleTimeString([], {
    //       hour: '2-digit',
    //       minute: '2-digit',
    //     })}`;

    //   console.log("formattedDate:", formattedDate);
    // }

    const formattedDate = dayjs(responseData.date.replace(/\//g, "-")).format("DD-MM-YYYY hh:mm A");
    // console.log("formattedDate:", formattedDate);

    const credit_note = this.getCreditNoteDetais(billingData);

    var getInvTemp = StoreHelper.getInvTemp();
    var isAzTemplate = false;
    if (getInvTemp && getInvTemp === "enterPrise") {
      isAzTemplate = true;
    }

    // UPI helpers and guards
    const upiIdRaw = StoreHelper.getFromSession('enter_upi_id') || '';
    console.log('UPI ID Raw:', upiIdRaw);
    const upiId = upiIdRaw ? upiIdRaw.toString() : '';
    console.log('UPI ID:', upiId);
    const upiHandle = StoreHelper.getFromSession('enter_upi_handle') || 'ibl';
    const upiAmountFull = billingData?.sales_data?.nettotal ?? 0;
    console.log('UPI Amount Full:', upiAmountFull);
    console.log('Payment Type:', billingData?.sales_data?.payment_type);
    const upiAmountRemaining = (typeof CartHelper.getUpiAmount === 'function') ? CartHelper.getUpiAmount(billingData.sales_data) : 0;
    console.log('UPI Amount Remaining:', upiAmountRemaining);
    const upiUriFull = `upi://pay?pa=${upiId}${upiHandle ? '@' + upiHandle : ''}&am=${upiAmountFull}`;
    const upiUriRemaining = `upi://pay?pa=${upiId}${upiHandle ? '@' + upiHandle : ''}&am=${upiAmountRemaining}`;
    console.log('Full URI:', upiUriFull);
    console.log('Session Storage:', sessionStorage.getItem('enter_upi_id'));



    return (
      <Box className="custom-font printable-area" p={1}>
        {!CartHelper.isEmpty(billingData) && billingData.success ? (
          <>
            {isAzTemplate ? (
              <>
                {StoreHelper.getCompany() !== "null" ? (
                  <Box p={0}>
                    <Grid container spacing={2}>
                      <Grid item xs={4}>
                        <Typography
                          style={{ fontWeight: "bold" }}
                          className="custom-font align-left-important"
                          variant="h2"
                          component="h2"

                        >
                          <strong>
                            {StoreHelper.getCompany()}
                          </strong>
                        </Typography>
                        <Typography
                          className="custom-font"
                          variant="body2"
                          component="p"
                        >
                          {"GSTIN : "}
                          {StoreHelper.getGSTNo()}
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        {/* <Typography className="custom-font" variant="body2" component="p">{"Tax Amt"}</Typography> */}
                      </Grid>
                    </Grid>
                  </Box>
                ) : null}

                <Box p={0} className="align-left-important">
                  <Typography
                    className="custom-font"
                    variant="body2"
                    component="b"
                  >
                    {StoreHelper.getConfigAddress() !== "null"
                      ? StoreHelper.getConfigAddress()
                      : ""}
                  </Typography>
                </Box>

                {StoreHelper.getConfigPhone() !== "null" ? (
                  <Box p={0} className="align-left-important">
                    <Typography
                      className="custom-font"
                      variant="body2"
                      component="b"
                    >
                      {"Phone:"}
                      {StoreHelper.getConfigPhone()} {", E-mail:"}
                      {StoreHelper.getConfigEmail()}
                    </Typography>
                  </Box>
                ) : null}

                <Divider className="mb={1} mt={1}" />
                <Box p={1}>
                  <Grid container spacing={2}>
                    <Grid item xs={4}>
                      {/* <Typography
                                                className="custom-font"
                                                variant="body2"
                                                component="p">
                                                {"State :"}
                                                {StoreHelper.getUserCity() !== "null"
                                                    ? StoreHelper.getUserCity()
                                                    : ""}
                                                {StoreHelper.getUserPincode() !== "null"
                                                    ? StoreHelper.getUserPincode()
                                                    : ""}
                                            </Typography> */}
                    </Grid>
                    <Grid item xs={4}>
                      <Typography
                        className="custom-font align-center-important"
                        variant="body2"
                        component="p"
                      >
                        <strong>TAX INVOICE</strong>
                      </Typography>
                    </Grid>
                    <Grid item xs={4}>
                      {/* <Typography className="custom-font" variant="body2" component="p">{"Tax Amt"}</Typography> */}
                    </Grid>
                  </Grid>
                </Box>

                <Divider className="mb={1} mt={1}" />

                <Box p={1}>
                  <Grid container spacing={0}>
                    <Grid item xs={4}>
                      <Typography
                        className="custom-font"
                        variant="body2"
                        component="p"
                      >
                        {"Invoice No: "} {responseData.invoice_num}
                      </Typography>
                      <Typography
                        className="custom-font"
                        variant="body2"
                        component="p"
                      >
                        {"Invoice Date :"}
                        {responseData.date}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>

                <Divider className="mb={1} mt={1}" />
              </>
            ) : (
              <>
                {StoreHelper.showLogoInBill() &&
                  StoreHelper.getCompanyLogo() ? (
                  <Box pb={1} className="align-center-important">
                    <img
                      className="company-logo"
                      src={StoreHelper.getCompanyLogo()}
                      alt="Logo"
                    />
                  </Box>
                ) : null}
                {StoreHelper.showBrandNameInBill() &&
                  StoreHelper.getBrandName() && (
                    <Box p={0} className="align-center-important">
                      <Typography
                        className="custom-font print-heading"
                        variant="h6"
                        component="b"
                      >
                        {StoreHelper.getBrandName()}
                      </Typography>
                    </Box>
                  )}
                {StoreHelper.getCompany() !== "null" ? (
                  <Box p={0} className="align-center-important">
                    <Typography
                      className="custom-font print-heading"
                      variant="h2"
                      component="b"
                    >
                      <strong> {StoreHelper.getCompany()}</strong>

                    </Typography>
                  </Box>
                ) : null}

                <Box p={0} className="align-center-important">
                  <Typography
                    className="custom-font"
                    variant="body2"
                    component="b"
                  >
                    {StoreHelper.getConfigAddress() !== "null"
                      ? StoreHelper.getConfigAddress()
                      : ""}
                  </Typography>
                </Box>
                <Box p={0} className="align-center-important">
                  <Typography
                    className="custom-font"
                    variant="body2"
                    component="b"
                  >
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
                      component="b"
                    >
                      <strong>Phone:

                        {StoreHelper.getConfigPhone()}
                      </strong>
                    </Typography>
                  </Box>
                ) : null}
                {StoreHelper.showEmailInBill() &&
                  StoreHelper.getConfigEmail() !== "null" ? (
                  <Box p={0} className="align-center-important">
                    <Typography
                      className="custom-font"
                      variant="body2"
                      component="b"
                    >
                      <strong>Email:</strong>
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
                      component="b"
                    >
                      {StoreHelper.getConfigWebsite()}
                    </Typography>
                  </Box>
                ) : null}
                {StoreHelper.getGSTNo() !== "null" ? (
                  <Box p={0} className="align-center-important">
                    <Typography
                      className="custom-font"
                      variant="body2"
                      component="b"
                    >
                      <strong> {langs.GST ? langs.GST : "GST"}
                        {":"}
                        {StoreHelper.getGSTNo()}</strong>

                    </Typography>
                  </Box>
                ) : null}
                <Box p={2} className="align-center-important">
                  {StoreHelper.getInvTemp() === "estimation" ? (
                    <Typography
                      className="custom-font print-heading"
                      variant="h6"
                      component="b"
                    >
                      {"Estimation"}
                    </Typography>
                  ) : (
                    <Typography
                      className="custom-font print-heading"
                      variant="h6"
                      component="b"
                    >
                      <strong>TAX INVOICE</strong>

                    </Typography>
                  )}
                </Box>
              </>
            )}

            {isAzTemplate ? (
              <>
                <Box p={1}>
                  <Grid item xs={12}>
                    {billingData.customer.customer_name ? (
                      <tr className="inv-table-row">
                        <td className="inv-table-data-left" colSpan={6}>
                          <Typography
                            className="custom-font"
                            variant="subtitle2"
                            component="b"
                          >
                            {"Name : "}
                          </Typography>
                        </td>
                        <td className="inv-table-data-left" colSpan={6}>
                          <Typography
                            className="custom-font"
                            variant="subtitle2"
                            component="b"
                          >
                            {billingData.customer.customer_name}
                          </Typography>
                        </td>
                      </tr>
                    ) : null}
                  </Grid>

                  <Grid item xs={12}>
                    {billingData.customer.phone_number ? (
                      <tr className="inv-table-row">
                        <td className="inv-table-data-left" colSpan={6}>
                          <Typography
                            className="custom-font"
                            variant="subtitle2"
                            component="b"
                          >
                            {"Mobile: "}
                          </Typography>
                        </td>
                        <td className="inv-table-data-left" colSpan={6}>
                          <Typography
                            className="custom-font"
                            variant="subtitle2"
                            component="b"
                          >
                            {billingData.customer.phone_number}
                          </Typography>
                        </td>
                      </tr>
                    ) : null}
                  </Grid>

                  <Grid item xs={12}>
                    {billingData?.sales_person_data ? (
                      <tr className="inv-table-row">
                        <td className="inv-table-data-left" colSpan={6}>
                          <Typography
                            className="custom-font"
                            variant="subtitle2"
                            component="b"
                          >
                            {"Sales Person: "}
                          </Typography>
                        </td>
                        <td className="inv-table-data-left" colSpan={6}>
                          <Typography
                            className="custom-font"
                            variant="subtitle2"
                            component="b"
                          >
                            {`${billingData?.sales_person_data?.first_name}  ${billingData?.sales_person_data?.last_name}`}
                          </Typography>
                        </td>
                      </tr>
                    ) : null}
                  </Grid>

                  {/* <Grid item xs={12}>
                                        <Typography
                                            className="custom-font"
                                            variant="subtitle2"
                                            component="b">
                                            {"GSTIN : "}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography
                                            className="custom-font"
                                            variant="subtitle2"
                                            component="b">
                                            {"State : "}
                                        </Typography>
                                    </Grid> */}
                </Box>
                <Divider className="" />
              </>
            ) : (
              <Box p={0} className="align-left background-white">
                <table className="inv-table" colSpan={12}>
                  <tbody>
                    <tr className="inv-table-row">
                      <td className="inv-table-data-left" colSpan={6}>
                        <Typography
                          className="custom-font"
                          variant="subtitle2"
                          component="b"
                        >
                          <strong>Invoice No:</strong>
                        </Typography>
                      </td>
                      <td className="inv-table-data-left" colSpan={6}>
                        <Typography
                          className="custom-font"
                          variant="subtitle2"
                          component="b"
                        >
                          {responseData.invoice_num}
                        </Typography>
                      </td>
                    </tr>
                    <tr className="inv-table-row">
                      <td className="inv-table-data-left" colSpan={6}>
                        <Typography
                          className=""
                          variant="subtitle2"
                          component="b"
                        >

                          <strong>Date:</strong>
                        </Typography>
                      </td>
                      <td className="inv-table-data-left" colSpan={6}>
                        <Typography
                          className=""
                          variant="subtitle2"
                          component="b"
                        >
                          {formattedDate}
                        </Typography>
                      </td>
                    </tr>

                    {billingData.customer.customer_name ? (
                      <tr className="inv-table-row">
                        <td className="inv-table-data-left" colSpan={6}>
                          <Typography
                            className=""
                            variant="subtitle2"
                            component="b"
                          >
                            <strong>Bill To:</strong>
                          </Typography>
                        </td>
                        <td className="inv-table-data-left" colSpan={6}>
                          <Typography
                            className=""
                            variant="subtitle2"
                            component="b"
                          >
                            {billingData.customer.customer_name}
                          </Typography>
                        </td>
                      </tr>
                    ) : null}

                    {billingData.customer.phone_number ? (
                      <tr className="inv-table-row">
                        <td className="inv-table-data-left" colSpan={6}>
                          <Typography
                            className="custom-font"
                            variant="subtitle2"
                            component="b"
                          >
                            {"Mobile: "}
                          </Typography>
                        </td>
                        <td className="inv-table-data-left" colSpan={6}>
                          <Typography
                            className="custom-font"
                            variant="subtitle2"
                            component="b"
                          >
                            {billingData.customer.phone_number}
                          </Typography>
                        </td>
                      </tr>
                    ) : null}

                    {billingData?.sales_person_data ? (
                      <tr className="inv-table-row">
                        <td className="inv-table-data-left" colSpan={6}>
                          <Typography
                            className="custom-font"
                            variant="subtitle2"
                            component="b"
                          >
                            {"Sales Person: "}
                          </Typography>
                        </td>
                        <td className="inv-table-data-left" colSpan={6}>
                          <Typography
                            className="custom-font"
                            variant="subtitle2"
                            component="b"
                          >
                            {`${billingData?.sales_person_data?.first_name}  ${billingData?.sales_person_data?.last_name}`}
                          </Typography>
                        </td>
                      </tr>
                    ) : null}
                    {/* sales_person_data */}
                  </tbody>
                </table>
              </Box>
            )}

            <Box p={0} />

            {StoreHelper.getInvTemp() === "retail" ? (
              <RetailInvoice />
            ) : StoreHelper.getInvTemp() === "enterPrise" ? (
              <AZInvoice />
            ) : StoreHelper.getInvTemp() === "tax" ? (
              <TaxInvoice />
            ) : StoreHelper.getInvTemp() === "default" ? (
              <DefaultInvoice />
            ) : StoreHelper.getInvTemp() === "grocery" ? (
              <GroceryInvoice />
            ) : StoreHelper.getInvTemp() === "othertpl" ? (
              <OtherInvoice />
            ) : StoreHelper.getInvTemp() === "invwithouttax" ? (
              <InvoiceWithoutTax />
            ) : StoreHelper.getInvTemp() === "estimation" ? (
              <OtherInvoice />
            ) : (
              <DefaultInvoice /> // fallback to default
            )}
            <Box p={1} />
            <Typography style={{ fontWeight: "bold" }}>
              Payments : {billingData?.sales_data?.payments}
            </Typography>
            {StoreHelper.getInvTemp() === "enterPrise" ? (
              <Typography style={{ fontWeight: "bold" }}>
                Amount in Words : Rs
                {this.convertToWords(billingData?.sales_data?.nettotal)}
                {" Only"}
              </Typography>
            ) : (
              ""
            )}
            {billingData.sales_data?.payment_type === "CREDIT" ? (
              <>
                {Number(billingData.sales_data?.paid_amt) > 0 &&
                  Number(billingData.sales_data?.credit_amt) > 0 ? (
                  <Box>
                    <Typography style={{ fontWeight: "bold" }}>
                      Paid Amount :
                      {CartHelper.getCurrencyFormatted(Number(billingData.sales_data?.paid_amt))}
                    </Typography>
                    <Typography style={{ fontWeight: "bold" }}>
                      Credit Balance :
                      {CartHelper.getCurrencyFormatted(billingData.sales_data?.credit_amt ?? 0)}
                    </Typography>
                  </Box>
                ) : null}
              </>
            ) : (
              <>
                {credit_note && (
                  <Box>
                    <Typography style={{ fontWeight: "bold" }}>
                      Paid Amount :
                      {CartHelper.getCurrencyFormatted(Number(billingData.sales_data?.nettotal))}
                    </Typography>
                    <Typography style={{ fontWeight: "bold" }}>
                      CreditNote Applied -{credit_note?.reference} :
                      {CartHelper.getCurrencyFormatted(credit_note?.discount ?? 0)}
                    </Typography>
                  </Box>
                )}
              </>
            )}

            {/* <PaymentDetails /> */}
            <Box />
            {StoreHelper.getInvTemp() === "estimation" ? null : <TaxDetails />}
            {/* <Typography style={{ fontWeight: "bold", paddingTop: "2%" }}>
              {" "}
              Tax Amount (in words) : Rs{" "}
              {this.convertToWords(billingData?.sales_data?.tax)} {" Only"}
            </Typography> */}

            <Box p={1} />
            {/* <ReturnDetails /> */}
            {StoreHelper.showBarCodeInInvoice() ? (
              <Box>
                <Grid container direction="row" justifyContent="center">
                  <Grid item>
                    <Barcode
                      value={responseData.invoice_num}
                      height={50}
                      fontSize={12}
                    />
                  </Grid>
                </Grid>
              </Box>
            ) : (
              ""
            )}
            <Typography style={{ fontWeight: "bold" }}>
              TERMS & CONDITIONS
            </Typography>
            <Box p={0} className="align-left">
              <Typography
                className="custom-font"
                variant="body2"
                dangerouslySetInnerHTML={this.renderPolicy()}
              ></Typography>
            </Box>
            {StoreHelper.getInvTemp() === "enterPrise" ? (
              <Box className="align-right">
                <Typography style={{ fontWeight: "bold" }}></Typography>

                <Typography style={{ fontWeight: "bold" }}>
                  Authorised Signatory
                </Typography>
              </Box>
            ) : (
              ""
            )}

            {/* {billingData.sales_data?.payment_type === "UPI" ? (
              <Box className="align-center-important" mt={2}>
                <Typography variant="subtitle1" style={{ fontWeight: "bold" }}>
                  Debug Info:
                </Typography>
                <Typography variant="caption" display="block">
                  UPI ID Present: {upiId ? 'Yes' : 'No'}<br />
                  Amount Valid: {Number(upiAmountFull) > 0 ? 'Yes' : 'No'}<br />
                  Payment Type: {billingData.sales_data?.payment_type}<br />
                  Amount: {upiAmountFull}
                </Typography>
                {upiIdRaw || upiId ? (
                  <>
                    <Typography variant="subtitle1" style={{ fontWeight: "bold" }}>
                      Scan to Pay via UPI
                    </Typography>
                    <QRCodeCanvas value={upiUriFull} size={128} />
                  </>
                ) : (
                  <Typography variant="caption" color="error">
                    UPI QR not available. UPI ID missing.<br />
                    Raw UPI: {upiIdRaw}<br />
                    Processed UPI: {upiId}
                  </Typography>
                )}
              </Box>
            ) : null} */}

            {/* {billingData.sales_data?.payment_type === "OTHER" && upiAmountRemaining > 0 ? (
              upiId ? (
                <Box className="align-center-important" mt={2}>
                  <Typography variant="subtitle1" style={{ fontWeight: "bold" }}>
                    Scan to Pay Remaining via UPI
                  </Typography>
                  <QRCodeCanvas value={upiUriRemaining} size={128} />
                </Box>
              ) : (
                <Box className="align-center-important" mt={1}>
                  <Typography variant="caption" color="error">
                    UPI QR not available for remaining amount. UPI id missing.
                  </Typography>
                  <Typography variant="caption" display="block">
                    {`uri: ${upiUriRemaining}`}
                  </Typography>
                </Box>
              )
            ) : null} */}
          </>
        ) : null}
      </Box>
    );
  }
}

export default SalesReportPrint;
