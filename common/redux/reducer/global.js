import { defaultDate, defaultDateTo } from '../../Constants';
import { ConstGlobal } from '../action-consts';

const initState = {
  loading: false,
  loggedIn: false,
  user: undefined,
  profile: undefined,
  dateFilterObj: { from: defaultDate, to: defaultDateTo, type: `all` },
  selectedDialerMode: 0
};

const globalReducer = (state = initState, action) => {
  switch (action.type) {
    case ConstGlobal.LOGIN_SUCCESS:
      return { ...state, loading: false, loggedIn: true, user: action.payload };
    case ConstGlobal.DEFAULT_DATE: {
      return { ...state, dateFilterObj: action.payload };
    }
    case ConstGlobal.LOADING_START:
      return { ...state, loading: true };
    case ConstGlobal.LOADING_STOP:
      return { ...state, loading: false };
    case ConstGlobal.LOGOUT:
      return {
        ...state,
        loading: false,
        loggedIn: false,
        user: undefined,
        profile: undefined,
      };
    case ConstGlobal.PROFILE_BALANCE_SUCCESS:
      return { ...state, loading: false, profile: action.payload };
    case ConstGlobal.SAVE_DIALER_MODE:
      return { ...state, selectedDialerMode: action.payload };
    default:
      return state;
  }
};

export default globalReducer;
