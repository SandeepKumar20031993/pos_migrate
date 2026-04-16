//import store from '../store';

const helpers = {
    isPackageMapped: function (customerData) {
        var isMapped = false;
        if (customerData && customerData.custrecord && customerData.custrecord.data) {
            var item = customerData.custrecord.data
            // if (item.membcard_no || item.package_id) {
                isMapped = true;
            // }
        }
        return isMapped ;
    },
    getTotalShopping: function (customerData) {
        var total = "";
        if (customerData && customerData.custrecord && customerData.custrecord.data) {
            var item = customerData.custrecord.data
            total = item.total;
        }
        return total
    },
    getTotalReward: function (customerData) {
        var point = 0;
        if (customerData && customerData.custrecord && customerData.custrecord.data) {
            var item = customerData.custrecord.data
            point = Number(item.reward_points) * Number(item.reward_point_equal);
        }
        return point
    },
}

export default helpers;