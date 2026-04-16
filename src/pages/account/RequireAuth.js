import React, { useEffect } from 'react';
import { useSelector } from "react-redux";
import StoreHelper from '../../Helper/storeHelper';

export default function Auth(ComposedComponent) {
    function RequireAuth(props) {
        const isLogged = useSelector((state) => state.isLogged);
        const isAuthenticated = isLogged && StoreHelper.isLoggedIn();

        useEffect(() => {
            if (!isAuthenticated) {
                props.history.push(`${process.env.PUBLIC_URL}/login`);
            }
        }, [isAuthenticated, props.history]);

        if (!isAuthenticated) {
            return null;
        }

        return <ComposedComponent {...props} />
    }

    return RequireAuth;
}
