import store from "../store";
import Helper from "../Helper/storeHelper";
import { v4 as uuidv4 } from "uuid";
import { dbProductsData } from "../services/product-service";
import AddToCartHelper from '../Helper/actionHelper/addToCartHelper';

const helpers = {
  parseNumber: function (value, locales = navigator.languages) {
    if (value) {
      const example = Intl.NumberFormat(locales).format("1.1");
      const cleanPattern = new RegExp(`[^-+0-9${example.charAt(1)}]`, "g");
      const cleaned = value.toString().replace(cleanPattern, "");
      const normalized = cleaned.replace(example.charAt(1), ".");
      return parseFloat(normalized);
    }
    return value;
  },
  getTotalQty: function () {
    var qty = 0;
    var cartProducts = store.getState().cartProduct;
    cartProducts.forEach((product) => {
      qty += Number(product.qty);
    });
    return qty;
  },
  getTotalAmount: function () {
    var amount = 0;

    var creditNoteAmt = this.getCreditNoteAmt();

    var cartProducts = store.getState().cartProduct;
    cartProducts.forEach((product) => {
      let ruleAppliedPrice = this.getRulesAppliedData(product);

      if (this.isGiftVoucherApplicable()) {
        amount += product.qty * this.getFinalPrice(product);
      }
      // else if (product?.isExchange) {
      //   amount += product.qty * (ruleAppliedPrice.subtotal + ruleAppliedPrice.taxamount)
      // }
      else {
        amount += product.qty * ruleAppliedPrice.price;
      }
    });

    /*         var return_ref_dis = store.getState().returnData?.sales_data?.return_ref_dis;
                 if(return_ref_dis){
                   console.log("returnData",return_ref_dis);
                   amount-=return_ref_dis;
                 } */

    if (store.getState().delivery.deliveryApplied) {
      amount += store.getState().delivery.delivery;
    }

    if (store.getState().miscellaneous.packagingApplied) {
      amount += store.getState().miscellaneous.packaging;
    }

    if (creditNoteAmt) {
      amount -= creditNoteAmt;
    }

    return Number(Math.round(amount)).toFixed(2);
  },
  getDefaultRuleAppliedTotal: function () {
    var amount = 0;
    var cartProducts = store.getState().cartProduct;
    cartProducts.forEach((product) => {
      var ruleAppliedPrice = this.getDefaultRulesAppliedData(product);
      if (this.isGiftVoucherApplicable()) {
        amount += product.qty * this.getFinalPrice(product);
      } else {
        amount += product.qty * ruleAppliedPrice.price;
      }
    });
    return Number(amount);
  },
  getTotalAmountWithoutRule: function () {
    var amount = 0;
    var cartProducts = store.getState().cartProduct;
    cartProducts.forEach((product) => {
      if (Helper.apply_dis_after_tax() || this.isRulesAppliedAsCoupon()) {
        amount += product.qty * this.getFinalPrice(product);
      } else {
        amount += product.qty * this.getPrice(product);
      }
    });
    return Number(Math.round(amount)).toFixed(2);
  },
  getPrice: function (product) {
    var price = Number(product.price);
    return price;
  },
  getFinalPrice: function (product) {
    var finalprice = Number(product.finalprice);
    return finalprice;
  },
  getBillSummary: function () {
    var cartProducts = store.getState().cartProduct;
    var summary = {};
    var beforeDiscount = 0;
    var subtotal = 0;
    var taxAmount = 0;
    var discountAmount = 0;
    var totalPayable = 0;
    var ruleDiscountAmount = 0;
    var redeemAmount = this.getRedeemAmount();
    var couponAmount = this.getCouponDiscountAmt();
    var creditNoteAmt = this.getCreditNoteAmt();
    var manualDiscAmt = this.getManualDiscountAmt();

    let totalAmount = 0;
    var addItemWiseDiscAmt = 0;

    // Separate tax calculation for exchange items (old) and new items
    var exchangeItemsTaxAmount = 0;
    var newItemsTaxAmount = 0;
    var hasExchangeItems = cartProducts.some(product => product.isExchange);

    cartProducts.forEach((product) => {
      var ruleAppliedPrice = this.getRulesAppliedData(product);

      // 1. Calculate Original Value before any discounts
      beforeDiscount += product.qty * this.getPrice(product);

      // 2. Calculate the NET Taxable Subtotal (Matches "Taxable Amt" in table: 312.50)
      // ruleAppliedPrice.subtotal must represent Price - Discount
      const netTaxableValue = product.qty * ruleAppliedPrice.subtotal;
      subtotal += netTaxableValue;

      // 3. Track Discounts
      var discount_Amount = product.qty * ruleAppliedPrice.discountAmount;
      discountAmount += discount_Amount;

      if (product.item_applied_disc_amt) {
        addItemWiseDiscAmt += product.qty * product.item_applied_disc_amt;
      }

      if (ruleAppliedPrice.ruleDiscountAmount) {
        ruleDiscountAmount += product.qty * ruleAppliedPrice.ruleDiscountAmount;
      }

      // 4. Calculate Tax on the NET Taxable Value (Matches "Tax Amt" in table: 37.50)
      const productTaxAmount = product.qty * ruleAppliedPrice.taxamount;

      if (hasExchangeItems) {
        if (product.isExchange) {
          exchangeItemsTaxAmount += productTaxAmount;
        } else {
          newItemsTaxAmount += productTaxAmount;
        }
      } else {
        taxAmount += productTaxAmount;
      }

      // 5. Total Payable calculation (Net Subtotal + Corrected Tax)
      // This ensures the final sum is exactly 350.00
      totalPayable += (netTaxableValue + productTaxAmount);
      totalAmount += (netTaxableValue + productTaxAmount);
    });

    // Exchange logic adjustment
    if (hasExchangeItems) {
      taxAmount = exchangeItemsTaxAmount - newItemsTaxAmount;
    }

    if (creditNoteAmt) {
      totalAmount = totalAmount - creditNoteAmt;
      totalPayable = totalPayable - creditNoteAmt;
    }

    // Returning bill Summary data
    summary.beforeDiscount = Number(beforeDiscount).toFixed(2);
    summary.subtotal = Number(subtotal).toFixed(2); // Should show 312.50 in your example
    summary.taxamount = Number(taxAmount).toFixed(2); // Will now show 37.50
    summary.discountAmount = Number(discountAmount).toFixed(2);
    summary.round = Number(Math.round(totalPayable) - totalPayable).toFixed(2);
    summary.ruleDiscountAmount = Number(ruleDiscountAmount).toFixed(2);
    summary.totalAmount = Number(totalAmount).toFixed(2);
    summary.addItemWiseDiscAmt = Number(addItemWiseDiscAmt).toFixed(2);

    // Metadata additions
    if (redeemAmount) summary.redeemAmount = redeemAmount;
    if (couponAmount) summary.couponAmount = couponAmount;
    if (creditNoteAmt) summary.creditNoteAmt = creditNoteAmt;
    if (manualDiscAmt) summary.manualDiscAmt = manualDiscAmt;

    if (store.getState().delivery.deliveryApplied) {
      summary.delivery = store.getState().delivery.delivery.toFixed(2);
    }
    if (store.getState().miscellaneous.packagingApplied) {
      summary.packaging = store.getState().miscellaneous.packaging.toFixed(2);
    }

    return summary;
  },

  getCheckoutData: function () {
    return store.getState().checkoutData;
  },
  getBillingData: function () {
    var checkoutData = store.getState().checkoutData;
    var billingData = checkoutData.billingData;
    console.log("Billing Data:", billingData);
    return billingData;
  },
  getResponseData: function () {
    var checkoutData = store.getState().checkoutData;
    var responseData = checkoutData.responseData;
    return responseData;
  },
  calculateTax: function (discounted_price, product) {
    var taxPercent = product.tax;
    var taxAmount = (discounted_price / 100) * taxPercent;
    var final_price = discounted_price + taxAmount;
    return final_price;
  },
  getTaxAmount: function (discounted_price, product) {
    var taxPercent = product.tax;
    var taxAmount = (discounted_price / 100) * taxPercent;
    return taxAmount;
  },
  getTaxAmountFromDiscount: function (amount, product) {
    var taxPercent = Number(product.tax);
    var taxAmount = amount - amount * (100 / (100 + taxPercent));
    return taxAmount;
  },
  getTaxAmountFromPrice: function (amount, product) {
    var taxPercent = Number(product.tax);
    var taxAmount = amount - amount * (100 / (100 + taxPercent));
    return taxAmount;
  },
  getTaxDetailsToPrint: function () {
    var checkoutData = store.getState().checkoutData;
    var products = checkoutData.billingData.data;
    var TaxSlabArray = this.getTaxSlab(products);
    var TaxNames = this.getTaxNames(products);
    var filteredTaxSlabProducts = [];
    if (!this.isEmpty(TaxSlabArray)) {
      TaxSlabArray.forEach((taxSlab) => {
        var filterTaxSlabList = this.filterTaxSlabList(taxSlab, products);
        var taxTotalsBySlab = this.getTaxTotalsBySlab(filterTaxSlabList);
        var taxDetails = {};
        taxDetails.slab_total = Number(taxTotalsBySlab.slab_total).toFixed(2);
        taxDetails.tax_total = Number(taxTotalsBySlab.total).toFixed(2);
        taxDetails.tax_percent = Number(taxSlab).toFixed(2);
        taxDetails.tax_rates = taxTotalsBySlab.tax_rates;
        taxDetails.hsn_code = taxTotalsBySlab.hsn_code;
        taxDetails.cgst = taxTotalsBySlab.cgst;
        taxDetails.sgst = taxTotalsBySlab.sgst;

        // taxDetails.hsn_code = 
        filteredTaxSlabProducts.push(taxDetails);
      });
    }
    var data = {};
    data.tax_data = filteredTaxSlabProducts.sort(
      (a, b) => Number(a.tax_percent) - Number(b.tax_percent)
    );
    data.tax_names = TaxNames;
    return data;
  },

  getTaxDetailsToPrintReport: function () {
    var checkoutData = store.getState().checkoutData;
    var products = checkoutData.billingData.data;
    var TaxSlabArray = this.getTaxSlab(products);
    var TaxNames = this.getTaxNames(products);
    var filteredTaxSlabProducts = [];
    if (!this.isEmpty(TaxSlabArray)) {
      TaxSlabArray.forEach((taxSlab) => {
        var filterTaxSlabList = this.filterTaxSlabList(taxSlab, products);
        var taxTotalsBySlab = this.getTaxTotalsBySlabForReport(filterTaxSlabList);
        var taxDetails = {};
        taxDetails.slab_total = Number(taxTotalsBySlab.slab_total).toFixed(2);
        taxDetails.tax_total = Number(taxTotalsBySlab.total).toFixed(2);
        taxDetails.tax_percent = Number(taxSlab).toFixed(2);
        taxDetails.tax_rates = taxTotalsBySlab.tax_rates;
        taxDetails.hsn_code = taxTotalsBySlab.hsn_code;
        taxDetails.cgst = taxTotalsBySlab.cgst;
        taxDetails.sgst = taxTotalsBySlab.sgst;

        // taxDetails.hsn_code = 
        filteredTaxSlabProducts.push(taxDetails);
      });
    }
    var data = {};
    data.tax_data = filteredTaxSlabProducts.sort(
      (a, b) => Number(a.tax_percent) - Number(b.tax_percent)
    );
    data.tax_names = TaxNames;
    return data;
  },
  getTaxNames: function (products) {  
    var TaxNamesArray = [];
    products.forEach((product) => {
      if (
        TaxNamesArray.length === 0 &&
        JSON.stringify(TaxNamesArray) !== JSON.stringify(product.tax_names)
      ) {
        TaxNamesArray = product.tax_names;
      }
    });
    return TaxNamesArray;
  },
  getTaxSlab: function (products) {
    var TaxSlabArray = [];
    products.forEach((product) => {
      if (!TaxSlabArray.includes(product.tax) && !product?.isExchange) {
        TaxSlabArray.push(product.tax);
      }
    });
    return TaxSlabArray;
  },
  filterTaxSlabList: function (keyValue, list) {
    let filteredList = [];
    for (let i = 0; i < list.length; i++) {
      if (list[i]["tax"] === keyValue) {
        filteredList.push(list[i]);
      }
    }
    return filteredList;
  },
  getTaxBreakupBaseAmounts: function (product) {
    const isDiscountAppliedAfterTax = Number(product.applyDisWithoutTax) === 1;
    const qty = Number(product.qty);

    if (isDiscountAppliedAfterTax) {
      const grossAmount = Number(product.finalprice) * qty;
      const taxAmount = this.getTaxAmountFromPrice(grossAmount, product);

      return {
        priceWithTax: grossAmount,
        taxAmt: taxAmount,
        taxableAmt: grossAmount - taxAmount,
      };
    }

    const priceWithTax = Number(this.getItemPrice(product));
    const taxAmt = this.getTaxAmountFromPrice(priceWithTax, product);

    return {
      priceWithTax,
      taxAmt,
      taxableAmt: priceWithTax - taxAmt,
    };
  },
  getTaxTotalsBySlab: function (productList) {
    var details = {};
    var taxRates = {};
    var taxTotals = 0;
    var slabTotals = 0;
    var hsn_code = {};
    var CGST = 0;
    var SGST = 0;
    if (!this.isEmpty(productList)) {
      productList.forEach((product) => {
        const { priceWithTax, taxAmt, taxableAmt } =
          this.getTaxBreakupBaseAmounts(product);

        let item_SlabTotals = 0;
        let item_taxTotals = 0;
        if (this.isGiftVoucherApplicable()) {
          item_SlabTotals = priceWithTax;
          item_taxTotals =
            product.qty * this.getTaxAmount(this.getPrice(product), product);
        } else {
          item_SlabTotals += taxableAmt;
          item_taxTotals += taxAmt;
        }

        // Handle exchange items by making their values negative
        if (product?.isExchange) {
          item_SlabTotals = -Math.abs(item_SlabTotals);
          item_taxTotals = -Math.abs(item_taxTotals);
        }

        hsn_code = product.hsn_code;
        slabTotals += item_SlabTotals;
        taxTotals += item_taxTotals;
        taxRates = product.tax_rates;
        CGST = Number(taxTotals / 2).toFixed(2);
        SGST = Number(taxTotals / 2).toFixed(2);
      });
    }
    details.total = taxTotals;
    details.slab_total = slabTotals;
    details.tax_rates = taxRates;
    details.hsn_code = hsn_code;
    details.cgst = CGST;
    details.sgst = SGST;
    return details;
  },

  getTaxTotalsBySlabForReport: function (productList) {
    var details = {};
    var taxRates = {};
    var taxTotals = 0;
    var slabTotals = 0;
    var hsn_code = {};
    var CGST = 0;
    var SGST = 0;
    if (!this.isEmpty(productList)) {
      productList.forEach((product) => {
        const { priceWithTax, taxAmt, taxableAmt } =
          this.getTaxBreakupBaseAmounts(product);

        let item_SlabTotals = 0;
        let item_taxTotals = 0;
        if (this.isGiftVoucherApplicable()) {
          item_SlabTotals = priceWithTax;
          item_taxTotals =
            product.qty * this.getTaxAmount(this.getPrice(product), product);
        } else {
          item_SlabTotals += taxableAmt;
          item_taxTotals += taxAmt;
        }

        // Handle exchange items by making their values negative
        if (product?.isExchange) {
          item_SlabTotals = -Math.abs(item_SlabTotals);
          item_taxTotals = -Math.abs(item_taxTotals);
        }

        hsn_code = product.hsn_code;
        slabTotals += item_SlabTotals;
        taxTotals += item_taxTotals;
        taxRates = product.tax_rates;
        CGST = Number(taxTotals / 2).toFixed(2);
        SGST = Number(taxTotals / 2).toFixed(2);
      });
    }
    details.total = taxTotals;
    details.slab_total = slabTotals;
    details.tax_rates = taxRates;
    details.hsn_code = hsn_code;
    details.cgst = CGST;
    details.sgst = SGST;
    return details;
  },

  getItemPriceForReport: function (item) {
    let price =
      Number(item.applyDisWithoutTax) === 1 ? item.finalprice : item.price;
    let discount = item.discount;
    let finalPrice = price - discount;
    if (Number(item.applyDisWithoutTax) === 0) {
      let taxAmt = this.getTaxAmount(finalPrice, item);
      finalPrice += taxAmt;
    }
    let totalFPrice = finalPrice * Number(item.qty);
    return totalFPrice.toFixed(2);
  },
  getCurrencyFormatted: function (amt) {
    return Helper.getCurrencySymbol() + " " + amt;
  },
  isEmpty: function (obj) {
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) return false;
    }
    return true;
  },
  isCartEmpty: function () {
    const cartPros = store.getState().cartProduct;
    return cartPros?.length ? false : true;
  },
  isNewSale: function () {
    var isNewSale = false;
    var state = store.getState();
    var returnData = state.returnData;
    var editData = state.editData;
    if (this.isEmpty(returnData) && this.isEmpty(editData)) {
      isNewSale = true;
    }
    return isNewSale;
  },
  isCustomerLoaded: function () {
    var isLoaded = false;
    var state = store.getState();
    var checkoutData = state.checkoutData;
    var customer = checkoutData.customer;
    if (customer && !this.isEmpty(customer) && customer.phone_number) {
      isLoaded = true;
    }
    return isLoaded;
  },
  isCustomerPopupSkipable: function () {
    var skipable = false;
    var state = store.getState();
    var checkoutData = state.checkoutData;
    var payment_type = checkoutData.data.payment_type
      ? checkoutData.data.payment_type
      : "";
    if (this.isCustomerLoaded() || payment_type) {
      skipable = true;
    }
    return skipable;
  },
  isRulesApplied: function (product, rule) {
    var isRulesApplied = false;
    if (
      rule.items &&
      rule.items.length === 0 &&
      rule.category_ids &&
      rule.category_ids.length === 0
    ) {
      isRulesApplied = true;
    }
    if (rule.items && rule.items.length > 0) {
      rule.items.forEach((itemId) => {
        if (Number(itemId) === Number(product.id)) {
          return (isRulesApplied = true);
        }
      });
    }
    if (rule.category_ids && rule.category_ids.length > 0) {
      rule.category_ids.forEach((catId) => {
        if (Number(catId) === Number(product.category_id)) {
          return (isRulesApplied = true);
        }
      });
    }
    if (product.rules && !Array.isArray(product.rules)) {
      if (product.rules.rule_id === rule.rule_id) {
        return (isRulesApplied = true);
      }
    }

    // console.log("isRulesApplied:", isRulesApplied, rule);
    return isRulesApplied;
  },
  getCurrentAppliedRule: function (product) {
    var state = store.getState();
    var cartProducts = state.cartProduct;
    var allRules =
      state.productData && state.productData.rules
        ? state.productData.rules
        : [];

    var rules =
      (product.rules && Array.isArray(product.rules) && product.rules.length > 0
      ) || (product?.isCreditNote) || (product?.isExchange) ? product.rules
        : allRules;

    if ((Array.isArray(rules) && rules.length > 0)) {
      var appliedRule = [];
      var sorted = [];
      rules.forEach((rule) => {

        if (!product?.isCreditNote) {
          var isApplicable = this.isRuleApplicableOnCurrentCart(
            cartProducts,
            product,
            rule
          );
          if (isApplicable) {
            appliedRule.push(rule);
          }
        } else {
          appliedRule.push(rule);

        }
      });
      if (appliedRule.length > 0) {
        sorted = appliedRule
          .sort(
            (a, b) =>
              (a.priority !== "0" ? a.priority : Infinity) -
              (b.priority !== "0" ? b.priority : Infinity)
          )
          .slice(0, 1);
      }
      if (sorted.length > 0) {
        sorted = sorted[0];
      }
      rules = sorted;
    }

    var returnData = state.returnData;
    if (!this.isEmpty(returnData) && Helper.isUsingNewRuleOnExchange() === 0) {
      if (product.rules && !Array.isArray(product.rules)) {
        rules = product.rules;
        if (this.getAppliedAsCouponDataByRule(rules)) {
          rules = {};
        }
      }
    }

    var billingData = state.checkoutData.billingData;
    if (!this.isEmpty(billingData)) {
      if (this.getAppliedAsCouponDataByRule(rules)) {
        rules = {};
      }
    }

    var editData = state.editData;
    if (!this.isEmpty(editData) && !this.isEmpty(product)) {
      if (product.rules && !Array.isArray(product.rules)) {
        rules = product.rules;
      }
    }
    return rules;
  },
  isRuleApplicableOnCurrentCart: function (cartProducts, product, rule) {
    var isRuleApplicable = false;
    var type_id = parseInt(rule.type_id);

    if (type_id === 1) {
      if (rule.percentoff && Number(rule.percentoff) > 0) {
        isRuleApplicable = true;
      }
      if (rule.flatoff && Number(rule.flatoff) > 0) {
        isRuleApplicable = true;
      }
    }
    if (type_id === 2) {
      if (Number(rule.qty_buy) && Number(rule.qty_get)) {
        let totalOfferQty = parseFloat(rule.qty_get) + parseFloat(rule.qty_buy);
        var totalCartQty = this.getRuleAppliedCartQty(cartProducts, rule);

        if (
          this.isRuleApplicableOnlyOnProduct(rule) &&
          this.isRuleApplicableOnThisProduct(product, rule)
        ) {
          totalCartQty = Number(product.qty);
        }

        if (totalCartQty >= totalOfferQty) {
          var noOfFreeCount =
            (totalCartQty - (totalCartQty % totalOfferQty)) / totalOfferQty;
          if (noOfFreeCount > 0) {
            isRuleApplicable = true;
          }
        }
      }
    }
    if (type_id === 4) {
      if (this.isExistInQtyRange(cartProducts, rule)) {
        isRuleApplicable = true;
      }
    }
    if (type_id === 5) {
      if (this.isExistInAmountRange(cartProducts, rule)) {
        isRuleApplicable = true;
      }
    }
    return isRuleApplicable;
  },
  isExistInAmountRange: function (cartProducts, rule) {
    var isExist = false;
    var totalCartValue = this.getRuleAppliedCartTotal(cartProducts, rule);

    if (rule.is_multiple_range) {
      var amt_ranges = rule.amt_range.split(";");
      amt_ranges.forEach((amt_range, index) => {
        var percent_off_range = rule.percent_off_range.split(";");
        var flat_off_range = rule.flat_off_range.split(";");
        var amountRange = amt_range.split("-");
        var startRange = amountRange[0];
        var endRange = amountRange[1];
        if (
          totalCartValue >= Number(startRange) &&
          totalCartValue <= Number(endRange) &&
          percent_off_range[index] &&
          percent_off_range[index] !== 0
        ) {
          isExist = true;
        }
        if (
          totalCartValue >= Number(startRange) &&
          totalCartValue <= Number(endRange) &&
          flat_off_range[index] &&
          flat_off_range[index] !== 0
        ) {
          isExist = true;
        }
      });
    } else if (
      rule.amt_spend &&
      Number(totalCartValue) >= Number(rule.amt_spend)
    ) {
      isExist = true;
    }
    return isExist;
  },
  isExistInQtyRange: function (cartProducts, rule) {
    var isExist = false;
    var totalCartQty = this.getRuleAppliedCartQty(cartProducts, rule);

    if (rule.is_multiple_qty) {
      var qty_ranges = rule.qty_range.split(";");
      qty_ranges.forEach((qty_range, index) => {
        let percent_off_range = rule.percent_off_range.split(";");
        var flat_off_range = rule.flat_off_range.split(";");
        var qtyRange = qty_range.split("-");
        var qtyStartRange = qtyRange[0];
        var qtyEndRange = qtyRange[1];
        if (
          totalCartQty >= Number(qtyStartRange) &&
          totalCartQty <= Number(qtyEndRange) &&
          percent_off_range[index] &&
          Number(percent_off_range[index]) !== 0
        ) {
          isExist = true;
        }
        if (
          totalCartQty >= Number(qtyStartRange) &&
          totalCartQty <= Number(qtyEndRange) &&
          flat_off_range[index] &&
          Number(flat_off_range[index]) !== 0
        ) {
          isExist = true;
        }
      });
    } else if (rule.qty_buy && Number(totalCartQty) >= Number(rule.qty_buy)) {
      isExist = true;
    }
    return isExist;
  },
  isAppliedManualDiscount: function (discount) {
    var state = store.getState();
    if (this.isEmpty(discount)) {
      discount = state.discount;
    }
    var redeemAmount = this.getRedeemAmount();
    var couponAmount = this.getCouponDiscountAmt();
    var creditNoteAmt = this.getCreditNoteAmt();

    var isDiscountApplied = false;
    if (discount.apply) {
      if (discount.flatoff || discount.percentoff) {
        isDiscountApplied = true;
      }
    }
    if (Number(couponAmount) || Number(creditNoteAmt) || Number(redeemAmount)) {
      isDiscountApplied = true;
    }
    return isDiscountApplied;
  },
  isOnlyCouponCodeApplied: function (discount) {
    var state = store.getState();
    if (this.isEmpty(discount)) {
      discount = state.discount;
    }

    var isOnlyCouponCodeApplied = false;
    if (!this.isEmpty(discount.couponData) && discount.couponData.success) {
      isOnlyCouponCodeApplied = true;
    }

    return isOnlyCouponCodeApplied;
  },
  isOnlyFlatDiscountApplied: function (discount) {
    if (this.isEmpty(discount)) {
      var state = store.getState();
      discount = state.discount;
    }
    var isOnlyFlatDiscountApplied = false;
    if (discount.apply && discount.flatoff) {
      isOnlyFlatDiscountApplied = true;
    }
    return isOnlyFlatDiscountApplied;
  },
  getManualDiscountAmt: function () {
    var discountValue = 0;
    var state = store.getState();
    var discount = state.discount;

    if (discount.apply && discount.flatoff) {
      discountValue = Number(discount.flatoff);
    }
    if (discount.apply && discount.percentoff) {
      var ruleAppliedCartTotal = this.getDefaultRuleAppliedTotal();
      discountValue =
        (ruleAppliedCartTotal * Number(discount.percentoff)) / 100;
    }
    return discountValue;
  },
  isApplyingDiscountAfterTax: function () {
    var apply_dis_after_tax = false;
    //var discount = store.getState().discount
    if (Helper.apply_dis_after_tax() === 1) {
      apply_dis_after_tax = true;
    }
    if (this.hasGlobalDiscountInReturn()) {
      apply_dis_after_tax = true;
    }

    return apply_dis_after_tax;
  },
  isRulesAppliedAsCoupon: function () {
    var isRulesAppliedAsCoupon = false;
    var state = store.getState();
    var rule = this.getCurrentAppliedRule("");
    if (!this.isEmpty(rule) && !this.isEmpty(state.productData)) {
      if (!this.isEmpty(rule) && Number(rule.apply_as_coupon) === 1) {
        isRulesAppliedAsCoupon = true;
      }
    }
    var returnData = state.returnData;
    if (!this.isEmpty(returnData)) {
      isRulesAppliedAsCoupon = false;
    }

    return isRulesAppliedAsCoupon;
  },
  getAppliedAsCouponDataByRule: function (rule) {
    var isRulesAppliedAsCoupon = false;
    if (!this.isEmpty(rule) && Number(rule.apply_as_coupon) === 1) {
      isRulesAppliedAsCoupon = true;
    }
    return isRulesAppliedAsCoupon;
  },
  isSpotApplied: function () {
    var state = store.getState();
    var spotApply = state.discount.spotApply;
    return spotApply;
  },
  isGiftVoucherApplicable: function () {
    var isGiftVoucherApplicable = false;
    //var state = store.getState()
    //var discount = state.discount;
    if (this.isRulesAppliedAsCoupon() && !this.isSpotApplied()) {
      isGiftVoucherApplicable = true;
    }
    return isGiftVoucherApplicable;
  },
  getRulesAppliedData: function (product) {
    var data = {};
    var default_discounted_data = {
      discounted_price: this.getPrice(product),
      discountAmount: 0,
      percentage_off_discount: 0,
      discount_label: "",
    };
    var discounted_data = default_discounted_data;
    var state = store.getState();
    var cartProducts = state.cartProduct;
    //var returnData = state.returnData;
    //var editData = state.editData;
    var discount = state.discount;
    if (product.prev_rule) {
      discounted_data = this.getPrevDiscAppliedData(product);
    } else {
      // console.log("product.prev_rule cond2222", product);

      discounted_data = this.getDefaultRulesAppliedData(product);
    }

    // console.log("discounted_data  11", discounted_data);
    // //Validating and Updating Return Order Item Data
    // if (!this.isEmpty(returnData) && !returnData.startRule) {
    //     discounted_data = this.getReturnEditData(returnData, cartProducts, product)
    // }
    //Updating And Getting Additional Discount Data With Rule Applied Data
    discounted_data = this.getAdditionalDiscountAppliedData(
      product,
      discount,
      cartProducts,
      discounted_data
    );
    // console.log("discounted_data  22", discounted_data);

    //sending default rules discount amount
    data.ruleDiscountAmount = discounted_data.ruleDiscountAmount;

    if (product.item_dis_type && !product.prev_rule) {
      let item_percent_wise = 0;
      let item_disc_amount = 0;

      if (product.item_dis_type === "PERCENT") {
        item_disc_amount =
          ((discounted_data.price) * Number(product.item_discount_amount)) / 100;
        item_percent_wise = product.item_discount_amount;
        // item_disc_amount =
        //   ((discounted_data.discounted_price + discounted_data.taxamount) *
        //     product.item_discount_amount) /
        //   100;
      } else if (product.item_dis_type === "FLAT") {
        let disc_amt_in_percent =
          (product.item_discount_amount * 100) /
          discounted_data.discounted_price;
        item_percent_wise = Number(disc_amt_in_percent).toFixed(2);
        item_disc_amount = product.item_discount_amount;
      } else {
        item_percent_wise = 0;
        item_disc_amount = 0;
      }

      //  console.log("item_percent_wise",item_percent_wise);
      //  console.log("item_disc_amount",item_disc_amount);

      let ttl_percent = Number(discounted_data.percentage_off_discount).toFixed(
        2
      );
      discounted_data.percentage_off_discount =
        Number(ttl_percent) + Number(item_percent_wise);
      discounted_data.discount_label =
        discounted_data.percentage_off_discount + "%";
      discounted_data.item_disc_amount = item_disc_amount;
      discounted_data.price = discounted_data.price - item_disc_amount;
      discounted_data.discountAmount =
        discounted_data.discountAmount + item_disc_amount;
    }

    //tax calculation
    let taxamount = this.getTaxAmount(
      discounted_data.discounted_price,
      product
    );

    //console.log("taxamount",taxamount);

    data.taxamount = taxamount;
    data.price = Number(discounted_data.discounted_price + taxamount).toFixed(
      2
    );

    if (this.isApplyingDiscountAfterTax()) {
      let price_incl_tax = Number(discounted_data.discounted_price + taxamount);
      let price_after_discount =
        Number(price_incl_tax) - Number(discounted_data.discountAmount);
      data.price = Number(price_after_discount).toFixed(2);
      if (price_after_discount < 0) {
        data.price = Number(0).toFixed(2);
      }
      // console.log("isApplyingDiscountAfterTax ", true);
    } else {
      // console.log("isApplyingDiscountAfterTax ", false);
    }

    data.subtotal = discounted_data.discounted_price;
    data.discountAmount = discounted_data.discountAmount;
    data.percentage_off_discount = discounted_data.percentage_off_discount;
    data.discount_label = discounted_data.discount_label;
    data.rule_id = discounted_data.rule_id ? discounted_data.rule_id : "";

    // data.item_wise_discount =product.item_dis_type
    // data.item_discount_amt = product.item_discount_amount
    // data.item_discount_value=0

    return data;
  },

  getDefaultRulesAppliedData: function (product) {

    let data = {};
    let default_discounted_data = {
      discounted_price: this.getPrice(product),
      discountAmount: 0,
      percentage_off_discount: 0,
      discount_label: "",
    };
    let discounted_data = default_discounted_data;
    var state = store.getState();
    var cartProducts = state.cartProduct;
    let rule = this.getCurrentAppliedRule(product);
    if (!this.isEmpty(rule) && this.isRulesApplied(product, rule)) {

      /*
            type_id:
                1 => is for Simple Discount
                2 => is for buy X Get Y Discount
                4 => is for buy X Get Discount
                5 => is for Spent X Get Discount
            */

      switch (parseInt(rule.type_id)) {
        case 1:
          discounted_data = this.getSimpleDiscount(product, rule);
          break;

        case 2:
          discounted_data = this.buyXGetY(product, rule, cartProducts);
          break;

        case 4:
          discounted_data = this.buyXGetDiscount(product, rule, cartProducts);
          break;

        case 5:
          discounted_data = this.spentXGetDiscount(product, rule, cartProducts);
          break;

        default:
          discounted_data = default_discounted_data;
      }
    }

    //tax calculation
    var tax_amount = this.getTaxAmount(
      discounted_data.discounted_price,
      product
    );
    let taxamount = tax_amount, price = Number(discounted_data.discounted_price + tax_amount).toFixed(
      2
    );
    // data.taxamount = tax_amount;
    // data.price = Number(discounted_data.discounted_price + tax_amount).toFixed(
    //   2
    // );
    if (this.isApplyingDiscountAfterTax()) {

      var price_incl_tax = Number(discounted_data.discounted_price + tax_amount);
      var price_after_discount =
        Number(price_incl_tax) - Number(discounted_data.discountAmount);
      // data.price = Number(price_after_discount).toFixed(2);
      price = Number(price_after_discount).toFixed(2);
      if (price_after_discount < 0) {
        // data.price = Number(0).toFixed(2);
        price = Number(0).toFixed(2);
      }
    }

    // console.log("proo", product);

    // console.log("data ret test 2", data);
    let subtotal = discounted_data.discounted_price;
    let discounted_price = discounted_data.discounted_price;
    let discountAmount = discounted_data.discountAmount;
    let percentage_off_discount = discounted_data.percentage_off_discount;
    let discount_label = discounted_data.discount_label;
    let rule_id = discounted_data.rule_id ? discounted_data.rule_id : "";
    // data.subtotal = discounted_data.discounted_price;
    // data.discounted_price = discounted_data.discounted_price;
    // data.discountAmount = discounted_data.discountAmount;
    // // console.log("discounted_data ret test", discounted_data);
    // data.percentage_off_discount = discounted_data.percentage_off_discount;
    // data.discount_label = discounted_data.discount_label;
    // data.rule_id = discounted_data.rule_id ? discounted_data.rule_id : "";
    // console.log("finall data", data);
    let finaldata = {
      subtotal, discountAmount, discounted_price, percentage_off_discount, price, taxamount, discount_label, rule_id
    }
    return finaldata;
  },
  getAdditionalDiscountAppliedData: function (
    product,
    discount,
    cartProducts,
    rulesAppliedData
  ) {
    var default_discounted_data = {
      discounted_price: this.getPrice(product),
      discountAmount: 0,
      percentage_off_discount: 0,
      discount_label: "",
    };

    var discounted_data = rulesAppliedData
      ? rulesAppliedData
      : default_discounted_data;

    //defining redeem amount
    var state = store.getState();
    var customerData = state.customerData;
    var redeemAmount = Number(customerData.redeemamount);

    var discPercentageByRule =
      rulesAppliedData && rulesAppliedData.percentage_off_discount
        ? rulesAppliedData.percentage_off_discount
        : 0;

    // data.item_wise_discount =product.item_dis_type
    // data.item_discount_amt = product.item_discount_amount
    // data.item_discount_value=0

    //var product_wise_discount =

    if (discount.apply) {
      var flatDiscountAmount = 0;
      var percentOnPerProduct = 0;
      if (discount.flatoff) {
        flatDiscountAmount = Number(discount.flatoff);
      }
      if (discount.percentoff) {
        var ruleAppliedCartTotal = this.getDefaultRuleAppliedTotal();

        // var ruleAppliedCartTotal = this.getTotalAmount();

        flatDiscountAmount =
          (ruleAppliedCartTotal * Number(discount.percentoff)) / 100;
      }

      if (!this.isEmpty(discount.couponData) && discount.couponData.success) {
        if (discount.couponData.data.type === "fixed") {
          flatDiscountAmount = Number(discount.couponData.data.discount);
        } else if (discount.couponData.data.type === "percent") {
          var ruleAppliedCartTotal = this.getDefaultRuleAppliedTotal();

          flatDiscountAmount =
            (ruleAppliedCartTotal * Number(discount.couponData.data.discount)) / 100;
          // console.log("labell",rulesAppliedData.d);
          // percentOnPerProduct = Number(discount.couponData.data.discount);

        }
      }

      // if (
      //   !this.isEmpty(discount.creditData) &&
      //   discount.creditData.success &&
      //   discount.creditData.credit_amt
      // ) {
      //   flatDiscountAmount = Number(discount.creditData.credit_amt);
      // }

      //Redeem Ammount Adding to other discount;
      if (customerData.isChecked && redeemAmount) {
        flatDiscountAmount += redeemAmount;
      }

      if (flatDiscountAmount) {
        percentOnPerProduct = this.getPercentageOfCartTotal(
          cartProducts,
          flatDiscountAmount
        );
        if (discPercentageByRule) {
          percentOnPerProduct += Number(discPercentageByRule);
        }
        discounted_data = this.getPercentOf(product, percentOnPerProduct);

        if (discPercentageByRule) {
          discounted_data.discount_label =
            Number(discPercentageByRule).toFixed(2) + "%";
        } else {
          discounted_data.discount_label = "";
        }
      } else {
        if (discPercentageByRule) {
          percentOnPerProduct += Number(discPercentageByRule);
        }
        discounted_data = this.getPercentOf(product, percentOnPerProduct);
      }
    }

    var taxamount = this.getTaxAmount(
      discounted_data.discounted_price,
      product
    );
    discounted_data.taxamount = taxamount;
    discounted_data.price = Number(
      discounted_data.discounted_price + taxamount
    ).toFixed(2);

    if (this.isApplyingDiscountAfterTax()) {
      var price_incl_tax = Number(discounted_data.discounted_price + taxamount);
      var price_after_discount =
        Number(price_incl_tax) - Number(discounted_data.discountAmount);
      discounted_data.price = Number(price_after_discount).toFixed(2);
      if (price_after_discount < 0) {
        discounted_data.price = Number(0).toFixed(2);
      }
    }

    discounted_data.ruleDiscountAmount = rulesAppliedData.discountAmount;
    discounted_data.rule_id = rulesAppliedData.rule_id
      ? rulesAppliedData.rule_id
      : "";
    // couponAmount
    return discounted_data;
  },
  getRuleDiscountAmount: function () {
    var discountAmount = 0;
    var state = store.getState();
    var cartProducts = state.cartProduct;
    cartProducts.forEach((product) => {
      var ruleAppliedData = this.getDefaultRulesAppliedData(product);
      if (ruleAppliedData.discountAmount) {
        discountAmount += product.qty * ruleAppliedData.discountAmount;
      }
    });
    return discountAmount;
  },
  getAddItemWiseDiscountAmount: function () {
    var discountAmount = 0;
    var state = store.getState();
    var cartProducts = state.cartProduct;
    cartProducts.forEach((product) => {
      if (product.item_applied_disc_amt_ttl) {
        discountAmount += product.item_applied_disc_amt_ttl;
        //console.log("product item-wise",product);
        //discountAmount += product.qty * ruleAppliedData.discountAmount;
      }
    });
    return discountAmount;
  },
  getRedeemAmount: function () {
    var amount = 0;
    var state = store.getState();
    var customerData = state.customerData;
    var redeemAmount = Number(customerData.redeemamount);
    if (customerData.isChecked && redeemAmount) {
      amount = redeemAmount;
    }
    return amount;
  },
  getCreditNoteAmt: function () {
    var amount = 0;
    var state = store.getState();
    var discount = state.discount;
    if (
      discount.apply &&
      discount.is_credit_note &&
      !this.isEmpty(discount.creditData)
    ) {
      if (discount.creditData.success && discount.creditData.credit_amt) {
        amount = Number(discount.creditData.credit_amt);
      }
    }
    return amount;
  },
  getCouponDiscountAmt: function () {
    var amount = 0;
    var state = store.getState();
    var discount = state?.discount;
    if (
      discount?.apply &&
      !this.isEmpty(discount?.couponData) &&
      discount?.couponData.success
    ) {
      // console.log("Discount applied as coupon ", discount);
      if (discount?.couponData?.data?.type === "fixed") {
        amount = Number(discount?.couponData?.data?.discount);
      }
      if (discount?.couponData?.data?.type === "percent") {
        var ruleAppliedCartTotal = this.getDefaultRuleAppliedTotal();
        amount = (ruleAppliedCartTotal * Number(discount?.couponData?.data?.discount)) / 100;
      }
    }
    return amount;
  },
  getPercentageOfCartTotal: function (cartProducts, flatoff) {
    var totalCartValue = 0;
    cartProducts.forEach((product) => {
      var price = this.getPrice(product) * Number(product.qty);
      if (this.isApplyingDiscountAfterTax()) {
        price = this.getFinalPrice(product) * Number(product.qty);
      }
      totalCartValue += price;
    });
    var percentage = (flatoff / totalCartValue) * 100;

    return percentage;
  },
  hasGlobalDiscountInReturn: function () {
    var isApplied = false;
    var state = store.getState();
    if (!this.isEmpty(state.returnData)) {
      var returingProduct = state.returnData.data;
      returingProduct.forEach((product) => {
        if (Number(product.applyDisWithoutTax) === 1) {
          isApplied = true;
          return isApplied;
        }
      });
    }
    return isApplied;
  },
  hasGlobalDiscountOnBilling: function (billingData) {
    var isApplied = false;
    if (billingData !== undefined && billingData.length > 0) {
      billingData.forEach((product) => {
        if (Number(product.applyDisWithoutTax) === 1) {
          isApplied = true;
          return isApplied;
        }
      });
    }
    return isApplied;
  },
  isReturingCartChanged: function () {
    var ischanged = false;
    var state = store.getState();
    var cartProducts = state.cartProduct;
    if (!this.isEmpty(state.returnData)) {
      var returingProduct = state.returnData.data;
      if (JSON.stringify(cartProducts) !== JSON.stringify(returingProduct)) {
        ischanged = true;
      }
    }
    return ischanged;
  },
  getPrevDiscAppliedData: function (product) {
    var default_discounted_data = {
      discounted_price: this.getPrice(product),
      discountAmount: 0,
      percentage_off_discount: 0,
      discount_label: "",
    };
    var discounted_data = default_discounted_data;
    var discountOnProduct = Number(product.discount);
    if (discountOnProduct && discountOnProduct > 0) {
      discounted_data = this.getPercentOf(product, discountOnProduct);
    }
    return discounted_data;
  },
  getReturnEditData: function (returnEditData, cartProducts, product) {
    var hasDiscount = Number(returnEditData.sales_data.discount);
    var applied_discountOnProduct = Number(product.discount);

    var default_discounted_data = {
      discounted_price: this.getPrice(product),
      discountAmount: 0,
      percentage_off_discount: 0,
      discount_label: "",
    };
    var discounted_data = default_discounted_data;

    var discount_detail = returnEditData.sales_data.discount_detail;
    discount_detail = discount_detail ? JSON.parse(discount_detail) : [];
    let ruleDiscountAmount = 0;
    let percentOnPerProduct = 0;
    if (discount_detail && discount_detail.length > 0) {
      discount_detail.forEach((discount) => {
        if (discount.type === "rule") {
          ruleDiscountAmount = Number(discount.discount);
        }
      });
      if (Number(ruleDiscountAmount) > 0) {
        percentOnPerProduct = this.getPercentageOfCartTotal(
          cartProducts,
          ruleDiscountAmount
        );
        discounted_data = this.getPercentOf(product, percentOnPerProduct);
      }
    } else if (hasDiscount > 0) {
      if (this.hasGlobalDiscountInReturn()) {
        percentOnPerProduct = this.getPercentageOfCartTotal(
          cartProducts,
          hasDiscount
        );
        discounted_data = this.getPercentOf(product, percentOnPerProduct);
      } else {
        discounted_data = this.getPercentOf(product, applied_discountOnProduct);
        discounted_data.discount_label =
          discounted_data.discountAmount > 0
            ? discounted_data.discount_label
            : "";
      }
    } else if (hasDiscount === 0) {
      discounted_data = this.getPercentOf(product, applied_discountOnProduct);
      discounted_data.discount_label =
        discounted_data.discountAmount > 0
          ? discounted_data.discount_label
          : "";
    }
    return discounted_data;
  },
  getSimpleDiscount: function (product, rule) {
    var data = {};

    if (rule.excluded_items && rule.excluded_items.includes(String(product.id))) {
      // If the product is excluded, return the original prices with no discount
      var product_price = this.getPrice(product);

      data.discounted_price = product_price;
      data.discountAmount = 0;
      data.percentage_off_discount = 0;
      data.discount_label = "";
      return data;
    }
    //Discount Calculation
    var product_price = this.getPrice(product);

    var discounted_price = product_price;
    var discountAmount = 0;
    var percentage_off_discount = 0;
    var discount_label = "";


    //returing values
    data.discounted_price = discounted_price;
    data.discountAmount = discountAmount;
    data.percentage_off_discount = percentage_off_discount;
    data.discount_label = discount_label;
    if (rule.percentoff && rule.percentoff > 0) {
      data = this.getPercentOf(product, Number(rule.percentoff));
      data.rule_id = rule.rule_id;
    }
    if (rule.flatoff && rule.flatoff > 0) {
      data = this.getFlatOf(product, Number(rule.flatoff));
      data.rule_id = rule.rule_id;
    }
    return data;
  },
  buyXGetY: function (product, rule, cartProducts) {
    var data = {};

    if (rule.excluded_items && rule.excluded_items.includes(String(product.id))) {
      // If the product is excluded, return the original prices with no discount
      var product_price = this.getPrice(product);

      data.discounted_price = product_price;
      data.discountAmount = 0;
      data.percentage_off_discount = 0;
      data.discount_label = "";
      return data;
    }
    var product_price = this.getPrice(product);

    var discounted_price = product_price;
    var discountAmount = 0;
    var percentage_off_discount = 0;
    var discount_label = "";

    //default returing values
    data.discounted_price = discounted_price;
    data.discountAmount = discountAmount;
    data.percentage_off_discount = percentage_off_discount;
    data.discount_label = discount_label;

    // console.log("product", product);
    //console.log("rule", rule);
    //console.log("cartProducts", cartProducts);

    //Getting Total Cart Value and Qty
    var totalCartValue = this.getRuleAppliedCartTotal(cartProducts, rule);
    var totalCartQty = this.getRuleAppliedCartQty(cartProducts, rule);

    if (
      this.isRuleApplicableOnlyOnProduct(rule) &&
      this.isRuleApplicableOnThisProduct(product, rule)
    ) {
      var productqty = Number(product.qty);
      var finalprice = this.isApplyingDiscountAfterTax()
        ? Number(product.finalprice)
        : Number(product.price);
      totalCartQty = productqty;
      totalCartValue = Number(productqty) * Number(finalprice);
      cartProducts = [product];
    }
    if (Number(rule.qty_buy) && Number(rule.qty_get)) {
      let totalOfferQty = parseFloat(rule.qty_get) + parseFloat(rule.qty_buy);

      if (totalCartQty >= totalOfferQty) {
        // var noOfFreeCount = (totalCartQty - (totalCartQty % totalOfferQty)) / totalOfferQty;

        let noOfFreeCount =
          Math.floor(totalCartQty / totalOfferQty) * parseFloat(rule.qty_get);

        let lowestprices = this.getItemsToShort(cartProducts, rule)
          .sort((a, b) => a.price - b.price)
          .slice(0, noOfFreeCount);
        let freeProductIds = [];
        var dis_array = [];
        let disAppliedCount = noOfFreeCount;

        //filtering product qty based discount on product
        lowestprices.forEach((lowest_price) => {
          var pro = {};
          var percent_off = 0;
          var actualAmt = lowest_price.price * lowest_price.qty;

          if (disAppliedCount === 0) return;
          if (lowest_price.qty >= disAppliedCount) {
            percent_off =
              (lowest_price.price / actualAmt) * 100 * disAppliedCount;
            pro.dis_percentoff = percent_off;
            pro.qty = disAppliedCount;
            pro.id = lowest_price.id;
            freeProductIds.push(lowest_price.id);
            dis_array.push(pro);
            disAppliedCount = 0;
          } else {
            percent_off = (lowest_price.price / actualAmt) * 100;
            pro.qty = lowest_price.qty;
            pro.dis_percentoff = percent_off;
            pro.id = lowest_price.id;
            freeProductIds.push(lowest_price.id);
            dis_array.push(pro);
            if (lowest_price.qty > 1) {
              disAppliedCount = disAppliedCount - lowest_price.qty;
            } else {
              disAppliedCount--;
            }
          }
        });
        //here BOGO discount calculating on all product
        var freeProTotal = this.getFreeProductTotal(cartProducts, dis_array);
        var percentage_off_total = (freeProTotal / totalCartValue) * 100;
        data = this.getPercentOf(product, Number(percentage_off_total));
        data.rule_id = rule.rule_id;

        /***** here BOGO discount calculating on applied product *******/
        // if (freeProductIds.length > 0 && freeProductIds.includes(Number(product.id))) {
        //     var current_dis_data = {};
        //     dis_array.forEach(data => {
        //         if (Number(product.id) === data.id) {
        //             current_dis_data = data;
        //         }
        //     })
        //     var percentoff = ((product_price * current_dis_data.qty) / (product_price * product.qty)) * 100;
        //     data = this.getPercentOf(product, Number(percentoff));
        // }
      }
    }
    return data;
  },
  buyXGetDiscount: function (product, rule, cartProducts) {
    var data = {};

    if (rule.excluded_items && rule.excluded_items.includes(String(product.id))) {
      // If the product is excluded, return the original prices with no discount
      var product_price = this.getPrice(product);

      data.discounted_price = product_price;
      data.discountAmount = 0;
      data.percentage_off_discount = 0;
      data.discount_label = "";
      return data;
    }
    var product_price = this.getPrice(product);

    var discounted_price = product_price;
    var discountAmount = 0;
    var percentage_off_discount = 0;
    var discount_label = "";

    //default returing values
    data.discounted_price = discounted_price;
    data.discountAmount = discountAmount;
    data.percentage_off_discount = percentage_off_discount;
    data.discount_label = discount_label;

    //Getting Total Cart Value
    //var totalCartValue          = this.getRuleAppliedCartTotal(cartProducts,rule);
    var totalCartQty = this.getRuleAppliedCartQty(cartProducts, rule);
    if (rule.is_multiple_qty) {
      var qty_ranges = rule.qty_range.split(";");

      qty_ranges.forEach((qty_range, index) => {
        let percent_off_range = rule.percent_off_range.split(";");
        var flat_off_range = rule.flat_off_range.split(";");
        var qtyRange = qty_range.split("-");
        var qtyStartRange = qtyRange[0];
        var qtyEndRange = qtyRange[1];

        if (
          totalCartQty >= Number(qtyStartRange) &&
          totalCartQty <= Number(qtyEndRange) &&
          percent_off_range[index] &&
          Number(percent_off_range[index]) !== 0
        ) {
          data = this.getPercentOf(product, Number(percent_off_range[index]));
          data.rule_id = rule.rule_id;
        }

        if (
          totalCartQty >= Number(qtyStartRange) &&
          totalCartQty <= Number(qtyEndRange) &&
          flat_off_range[index] &&
          Number(flat_off_range[index]) !== 0
        ) {
          var discountPerProduct = Number(flat_off_range[index]);
          var percentOnPerProduct = this.getPercentageOfCartTotal(
            cartProducts,
            discountPerProduct
          );
          data = this.getPercentOf(product, percentOnPerProduct);
          data.rule_id = rule.rule_id;
        }
      });
    } else if (rule.qty_buy && Number(totalCartQty) >= Number(rule.qty_buy)) {
      if (rule.percentoff) {
        data = this.getPercentOf(product, Number(rule.percentoff));
        data.rule_id = rule.rule_id;
      } else if (rule.flatoff) {
        var discountPerProduct = Number(rule.flatoff);
        var percentOnPerProduct = this.getPercentageOfCartTotal(
          cartProducts,
          discountPerProduct
        );
        data = this.getPercentOf(product, percentOnPerProduct);
        data.rule_id = rule.rule_id;
      }
    }

    return data;
  },
  spentXGetDiscount: function (product, rule, cartProducts) {

    var data = {};
    if (rule.excluded_items && rule.excluded_items.includes(String(product.id))) {
      // If the product is excluded, return the original prices with no discount
      var product_price = this.getPrice(product);

      data.discounted_price = product_price;
      data.discountAmount = 0;
      data.percentage_off_discount = 0;
      data.discount_label = "";
      return data;
    }
    var product_price = this.getPrice(product);

    var discounted_price = product_price;
    var discountAmount = 0;
    var percentage_off_discount = 0;
    var discount_label = "";

    //default returing values
    data.discounted_price = discounted_price;
    data.discountAmount = discountAmount;
    data.percentage_off_discount = percentage_off_discount;
    data.discount_label = discount_label;

    //Getting Total Cart Value
    var totalCartValue = this.getRuleAppliedCartTotal(cartProducts, rule);
    //var totalCartQty = this.getRuleAppliedCartQty(cartProducts, rule);

    if (rule.is_multiple_range) {
      var amt_ranges = rule.amt_range.split(";");

      amt_ranges.forEach((amt_range, index) => {
        var percent_off_range = rule.percent_off_range.split(";");
        var flat_off_range = rule.flat_off_range.split(";");
        var amountRange = amt_range.split("-");
        var startRange = amountRange[0];
        var endRange = amountRange[1];

        if (
          totalCartValue >= Number(startRange) &&
          totalCartValue <= Number(endRange) &&
          percent_off_range[index] &&
          percent_off_range[index] !== 0
        ) {
          data = this.getPercentOf(product, Number(percent_off_range[index]));
          data.rule_id = rule.rule_id;
        }
        if (
          totalCartValue >= Number(startRange) &&
          totalCartValue <= Number(endRange) &&
          flat_off_range[index] &&
          flat_off_range[index] !== 0
        ) {
          if (rule.free_item) {
            var free_product = rule.free_product[0];
            if (free_product) {
              var pro = this.getProductFromId(Number(free_product));
              if (pro) {
                console.log(pro);
                let pros = this.getCartItems();
                let free_pro = pros.find((pro_) => free_product == pro_?.id);
                if (!free_pro) {
                  console.log("ADDING FREE PRO", pro?.prices[0].mrp);
                  AddToCartHelper.validatePrice(pro);
                }
              }

            }

          }
          var discountPerProduct = Number(flat_off_range[index]);
          var percentOnPerProduct = this.getPercentageOfCartTotal(
            cartProducts,
            discountPerProduct
          );
          data = this.getPercentOf(product, Number(percentOnPerProduct));
          data.rule_id = rule.rule_id;
        }
      });
    } else if (
      rule.amt_spend &&
      Number(totalCartValue) >= Number(rule.amt_spend)
    ) {
      if (rule.percentoff) {
        data = this.getPercentOf(product, Number(rule.percentoff));
        data.rule_id = rule.rule_id;
      } else if (rule.flatoff) {
        var discountPerProduct = Number(rule.flatoff);
        var percentOnPerProduct = this.getPercentageOfCartTotal(
          cartProducts,
          discountPerProduct
        );

        data = this.getPercentOf(product, percentOnPerProduct);
        data.rule_id = rule.rule_id;
        // console.log("rule.data", data);
      } else if (rule.free_item) {
        var free_product = rule.free_product[0];

        // console.log("free_product", free_product);
        if (free_product) {
          var pro = this.getProductFromId(Number(free_product));
          if (pro) {
            // console.log(pro);
            let pros = this.getCartItems();
            let free_pro = pros.find((pro_) => free_product == pro_?.id);
            if (!free_pro) {
              console.log("ADDING FREE PRO", pro?.prices[0].mrp);
              AddToCartHelper.validatePrice(pro);
            }
            var discount = Number(pro?.prices[0].mrp);
            var flatOff = this.getPercentageOfCartTotal(
              cartProducts,
              discount
            );
            // console.log("flatOff", flatOff);
            data = this.getPercentOf(product, flatOff);
            data.rule_id = rule.rule_id;
          }

        }

      }
    }
    return data;
  },
  getFormData: function () {
    //getting store data
    var state = store.getState();
    var cartProducts = state.cartProduct;
    var returnData = state.returnData;
    var exchangeData = state.exchange?.data;
    var editData = state.editData;
    var checkoutData = state.checkoutData.data;
    var customerData = state.customerData;
    var discountData = state.discount;
    let token = state.checkoutData?.token;
    var formData = {};
    //adding Cart Items in form
    formData.cart = [];
    formData.applyDisWithoutTax = 0;
    //arranging cart items data for checkout
    cartProducts.forEach((product, index) => {
      var discountedData = this.getRulesAppliedData(product);
      const cartProduct = { ...product };
      delete cartProduct.rules;
      formData.cart[index] = cartProduct;
      formData.cart[index].quantity = product.qty;
      formData.cart[index].rule_applied = discountedData.rule_id
        ? discountedData.rule_id
        : "";
      formData.cart[index].disType = "";
      formData.cart[index].discount = Number(
        discountedData.percentage_off_discount
      ).toFixed(4);
      if (this.isGiftVoucherApplicable()) {
        formData.cart[index].discount = 0;
      }
      formData.cart[index].applyDisWithoutTax = 0; // this parameter is for apply discount after tax
      //check for discount after tax if redeeming gift value or aftertax enabled
      if (this.isApplyingDiscountAfterTax() || customerData.isChecked) {
        formData.cart[index].applyDisWithoutTax = 1;
        formData.applyDisWithoutTax = 1;
      }

      let tax = 0;
      if (this.isGiftVoucherApplicable()) {
        tax = product.qty * this.getTaxAmount(this.getPrice(product), product);
      } else {
        tax = product.qty * discountedData.taxamount;
      }

      var discount_Amount = product.qty * discountedData.discountAmount;
      if (this.isApplyingDiscountAfterTax() && discount_Amount) {
        let taxAmtOnDiscount = this.getTaxAmountFromDiscount(
          discount_Amount,
          product
        );
        tax -= taxAmtOnDiscount;
      }

      //  formData.cart[index].finalprice = discountedData.price
      //  console.log("finalprice",formData.cart[index].finalprice);
      //console.log("price",discountedData);

      formData.cart[index].item_ttl_disc_amt = discountedData.discountAmount;
      formData.cart[index].item_calc_tax = tax;
      formData.cart[index].item_price = discountedData.price;
      formData.cart[index].appointment_id = product.appointment_id;
    });

    //Arranging payments data
    formData.payments = {};
    if (!this.isEmpty(checkoutData)) {
      formData.payments.subtotal = checkoutData.subtotal;

      if (this.isGiftVoucherApplicable()) {
        formData.payments.discount = 0;
      } else {
        formData.payments.discount = checkoutData.discount;
      }
      formData.payments.totaltax = checkoutData.totaltax;
      formData.payments.payment_amount = checkoutData.payment_amount;

      formData.payments.payment_type = checkoutData.payment_type;
      if (checkoutData.payment_type === "CARD") {
        formData.payments.transactionid = checkoutData.card_no;
      }
      if (checkoutData.payment_type === "POS") {
        formData.payments.transactionid = state.payments?.data?.rrn;
      }
      if (checkoutData.payment_type === "POS-PL") {
        formData.payments.transactionid = state.payments?.pineLabs?.trans_id;
      }

      if (checkoutData.credit_amt) {
        formData.payments.credit_amt = checkoutData.credit_amt;
        formData.payments.paid_amt = checkoutData.paid_amt;
      }

      if (discountData?.is_credit_note) {
        let creditData = discountData?.creditData

        formData.payments.credit_amt = creditData.credit_amt;
        formData.return_dis = creditData.credit_amt;
        // 
      }


      let round = this.getBillSummary().round;
      formData.payments.round = round;
      if (state.delivery.deliveryApplied) {
        formData.payments.delivery_charge = state.delivery.delivery.toFixed(2);
      }

      if (state.miscellaneous.packagingApplied) {
        formData.payments.packaging_charge = state.miscellaneous.packaging.toFixed(
          2
        );
      }
    }

    var additional = this.getAdditionalDiscountData();
    if (additional && !this.isEmpty(additional) && additional.length > 0) {
      formData.additional_discount = additional;
    }

    //Other Payments
    formData.other_payments = {};
    if (checkoutData.payment_type === "OTHER") {
      var otherPayment = state.checkoutData.otherPayment;
      if (otherPayment.cash) {
        formData.other_payments.CASH = otherPayment.cash;
      }
      if (otherPayment.card) {
        formData.other_payments.CARD = otherPayment.card;
      }
      if (otherPayment.upi) {
        formData.other_payments.UPI = otherPayment.upi;
      }
      if (otherPayment.other) {
        var otherPaymentType = otherPayment.otherType;
        formData.other_payments[otherPaymentType] = otherPayment.other;
        //card Number
        formData.payments.transactionid = otherPayment.cardNo;
      }
    }

    if (!this.isEmpty(returnData)) {
      formData.returnOrder = 1;
      formData.sale_id = "";
      if (returnData.sale_id) {
        formData.sale_id = returnData.sale_id;
      }
      if (returnData.barcode_return) {
        formData.barcode_return = returnData.barcode_return;
      }
      if (Number(checkoutData.payment_amount) < 0) {
        formData.payments.payment_amount = 0;
      }
    }
    if (exchangeData) {
      formData.returnOrder = 1;
      formData.sale_id = "";
      if (exchangeData.sale_id) {
        formData.sale_id = exchangeData.sale_id;
      }
    }

    if (!this.isEmpty(editData)) {
      formData.sale_id = editData.sale_id;
    }

    formData.user = Helper.getUserId();
    formData.status = 0;
    formData.apply_as_coupon_disc = 0;
    if (this.isGiftVoucherApplicable()) {
      formData.apply_as_coupon_disc = checkoutData.discount;
    }
    // if (this.isOnlyCouponCodeApplied()) {
    //     var summary = this.getBillSummary();
    //     formData.apply_as_coupon_disc = summary.ruleDiscountAmount
    //     formData.coupon_code = discount.coupon
    // }
    // if (discount.apply && !this.isEmpty(discount.creditData) && discount.creditData.success) {
    //     formData.credit_note = discount.coupon
    //     // formData.credit_discount = discount.creditData.credit_amt
    // }

    formData.is_redeemd = false;
    formData.couponBal = 0;
    formData.couponRedeemedAmt = 0;
    //check if redeeming gift value
    var custRecord = customerData.custrecord.data
      ? customerData.custrecord.data
      : "";
    if (customerData.isChecked) {
      var redeemamount = customerData.redeemamount;
      formData.is_redeemd = customerData.isChecked;

      //Gift voucher applying here;
      var isGiftVAplcble = this.isGiftVoucherApplicable();
      var giftval = this.getCouponBalance(customerData);
      if (isGiftVAplcble && giftval && redeemamount) {
        var couponBal = giftval;
        if (giftval >= redeemamount) {
          couponBal = giftval - redeemamount;
        }
        formData.couponBal = couponBal;
        formData.couponRedeemedAmt = redeemamount;
      }

      //Redeem Amount converting to point;
      if (
        custRecord &&
        custRecord.reward_points &&
        custRecord.reward_point_equal
      ) {
        var usedRewardPoint =
          Number(redeemamount) / Number(custRecord.reward_point_equal);
        formData.points_used = usedRewardPoint;
        formData.points_left =
          Number(custRecord.reward_points) - usedRewardPoint;
      }
    }
    //Reward package id gettting from customer record
    if (custRecord) {
      if (custRecord.package_id) {
        formData.reward_pkg_id = custRecord.package_id;
      }
    }
    //Reward package id gettting from New Package Mapping Box data
    if (customerData.rewardPkgId) {
      formData.reward_pkg_id = customerData.rewardPkgId;
    }
    if (customerData.memberNo) {
      formData.membership_no = customerData.memberNo;
    }

    formData.salescounter = Helper.getSalesCounter();
    formData.customer = "";
    formData.cphone = "";

    var customer = state.checkoutData.customer
    if (!this.isEmpty(customer)) {
      formData.create_customer = true
      formData.cname = customer.customer_name
      formData.cphone = customer.phone_number
      formData.ccountrycode = customer.countrycode
      formData.customer_source = customer.referralsource
      formData.additional_details = customer.additional_comment
      formData.sales_person = ""
      if (customer.salesExec) {
        formData.sales_person = customer.salesExec
      }
    }
    formData.location = Helper.getLocationId();
    formData.order_date = this.getOrderDateTime();
    formData.ref_uuid = uuidv4();

    if (token && token?.id) {
      formData.token = token;
    }

    if (state?.cashRegister && state?.cashRegister?.isRegisterOpen) {
      formData.register_id = state?.cashRegister?.register_id;
    }

    return formData;
  },
  getAdditionalDiscountData: function () {
    var state = store.getState();
    var discount = state.discount;
    //Additional Discount mapping
    //var redeemAmount = this.getRedeemAmount();
    var additional = [];

    var itemWiseDiscAmt = this.getAddItemWiseDiscountAmount();
    if (Number(itemWiseDiscAmt) > 0) {
      var discountData = {};
      discountData.discount = itemWiseDiscAmt.toFixed(2);
      discountData.type = "flatoff";
      discountData.group = "additional";
      discountData.reference = "ItemDisc";
      additional.push(discountData);
    }

    var ruleDiscountAmt = this.getRuleDiscountAmount();
    if (ruleDiscountAmt && Number(ruleDiscountAmt) > 0) {
      var ruleData = {};
      ruleData.discount = Number(ruleDiscountAmt).toFixed(2);
      ruleData.type = "rule";
      ruleData.group = "rule";
      ruleData.reference = "";
      additional.push(ruleData);
    }
    var couponAmount = this.getCouponDiscountAmt();
    if (Number(couponAmount) > 0) {
      var couponData = {};
      couponData.discount = couponAmount.toFixed(2);
      couponData.type = "coupon";
      couponData.group = "additional";
      couponData.reference = discount.coupon;
      couponData.discounttype = discount?.couponData?.data?.type
      additional.push(couponData);
    }
    var creditNoteAmt = this.getCreditNoteAmt();
    if (Number(creditNoteAmt) > 0) {
      var creditData = {};
      creditData.discount = creditNoteAmt.toFixed(2);
      creditData.type = "creditnote";
      creditData.group = "additional";
      creditData.reference = discount.coupon;
      additional.push(creditData);
    }
    var manualDiscAmt = this.getManualDiscountAmt();
    if (Number(manualDiscAmt) > 0) {
      var discountData = {};
      discountData.discount = manualDiscAmt.toFixed(2);
      discountData.type = discount.flatoff ? "flatoff" : "percentoff";
      discountData.group = "additional";
      discountData.reference = discount.flatoff
        ? discount.flatoff
        : discount.percentoff;
      additional.push(discountData);
    }

    return additional;
  },
  getCouponBalance: function (customerData) {
    var total = 0;
    if (
      customerData &&
      customerData.custrecord &&
      customerData.custrecord.data
    ) {
      var item = customerData.custrecord.data;
      total = Number(item.giftvalue);
    }
    return Number(total);
  },
  getTotalShopping: function (customerData) {
    var total = "";
    if (
      customerData &&
      customerData.custrecord &&
      customerData.custrecord.data
    ) {
      var item = customerData.custrecord.data;
      total = item.total;
    }
    return total;
  },
  recheckLowestPriceForBogo: function (cartProducts) {
    var lowestPrice = 0;
    var allProductPrice = [];
    cartProducts.forEach((product) => {
      allProductPrice.push(this.getPrice(product));
    });
    lowestPrice = Math.min(...allProductPrice);
    return lowestPrice;
  },
  getItemsToShort: function (cartProducts, rule) {
    var allProduct = [];
    var rulesAppliedCartProduct = [];
    cartProducts.forEach((product) => {
      if (this.isRulesApplied(product, rule)) {
        rulesAppliedCartProduct.push(product);
      }
    });
    rulesAppliedCartProduct.forEach((product) => {
      var item = {};
      item.price = Number(product.finalprice);
      item.id = Number(product.id);
      item.qty = Number(product.qty);
      allProduct.push(item);
    });
    return allProduct;
  },
  getFreeProductTotal: function (cartProducts, freeProductIds) {
    var total = 0;
    cartProducts.forEach((cartProduct) => {
      freeProductIds.forEach((pro) => {
        if (Number(cartProduct.id) === pro.id) {
          var product_price = 0;
          if (this.isApplyingDiscountAfterTax()) {
            product_price = this.getFinalPrice(cartProduct);
          } else {
            product_price = this.getPrice(cartProduct);
          }
          total += product_price * pro.qty;
        }
      });
    });
    return total;
  },
  getRuleAppliedCartTotal: function (cartProducts, rule) {
    var totalCartValue = 0;
    cartProducts.forEach((product) => {
      if (this.isRulesApplied(product, rule)) {
        var productqty = Number(product.qty);
        var finalprice = this.isApplyingDiscountAfterTax()
          ? Number(product.finalprice)
          : Number(product.price);
        totalCartValue += Number(productqty) * Number(finalprice);
      }
    });
    return Number(totalCartValue);
  },
  getRuleAppliedCartQty: function (cartProducts, rule) {
    var totalCartQty = 0;
    cartProducts.forEach((product) => {
      if (this.isRulesApplied(product, rule)) {
        var qty = Number(product.qty);
        totalCartQty += qty;
      }
    });
    return Number(totalCartQty);
  },
  getPercentOf: function (product, percentoff) {
    var data = {};
    var product_price = this.getPrice(product);
    var product_finalprice = this.getFinalPrice(product);

    var percentage_off_discount = percentoff;
    var discountAmount = (product_price / 100) * percentage_off_discount;
    var discounted_price = product_price - discountAmount;

    if (this.isApplyingDiscountAfterTax()) {
      discountAmount = (product_finalprice / 100) * percentage_off_discount;
      discounted_price = product_price;
    }

    var discount_label = Number(percentage_off_discount).toFixed(2) + "%";
    data.discounted_price = discounted_price;
    data.discountAmount = discountAmount;
    data.percentage_off_discount = percentage_off_discount;
    data.discount_label = discount_label;
    return data;
  },
  getFlatOf: function (product, flatoff) {
    var data = {};
    var product_price = this.getPrice(product);
    var product_finalprice = this.getFinalPrice(product);

    var percentage_off_discount = (flatoff / product_price) * 100;
    var discountAmount = (product_price / 100) * percentage_off_discount;
    var discounted_price = product_price - discountAmount;

    if (this.isApplyingDiscountAfterTax()) {
      percentage_off_discount = (flatoff / product_finalprice) * 100;
      discountAmount = (product_finalprice / 100) * percentage_off_discount;
      discounted_price = product_price;
    }

    var discount_label = Number(percentage_off_discount).toFixed(2) + "%";

    data.discounted_price = discounted_price;
    data.discountAmount = discountAmount;
    data.percentage_off_discount = percentage_off_discount;
    data.discount_label = discount_label;

    return data;
  },
  getProductFromId: function (id) {
    var allProduct = dbProductsData?.data;
    var findProduct = "";

    allProduct?.forEach((product) => {
      if (product.id === id) {
        findProduct = { ...product };
        return true;
      }
    });
    return findProduct;
  },

  getCalculationOfDenoms: function (denom) {
    var TotalCalc = 0;
    if (denom && !this.isEmpty(denom)) {
      denom.forEach((data) => {
        TotalCalc += data.denom * data.count;
      });
    }
    return TotalCalc;
  },
  getOfflineInvoiceNo: function () {
    var invPrefix = Helper.getInvPrefix();
    var today = new Date();
    var date =
      today.getFullYear() + "" + (today.getMonth() + 1) + "" + today.getDate();
    var time =
      today.getHours() + "" + today.getMinutes() + "" + today.getSeconds();
    var dateTime = date + "" + time;
    return invPrefix + "" + dateTime;
  },
  getOfflineOrderDate: function () {
    var today = new Date();
    var date =
      today.getFullYear() +
      "-" +
      (today.getMonth() + 1) +
      "-" +
      today.getDate();
    var time =
      today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date + " " + time;
    return dateTime;
  },
  getOfflineResponseDate: function () {
    var today = new Date();
    var date =
      today.getDate() +
      "/" +
      (today.getMonth() + 1) +
      "/" +
      today.getFullYear();
    var time =
      today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date + " " + time;
    return dateTime;
  },
  getOrderDateTime: function () {
    var today = new Date();
    var date =
      today.getMonth() + 1 + "/" + today.getDate() + "/" + today.getFullYear();
    var time =
      today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date + " " + time;
    return dateTime;
  },
  formatOrderDate: function (date) {
    return date.split("-").join("/");
  },
  getOfflineBillingData: function (formData) {
    var rules = this.getCurrentAppliedRule("");
    var billingData = {};
    billingData.success = true;
    billingData.data = formData.cart;
    billingData.rules = rules;
    billingData.sales_data = {
      applyDisWithoutTax: formData.applyDisWithoutTax.toString(),
      dis_type: null,
      discount: formData.payments.discount,
      nettotal: formData.payments.payment_amount,
      subtotal: formData.payments.subtotal,
      tax: formData.payments.totaltax,
    };
    billingData.customer = {
      amount: formData.payments.payment_amount,
      order_date: this.getOfflineOrderDate(),
      person_id: "",
      phone_number: formData.cphone,
    };
    return billingData;
  },
  getOfflineResponseData: function (formData) {
    var responseData = {};
    responseData.date = this.getOfflineResponseDate();
    responseData.invoice_num = formData.off_ref_no;
    responseData.sale_id = formData.off_ref_no;
    responseData.success = true;
    return responseData;
  },
  getProductUpdatedPrice: function (product, price) {
    var selectedProduct = { ...product };
    const selectedPrice = {
      cost_price: price.costprice,
      price: price.pricebftx,
      mrp: price.mrp,
      finalprice: price.mrp,
      actualMrp: price.actualMrp,
    };
    selectedProduct = {
      ...selectedProduct,
      ...selectedPrice,
    };
    return selectedProduct;
  },
  getPriceFromPrices: function (product) {
    var finalprice = product.finalprice;
    if (product.prices && product.prices.length > 0) {
      var price = product.prices[0];
      finalprice = price.mrp;
    }
    return this.getCurrencyFormatted(finalprice);
  },
  isPriceVarient: function (product) {
    let isVary = false;
    if (product.prices && product.prices.length > 0) {
      var price = product.prices[0];
      if (Number(price.actualMrp) - Number(price.mrp) > 0) {
        isVary = price?.actualMrp;
      }
    }
    return isVary ? "MRP " + this.getCurrencyFormatted(isVary) : false;
  },
  getQTHFromStock: function (product) {
    var qth = product.pre_qty ? product.pre_qty : 0;
    var quantity = 0;
    if (product.stock) {
      product.stock.forEach((stock) => {
        quantity += Number(stock.quantity);
      });
      if (quantity) {
        qth = quantity;
      }
    }
    return Number(qth).toFixed(2);
  },
  /* handling the customer group price */
  getCustomerGroupProductPrice: function (product, price, membershipId) {
    var selectedProduct = { ...product };
    console.log(selectedProduct.group_prices.cust_grp_prices);
    let custgroupPrices = JSON.parse(selectedProduct.group_prices.cust_grp_prices);
    let prdFinalPrice = (membershipId != 0) && (membershipId in custgroupPrices) ? custgroupPrices[membershipId] : price.mrp;
    console.log("Final Price " + prdFinalPrice);
    const selectedPrice = {
      cost_price: price.costprice,
      price: (prdFinalPrice / (1 + (product.tax / 100))), // price before tax
      mrp: prdFinalPrice,
      finalprice: prdFinalPrice,
      actualMrp: price.actualMrp,
    };


    selectedProduct = {
      ...selectedProduct,
      ...selectedPrice,
    };
    return selectedProduct;
  },
  getDetailPriceFromNewPrice: function (
    tax,
    newPrice,
    discount_type,
    discount_amount,
    product
  ) {
    var data = {};
    var TaxPercent = Number(tax);
    var NewPriceNum = Number(newPrice);
    var taxAmount = NewPriceNum - NewPriceNum * (100 / (100 + TaxPercent));
    var taxAmountFixed = Number(taxAmount).toFixed(3);
    var taxAmountNum = Number(taxAmountFixed);
    // data.taxAmount = taxAmountNum;
    data.price = NewPriceNum - taxAmountNum;
    data.finalprice = NewPriceNum;
    data.mrp = NewPriceNum;
    data.actualMrp = product?.actualMrp;
    if (Number(data.actualMrp) === Number(data.mrp)) {
      data.is_editable_already = false;
    } else {
      data.is_editable_already = true;
    }

    data.item_dis_type = discount_type;
    data.item_discount_amount = discount_amount;
    var item_applied_disc_amt = 0;
    if (discount_type === "PERCENT") {
      item_applied_disc_amt = Number((newPrice * discount_amount) / 100);
    } else if (discount_type === "FLAT") {
      item_applied_disc_amt = Number(discount_amount);
    } else {
      item_applied_disc_amt = 0;
    }
    data.item_applied_disc_amt = item_applied_disc_amt;
    data.item_applied_disc_amt_ttl = item_applied_disc_amt * product.qty;
    return data;
  },

  // to calculate Item Wise percent or flat discount
  getDetailPriceFromNewPriceEDitable: function (
    tax,
    newPrice,
    mrp,
    discount_type,
    discount_amount,
    product
  ) {
    var data = {};
    var new_Price_num_calc = Number(newPrice);
    var TaxPercent = Number(tax);
    var NewPriceNum = Number(newPrice);
    var taxAmount = mrp - mrp * (100 / (100 + TaxPercent));
    var taxAmountFixed = Number(taxAmount).toFixed(3);
    var taxAmountNum = Number(taxAmountFixed);
    data.price = new_Price_num_calc - taxAmountNum;
    var new_price_num_ttl = Number(new_Price_num_calc - taxAmountNum);
    data.finalprice = new_Price_num_calc;
    data.mrp = new_Price_num_calc;
    data.item_dis_type = discount_type;
    data.item_discount_amount = discount_amount;

    var item_applied_disc_amt = "";
    if (discount_type === "PERCENT") {
      item_applied_disc_amt = Number((newPrice * discount_amount) / 100);
    } else if (discount_type === "FLAT") {
      item_applied_disc_amt = Number(discount_amount);

    } else {
      item_applied_disc_amt = 0;
    }
    data.item_applied_disc_amt = item_applied_disc_amt;
    data.item_applied_disc_amt_ttl = item_applied_disc_amt * product.qty;
    data.mrp = mrp;
    data.finalprice = mrp;
    data.price = Number(mrp) - taxAmountNum;
    return data;
  },

  changeTaxForNewPrice: function (tax, newPrice) {
    var data = {};
    var TaxPercent = Number(tax);
    var NewPriceNum = Number(newPrice);
    var taxAmount = NewPriceNum - NewPriceNum * (100 / (100 + TaxPercent));
    var taxAmountFixed = Number(taxAmount).toFixed(3);
    var taxAmountNum = Number(taxAmountFixed);
    // data.taxAmount = taxAmountNum;
    data.price = NewPriceNum - taxAmountNum;
    data.finalprice = NewPriceNum;
    data.mrp = NewPriceNum;
    if (Number(data.actualMrp) === Number(data.mrp)) {
      data.is_editable_already = false;
    } else {
      data.is_editable_already = true;
    }
    data.tax = tax;
    const tax_rates = [Number(tax / 2).toFixed(3), Number(tax / 2).toFixed(3)];
    data.tax_rates = tax_rates;
    return data;
  },

  getCartItems: function () {
    return store.getState().cartProduct;
  },
  getCreditData: function () {
    return store.getState().credit;
  },
  getItemDisAmt: function (item) {
    let mrp = item.actualMrp;
    let mrpTotal = Number(mrp) * Number(item.qty);
    let price = this.getItemPrice(item);
    let diff = Number(mrpTotal) - Number(price);

    let totalDisc = diff;
    return totalDisc.toFixed(2);
  },
  getItemDisAmtWithCurrency: function (item) {
    let discount = this.getItemDisAmt(item);
    return this.getCurrencyFormatted(Number(discount).toFixed(2));
  },
  getItemPrice: function (item) {
    let price =
      Number(item.applyDisWithoutTax) === 1 ? item.finalprice : item.price;
    let discount = item.discount;
    let discountAmt = (Number(discount) * Number(price)) / 100;
    let finalPrice = price - discountAmt;
    if (Number(item.applyDisWithoutTax) === 0) {
      let taxAmt = this.getTaxAmount(finalPrice, item);
      finalPrice += taxAmt;
    }
    let totalFPrice = finalPrice * Number(item.qty);
    return totalFPrice.toFixed(2);
  },
  getItemPriceWithCurrency: function (item) {
    let price = this.getItemPrice(item);
    return this.getCurrencyFormatted(Number(price).toFixed(2));
  },
  getProductWithRules: function (cproduct) {
    const product = { ...cproduct };
    var state = store.getState();
    const rules =
      state.productData.rules && state.productData.rules.length > 0
        ? state.productData.rules
        : [];
    product.rules = [];
    rules.forEach((rule) => {
      if (this.isRulesApplied(product, rule)) {
        product.rules.push(rule);
      }
    });
    return product;
  },
  isRuleApplicableOnlyOnProduct: function (rule) {
    var applied_on_product = false;
    if (rule.apply_rule_on === "product") {
      applied_on_product = true;
    }
    return applied_on_product;
  },
  isRuleApplicableOnThisProduct: function (product, rule) {
    var applied_on_this_product = false;
    if (rule.apply_rule_on === "product") {
      if (rule.items && rule.category_ids) {
        if (rule.items.length === 0 && rule.category_ids.length === 0) {
          return (applied_on_this_product = true);
        }
      }
      if (rule.items && rule.items.length > 0) {
        rule.items.forEach((itemId) => {
          if (Number(itemId) === Number(product.id)) {
            return (applied_on_this_product = true);
          }
        });
      }
      if (rule.category_ids && rule.category_ids.length > 0) {
        rule.category_ids.forEach((catId) => {
          if (Number(catId) === Number(product.category_id)) {
            return (applied_on_this_product = true);
          }
        });
      }
    }
    return applied_on_this_product;
  },
  getReturnData: (returnDetails) => {
    let returndata;

    return returndata;
  },

  /*** This following functions are to generate local invoice data without calling loadorder api */
  // *** start ***
  generateInvoiceData: function (formData, responseData = null) {
    // order_data shud be {sale_id ,invoice_num }
    let checkoutData = store.getState().checkoutData;
    var data = formData?.cart; //        store.getState().cartProduct;
    // console.log("formad ta");
    let customer = checkoutData.customer;

    let sales_data = {
      dis_type: null,
      return_ref_dis: "0.000",

      additional_disc: "0.00",

      applyDisWithoutTax: formData?.applyDisWithoutTax.toFixed(2),
      credit_balance: formData?.payments?.credit_amt ?? "0.00",
      credit_amt: formData?.payments?.credit_amt ?? "0.00",
      paid_amt: formData?.payments?.paid_amt ?? "0.00",
      discount_detail: this.getBillAdditionalDisc(formData),
      rule_disc: this.getBillRuleDisc(formData),

      delivery_charge: formData?.payments?.delivery_charge ?? "0.00",
      misc_charge: formData.payments?.packaging_charge ?? "0.00",
      payments: this.getBillPayments(formData),
      payment_type: formData.payments?.payment_type,

      discount: formData.payments.discount, //"0.00",
      nettotal: formData.payments.payment_amount, //"75.00",
      subtotal: formData.payments.subtotal, // "68.18",
      tax: formData.payments.totaltax, //"6.82",
    };

    let rules = [];

    let invoice = responseData?.invoice_num ?? checkoutData.responseData.invoice_num;
    let sale_id = responseData?.sale_id ?? checkoutData.responseData.sale_id;

    let sales_person_data = this.getSales_person_data(formData);

    let billingData = {
      customer,
      data,
      rules,
      sale_id,
      sales_data,
      invoice,
      sales_person_data,

      success: true,
    };

    return billingData;
  },

  getBillPayments: function (billingData) {
    let payments = billingData.payments;

    if (payments.payment_type === "OTHER") {
      let cash = Boolean(Number(billingData.other_payments?.CASH))
        ? `, CASH ${billingData.other_payments?.CASH}`
        : "";
      let card = Boolean(Number(billingData.other_payments?.CARD))
        ? `, CARD ${billingData.other_payments?.CARD}`
        : "";
      let upi = Boolean(Number(billingData.other_payments?.UPI))
        ? `, UPI ${billingData.other_payments?.UPI}`
        : "";
      payments = cash + card + upi;
    } else {
      payments = `${payments.payment_type} ${payments.payment_amount}`;
    }

    return payments; // : "CASH 75.00, CARD 1927.00",
  },
  getBillAdditionalDisc: function (billingData) {
    let add_discount = "0.00";
    if (
      billingData?.additional_discount &&
      billingData?.additional_discount?.length > 0
    ) {
      // discount_detail
      add_discount = JSON.stringify(billingData?.additional_discount);
    }
    return add_discount;
  },
  getBillRuleDisc: function (formData) {
    let rule_disc = 0;
    if (formData?.additional_discount?.length) {
      formData.additional_discount.forEach((element) => {
        if (element.type === "rule") {
          rule_disc += element?.discount;
        }
      });
    }
    return rule_disc.toString();
  },
  getSales_person_data: function (formData) {
    let sales_exes = store.getState().storeData?.data?.salesexes;
    if (formData?.sales_person) {
      let res = sales_exes?.find(
        (item) => Number(item?.person_id) === Number(formData?.sales_person)
      );
      if (res) {
        return res;
      }
    }
    return null;
  },
  // *** end ***
};

export default helpers;
