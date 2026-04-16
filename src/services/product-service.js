import { post } from "../redux/action/http"
import UrlHelper from '../Helper/urlHelper'
import localforage from "./localForage";

let pageSeq = 1;
let totalPages = 1;
let maxCall = 3;

export let dbProductsData = {}
export let hashError = false
export let emptyProducts = false

export const fetchProduct = (formData) => {
    let url = UrlHelper.REACT_APP_ITEM_API();
    return post(url, formData);
}

export const fetchAndRefreshedProducts = () => {
    pageSeq = 1
    fetchAndSaveProductsInIndexDB();
}

export const fetchAndSaveProductsInIndexDB = (callback) => {
    var formData = {}
    formData.page = pageSeq;
    fetchProduct(formData)
        .then(res => res.json())
        .then(resData => {
            if (resData?.success && resData.data && resData.data.length > 0) {
                localforage.setItem('products', JSON.stringify(resData)).then(function () {
                    return localforage.getItem('products');
                }).then(function (value) {
                    if (value) {
                        dbProductsData = JSON.parse(value);
                        if (dbProductsData.total_pages) {
                            totalPages = dbProductsData.total_pages
                        }
                        loadNextPages(callback);
                        sessionStorage.setItem("indexdb_refreshed", "true");
                        if (callback) callback(dbProductsData);
                    }
                }).catch(function (err) {
                    hashError = true
                    if (callback) callback(null);
                });
            } else {
                emptyProducts = true
                if (callback) callback(null);
            }
        })
        .catch((err) => {
            hashError = true
            if (callback) callback(null);
        })
}

export const getProductsFromDb = (callback) => {
    let isRefreshed = sessionStorage.getItem("indexdb_refreshed");
    if (!emptyProducts) {
        if (isRefreshed === "true") {
            localforage.getItem('products')
                .then(value => {
                    if (value) {
                        dbProductsData = JSON.parse(value);
                        if (callback) callback(dbProductsData);
                    } else {
                        fetchAndSaveProductsInIndexDB(callback);
                    }
                }).catch(function (err) {
                    fetchAndSaveProductsInIndexDB(callback);
                });
        } else {
            fetchAndSaveProductsInIndexDB(callback);
        }
    } else {
        if (callback) callback(null);
    }
}

export const clearProductData = () => {
    pageSeq = 1
    dbProductsData = {}
}

const loadNextPages = (callback) => {
    pageSeq++
    loadOtherProduct(callback);
}

const loadOtherProduct = (callback) => {
    if (pageSeq > 1 && totalPages > 1 && pageSeq <= totalPages && maxCall > 0) {
        var formData = {}
        formData.page = pageSeq;
        fetchProduct(formData)
            .then(res => res.json())
            .then(resData => {
                maxCall = 3
                if (resData.data && resData.data.length > 0) {
                    concatAndSaveProducts(resData.data, callback)
                }
                loadNextPages(callback);
            }).catch(function (err) {
                pageSeq--;
                maxCall--;
                loadNextPages(callback);
            });
    }
}

const concatAndSaveProducts = (products, callback) => {
    var prevData = { ...dbProductsData };
    var allProducts = prevData.data.concat(products);
    updateProductDB(allProducts, callback);
}

const updateProductDB = (allProducts, callback) => {
    var prevData = { ...dbProductsData };
    prevData.data = allProducts;
    localforage.setItem('products', JSON.stringify(prevData)).then(function () {
        return localforage.getItem('products');
    }).then(function (value) {
        if (value) {
            dbProductsData = JSON.parse(value);
            if (callback) callback(dbProductsData);
        }
    })
}

export default dbProductsData;