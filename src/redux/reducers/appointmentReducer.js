import {
  SAVE_APPOINTMENTS,
  LOAD_APPOINTMENTS,
  CANCEL_APPOINTMENTS,
} from "../action";

const initialState = {
  appointments: [],
  count: 0,
};

function appointmentReducer(state = initialState, action) {
  let newState = { ...state };
  switch (action.type) {
    case SAVE_APPOINTMENTS:
      return state;
    case LOAD_APPOINTMENTS:
      return { ...state, appointments: action.payload };
    case CANCEL_APPOINTMENTS:
      return state;
    default:
      return state;
  }
}

export default appointmentReducer;
