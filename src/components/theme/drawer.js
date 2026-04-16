import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
import {
  Grid,
  Avatar,
  Box,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  Button,
} from "@material-ui/core";
import {
  Lock,
  Description,
  Info,
  Reply,
  PanTool,
  Money,
  Dashboard,
  CardGiftcard,
  Payment,
  AccountCircle,
  PlayCircleFilled,
  ContactMail,
  Edit,
  Storage,
  Cancel,
  CreditCard,
  History,
  Settings,
  ListAlt,
  ExpandLess,
  ExpandMore,
  MenuBook,
  Receipt as ReceiptIcon
} from "@material-ui/icons";
// import ReceiptIcon from '@material-ui/icons/Receipt';
import PlaylistAddCheckIcon from '@material-ui/icons/PlaylistAddCheck';
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';
import ReplayIcon from '@material-ui/icons/Replay';
import DateRangeIcon from "@material-ui/icons/DateRange";
import Helper from "../../Helper/storeHelper";
import CartHelper from "../../Helper/cartHelper";
import { useDispatch } from "react-redux";
import { clearCart, clearToken } from "../../redux/action/cartAction";
import { logoutUser } from "../../redux/action/isLoggedInAction";
import { clearReturningProducts } from "../../redux/action/returnAction";
import { clearEditProducts } from "../../redux/action/editAction";
import {
  pageTitle,
  returnIsActive,
  editIsActive,
  openCancelPopup,
} from "../../redux/action/themeAction";

import StoreHelper from '../../Helper/storeHelper'
import { clearExchangeData, setExchangeIsActive } from "../../redux/action/exchangeActions";

const Styles = () => ({
  logbutton: {
    borderRadius: 4,
    fontSize: 15,
    textTransform: "capitalize",
    border: "2px solid red",
    padding: "10px 0",
    fontWeight: "700",
    position: "relative",
    color: "red",
    "&:hover": {
      background: "red",
      color: "white",
    },
  },
  logoutBox: {
    position: "relative",
    bottom: 0,
    left: 0,
    width: "100%",
    padding: "10px 16px",
  },
});

const initialMenuState = {
  newSale: true,
  returnSale: true,
  editSale: false,
  cancelInvoice: false,
  salesRecord: true,
  suspended: true,
  register: false,
  stockRequest: false,
  inventory: false,
  discountCoupon: false,
  paymentHistory: false,
  profileDetail: false,
  help: true,
  productTour: false,
  contactus: true,
  creditnote: false,
  credithistory: false,
  customerHistory: false,
  catalog: false,
  appointments: false,
  salesExpand: false,
  reportExpand: false,
};

function DrawerMenu(props) {
  const { classes, open, close, history, location } = props;
  const dispatch = useDispatch();
  const [menuState, setMenuState] = useState(initialMenuState);

  useEffect(() => {
    const permissions = Helper.getPermissions();

    if (CartHelper.isEmpty(permissions)) {
      setMenuState((prev) => ({
        ...prev,
        returnSale: true,
        register: true,
        stockRequest: false,
        customerHistory: true,
        catalog: true,
        editSale: Number(Helper.canEditInvoice()) === 1,
        cancelInvoice: Helper.canCancelInvoice() === 1,
        credithistory: Helper.isCreditAllowed(),
        creditnote: Helper.canCreateCreditNote(),
      }));
      return;
    }

    setMenuState((prev) => ({
      ...prev,
      editSale: Helper.hasPermission("sales", "EDIT"),
      returnSale: Helper.hasPermission("sales", "EDIT") || prev.returnSale,
      cancelInvoice: Helper.hasPermission("sales", "DELETE"),
      credithistory: Helper.isCreditAllowed(),
      catalog: Helper.hasAnyPermission("items", ["ADD", "EDIT"]),
      customerHistory: Helper.hasAnyPermission("customers", ["ADD", "EDIT"]),
      creditnote: Helper.hasPermission("b2c_creditnote", "ADD"),
      register: Helper.hasAnyPermission("salesregister", ["ADD", "EDIT"]),
      appointments: Helper.hasAnyPermission("appointments", ["ADD", "EDIT"]),
      stockRequest: false,
    }));
  }, []);

  const updateValue = (key, value) => {
    setMenuState((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const startNewSale = (route) => {
    dispatch(clearReturningProducts());
    dispatch(clearExchangeData());
    dispatch(clearEditProducts());
    dispatch(clearCart());
    dispatch(pageTitle("New Sale"));
    close();
    dispatch(clearToken());
    history.push(`${process.env.PUBLIC_URL}/${route}`);
  };

  const handleLogout = () => {
    dispatch(
      logoutUser({
        user: Helper.getUserId(),
      })
    );
  };

  const startReturnSale = () => {
    dispatch(returnIsActive(true));
    close();
    if (location.pathname !== "/") {
      history.push(`${process.env.PUBLIC_URL}/`);
    }
  };

  const startExchangeSale = () => {
    dispatch(setExchangeIsActive(true));
    close();
    if (location.pathname !== "/") {
      history.push(`${process.env.PUBLIC_URL}/`);
    }
  };

  const startEditInvoice = () => {
    dispatch(editIsActive(true));
    close();
    if (location.pathname !== "/") {
      history.push(`${process.env.PUBLIC_URL}/`);
    }
  };

  const handleCancelInvoice = () => {
    dispatch(openCancelPopup(true));
    close();
  };

  const goToPage = (route) => {
    history.push(`${process.env.PUBLIC_URL}/${route}`);
    close();
  };

  const {
    newSale,
    salesExpand,
    reportExpand,
    returnSale,
    editSale,
    cancelInvoice,
    salesRecord,
    suspended,
    stockRequest,
    inventory,
    discountCoupon,
    paymentHistory,
    profileDetail,
    help,
    productTour,
    contactus,
    credithistory,
    creditnote,
    appointments,
    customerHistory,
    register,
    catalog,
  } = menuState;

  const isQueueBustingEnabled = StoreHelper.isQueueBustingEnabled();
  return (
    <Drawer open={open} onClose={close} className="drawer">
        <List className="avatar-container">
          <Box>
            <ListItem>
              <Grid container direction="row">
                {/* <Grid item md={12} sm={12} xs={12}>
                                    <IconButton  onClick={this.props.close} className={'drawer-close'}>
                                        <CloseIcon />
                                    </IconButton>
                                </Grid> */}
                <Grid item xs={4}>
                  <Grid item container direction="row" justify="center">
                    <Grid
                      item
                      xs={12}
                      container
                      direction="row"
                      justify="center"
                    >
                      <Box p={1}>
                        <Avatar
                          className={"avatar"}
                          src={Helper.getCompanyLogo()}
                        >

                        </Avatar>
                      </Box>
                      <Box
                        p={1}
                        className="width-100 display-grid align-center"
                      >
                        <Typography
                          variant="subtitle2"
                          component="span"
                          className={"brand-name"}
                          noWrap={true}
                        >
                          {/* {Helper.getCompany()} */}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={8} container alignItems="center">
                  <Grid container direction="row" justify="center">
                    <Box pb={0} className={"display-grid"}>
                      <Typography variant="h6" component="h6" noWrap={true}>
                        {Helper.getCompany()}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid container direction="row" justify="space-between">
                    <Grid item></Grid>
                    <Grid item>
                      <Box pb={0} className={"display-grid"}>
                        <Typography
                          variant="body1"
                          component="span"
                          className={"emp-name"}
                          noWrap={true}
                        >
                          {Helper.getUserName()}
                        </Typography>
                      </Box>
                      <Box pb={0} className={"display-grid"}>
                        <Typography
                          variant="body2"
                          component="span"
                          className={"emp-position"}
                          noWrap={true}
                        >
                          {Helper.getRole()}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </ListItem>
          </Box>
        </List>
        <List className={"menu-list padding-0"}>
          {newSale ? (
          <ListItem button onClick={() => startNewSale("")}>
              <ListItemIcon>
                <Description />
              </ListItemIcon>
              <ListItemText primary={"New Sale"} />
            </ListItem>
          ) : null}

          <ListItem
            button
          onClick={() => updateValue("salesExpand", !salesExpand)}
          >
            <ListItemIcon>
              <MenuBook />
            </ListItemIcon>
            <ListItemText primary={"Sales"} />
            {salesExpand ? <ExpandLess /> : <ExpandMore />}
          </ListItem>

          <Collapse in={salesExpand} timeout="auto" unmountOnExit>
            <List component="div" className="pl-8">
              {returnSale ? (
              <ListItem button onClick={startReturnSale}>
                  <ListItemIcon>
                    <Reply />
                  </ListItemIcon>
                  <ListItemText primary={"Return "} />
                </ListItem>
              ) : null}

              {/* This feature is yet to be tested properly */}
              {returnSale ? (
              <ListItem button onClick={startExchangeSale}>
                  <ListItemIcon>
                    <ReplayIcon />
                  </ListItemIcon>
                  <ListItemText primary={"Exchange"} />
                </ListItem>
              ) : null}

              {editSale ? (
              <ListItem button onClick={startEditInvoice}>
                  <ListItemIcon>
                    <Edit />
                  </ListItemIcon>
                  <ListItemText primary={"Edit Sale"} />
                </ListItem>
              ) : null}
              {cancelInvoice ? (
              <ListItem button onClick={handleCancelInvoice}>
                  <ListItemIcon>
                    <Cancel />
                  </ListItemIcon>
                  <ListItemText primary={"Cancel Invoice"} />
                </ListItem>
              ) : null}

              {suspended ? (
              <ListItem button onClick={() => goToPage("suspended")}>
                  <ListItemIcon>
                    <PanTool />
                  </ListItemIcon>
                  <ListItemText primary={"Suspended Sale"} />
                </ListItem>
              ) : null}
            </List>
          </Collapse>

          <ListItem
            button
          onClick={() => updateValue("reportExpand", !reportExpand)}
          >
            <ListItemIcon>
              <MenuBook />
            </ListItemIcon>
            <ListItemText primary={"Reports"} />
            {reportExpand ? <ExpandLess /> : <ExpandMore />}
          </ListItem>

          <Collapse in={reportExpand} timeout="auto" unmountOnExit>
            <List component="div" className="pl-8">
              {salesRecord ? (
              <ListItem button onClick={() => goToPage("salesrecord")}>
                  <ListItemIcon>
                    <Money />
                  </ListItemIcon>
                  <ListItemText primary={"Sales Report"} />
                </ListItem>
              ) : null}

              {salesRecord ? (
              <ListItem button onClick={() => goToPage("cash-register-report")}>
                  <ListItemIcon>
                    <ReceiptIcon />
                  </ListItemIcon>
                  <ListItemText primary={"Cash Register Report"} />
                </ListItem>
              ) : null}
            </List>
          </Collapse>

          {creditnote ? (
          <ListItem button onClick={() => goToPage("creditnote")}>
              <ListItemIcon>
                <CreditCard />
              </ListItemIcon>
              <ListItemText primary={"Credit Note"} />
            </ListItem>
          ) : null}

          {register ? (
          <ListItem button onClick={() => goToPage("cash-register")}>
              <ListItemIcon>
                <LibraryBooksIcon />
              </ListItemIcon>
              <ListItemText primary={"Cash register"} />
            </ListItem>
          ) : null}

          {Boolean(Number(isQueueBustingEnabled)) ? (
          <ListItem button onClick={() => startNewSale("token")}>
              <ListItemIcon>
                <PlaylistAddCheckIcon />
              </ListItemIcon>
              <ListItemText primary={"Token"} />
            </ListItem>
          ) : null}


          {catalog && (
          <ListItem button onClick={() => goToPage("catalog/product")}>
              <ListItemIcon>
                <ListAlt />
              </ListItemIcon>
              <ListItemText primary="Product" />
            </ListItem>
          )}

          {appointments ? (
          <ListItem button onClick={() => goToPage("appointments")}>
              <ListItemIcon>
                <DateRangeIcon />
              </ListItemIcon>
              <ListItemText primary={"Appointments"} />
            </ListItem>
          ) : null}

          {customerHistory ? (
          <ListItem button onClick={() => goToPage("customer-history")}>
              <ListItemIcon>
                <History />
              </ListItemIcon>
              <ListItemText primary={"Customer history"} />
            </ListItem>
          ) : null}



          {/* 
                    {catalog ?
                        <>
                            <ListItem button onClick={() => this.updateValue("catalogExpand", !catalogExpand)}>
                                <ListItemIcon><MenuBook /></ListItemIcon>
                                <ListItemText primary={'Inventory'} />
                                {catalogExpand ? <ExpandLess /> : <ExpandMore />}
                            </ListItem>
                            <Collapse in={catalogExpand} timeout="auto" unmountOnExit>
                                <List component="div" className="pl-8">
                                    <ListItem button onClick={() => this.goToPage('catalog/product')}>
                                        <ListItemIcon>
                                            <ListAlt />
                                        </ListItemIcon>
                                        <ListItemText primary="Product" />
                                    </ListItem>
                                </List>
                            </Collapse>
                        </>
                        : null} */}


          {credithistory ? (
          <ListItem button onClick={() => goToPage("credit-history")}>
              <ListItemIcon>
                <CreditCard />
              </ListItemIcon>
              <ListItemText primary={"Credit history"} />
            </ListItem>
          ) : null}

          {/* {register ? (
            <>
              <ListItem
                button
                onClick={() =>
                  this.updateValue("registerExpand", !registerExpand)
                }
              >
                <ListItemIcon>
                  <MenuBook />
                </ListItemIcon>
                <ListItemText primary={"Register"} />
                {registerExpand ? <ExpandLess /> : <ExpandMore />}
              </ListItem>
              <Collapse in={registerExpand} timeout="auto" unmountOnExit>
                <List component="div" className="pl-8">
                  {openRegister ? (
                    <ListItem
                      button
                      onClick={() => this.goToPage("openregister")}
                    >
                      <ListItemIcon>
                        <LocalLibrary />
                      </ListItemIcon>
                      <ListItemText primary={"Open Register"} />
                    </ListItem>
                  ) : null}
                  {closeRegister ? (
                    <ListItem
                      button
                      onClick={() => this.goToPage("closeregister")}
                    >
                      <ListItemIcon>
                        <Note />
                      </ListItemIcon>
                      <ListItemText primary={"Close Register"} />
                    </ListItem>
                  ) : null}
                </List>
              </Collapse>
            </>
          ) : null} */}
          {stockRequest ? (
          <ListItem button onClick={() => goToPage("stockrequest")}>
              <ListItemIcon>
                <Storage />
              </ListItemIcon>
              <ListItemText primary={"Stock Request"} />
            </ListItem>
          ) : null}
          {inventory ? (
            <ListItem button>
              <ListItemIcon>
                <Dashboard />
              </ListItemIcon>
              <ListItemText primary={"Inventory"} />
            </ListItem>
          ) : null}
          {discountCoupon ? (
            <ListItem button>
              <ListItemIcon>
                <CardGiftcard />
              </ListItemIcon>
              <ListItemText primary={"Discount Coupons"} />
            </ListItem>
          ) : null}
          {paymentHistory ? (
            <ListItem button>
              <ListItemIcon>
                <Payment />
              </ListItemIcon>
              <ListItemText primary={"Payment History"} />
            </ListItem>
          ) : null}
          {profileDetail ? (
            <ListItem button>
              <ListItemIcon>
                <AccountCircle />
              </ListItemIcon>
              <ListItemText primary={"Profile Details"} />
            </ListItem>
          ) : null}
          {productTour ? (
            <ListItem button>
              <ListItemIcon>
                <PlayCircleFilled />
              </ListItemIcon>
              <ListItemText primary={"Product tour"} />
            </ListItem>
          ) : null}

        <ListItem button onClick={() => goToPage("settings")}>
            <ListItemIcon>
              <Settings />
            </ListItemIcon>
            <ListItemText primary={"Settings"} />
          </ListItem>

          {contactus ? (
          <ListItem button onClick={() => goToPage("contactus")}>
              <ListItemIcon>
                <ContactMail />
              </ListItemIcon>
              <ListItemText primary={"Contact us"} />
            </ListItem>
          ) : null}

          {help ? (
          <ListItem button onClick={() => goToPage("help")}>
              <ListItemIcon>
                <Info />
              </ListItemIcon>
              <ListItemText primary={"Help"} />
            </ListItem>
          ) : null}
        </List>
        <Box className={classes.logoutBox}>
          {/* <Fab variant="extended" className={classes.logbutton} onClick={() => Helper.logOut()}> */}
          <Button
            startIcon={<Lock />}
            fullWidth
            className={classes.logbutton}
          onClick={handleLogout}
          >
            <Typography variant="subtitle2" component="strong">
              Logout
            </Typography>
          </Button>
        </Box>
      </Drawer>
  );
}

export default withStyles(Styles)(withRouter(DrawerMenu));
