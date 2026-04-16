import StoreHelper from '../Helper/storeHelper'

export const toLocalDate = (date) => {
    return date ? new Date(date).toLocaleDateString() : null;
}

export const formattDate = (val) => {
    let date = new Date(val);

    const format = StoreHelper.getStoreDateFormat();

    // var offset = new Date().getTimezoneOffset();
    // var hrs = -(new Date().getTimezoneOffset() / 60)
    // console.log("offset:", offset);
    // console.log("hrs:", hrs);
    // if offset equals -60 then the time zone offset is UTC+01


    if (format === 'd/M/Y') {
        return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
    }

    return date.toLocaleDateString();

}