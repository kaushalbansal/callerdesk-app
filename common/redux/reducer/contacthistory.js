import { ConstContact } from '../action-consts';

const initState = {
  list: [],
  total: 0,
};

const contactHistory = (state = initState, action) => {
  switch (action.type) {
    case ConstContact.LOAD_HISTORY: {
      const { data } = action.payload;
      // const _newList = reset ? [...data.result] : [...state.list, ...data.result];
      return { ...state, list: data.result, total: data.total };
    }
    default:
      return state;
  }
};

export default contactHistory;
