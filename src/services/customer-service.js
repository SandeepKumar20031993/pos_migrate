import { post } from "../redux/action/http"
import UrlHelper from '../Helper/urlHelper'
import localforage from "./localForage";


export let customerData = []

export let hashError = false

export const fetchCustomer = (formData) => {
    let url = UrlHelper.REACT_APP_SEARCH_CUSTOMER();
    return post(url, formData);
}

export const transformAndSave = (customers) => {
    customers.forEach((customer) => {
        let isExist = customerData.filter(oldCust => (oldCust.value === customer.value && oldCust.phone === customer.phone));
        if (isExist.length === 0) {
            customerData.push(customer)
        }
    })
    let allowedLength = 1000
    let allLength = customerData.length
    if (allLength >= allowedLength) {
        let lastEndPoint = Number(allLength) - allowedLength;
        let slicedData = customerData.slice(lastEndPoint);
        customerData = slicedData;
    }
    saveCustomerInIndexDB(customerData);
}

export const saveCustomerInIndexDB = (custData) => {
    let encryptData = btoa(JSON.stringify(custData));
    localforage.setItem('customers', encryptData).then(function () {
        return localforage.getItem('customers');
    }).then(function (value) {
        if (value) {
            let decryptData = atob(value)
            customerData = JSON.parse(decryptData);
        }
    }).catch(function (err) {
        hashError = true
    });
}

export const getCustomerFromDb = () => {
    localforage.getItem('customers')
        .then(value => {
            if (value) {
                let decryptData = atob(value)
                customerData = JSON.parse(decryptData);
            }
        }).catch(function (err) {
            hashError = true
        });
}


export default customerData;