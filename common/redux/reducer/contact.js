import { ConstContact } from '../action-consts';

const initState = {
  list: [],
  total: 0,
  savedList: [],
};

const contactReducer = (state = initState, action) => {
  switch (action.type) {
    case ConstContact.LOAD_LIST: {
      const { data, reset } = action.payload;
      const _newList = reset
        ? [...data.result]
        : [...state.list, ...data.result];
      return { ...state, list: _newList, total: data.total };
    }
    case ConstContact.LOAD_SAVED_CONTACT_LIST:
      return { ...state, savedList: action.payload.data };
    default:
      return state;
  }
};

export default contactReducer;
