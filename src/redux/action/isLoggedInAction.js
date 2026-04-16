import UrlHelper from '../../Helper/urlHelper'
import { post } from "./http"
import { isLoogedIn } from '../slices/isLoggedSlice';
import { saveConfigData, clearStoreData } from '../slices/storeDataSlice';
import { loading, alert } from './InterAction';
import { saveDenomination } from './openCloseRegisterAction';
import { toogleLocationPopup } from './storeCounterAction';
import StoreHelper from '../../Helper/storeHelper';
import CartHelper from '../../Helper/cartHelper';
import history from '../../services/history';
import AccountHelper from '../../Helper/actionHelper/accountHelper';

export { isLoogedIn, saveConfigData, clearStoreData };

const buildDenominationsArray = (denominations) => {
    const denominationsArray = [];
    const denominationsData = denominations ? denominations.split(',') : [];

    denominationsData.forEach((data) => {
        denominationsArray.push({
            denom: Number(data),
            count: 0,
            total: 0
        });
    });

    return denominationsArray;
};

const openLocationPopupIfNeeded = (dispatch, getState) => {
    const state = getState();
    const storeCounters = state.storeCounter;
    const locationId = Number(StoreHelper.getLocationId());
    const location = storeCounters.location.location;

    if (!locationId && CartHelper.isEmpty(location)) {
        dispatch(toogleLocationPopup(true));
    }
};


export const loadtStoreData = (formData) => dispatch => {
    let url = process.env.REACT_APP_VALIDATE_STORE;
    return post(url, formData)
}
export const LogInNow = (formData) => dispatch => {
    let url = UrlHelper.REACT_APP_LOGIN_API();
    return post(url, formData)
}

export const loginUser = (formData, rememberMe) => (dispatch, getState) => {
    dispatch(loading(true));

    return dispatch(LogInNow(formData))
        .then(res => res.json())
        .then(resData => {
            if (resData.success) {
                dispatch(saveConfigData(resData));
                dispatch(isLoogedIn(true));
                StoreHelper.setThisDataInSession('sales_counter', 'counter 1');
                StoreHelper.setAllDataInSession('user', resData.data);
                StoreHelper.setAllDataInSession('configs', resData.configs);
                dispatch(saveDenomination(buildDenominationsArray(resData?.configs?.denominations)));
                StoreHelper.setThisDataInSession('salesexes', JSON.stringify(resData.salesexes));
                StoreHelper.setThisDataInSession('islogin', 'yes');
                dispatch(loading(false));
                openLocationPopupIfNeeded(dispatch, getState);
                if (rememberMe) {
                    AccountHelper.saveLoginCredentials(formData);
                }
                history.push(`${process.env.PUBLIC_URL}/`);
                return resData;
            }

            dispatch(loading(false));
            dispatch(alert(true, resData.msg));
            dispatch(clearStoreData());
            return resData;
        })
        .catch(err => {
            dispatch(loading(false));
            dispatch(alert(true, "Something went wrong!"));
            dispatch(clearStoreData());
            throw err;
        });
}

export const changeStore = () => dispatch => {
    try {
        AccountHelper.clearStoreCookies();
        dispatch(resetAllData());
        return true;
    } catch (err) {
        return false;
    }
}

export const resetAllData = () => {
    return {
        type: 'RESET_ALL_DATA'
    }
}

export const LogOutact = (formData) => dispatch => {
    let url = UrlHelper.REACT_APP_LOGOUT_API();
    return post(url, formData)
    .then(res => res.json())
    .then(resData => dispatch({
        type: '',
        payload: resData
    }))
    .catch(err => dispatch({
        type: '',
        payload: {}
    }))
}

export const logoutUser = (formData) => dispatch => {
    const finalizeLogout = () => {
        AccountHelper.clearStoreCookies();
        StoreHelper.clearStorageData();
        dispatch(isLoogedIn(false));
        dispatch(clearStoreData());
        dispatch(resetAllData());
        history.push(`${process.env.PUBLIC_URL}/login`);
    };

    return dispatch(LogOutact(formData))
        .catch(() => null)
        .finally(() => {
            finalizeLogout();
        });
}
