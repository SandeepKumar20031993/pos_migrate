import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableRow from "@material-ui/core/TableRow";
import DeleteIcon from "@material-ui/icons/Delete";
import CartHelper from "../../Helper/cartHelper";
import AddToCartHelper from "../../Helper/actionHelper/addToCartHelper";
import { updateCName, updateCPhone } from "../../redux/action/cartAction";
import { createAppointment, loadAppointments, cancelAppointment } from "../../redux/action/appointmentsAction";
import { loading, alert } from "../../redux/action/InterAction";
import { List, ListItem, ListItemIcon, ListItemText, Dialog, Box, DialogTitle, DialogActions, DialogContent, Grid, Button, TextField, IconButton, CircularProgress, Chip, Typography, MenuItem, FormControl, Card, CardContent, CardHeader, FormControlLabel, Switch, Divider, InputLabel, Select, Tooltip, } from "@material-ui/core";
import { Close, Edit, Search } from "@material-ui/icons";
import { dbProductsData, getProductsFromDb, } from "../../services/product-service";
import { Alert, Autocomplete } from "@material-ui/lab";
import { AddToCart, clearCart } from "../../redux/action/cartAction";
import { MuiPickersUtilsProvider, KeyboardDatePicker, KeyboardTimePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import { customerData, fetchCustomer } from "../../services/customer-service"

import { formattDate } from '../../utils/date-time'

const statusColor = {
  "BOOKED": "#F96370",
  "CLOSED": "#70DF7D",
  "COMPLETED": "#52DBC1",
  "IN PROGRESS": "#6FC9EF"
}

class Appointments extends Component {
  constructor(props) {
    super(props);

    var today = new Date()
    const fromTime = new Date();
    const toTime = new Date();
    toTime.setMinutes(fromTime.getMinutes() + 30);

    this.state = {
      customer_name: "",
      customer_phone: "",
      employee: "",
      status: "",
      weekendsVisible: true,
      currentEvents: [],
      openBookingForm: false,
      openBookingEditForm: false,
      viewAppointment: false,
      suggestions: [],
      value: [],
      calendarData: [],
      appointments: [],
      loading: true,
      info: [],
      data: [],
      selPro: null,
      error_message: null,
      cancel_message: null,
      edit: false,
      selected_services: [],
      appointment_id: "",
      isLoading: false,
      salesExe: 0,
      buttonStatus: false,
      appointmentDate: today,
      fromTime: fromTime,
      toTime: toTime,
      fromDate: today,
      toDate: today,
      customerSearchList: [],
      appointmentStatus: ""
    };
  }

  addServiceItemToCart(appointment) {

    if (appointment.status !== "COMPLETED") {
      this.props.alert(true, "This Service is not completed.Change the status to 'Completed' to create bill.");
      return;
    }
    if (!CartHelper.isCartEmpty()) {
      this.props.clearCart();
    }
    this.props.updateCName(appointment.customer_name);
    this.props.updateCPhone(appointment.customer_phone);
    appointment?.service_ids?.forEach((iddd) => {
      const matchedProduct = dbProductsData?.data?.find((item) => item?.id == iddd);
      if (!matchedProduct) {
        return;
      }
      const product = {
        ...matchedProduct,
        appointment_id: appointment?.id,
      };
      AddToCartHelper.validatePrice(product);
    });
    window.location.href = `${process.env.PUBLIC_URL}/`;
  }

  componentDidMount() {
    getProductsFromDb();
    this.getAppointments();
  }
  getAppointments(payload) {

    this.setState({ loading: true });
    this.props
      .loadAppointments(payload)
      .then((res) => res.json())
      .then((response) => {
        if (response["success"]) {
          this.setState({
            // appointments: response.appointments,
            data: response.data,
            loading: false,
          });

        }
      })
      .catch(() => {
        this.props.alert(true, "Something went wrong");
        this.setState({
          loading: false,
        });
      });
  }

  editAppointment(ids) {
    let selectedServices = [];

    ids?.forEach((iddd) => {
      let product = dbProductsData?.data?.find((item) => item?.id == iddd);
      selectedServices.push(product);
    });
    this.setState({
      selected_services: [...this.state.selected_services, ...selectedServices],
    });
  }

  onChange = (event, { newValue }) => {
    this.setState({
      value: newValue,
    });
  };

  handleFrom = (fromTime) => {
    if (fromTime) {
      // Ensure that fromTime is now or in the future
      if (this.state.appointmentDate.toLocaleDateString() !== new Date().toLocaleDateString()) {
        const toTime = new Date(fromTime);
        toTime.setMinutes(fromTime.getMinutes() + 30);
        this.setState({ fromTime, toTime, error_message: "" });
      } else {
        if (fromTime >= new Date()) {
          const toTime = new Date(fromTime);
          toTime.setMinutes(fromTime.getMinutes() + 30);
          this.setState({ fromTime, toTime, error_message: "" });

        } else {
          this.setState({
            error_message: "Cannot select a time from the past",
          });
        }
      }
    }
  }

  handleDate = (e) => {
    const date = new Date();
    this.setState({
      appointmentDate: e,
      fromTime: new Date(),
      toTime: date.setMinutes(date.getMinutes() + 30)

    });
  }

  handleTo = (toTime) => {
    if (toTime) {
      // Ensure that toTime is greater than fromTime
      if (toTime >= this.state.fromTime) {
        this.setState({ toTime, error_message: "" });
      } else {
        this.setState({
          error_message: "'To' time cannot be same or less than 'From' Time"
        });
      }
    }
  }

  handleFromFilter = (fromDate) => {
    if (fromDate) {
      // Ensure that fromTime is now or in the future
      const toDate = new Date(fromDate);
      toDate.setMinutes(fromDate.getDate() + 5);
      this.setState({ fromDate, toDate });
    }
  }

  handleToFilter = (toDate) => {
    if (toDate) {
      if (toDate >= this.state.fromDate) {
        this.setState({ toDate });

      }
    }
  }

  closePopup = () => {
    this.setState({
      openBookingForm: false,
      viewAppointment: false,
      openBookingEditForm: false,
      selected_services: [],
      customer_name: "",
      customer_phone: "",
      value: [],
      edit: false,
      salesExe: "",
    });
  };

  handleSalesPerson = (event) => {
    this.setState({
      salesExe: event.target.value,
    });
  };



  render() {
    const divStyle = {
      margin: "80px",
    };
    const { appointments } = this.props;
    const { fromDate, toDate } = this.state
    // console.log(this.state);
    if (this.state.loading)
      return (
        <Box
          display={"flex"}
          flexDirection={"column"}
          justifyContent={"center"}
          alignItems={"center"}
          width={"100%"}
        >
          <CircularProgress style={{ color: "green" }} />
          <Box style={{ color: "red" }}> Loading</Box>
        </Box>
      );
    return (
      <>
        {/* <Createappointment openDialog={this.state.openBookingForm} closePopup={this.closePopup()} /> */}
        {/* <EditAppointment />
        <AppointmentDetails /> */}
        {this.renderForm()}
        {this.renderEditForm()}
        {this.renderAppointment()}
        <Box p={1} className="height-20-overflow">
          <form className=" height-20" onSubmit={this.onSubmit}>
            <Grid item container xs={12} >
              <Grid item xs={7} container direction="row" spacing={1}>
                <Grid item >
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker
                      required
                      id="from-date-picker-dialog"
                      label="From"
                      format="dd/MM/yyyy"
                      value={fromDate}
                      size="small"
                      inputVariant="outlined"
                      KeyboardButtonProps={{
                        'aria-label': 'change date',
                      }}
                      onChange={this.handleFromFilter}
                    />
                  </MuiPickersUtilsProvider>
                </Grid>

                <Grid item >
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker
                      required
                      id="to-date-picker-dialog"
                      label="To"
                      format="dd/MM/yyyy"
                      value={toDate}
                      size="small"
                      inputVariant="outlined"
                      KeyboardButtonProps={{
                        'aria-label': 'change date',
                      }}
                      onChange={this.handleToFilter}
                    />
                  </MuiPickersUtilsProvider>
                </Grid>

                <Grid item >
                  <Button
                    type="submit"
                    className="search-button"
                    variant="contained"
                    color="secondary"
                    size="large"
                  >
                    <Search />
                  </Button>
                </Grid>


              </Grid>
              <Grid item xs={5} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  color="secondary"
                  variant="contained"
                  onClick={() => { this.setState({ openBookingForm: true }) }}
                >
                  Book an Appointment
                </Button>
              </Grid>
            </Grid>
          </form>
        </Box>
        <Box>
          <Grid container style={{ margin: "5px" }} >
            {this.state.data ? (
              this.state.data && this.state.data?.map((item) => (
                <>
                  <Grid item xs={3} style={{ marginLeft: 12 }}>
                    <Box textAlign="center" mb={2} fontSize={"20px"} fontWeight={"bold"}>
                      {item.sales_person ? item.sales_person : "Unassigned"}
                    </Box>

                    {item?.bookings?.map((booking) => (
                      < Card style={{ marginBottom: 4, backgroundColor: "#F9F9F9" }} >
                        <CardHeader
                          // title={booking?.customer_name}
                          style={{ padding: "8px" }}
                          avatar={
                            <>   <Tooltip placement="top" title={booking.status !== "CLOSED" ? "change status" : ""} aria-label={booking.status !== "CLOSED" ? "change status" : ""}>
                              <Chip onClick={() => {
                                if (booking.status !== "CLOSED") {
                                  this.setState({
                                    customer_name: booking?.customer_name,
                                    customer_phone: booking?.customer_phone,
                                    salesExe: booking?.sales_person_id,
                                    status: booking?.status,
                                    viewAppointment: false,
                                    openBookingEditForm: true,
                                    appointment_id: booking.id,
                                    edit: true,
                                  });
                                  this.editAppointment(booking?.service_ids);
                                }
                              }
                              }
                                label={booking.status}
                                style={{ cursor: booking.status !== "CLOSED" ? "pointer" : "default", backgroundColor: statusColor[booking.status], color: 'white', fontWeight: "bold" }}
                              /></Tooltip></>
                          }
                        />
                        <CardContent style={{ padding: "8px", cursor: "pointer" }} onClick={() => this.handleEventClick(booking)}>
                          <Typography style={{ fontWeight: "bold" }}>{booking.customer_name}</Typography>
                          {new Date(booking.start_datetime).toLocaleDateString()} {"  ("} {new Date(booking.start_datetime).toLocaleTimeString()} - {new Date(booking.end_datetime).toLocaleTimeString()} {"  )"}
                          <List >
                            {booking?.services?.map((service) => (
                              <ListItem style={{ fontFamily: "sans-serif", fontSize: "12px" }}>
                                <ListItemIcon>
                                  <FiberManualRecordIcon size="small" />
                                </ListItemIcon>

                                {/* <ListItemText style={{ fontFamily: "sans-serif", fontSize: "12px" }}
                                primary={service} /> */}
                                {service}
                              </ListItem>
                            ))}
                          </List>

                        </CardContent>
                      </Card>
                    ))}

                  </Grid>
                  {/* <Divider flexItem style={{ margin: '0 10px' }} orientation="vertical" flexItem /> */}
                </>
              ))
            ) : <Typography textAlign="center">No bookings found</Typography>}

          </Grid >
        </Box >
      </>

    );
  }

  renderForm() {
    const divStyle = {
      margin: "40px",
      backgroundColor: "black"
    };
    const { storeData } = this.props;
    const {
      customer_name,
      customer_phone,
      employee,
      suggestions,
      value,
    } = this.state;
    const inputStyte = {
      height: 55,
      width: "100%",
      position: "relative",
      fontSize: 12,
      padding: "0 0 0 20px",
      border: "1px solid #e0e0e0",
      borderRadius: 4,
    };
    const inputProps = {
      placeholder: "Enter Service name",
      value,
      onChange: this.onChange,
      onFocus: this.onFocusHandler,
      onKeyDown: this.onKeyDown,
      style: inputStyte,
    };
    const { from, appointmentDate, fromTime, toTime, fromDate, toDate, customerSearchList } = this.state

    let services = dbProductsData?.data ?? [];
    return (
      <div className="demo-app-sidebar" style={divStyle}>

        {this.state.cancel_message && (
          <Alert
            severity="success"
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => {
                  this.setState({
                    cancel_message: null,
                  });
                }}
              >
                <Close fontSize="inherit" />
              </IconButton>
            }
            sx={{ mb: 2 }}
          >
            {this.state.cancel_message}
          </Alert>
        )}
        {
          <Dialog
            fullWidth={true}
            maxWidth="sm"
            open={this.state.openBookingForm}
            scroll={"body"}
            className={"create-product"}
          >
            <form onSubmit={this.saveAppointment} autoComplete="off">
              <Grid>
                <DialogActions>
                  <IconButton
                    className={"popup-close-button"}
                    onClick={this.closePopup}
                  >
                    <Close />
                  </IconButton>
                </DialogActions>
              </Grid>
              <DialogTitle>{"Book an Appointment"}</DialogTitle>
              <DialogContent>
                <Grid container direction="row" spacing={2}>
                  <Grid item xs={12}>
                    {this.state.error_message && (
                      <Typography style={{ color: "red" }}>
                        {this.state.error_message}
                      </Typography>
                    )}
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      required
                      className="width-100"
                      label="Phone"
                      variant="outlined"
                      type="number"
                      size="small"
                      value={customer_phone}
                      onChange={(e) => this.update("customer_phone", e)}
                    />
                    {customerSearchList.length > 0 ?
                      <div className="auto-complete-container">
                        <List>
                          {customerSearchList.map((customer, index) => (
                            <ListItem button key={index} onClick={() => { this.customerSelected(customer) }}>
                              <ListItemText primary={customer.label} />
                            </ListItem>
                          ))}
                        </List>
                      </div>
                      :
                      null
                    }
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      required
                      className="width-100"
                      label="Customer Name"
                      variant="outlined"
                      size="small"
                      value={customer_name}
                      onChange={(e) => this.update("customer_name", e)}
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <Box>
                      {storeData.data.salesexes ? (
                        <FormControl
                          variant="outlined"
                          className={"select-sales-person width-100"}
                        >
                          <TextField
                            select
                            size="small"
                            label="Staff"
                            value={this.state.salesExe}
                            variant="outlined"
                            onChange={this.handleSalesPerson}
                          >
                            <MenuItem value="">
                              <em>None</em>
                            </MenuItem>
                            {storeData.data.salesexes.map((exec) => (
                              <MenuItem
                                value={exec.person_id}
                                key={exec.person_id}
                              >
                                {exec.first_name + " " + exec.last_name}
                              </MenuItem>
                            ))}
                          </TextField>
                        </FormControl>
                      ) : null}
                    </Box>
                  </Grid>
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <Grid item xs={6}>
                      <KeyboardDatePicker
                        required
                        id="date-picker-dialog"
                        label="Appointment Date"
                        format="dd/MM/yyyy"
                        value={appointmentDate}
                        minDate={new Date()}
                        size="small"
                        inputVariant="outlined"
                        InputProps={{ readOnly: true }}
                        KeyboardButtonProps={{
                          "aria-label": "change date",
                        }}
                        onChange={this.handleDate}
                      />
                    </Grid>
                  </MuiPickersUtilsProvider>
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <Grid item xs={6}>
                      <KeyboardTimePicker
                        required
                        id="from-time-picker-dialog"
                        label="Time Slot - From"
                        value={fromTime}
                        minDate={new Date()}
                        size="small"
                        inputVariant="outlined"
                        InputProps={{ readOnly: true }}
                        KeyboardButtonProps={{
                          "aria-label": "change date",
                        }}
                        onChange={this.handleFrom}
                      />
                    </Grid>
                  </MuiPickersUtilsProvider>
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <Grid item xs={6}>
                      <KeyboardTimePicker
                        required
                        id="to-time-picker-dialog"
                        label="Time Slot - To"
                        value={toTime}
                        minDate={this.state.fromTime}
                        size="small"
                        inputVariant="outlined"
                        InputProps={{ readOnly: true }}
                        KeyboardButtonProps={{
                          "aria-label": "change date",
                        }}
                        onChange={this.handleTo}
                      />
                    </Grid>
                  </MuiPickersUtilsProvider>
                  <Grid item xs={12}>
                    <Autocomplete
                      multiple // enable multiple selection
                      options={services}
                      getOptionLabel={(option) => {
                        return option.name;
                      }}
                      value={this.state.value}
                      onChange={(event, newValue) => {
                        this.setState({
                          value: newValue,
                          error_message: null,
                        });
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Select Services"
                          variant="outlined"
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions>
                <Button
                  disabled={this.state.isLoading}
                  type="submit"
                  startIcon={
                    this.state.isLoading && <CircularProgress size={20} />
                  }
                  variant="contained"
                  color="secondary"
                  size="large"
                >
                  {this.state.isLoading ? "saving" : "Save"}
                </Button>
              </DialogActions>
            </form>
          </Dialog>
        }
      </div>
    );
  }

  renderEditForm() {
    const divStyle = {
      margin: "40px", // You can adjust the value as needed
    };
    const { storeData } = this.props;

    const {
      customer_name,
      customer_phone,
      employee,
      suggestions,
      value,
    } = this.state;

    let services = dbProductsData?.data ?? [];
    return (
      <div className="demo-app-sidebar" style={divStyle}>
        {
          <Dialog
            fullWidth={true}
            maxWidth="sm"
            open={this.state.openBookingEditForm}
            scroll={"body"}
            className={"create-product"}
          >
            <form onSubmit={this.saveAppointment} autoComplete="off">
              <Grid>
                <DialogActions>
                  <IconButton
                    className={"popup-close-button"}
                    onClick={this.closePopup}
                  >
                    <Close />
                  </IconButton>
                </DialogActions>
              </Grid>
              <DialogTitle>Edit Appointment</DialogTitle>
              <DialogContent>
                <Grid container direction="row" spacing={2}>
                  <Grid item xs={12}>
                    {this.state.error_message && (
                      <Typography style={{ color: "red" }}>
                        {this.state.error_message}
                      </Typography>
                    )}
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      required
                      className="width-100"
                      label="Customer Name"
                      variant="outlined"
                      value={customer_name}
                      onChange={(e) => this.update("customer_name", e)}
                      disabled={this.state.edit ? this.state.edit : false}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      required
                      className="width-100"
                      label="Phone"
                      variant="outlined"
                      type="number"
                      value={customer_phone}
                      onChange={(e) => this.update("customer_phone", e)}
                      disabled={this.state.edit ? this.state.edit : false}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Box>
                      {storeData.data.salesexes ? (
                        <FormControl
                          variant="outlined"
                          className={"select-sales-person width-100"}
                        >
                          <TextField
                            select
                            size="small"
                            label="Staff"
                            value={this.state.salesExe}
                            variant="outlined"
                            onChange={(e) => this.update("salesExe", e)}
                          >
                            <MenuItem value="">
                              <em>None</em>
                            </MenuItem>
                            {storeData.data.salesexes.map((exec) => (
                              <MenuItem
                                value={exec.person_id}
                                key={exec.person_id}
                              >
                                {exec.first_name + " " + exec.last_name}
                              </MenuItem>
                            ))}
                          </TextField>
                        </FormControl>
                      ) : null}
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box>
                      <FormControl
                        variant="outlined"
                        className={"select-sales-person width-100"}
                      >
                        <TextField
                          select
                          size="small"
                          label="Status"
                          value={this.state.status}
                          variant="outlined"
                          onChange={(e) => this.update("status", e)}
                        >
                          <MenuItem value={"IN PROGRESS"} key={"N PROGRESS"}>In Progress</MenuItem>
                          <MenuItem value={"BOOKED"} key={"BOOKED"}>Booked</MenuItem>
                          <MenuItem value={"CANCEL"} key={"CANCEL"}>Cancel</MenuItem>
                          <MenuItem value={"COMPLETED"} key={"COMPLETED"}>Completed</MenuItem>

                        </TextField>
                      </FormControl>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Autocomplete
                      multiple // enable multiple selection
                      options={services}
                      getOptionLabel={(option) => {
                        return option.name;
                      }}
                      value={this.state.selected_services}
                      onChange={(event, newValue) => {
                        this.setState({
                          selected_services: newValue,
                          error_message: null,
                        });
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Select Services"
                          variant="outlined"
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions>
                <Button
                  disabled={this.state.buttonStatus}
                  type="submit"
                  startIcon={
                    this.state.isLoading && <CircularProgress size={20} />
                  }
                  variant="contained"
                  color="secondary"
                  size="large"
                >
                  {this.state.isLoading ? "saving" : "Save"}
                </Button>
              </DialogActions>
            </form>
          </Dialog>
        }
      </div>
    );
  }

  renderAppointment() {
    const divStyle = {
      margin: "40px", // You can adjust the value as needed
    };
    const { info, data } = this.state;
    const id = info.id;
    const matchingDataItem = info;

    //data?.find((dataItem) => dataItem.id == id) ?? {};
    return (
      <div className="demo-app-sidebar" style={divStyle}>
        {
          <Dialog
            fullWidth={true}
            maxWidth="sm"
            open={this.state.viewAppointment}
            scroll={"body"}
            className={"view-appointment"}
          >
            <Grid>
              <DialogActions>
                <IconButton
                  className={"popup-close-button"}
                  onClick={this.closePopup}
                >
                  <Close />
                </IconButton>
              </DialogActions>
            </Grid>
            <DialogTitle>
              Appointment Details{" "}
              {matchingDataItem?.status != "CLOSED" ? (
                <Edit
                  style={{ marginLeft: "10px", cursor: "pointer" }}
                  onClick={() => {
                    this.setState({
                      customer_name: matchingDataItem?.customer_name,
                      customer_phone: matchingDataItem?.customer_phone,
                      salesExe: matchingDataItem?.sales_person_id,
                      status: matchingDataItem?.status,
                      viewAppointment: false,
                      openBookingEditForm: true,
                      appointment_id: info.id,
                      edit: true,
                    });
                    this.editAppointment(matchingDataItem?.service_ids);
                  }}
                />
              ) : (
                ""
              )}
            </DialogTitle>
            <DialogContent>
              <TableContainer>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableBody>
                    <TableRow>
                      <TableCell component="th" scope="row">
                        Customer
                      </TableCell>
                      <TableCell align="right">
                        {matchingDataItem
                          ? matchingDataItem.customer_name
                          : "N/A"}{" "}
                        (
                        {matchingDataItem
                          ? matchingDataItem.customer_phone
                          : "N/A"}
                        )
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row">
                        Boooking Date & Time
                      </TableCell>
                      <TableCell align="right">
                        {matchingDataItem
                          ? new Date(matchingDataItem.start_datetime).toLocaleDateString() + "  " + new Date(matchingDataItem.start_datetime).toLocaleTimeString()
                          : "N/A"}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row"></TableCell>
                      <TableCell align="right">
                        {matchingDataItem
                          ? new Date(matchingDataItem.end_datetime).toLocaleDateString() + "   " + new Date(matchingDataItem.end_datetime).toLocaleTimeString()
                          : "N/A"}
                      </TableCell>
                    </TableRow>
                    {matchingDataItem?.sales_person ? (
                      <TableRow>
                        <TableCell component="th" scope="row">
                          Assigned Staff
                        </TableCell>
                        <TableCell align="right">
                          {matchingDataItem
                            ? matchingDataItem.sales_person
                            : "N/A"}
                        </TableCell>
                      </TableRow>
                    ) : (
                      ""
                    )}

                    <TableRow>
                      <TableCell component="th" scope="row">
                        Services
                      </TableCell>

                      <TableCell align="right">
                        {matchingDataItem
                          ? matchingDataItem.service_names
                          : "N/A"}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row">
                        Status
                      </TableCell>
                      {(matchingDataItem?.status !== "CLOSED") ?
                        <TableCell align="right">
                          {matchingDataItem.status}
                          <Tooltip title="change status" aria-label="change status" placement="top">
                            <Edit style={{ cursor: "pointer" }} onClick={() => {

                              this.setState({
                                customer_name: matchingDataItem?.customer_name,
                                customer_phone: matchingDataItem?.customer_phone,
                                salesExe: matchingDataItem?.sales_person_id,
                                status: matchingDataItem?.status,
                                viewAppointment: false,
                                openBookingEditForm: true,
                                appointment_id: info.id,
                                edit: true,
                              });

                              this.editAppointment(matchingDataItem?.service_ids);

                            }} />
                          </Tooltip>
                        </TableCell>
                        : <TableCell align="right">{matchingDataItem?.status}</TableCell>}
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row"></TableCell>
                      {matchingDataItem?.status !== "CLOSED" ? (
                        <TableCell align="right">
                          {/* <Button
                            variant="outlined"
                            onClick={() => this.CancelAppointment(info.id)}
                            className="cancelButton height-100"
                            id="cancel-btn"
                            startIcon={<DeleteIcon />}
                          >
                            Cancel
                          </Button> */}
                          <Button
                            style={{ marginLeft: "10px" }}
                            variant="outlined"
                            onClick={() => {
                              this.addServiceItemToCart(matchingDataItem);
                            }}
                            className="cancelButton height-100"
                            id="cancel-btn"
                          >
                            Create Bill
                          </Button>
                        </TableCell>
                      ) : (
                        ""
                      )}
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </DialogContent>
          </Dialog>
        }
      </div>
    );
  }

  saveAppointment = (e) => {

    e.preventDefault();
    if (this.state.edit) {
      if (!this.state.selected_services.length) {
        this.setState({
          error_message: "Select a Service",
        });
        return;
      }
    } else {
      if (!this.state.value.length) {
        this.setState({
          error_message: "Select a Service",
        });
        return;
      }

      if (this.state.customer_phone.length !== 10) {
        this.setState({
          error_message: "Phone number can have maximum of 10 digits",
        });
        return;
      }
    }
    this.setState({ isLoading: true });
    let selected_services = "";
    if (this.state.edit) {
      selected_services =
        this.state.selected_services
          ?.map((service) => {
            return service.id;
          })
          ?.join(",") ?? "";
    } else {
      selected_services =
        this.state.value
          ?.map((service) => {
            return service.id;
          })
          ?.join(",") ?? "";
    }

    var payload = {
      calendarData: {
        'date': formattDate(this.state.appointmentDate),
        // 'date': this.state.appointmentDate.toLocaleDateString(),
        'from_time': this.state.fromTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }),
        'to_time': this.state.toTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }),
      },
      customer_phone: this.state.customer_phone,
      customer_name: this.state.customer_name,
      value: selected_services,
      sales_person: this.state.salesExe,
      status: this.state.status,
    };
    if (this.state.edit) {
      payload.appointment_id = this.state.appointment_id;
    }
    // return;
    this.props
      .createAppointment(payload)
      .then((res) => res.json())
      .then((response) => {
        if (response && response.success) {
          this.getAppointments();
          this.closePopup();
          this.setState({
            customer_name: "",
            customer_phone: "",
            value: [],
            salesExe: 0,
            edit: false,
            isLoading: false,
          });
        } else {
          this.props.alert(true, response.msg);
          this.closePopup();
        }
      })
      .catch(() => {
        this.props.alert(true, "Something went wrong");
      });
    // }
  };

  onSubmit = (e) => {
    e.preventDefault()
    if (this.state.fromDate && this.state.toDate) {
      var payload = {
        from_date: this.state.fromDate.toLocaleDateString(),
        to_date: this.state.toDate.toLocaleDateString()
      };
      this.getAppointments(payload);
    }
  }

  CancelAppointment = (id) => {
    var payload = {
      appointment_id: id,
    };
    this.props
      .cancelAppointment(payload)
      .then((res) => res.json())
      .then((response) => {
        if (response && response.success) {
          this.getAppointments();
          this.setState({
            cancel_message: response.message,
          });
          this.closePopup();
        } else {
          this.props.alert(true, response.msg);
        }
      })
      .catch(() => {
        this.props.alert(true, "Something went wrong");
      });
  };

  handleWeekendsToggle = () => {
    this.setState({
      weekendsVisible: !this.state.weekendsVisible,
    });
  };

  update = (name, e) => {
    this.setState({ [name]: e.target.value });

    if (name === "customer_phone" && e.target.value.length === 10) {
      var payload = {
        searchby: "phone",
        searchterm: e.target.value
      };
      fetchCustomer(payload)
        .then((res) => res.json())
        .then((response) => {
          if (response && response.success) {
            this.setState({
              customerSearchList: response.suggestions,
            });
          } else {
            // this.props.alert(true, response.msg);
          }
        })
        .catch(() => {
          this.props.alert(true, "Something went wrong");
        });
    }
  };
  customerSelected = (customer) => {
    this.setState({
      customer_phone: customer.phone,
      customer_name: customer.name,
      customerSearchList: []
    });

  }

  handleDateSelect = (selectInfo) => {
    this.setState({
      // calendarData: selectInfo,
      openBookingForm: true,
    });
  };

  handleEventClick = (clickInfo) => {
    this.setState({
      info: clickInfo,
      viewAppointment: true,
    });
  };

  handleEvents = (events) => {
    this.setState({
      currentEvents: events,
    });
  };

}

Appointments.propTypes = {
  createAppointment: PropTypes.func.isRequired,
  cancelAppointment: PropTypes.func.isRequired,
  loadAppointments: PropTypes.func.isRequired,
  loading: PropTypes.func.isRequired,
  alert: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  appointments: state.appointments,
  storeData: state.storeData,
});

const mapActionToProps = {
  createAppointment,
  cancelAppointment,
  loadAppointments,
  updateCName,
  updateCPhone,
  AddToCart,
  clearCart,
  loading,
  alert,
};

export default connect(
  mapStateToProps,
  mapActionToProps
)(withRouter(Appointments));
