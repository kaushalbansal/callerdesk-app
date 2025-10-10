import { EntryApi } from '../action-consts';

const initState = {
  entryStatus: true,
};

const EntryReducer = (state = initState, action) => {
  switch (action.type) {
    case EntryApi.STATUS_ENTRY: {
      console.log(action.payload, `action.payload`);
      if (action.payload === 1) {
        return { entryStatus: false };
      } else {
        return { entryStatus: true };
      }
    }
    default:
      return state;
  }
};

export default EntryReducer;
