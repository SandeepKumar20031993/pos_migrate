import React from 'react';
import './App.css';
import Router from './Router';
import { Provider } from 'react-redux';
import myStore from './store';
import AppVersion from './components/theme/AppVersion';
import { Toaster } from 'react-hot-toast';

import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file

function App() {

    return (
        <Provider store={myStore}>
            <div className="App">
                <AppVersion />
                <Router />
                <Toaster />
            </div>
        </Provider>
    );
}

export default App;
