import { CLEAR_EXCHANGE_DATA, EXCHANGE_IS_ACTIVE, SET_EXCHANGE_DATA } from ".";

export const setExchangeIsActive = (payload) => ({ type: EXCHANGE_IS_ACTIVE, payload });

export const setExchangeData = (payload) => ({ type: SET_EXCHANGE_DATA, payload });

export const clearExchangeData = () => ({ type: CLEAR_EXCHANGE_DATA })
