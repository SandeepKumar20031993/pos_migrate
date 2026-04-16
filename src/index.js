import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { MuiThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppTheme from './Theme';
import * as serviceWorker from './serviceWorker'; // fix this line too if needed

ReactDOM.render(
  <MuiThemeProvider theme={AppTheme}>
    <CssBaseline />
    <App />
  </MuiThemeProvider>,
  document.getElementById('root')
);

serviceWorker.register();
