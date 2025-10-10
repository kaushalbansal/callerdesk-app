import { BreakApi } from '../action-consts';

const initState = {
  status: true,
};

const BreakReducer = (state = initState, action) => {
  switch (action.type) {
    case BreakApi.STATUS: {
      return { ...state, status: action.payload };
    }
    default:
      return state;
  }
};

export default BreakReducer;
