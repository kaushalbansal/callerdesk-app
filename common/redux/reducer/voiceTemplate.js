import { ConstVoiceList } from '../action-consts';

const initState = {
  data: [],
  total: 0,
  totalGroup: 0,
  callGroupList: [],
};

const voiceTemplateReducer = (state = initState, action) => {
  switch (action.type) {
    case ConstVoiceList.LOAD_VOICE_TEMPLATE: {
      const _res = action.payload;
      return { ...state, data: [state.data, ..._res] };
    }
    case ConstVoiceList.LOAD_CALLGROUP_LIST: {
      const { list, total, isLoadMore } = action.payload;
      return {
        ...state,
        callGroupList: isLoadMore
          ? [...state.callGroupList, ...list]
          : [...list],
        totalGroup: total,
      };
    }
    default:
      return state;
  }
};

export default voiceTemplateReducer;
