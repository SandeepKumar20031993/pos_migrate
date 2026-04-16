import store from '../store';
import Cookies from 'universal-cookie';

const helpers = {
    getWordlinePOSActionID: function (type) {

        const action = {
            'SALE': 1,
            'SALE-UPI': 133
        }
        return action[type]

    },
    getWordLinePOSTid: function () {
        return this.getFromSession('configs_wordline_pos_tid');
    },
    isPOSPaymentsEnabled: function () {
        return Number(this.getFromSession('configs_is_pos_payments_allowed'));
    },
    isEnableGlobalDiscount: function () {
        return Boolean(Number(this.getFromSession('configs_enable_global_discount')));
    },
    isPineLabsPaymentsAllowed: function () {
        return Boolean(Number(this.getFromSession('configs_is_pinelabs_payments_allowed')));
    },
    getPineLabsTerminals: function () {
        let value = this.getFromSession('configs_pinelabs_terminals_data');
        let terminals = value ? JSON.parse(value) : [];
        return terminals;
    },
    getPineLabsPaymentsModes: function () {
        let value = this.getFromSession('configs_pinelabs_payments_types');
        let modes = value ? JSON.parse(value) : [];
        return modes;
    },
    getDefaultPineLabsTerminal: function () {
        let val = this.getFromSession('default_pinelabs_terminal')
        return val ? JSON.parse(val) : null
    },
    canViewProductsLabel: function () {
        return Number(this.getFromSession('hide_catalog_display'));
    },
    isBrowser: function () {
        return typeof window !== 'undefined' ? true : false
    },
    getStoreApiUrl: function () {
        var url = ''
        const cookies = new Cookies();
        if (cookies.get('url')) {
            url = cookies.get('url')
        }
        return url;
    },
    getStoreName: function () {
        var store_name = ''
        const cookies = new Cookies();
        if (cookies.get('store_name')) {
            store_name = cookies.get('store_name')
        }
        return store_name;
    },
    getStoreCode: function () {
        const cookies = new Cookies();
        var store_code = cookies.get('feteon_store_code')
        return (store_code) ? store_code : "";
    },
    setAllDataInSession: function (prefix, data) {
        for (var label in data) {
            var prefix_label = prefix + '_' + label;
            var value = data[label];

            if (Array.isArray(value)) {
                this.setInSession(prefix_label, JSON.stringify(value));
            } else {
                this.setInSession(prefix_label, value);
            }
        }
    },
    setThisDataInSession: function (label, value) {
        this.setInSession(label, value);
    },
    setInSession: function (key, value) {
        if (this.isBrowser()) {
            sessionStorage.setItem(key, value);
        }
    },
    getFromSession: function (key) {
        if (this.isBrowser()) {
            let data = sessionStorage.getItem(key);
            return (data && data !== 'null') ? data : "";
        }
    },
    getFromCookie: function (key) {
        const cookies = new Cookies();
        var value = cookies.get(key);
        return (value) ? value : "";
    },
    setInCookie: function (key, value, days = 1) {
        const cookies = new Cookies();
        const expiryDate = new Date()
        expiryDate.setDate(expiryDate.getDate() + days)
        cookies.set(key, value, { path: `${process.env.PUBLIC_URL}/`, expires: expiryDate });
    },
    isLoggedIn: function () {
        let islogin = false;
        if (this.getFromSession('islogin') === 'yes') {
            islogin = true;
        }
        return islogin;
    },
    logOut: function () {
        if (this.isBrowser()) {
            sessionStorage.clear();
            window.location.reload();
        }
    },
    clearStorageData: function () {
        if (this.isBrowser()) {
            sessionStorage.clear();
        }
    },
    getStoreDateFormat: function () {
        return this.getFromSession('configs_dateformat');
    },
    getApiKey: function () {
        return this.getFromSession('user_apikey');
    },
    getRetailId: function () {
        return this.getFromSession('user_rid');
    },
    canEditInvoice: function () {
        return Number(this.getFromSession('user_canEditInvoice'));
    },
    canCancelInvoice: function () {
        return Number(this.getFromSession('user_canCancelInvoice'));
    },
    canCreateCreditNote: function () {
        return Number(this.getFromSession('user_showCreditNote'));
    },
    canCreateProduct: function () {
        return Number(this.getFromSession('configs_can_create_product'));
    },
    getSalesCounter: function () {
        return this.getFromSession('sales_counter');
    },
    getConfigPhone: function () {
        return this.getFromSession('configs_phone');
    },
    getConfigEmail: function () {
        return this.getFromSession('configs_email');
    },
    getConfigWebsite: function () {
        return this.getFromSession('configs_website');
    },
    apply_dis_after_tax: function () {
        return Number(this.getFromSession('configs_apply_dis_without_tax'));
    },
    getUserId: function () {
        return this.getFromSession('user_id');
    },
    getUserName: function () {
        return this.getFromSession('user_uname');
    },
    getRole: function () {
        return this.getFromSession('user_role');
    },
    getUserAddress: function () {
        return this.getFromSession('user_address');
    },
    getConfigAddress: function () {
        return this.getFromSession('configs_address');
    },
    getUserCity: function () {
        return this.getFromSession('user_city');
    },
    getSalesReportDuration: function () {
        return this.getFromSession('configs_sales_report_duration');
    },
    getUserRegion: function () {
        return this.getFromSession('user_region');
    },
    getUserPincode: function () {
        return this.getFromSession('user_pincode');
    },
    getGSTNo: function () {
        let gst = this.getFromSession('user_gst_no');
        if (!gst) {
            gst = this.getFromSession('configs_gst');
        }
        return gst;
    },
    getLocationId: function () {
        return this.getFromSession('user_location_id');
    },
    getLocationName: function () {
        return this.getFromSession('configs_location_name');
    },
    getSessionValue: function () {
        return this.getFromSession('configs_show_outofstock_in_pos');
    },
    getCompany: function () {
        return this.getFromSession('configs_company');
    },
    getBrandName: function () {
        let val = this.getFromSession('configs_brand_name');
        if (val && val.length)
            return val
        return null
    },
    getCompanyLogo: function () {
        return this.getFromSession('configs_company_logo');
    },
    getReturnPolicy: function () {
        return this.getFromSession('configs_return_policy');
    },
    getCurrencySymbol: function () {
        return this.getFromSession('configs_currency_symbol');
    },
    isMiscellaneousChargesEnables: function () {
        return this.getFromSession('configs_enable_miscellaneous_charge')
    },
    isDeliveryChargesEnables: function () {
        return this.getFromSession('configs_enable_delivery_charge')
    },
    isQueueBustingEnabled: function () {
        return this.getFromSession('configs_enable_queue_busting')
    },
    quantityDecimal: function () {
        return this.getFromSession('configs_quantity_decimals')
    },
    isMiscellaneousButton: function () {
        let res = this.getFromSession('configs_enable_miscellaneous_charge')
        let del = this.getFromSession('configs_enable_delivery_charge')
        if (res | del)
            return true
        return false
    },
    getCurrencyFormatted: function (amt) {
        return this.getCurrencySymbol() + '' + amt;
    },
    getOtherPaymentOptions: function () {
        var paymentOptions = []
        var storeData = store.getState().storeData;
        let other_payment_options = "";
        if (this.getFromSession('configs_other_payment_options')) {
            other_payment_options = this.getFromSession('configs_other_payment_options');
        } else {
            other_payment_options = storeData.data.configs.other_payment_options;
        }
        if (other_payment_options) {
            paymentOptions = other_payment_options?.split(',');
        }
        return paymentOptions
    },
    isOnline: function () {
        return navigator.onLine;
    },
    isBarcodeReturn: function () {
        return Number(this.getFromSession('configs_barcode_return'));
    },
    isStockValidationCheckEnabled: function () {
        var isEnabled = false
        if (Number(this.getFromSession('configs_stock_validation_check')) === 1) {
            isEnabled = true
        }
        return isEnabled;
    },
    isGlobalDiscountEnabled: function () {
        return Number(this.getFromSession('user_showGblDisc'));
    },
    isCashAllowed: function () {
        return Number(this.getFromSession('configs_is_cash_allowed'));
    },
    isCardAllowed: function () {
        return Number(this.getFromSession('configs_is_card_allowed'));
    },
    isUPIAllowed: function () {
        return Number(this.getFromSession('configs_is_upi_allowed'));
    },
    isOTHERAllowed: function () {
        return Number(this.getFromSession('configs_is_other_allowed'));
    },
    isWalletAllowed: function () {
        return Number(this.getFromSession('configs_is_wallet_allowed'));
    },
    isCreditAllowed: function () {
        return Number(this.getFromSession('configs_is_credit_allowed'));
    },
    getWalletOptions: function () {
        return this.getFromSession('configs_wallet_options');
    },
    isPriceEditable: function () {
        return Number(this.getFromSession('configs_price_editable'));
    },
    isDummyBillAllowed: function () {
        return Number(this.getFromSession('configs_bill_offline'));
    },
    getInvTemp: function () {
        return (this.getFromSession('configs_invtemplate')) ? this.getFromSession('configs_invtemplate') : "default";
    },
    showLogoInBill: function () {
        return Number(this.getFromSession('configs_show_logo_in_bill'));
    },
    showPhoneInBill: function () {
        return Number(this.getFromSession('configs_show_phone_no_in_invoice'));
    },
    showBrandNameInBill: function () {
        return Boolean(Number(this.getFromSession('configs_show_brand_name_in_invoice')));
    },
    showAddressInBill: function () {
        return Number(this.getFromSession('configs_show_address_in_invoice'));
    },
    showEmailInBill: function () {
        return Number(this.getFromSession('configs_show_email_in_invoice'));
    },
    showWebsiteInBill: function () {
        return Number(this.getFromSession('configs_show_website_in_invoice'));
    },
    showGSTInBill: function () {
        return Number(this.getFromSession('configs_show_gst_no_in_invoice'));
    },
    getLangs: function () {
        var langs = {}
        var storeData = store.getState().storeData;
        if (storeData && storeData.data && storeData.data.langs) {
            langs = storeData.data.langs
        }
        return langs
    },
    isCustomerRewardEnable: function () {
        return Number(this.getFromSession('configs_customer_reward_enable'));
    },
    getInvPrefix: function () {
        return (this.getFromSession('user_invprefix')) ? this.getFromSession('user_invprefix') : "INV";
    },
    isCustRequired: function () {
        return Number(this.getFromSession('configs_customer_required'));
    },
    getPosLayout: function () {
        return (this.getFromSession('configs_pos_layout')) ? this.getFromSession('configs_pos_layout') : "default";
    },
    isUsingNewRuleOnExchange: function () {
        return Number(this.getFromSession('configs_use_new_rule_on_exchange'));
    },
    getPermissions: function () {
        let state = store.getState();
        let storeData = (state.storeData) ? state.storeData : {};
        return (storeData.data.permission_array) ? storeData.data.permission_array : {};
    },
    hasPermission: function (module, action) {
        let permissions = this.getPermissions();
        let existModule = (permissions[module]) ? permissions[module] : [];
        if (existModule.includes(action)) {
            return true;
        } else {
            return false;
        }
    },
    hasAnyPermission: function (module, actionArrr) {
        let permissions = this.getPermissions();
        let existModule = (permissions[module]) ? permissions[module] : [];
        if (existModule.some(action => actionArrr.includes(action))) {
            return true;
        } else {
            return false;
        }
    },
    isTaxChangeable: function () {
        return Number(this.getFromSession('configs_is_tax_changeable'));
    },
    taxLimitValue: function () {
        return Number(this.getFromSession('configs_tax_limit_value'));
    },
    taxLimitPercentage: function () {
        return Number(this.getFromSession('configs_tax_limit_percent'));
    },
    maxTaxLimitValue: function () {
        return Number(this.getFromSession('configs_tax_limit_value_above'));
    },
    maxTaxLimitPercentage: function () {
        return Number(this.getFromSession('configs_tax_limit_percent_above'));
    },
    businessType: function () {
        return Number(this.getFromSession('configs_business_type'));
    },
    showBarCodeInInvoice: function () {
        return Number(this.getFromSession('configs_show_barcode_in_invoice'));
    },
    isCashRegsiterEnabled: function () {
        return Number(this.getFromSession('configs_enable_cash_register'));
    },
    getTaxGroups: function () {

        let state = store.getState();
        let taxGroups = [];
        if (state?.storeData?.data?.success) {
            taxGroups = state?.storeData?.data?.configs?.tax_groups ?? [];
        }
        return taxGroups
    },
    getCategories: function () {
        let state = store.getState()
        let cats = [];
        if (state?.productData?.categories?.length
        ) {
            cats = state?.productData?.categories ?? [];
        }
        return cats
    }
}

export default helpers;