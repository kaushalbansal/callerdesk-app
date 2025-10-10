/* eslint-disable camelcase */
import { ConstCalllog } from '../action-consts';

const now = Date.now();
const initState = {
  list: [],
  appList: [],
  logStatus: `total`,
  total: 0,
  totalAnswer: 0,
  totalMissed: 0,
  totalVoicemail: 0,
  totalAppLog: 0,
  totalContact: 0,
  totalMember: 0,
  currentPage: 1,
  filters: undefined,
  ivrList: [],
  memList: [],
  routingList: [],
  HomeSummary: {},
  blockList: [],
  blockListTotal: 0,
  simCallLogData: [],
  simCallLogFilters: {
    status: 'total',
    from: now - 30 * 24 * 60 * 60 * 1000,
    to: now,
    rangeKey: '30'
  },
  simCallLogMeta: {
    lastFilters: null,       // {status, from, to, rangeKey}
    nextPage: 0,
    isFullyLoaded: false,
    lastFetchedAt: 0,     
    initialized: false ,
    totalCount: null 
  }

};

const callLogReducer = (state = initState, action) => {
  switch (action.type) {
    case ConstCalllog.LOAD_LIST: {
      const { data, reset } = action.payload;
      const _newList = reset
        ? [...data.result]
        : [...state.list, ...data.result];

      //   const filterData = removeDulplicate(_newList);
      return {
        ...state,
        list: _newList,
        total: data.total,
        totalMissed: data.totalMissed,
        totalAnswer: data.totalAnswer,
        totalVoicemail: data.totalVoicemail,
      };
    }
    case ConstCalllog.LOG_STATUS: {
      const { logStatus } = action.payload;
      return { ...state, logStatus };
    }
    case ConstCalllog.LOAD_APP_CALL_LIST: {
      const { dataAppLog, resetAppLog } = action.payload;
      const _newListApp = resetAppLog
        ? [...dataAppLog.result]
        : [...state.appList, ...dataAppLog.result];
      return { ...state, appList: _newListApp, totalAppLog: dataAppLog.total };
    }
    case ConstCalllog.IVR_LIST:
      return { ...state, ivrList: action.payload };
    case ConstCalllog.MEM_LIST: {
      const { list, total, isLoadMore } = action.payload;
      return {
        ...state,
        memList: isLoadMore ? [...state.memList, ...list] : [...list],
        totalMember: total,
      };
    }
    case ConstCalllog.MEMBER_STATUS_UPDATE: {
      const { member_id, status } = action.payload;
      const newList = state.memList.map((e) => {
        e.status = e.member_id === member_id ? status : e.status;
        return e;
      });
      return { ...state, memList: [...newList] };
    }
    case ConstCalllog.ROUTING_LIST:
      return { ...state, routingList: action.payload };
    case ConstCalllog.CLEAR_ROUTING_LIST:
      return { ...state, routingList: [] };
    case ConstCalllog.HOME_PAGE_SUMMARY:
      return { ...state, HomeSummary: action.payload };
    case ConstCalllog.BLOCK_LIST: {
      const { blockListData, resetBlockList } = action.payload;
      const _newBlockList = resetBlockList
        ? [...blockListData]
        : [...state.blockList, ...blockListData];
      return {
        ...state,
        blockList: _newBlockList,
        blockListTotal: blockListData.total,
      };
    }
    case ConstCalllog.BLOCK_UNBLOCK_SUCCESS: {
      const _index = state.list.findIndex(
        (x) => x.caller_num === action.payload.caller_num,
      );
      const _list = JSON.parse(JSON.stringify(state.list));
      if (_index > -1) {
        _list[_index].block = 'YES';
      }
      return { ...state, list: _list };
    }
    case ConstCalllog.GET_SIM_CALL_LOG:
      return { ...state, simCallLogData: action.payload };
    case ConstCalllog.SET_SIM_CALL_LOG_FILTERS:
      return { ...state, simCallLogFilters: action.payload };
    case ConstCalllog.SET_SIM_CALL_LOG_META:
      return { ...state, simCallLogMeta: {...state.simCallLogMeta, ...action.payload} };
    default:
      return state;
  }
};

export default callLogReducer;
