import { configureStore } from '@reduxjs/toolkit';
import allReducer from './redux/reducers'

function saveToLocalStorage(state) {
    try {
        const serializedState = JSON.stringify(state);
        if (typeof window !== 'undefined') {
            localStorage.setItem('state', serializedState);
        }
    } catch (e) {
        console.log(e);
    }
}

function loadFromLocalStorage() {
    try {
        const serializedState = typeof window !== 'undefined' ? localStorage.getItem('state') : null;
        if (serializedState === null) return undefined
        return JSON.parse(serializedState);
    } catch (e) {
        console.log(e);
        return undefined
    }
}

const initialState = loadFromLocalStorage();

const store = configureStore({
    reducer: allReducer,
    preloadedState: initialState,
    devTools: process.env.NODE_ENV !== 'production',
});

store.subscribe(() => saveToLocalStorage(store.getState()))


export default store;

