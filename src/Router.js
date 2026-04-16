import React, { Component } from "react";
//import { Box } from '@material-ui/core';
import { Router as BrowserRouter, Route, Redirect } from "react-router-dom";
import history from "./services/history";
import Login from "./pages/account/Login";
import Index from "./pages/POS";
import Helper from "./Helper/storeHelper";
import Header from "./components/theme/header";
import Footer from "./components/theme/footer";

import OpenRegister from "./pages/OpenCloseRegister/openRegister";
import CloseRegister from "./pages/OpenCloseRegister/closeRegister";
import SuspendedSale from "./pages/suspended";
import Help from "./pages/help";
import SalesRecord from "./pages/sales-record";
import StockRequest from "./pages/stock-request";
import Cancelinvoice from "./pages/cancel-invoice";
import Contactus from "./pages/contact-us";
import CreditNote from "./pages/credit-note";
import CreditHistory from "./pages/credit-history";
import CustomerHistory from "./pages/customer-history";
import Appointments from "./pages/appointments";
import CompleteReturn from "./pages/complete-return";
import OfflineOrders from "./pages/offline-orders";
import Settings from "./pages/settings";
import CatalogRoutes from "./pages/catalog/CatalogRoutes";
import RequireAuth from "./pages/account/RequireAuth";
import UnAuthorised from "./pages/common/UnAuthorised";
import PaymentDue from "./pages/common/PaymentDue";
import CashRegister from "./pages/cash-register/cash-register";
import cashregisterReport from "./pages/sales-record/cashregisterReport";

class Router extends Component {
  render() {
    return (
      <BrowserRouter history={history} basename={`/`}>
        <Header />
        <Route
          exact
          path={`${process.env.PUBLIC_URL}/`}
          component={RequireAuth(Index)}
        />
        <Route path={`${process.env.PUBLIC_URL}/login`} component={Login} />
        <Route
          path={`${process.env.PUBLIC_URL}/unauthorised`}
          component={UnAuthorised}
        />
        <Route
          path={`${process.env.PUBLIC_URL}/paymentdue`}
          component={RequireAuth(PaymentDue)}
        />
        <Route
          path={`${process.env.PUBLIC_URL}/openregister`}
          component={RequireAuth(OpenRegister)}
        />
        <Route
          path={`${process.env.PUBLIC_URL}/closeregister`}
          component={RequireAuth(CloseRegister)}
        />
        <Route
          path={`${process.env.PUBLIC_URL}/suspended`}
          component={RequireAuth(SuspendedSale)}
        />
        <Route
          path={`${process.env.PUBLIC_URL}/help`}
          component={RequireAuth(Help)}
        />
        <Route
          path={`${process.env.PUBLIC_URL}/salesrecord`}
          component={RequireAuth(SalesRecord)}
        />
        <Route
          path={`${process.env.PUBLIC_URL}/cash-register-report`}
          component={RequireAuth(cashregisterReport)}
        />
        <Route
          path={`${process.env.PUBLIC_URL}/stockrequest`}
          component={RequireAuth(StockRequest)}
        />
        <Route
          path={`${process.env.PUBLIC_URL}/cancelinvoice`}
          component={RequireAuth(Cancelinvoice)}
        />
        <Route
          path={`${process.env.PUBLIC_URL}/contactus`}
          component={RequireAuth(Contactus)}
        />
        <Route
          path={`${process.env.PUBLIC_URL}/creditnote`}
          component={RequireAuth(CreditNote)}
        />
        <Route
          path={`${process.env.PUBLIC_URL}/credit-history`}
          component={RequireAuth(CreditHistory)}
        />
        <Route
          path={`${process.env.PUBLIC_URL}/customer-history`}
          component={RequireAuth(CustomerHistory)}
        />
        <Route
          path={`${process.env.PUBLIC_URL}/appointments`}
          component={RequireAuth(Appointments)}
        />

        <Route
          path={`${process.env.PUBLIC_URL}/complete-return`}
          component={RequireAuth(CompleteReturn)}
        />
        <Route
          path={`${process.env.PUBLIC_URL}/offline-orders`}
          component={RequireAuth(OfflineOrders)}
        />
        <Route
          path={`${process.env.PUBLIC_URL}/settings`}
          component={RequireAuth(Settings)}
        />
        <Route
          path={`${process.env.PUBLIC_URL}/catalog`}
          component={RequireAuth(CatalogRoutes)}
        />
        <Route
          exact
          path={`${process.env.PUBLIC_URL}/token`}
          component={RequireAuth(Index)}
        />
        <Route
          exact
          path={`${process.env.PUBLIC_URL}/cash-register`}
          component={RequireAuth(CashRegister)}
        />

        <Footer />
        {!Helper.isLoggedIn() ? (
          <Redirect to={`${process.env.PUBLIC_URL}/login`} />
        ) : null}
      </BrowserRouter>
    );
  }
}

export default Router;
