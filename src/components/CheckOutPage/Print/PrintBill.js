import React, { forwardRef } from "react";
import { Typography, Box, Grid, Divider } from "@material-ui/core";
import CartHelper from "../../../Helper/cartHelper";
import StoreHelper from "../../../Helper/storeHelper";
import PaymentDetails from "./paymentDetails";
import TaxDetails from "./taxDetails";
import ReturnDetails from "./ReturnDetails";
import DefaultInvoice from "./inv-template/defaultInv";
import GroceryInvoice from "./inv-template/groceryInv";
import OtherInvoice from "./inv-template/otherInv";
import Barcode from "react-barcode";
import { toWords } from "number-to-words";
import AZInvoice from "./inv-template/azInv";
import TaxInvoice from "./inv-template/taxInv";
import InvoiceWithoutTax from "./inv-template/invwithouttax";
import RetailInvoice from "./inv-template/RetailInvoice";
// import QRCode from "qrcode.react";
import { QRCodeCanvas } from "qrcode.react";

const PrintBill = forwardRef((props, ref) => {
  const getCreditNoteDetais = (billData) => {
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
  };

  const capitalizeFirstLetter = (string) => {
    return string.replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const convertToWords = (num) => {
    const [integerPart, fractionalPart] = num.toString().split(".");
    const integerWords = capitalizeFirstLetter(toWords(integerPart));
    let fractionalWords = "";
    if (fractionalPart > 0) {
      fractionalWords =
        " and " + capitalizeFirstLetter(toWords(fractionalPart)) + " paise ";
    }
    return `${integerWords} ${fractionalWords}`;
  };

  const renderPolicy = () => {
    let policyText = StoreHelper.getReturnPolicy();
    if (!policyText) policyText = ""; // fallback to empty string if null/undefined
    const formattedText = policyText.replace(/\n/g, "<br/>");
    return { __html: formattedText };
  }

  const billingData = CartHelper.getBillingData();
  const responseData = CartHelper.getResponseData();
  const langs = StoreHelper.getLangs();
  // const getCheckoutData = CartHelper.getCheckoutData();
  const credit_note = getCreditNoteDetais(billingData);
  const getInvTemp = StoreHelper.getInvTemp();
  const isAzTemplate = getInvTemp && getInvTemp === "enterPrise";

  // Example: get payment details from billingData or props
  const selectedPaymentModes = billingData?.sales_data?.selectedPaymentModes || []; // adjust as per your data structure
  const totalAmount = billingData?.sales_data?.nettotal || 0;
  const cashPaid = billingData?.sales_data?.cashPaid || 0;
  const otherPaid = billingData?.sales_data?.otherPaid || 0;
  const upiPaid = billingData?.sales_data?.upiPaid || 0;

  // {
  //   (() => {
  //     const upiAmount = CartHelper.getUpiAmount(billingData.sales_data);
  //     if (upiAmount > 0) {
  //       return (
  //         <Box className="align-center-important" mt={2}>
  //           <Typography variant="subtitle1" style={{ fontWeight: "bold" }}>
  //             Scan to Pay via UPI
  //           </Typography>
  //           <QRCodeCanvas
  //             value={`upi://pay?pa=9739259728-2@ibl&am=${upiAmount}`}
  //             size={128}
  //           />
  //         </Box>
  //       );
  //     }
  //     return null;
  //   })()
  // }
  // console.log("upiAmountssss", billingData);

  // function getUpiAmount(paymentString) {
  //   Split the string by commas and trim spaces
  //   const parts = paymentString.split(',').map(p => p.trim());

  //   Find the part containing 'UPI'
  //   const upiPart = parts.find(part => part.startsWith('UPI'));

  //   if (!upiPart) return null; 

  //   Extract the number using a regex
  //   const matches = upiPart.match(/\d+(\.\d+)?/);

  //   Return the amount as a number
  //   return matches ? Number(matches[0]) : null;
  // }

  return (
    <Box className="custom-font printable-area" p={1} ref={ref}>
      {!CartHelper.isEmpty(billingData) && billingData.success ? (
        <>
          {isAzTemplate ? (
            <>
              {StoreHelper.getCompany() !== "null" ? (
                <Box p={0}>
                  <Grid container spacing={2}>
                    <Grid item xs={4}>
                      <Typography

                        className="print-heading"
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
                      ><strong>
                          {"GSTIN : "}
                          {StoreHelper.getGSTNo()}
                        </strong></Typography>
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

                  {/* <Grid item xs={4}>

                  </Grid> */}
                </Grid>
              </Box>

              <Divider className="mb={1} mt={1}" />
            </>
          ) : (
            <>
              {StoreHelper.showLogoInBill() && StoreHelper.getCompanyLogo() ? (
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
                      className=" print-heading"
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
                    className="print-heading"
                    variant="h6"
                    component="b"
                  >
                    {StoreHelper.getCompany()}
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
                    <strong> {"Phone:"}
                      {StoreHelper.getConfigPhone()}</strong>

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
                    <strong>{langs.GST ? langs.GST : "GST"}
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
                    className=" print-heading"
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
                        className=""
                        variant="subtitle2"
                        component="b"
                      >
                        <strong>Invoice No:</strong>
                      </Typography>
                    </td>
                    <td className="inv-table-data-left" colSpan={6}>
                      <Typography
                        className=""
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
                        {responseData.date}
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
                          className=""
                          variant="subtitle2"
                          component="b"
                        >
                          {"Mobile: "}
                        </Typography>
                      </td>
                      <td className="inv-table-data-left" colSpan={6}>
                        <Typography
                          className=""
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
                          className=""
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
                </tbody>
              </table>
            </Box>
          )}

          <Box p={0} />

          {/* Main template selection  from the backend*/}

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
              {convertToWords(billingData?.sales_data?.nettotal)} {" Only"}
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
                    {CartHelper.getCurrencyFormatted(
                      Number(billingData.sales_data?.paid_amt)
                    )}
                  </Typography>
                  <Typography style={{ fontWeight: "bold" }}>
                    Credit Balance :
                    {CartHelper.getCurrencyFormatted(
                      billingData.sales_data?.credit_amt ?? 0
                    )}
                  </Typography>
                </Box>
              ) : null}
            </>
          ) : (
            <>

              {Number(billingData.sales_data?.credit_balance) !== 0 && (
                <Box>
                  <Typography style={{ fontWeight: "bold" }}>
                    Paid Amount :
                    {CartHelper.getCurrencyFormatted(
                      Number(billingData.sales_data?.nettotal)
                    )}
                  </Typography>
                  <Typography style={{ fontWeight: "bold" }}>
                    CreditNote Applied -{credit_note?.reference} :
                    {CartHelper.getCurrencyFormatted(
                      credit_note?.discount ?? 0
                    )}
                  </Typography>
                </Box>
              )}
            </>
          )}

          <Box />
          {StoreHelper.getInvTemp() === "estimation" ||
            StoreHelper.getInvTemp() === "invwithouttax" ? null : (
            <TaxDetails />
          )}
          {/* <Typography style={{ fontWeight: "bold", paddingTop: "2%" }}>
            Tax Amount (in words) : Rs
            {convertToWords(billingData?.sales_data?.tax)} {" Only"}
          </Typography> */}

          <Box p={1} />
          <ReturnDetails />
          {StoreHelper.showBarCodeInInvoice() ? (
            <Box style={{ borderBottom: "2px solid #333" }}>
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
          <Box
            className="policy-box"
            sx={{
              textAlign: "left",
              lineHeight: 1.6,
              color: "#000",
              paddingLeft: "8px",
              "@media print": {
                fontSize: "12px",
                color: "#000",
                paddingLeft: "8px",
                textAlign: "left",
              },
            }}
          >

            <Typography
              variant="body2"
              sx={{ textAlign: "left", whiteSpace: "pre-line" }}
              dangerouslySetInnerHTML={renderPolicy()}
            />
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
                Scan to Pay via UPI
              </Typography>
              <QRCodeCanvas
                value={`upi://pay?pa=${StoreHelper.getFromSession('enter_upi_id')}@ibl&am=${billingData?.sales_data?.nettotal ?? 0}`}
                size={128}
              />
            </Box>
          ) : null} */}

          {/* {billingData.sales_data?.payment_type === "OTHER" &&
            CartHelper.getUpiAmount(billingData.sales_data) > 0 && (
              <Box className="align-center-important" mt={2}>
                <Typography variant="subtitle1" style={{ fontWeight: "bold" }}>
                  Scan to Pay Remaining via UPI
                </Typography>
                <QRCodeCanvas
                  value={`upi://pay?pa=${StoreHelper.getFromSession('enter_upi_id')}@ibl&am=${CartHelper.getUpiAmount(
                    billingData.sales_data
                  )}`}
                  size={128}
                />
              </Box>
            )} */}

        </>
      ) : null
      }
    </Box>
  );
});

export default PrintBill;
