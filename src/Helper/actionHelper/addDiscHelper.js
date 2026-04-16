import store from '../../store';
import CartHelper from '../cartHelper'
import { isDiscountCouponApplied, applyCoupon, applyPercentoff, applyFlatoff, saveCouponData, updateInvoice, isCreditNoteCoupon, saveCreditData } from '../../redux/action/discountAction';
import { updateCPhone } from '../../redux/action/cartAction';

const helpers = {
    restoreAddDiscount: function (res, invoice_no) {
        var discountData = (res.sales_data.discount_detail) ? JSON.parse(res.sales_data.discount_detail) : "";
        if (discountData && !CartHelper.isEmpty(discountData)) {
            if (Array.isArray(discountData) && discountData.length > 0) {
                discountData.forEach(discount_data => {
                    this.restoreDiscount(discount_data, invoice_no);
                });
            } else {
                if (discountData[1]) {
                    this.restoreDiscount(discountData[1], invoice_no);
                } else {
                    this.restoreDiscount(discountData, invoice_no);
                }
            }
        }
        var customer = (res.customer) ? res.customer : "";
        if (customer && !CartHelper.isEmpty(customer)) {
            this.restorePhone(customer);
        }
    },
    restoreDiscount: function (discountData, invoice_no) {
        var type = discountData['type'];
        var reference = discountData['reference'];
        var discount = discountData['discount'];
        if (type === "coupon") {
            this.restoreCoupon(reference, discount, discountData);
        }
        if (type === "creditnote") {
            this.restoreCreditNote(reference, invoice_no, discount);
        }
        if (type === "percentoff" && reference !== "ItemDisc") {
            this.restorePercentDiscount(reference)
        }
        if (type === "flatoff" && reference !== "ItemDisc") {
            this.restoreFlatDiscount(discount)
        }
    },
    restorePhone: function (customer) {
        var phone = (customer.phone_number) ? customer.phone_number : "";
        if (phone) {
            store.dispatch(updateCPhone(phone));
        }
    },
    restoreCoupon: function (code, amt, discount) {
        var data = {
            "success": true,
            "data": {
                "discount": amt,
                "type": discount?.discounttype
            }
        }
        store.dispatch(applyCoupon(code));
        store.dispatch(saveCouponData(data));
        store.dispatch(isDiscountCouponApplied(true));
    },
    restoreCreditNote: function (code, inv, amt) {
        var data = {
            "credit_amt": amt,
            "credit_id": code,
            "success": true
        }
        store.dispatch(applyCoupon(code));
        store.dispatch(updateInvoice(inv));
        store.dispatch(isCreditNoteCoupon(true));
        store.dispatch(saveCreditData(data));
        store.dispatch(isDiscountCouponApplied(true));
    },
    restorePercentDiscount: function (percent) {
        store.dispatch(applyPercentoff(percent));
        store.dispatch(isDiscountCouponApplied(true));
    },
    restoreFlatDiscount: function (amt) {
        store.dispatch(applyFlatoff(amt));
        store.dispatch(isDiscountCouponApplied(true));
    }
}
export default helpers;