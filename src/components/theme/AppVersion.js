import React, { Component } from 'react'
//import Cookies from 'universal-cookie';

export class AppVersion extends Component {
    componentDidMount() {
        const GALLA_APP_VERSION = process.env.REACT_APP_CURRENT_GIT_SHA;
        // if (localStorage.GALLA_APP_VERSION && localStorage.GALLA_APP_VERSION !== GALLA_APP_VERSION) {
        //     localStorage.clear();
        //     sessionStorage.clear();
        //     const cookies = new Cookies();
        //     cookies.remove('url', { path: `${process.env.PUBLIC_URL}/` });
        //     cookies.remove('store_name', { path: `${process.env.PUBLIC_URL}/` });
        //     cookies.remove('feteon_store_code', { path: `${process.env.PUBLIC_URL}/` });
        // }
        if (typeof localStorage.GALLA_APP_VERSION === 'undefined' || localStorage.GALLA_APP_VERSION === null) {
            localStorage.setItem('GALLA_APP_VERSION', GALLA_APP_VERSION);
        }
    }

    render() {
        return (
            <React.Fragment />
        )
    }
}

export default AppVersion
