import localforage from "./localForage";

export let offlineOrderData = []

export let hashError = false

export const updateAndSaveOfflineOrderInIndexDB = (new_order) => {
    let isExist = offlineOrderData.filter(old_order => old_order.off_ref_no === new_order.off_ref_no);
    if (isExist.length === 0) {
        offlineOrderData.push(new_order)
    }
    let allowedLength = 100
    let allLength = offlineOrderData.length
    if (allLength >= allowedLength) {
        let lastEndPoint = Number(allLength) - allowedLength;
        let slicedData = offlineOrderData.slice(lastEndPoint);
        offlineOrderData = slicedData;
    }
    saveOrderInIndexDB(offlineOrderData);
}

export const removeOfflineOrderInIndexDB = (order) => {
    let index = offlineOrderData.findIndex(old_order => old_order.off_ref_no === order.off_ref_no);
    if (index >= 0) {
        offlineOrderData.splice(index, 1)
    }
    saveOrderInIndexDB(offlineOrderData);
}

export const clearOfflineOrderInIndexDB = () => {
    saveOrderInIndexDB([]);
}

export const saveOrderInIndexDB = (allOfflineOrderData) => {
    localforage.setItem('galla_offline_orders', JSON.stringify(allOfflineOrderData)).then(function () {
        return localforage.getItem('galla_offline_orders');
    }).then(function (value) {
        if (value) {
            offlineOrderData = JSON.parse(value);
        }
    }).catch(function (err) {
        hashError = true
    });
}

export const getOfflineOrderFromDb = () => {
    localforage.getItem('galla_offline_orders')
        .then(value => {
            if (value) {
                offlineOrderData = JSON.parse(value);
            }
        }).catch(function (err) {
            hashError = true
        });
}


export default offlineOrderData;