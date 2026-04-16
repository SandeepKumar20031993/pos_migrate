import StoreHelper from '../../Helper/storeHelper'

export const post = (url, post) => {
    var headers = {}
    headers['Content-Type'] = "application/json";
    // headers['LANG'] = "en";
    var apiKey = StoreHelper.getApiKey();
    if (apiKey) {
        headers['API-KEY'] = apiKey;
    }
    var rid = StoreHelper.getRetailId();
    if (rid) {
        headers['RID'] = rid
    }
    return fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(post)
    })
}

export const get = (url) => {
    var headers = {}
    headers['Content-Type'] = "application/json";
    // headers['LANG'] = "en";
    var apiKey = StoreHelper.getApiKey();
    if (apiKey) {
        headers['API-KEY'] = apiKey;
    }
    var rid = StoreHelper.getRetailId();
    if (rid) {
        headers['RID'] = rid
    }
    return fetch(url, {
        method: 'GET',
        headers: headers
    })
}