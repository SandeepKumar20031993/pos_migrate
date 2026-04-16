import { LOAD_APPOINTMENTS } from ".";
import UrlHelper from "../../Helper/urlHelper";
import { post, get } from "./http";

export const loadAppointments = (formData) => (dispatch) => {
  let url = UrlHelper.REACT_APP_LOAD_APPOINTMENT();
  return post(url, formData);
};

export const createAppointment = (formData) => (dispatch) => {
  let url = UrlHelper.REACT_APP_CREATE_APPOINTMENT();
  return post(url, formData);
};

export const cancelAppointment = (formData) => (dispatch) => {
  let url = UrlHelper.REACT_APP_CANCEL_APPOINTMENT();
  return post(url, formData);
};



