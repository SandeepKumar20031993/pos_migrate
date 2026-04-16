import Cookies from 'universal-cookie';

const helpers = {
    clearStoreCookies: function () {
        const cookies = new Cookies();
        cookies.remove('url', { path: `${process.env.PUBLIC_URL}/` });
        cookies.remove('store_name', { path: `${process.env.PUBLIC_URL}/` });
        cookies.remove('feteon_store_code', { path: `${process.env.PUBLIC_URL}/` });
        cookies.remove('galla_remembered', { path: `${process.env.PUBLIC_URL}/` });
    },
    saveLoginCredentials: function (formData) {
        let strData = JSON.stringify(formData);
        let incrypt = btoa(strData);
        const cookies = new Cookies();
        const expiryDate = new Date()
        expiryDate.setMonth(expiryDate.getMonth() + 1)
        cookies.set('galla_remembered', incrypt, { path: `${process.env.PUBLIC_URL}/`, expires: expiryDate });
    },
    getLoginCredentials: function () {
        const cookies = new Cookies();
        let remembered = cookies.get('galla_remembered', { path: `${process.env.PUBLIC_URL}/` });
        if (remembered) {
            let decrypt = atob(remembered);
            if (decrypt) {
                return JSON.parse(decrypt);
            }
        }
        return "";
    },
    removeLoginCredentials: function () {
        const cookies = new Cookies();
        cookies.remove('galla_remembered', { path: `${process.env.PUBLIC_URL}/` });
    }
}
export default helpers;
