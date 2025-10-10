/* eslint-disable camelcase */
import axios from 'axios';
import { ConstCalllog, ConstScreens } from '../action-consts';
import { http } from '../../helpers/http';
import { filterObj, initCallResult, pageSize } from '../../Constants';
import { checkAuth, toastShow } from '../../helpers/utils';
import store from '../store';
import { startLoading, stopLoading } from './common';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeModules } from 'react-native';
const { CallLogModule } = NativeModules;
const CACHE_TTL = 1000 * 60 * 5;

export const getCallLogList = async (authCode, data) => {
  try {
    const obj = store.getState();
    const form_data = new FormData();
    form_data.append('authcode', authCode);
    // const { _from, _to } = formatApiFilterDate(data.from, data.to);
    data.from && form_data.append('start_date', obj.global.dateFilterObj.from);
    data.to && form_data.append('end_date', obj.global.dateFilterObj.to);
    data.ivr && form_data.append('deskphone', data.ivr);
    data.member && form_data.append('member_num', data.member);
    obj.callLog.logStatus &&
      form_data.append('callresult', initCallResult[obj.callLog.logStatus]);
    // data.callresult && form_data.append('callresult', data.callresult);
    form_data.append('per_page', data.pageSize);
    form_data.append('current_page', data.currentPage);
    const res = await axios.post(
      'https://app.callerdesk.io/api/call_list_v2',
      form_data,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
    if (res.data.type === `error`) {
      checkAuth(res.data.message);
    }
    return res;
  } catch (error) {
    console.log({ error });
    return error.response;
  }
};
export const loadMemberListApi = async (authCode) => {
  try {
    const form_data = new FormData();
    form_data.append('authcode', authCode);
    form_data.append('per_page', pageSize);
    const res = await axios.post(
      'https://app.callerdesk.io/api/getmemberlist_V2',
      form_data,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
    return res;
  } catch (error) {
    return error.response;
  }
};

export const getAppCallLogList = async (authCode, data) => {
  try {
    const obj = store.getState();
    const form_data = new FormData();
    form_data.append('authcode', authCode);
    // const { _from, _to } = formatApiFilterDate(data.from, data.to);
    data.from && form_data.append('start_date', obj.global.dateFilterObj.from);
    data.to && form_data.append('end_date', obj.global.dateFilterObj.to);
    data.ivr && form_data.append('deskphone', data.ivr);
    data.member && form_data.append('caller_num', data.member);
    obj.callLog.logStatus &&
      form_data.append('callresult', initCallResult[obj.callLog.logStatus]);
    // data.callresult && form_data.append('callresult', data.callresult);
    form_data.append('per_page', data.pageSize);
    form_data.append('current_page', data.currentPage);
    const res = await axios.post(
      'https://app.callerdesk.io/api/app_call_list_v2',
      form_data,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
    if (res?.data?.type === `error`) {
      checkAuth(res?.data?.message);
    }
    return res;
  } catch (error) {
    return error.response;
  }
};

export function loadCallLogList(
  authcode = '',
  filters = filterObj,
  reset = false,
  isLoadMore = false,
) {
  return async (dispatch) => {
    !isLoadMore && store.dispatch(startLoading());
    console.log(`filters`, filters.currentPage);
    try {
      const [logDataRes, appLogDataRes] = await Promise.all([
        getCallLogList(authcode, filters),
        getAppCallLogList(authcode, filters),
      ]);
      const logDataResult = logDataRes.data.result ?? [];
      const appLogDataResult = appLogDataRes.data.result ?? [];

      let finalLogList =
        logDataResult.length > 0 ? logDataResult : appLogDataResult;

      if (finalLogList.length > 0) {
        const combinedLogData =
          appLogDataResult.length > 0
            ? [
                ...logDataResult,
                ...appLogDataResult.map((item) => ({
                  ...item,
                  type: 'app',
                })),
              ]
            : logDataResult;

        finalLogList = combinedLogData.sort(
          (a, b) => new Date(b.call_date) - new Date(a.call_date),
        );
      }
      console.log(`finalLogList`, finalLogList.length);
      dispatch(
        loadCallLogListSuccess({
          data: {
            result: finalLogList,
            total: logDataRes.data.total + appLogDataRes.data.total,
            totalAnswer:
              parseInt(logDataRes.data.answered_total) +
              parseInt(appLogDataRes.data.answered_total),
            totalMissed:
              parseInt(logDataRes.data.noanswer_total) +
              parseInt(appLogDataRes.data.noanswer_total),
            totalVoicemail:
              parseInt(logDataRes.data.voicemail) +
              parseInt(appLogDataRes.data.voicemail),
          },
          reset,
        }),
      );
    } catch (error) {
      console.log('Error loading call logs:', error);
    } finally {
      store.dispatch(stopLoading());
    }
  };
}

export function loadHomePageSummary(authcode = '') {
  const formData = new FormData();
  formData.append('authcode', authcode);
  store.dispatch(startLoading());

  return async (dispatch) => {
    await http
      .postForm('api/get-count-v2', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((res) => {
        // if (res?.member_analysis) {
        // res?.member_analysis?.length === 0 &&
        //   EntryApi({ authcode, status: `1` });
        dispatch(loadHomePageSummarySuccess(res));
        dispatch(loadHomeScreenData(res));
        // }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        store.dispatch(stopLoading());
      });
  };
}

export function loadIVRList(authcode = '') {
  const formData = new FormData();
  formData.append('authcode', authcode);
  formData.append('per_page', authcode);
  store.dispatch(startLoading());

  return async (dispatch) => {
    await http
      .postForm('api/getdeskphone_v2', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((res) => {
        if (res.type === `error`) {
          checkAuth(res?.message);
        }
        if (res.getdeskphone) dispatch(loadIVRListSuccess(res.getdeskphone));
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        store.dispatch(stopLoading());
      });
  };
}

export function loadMemberList(
  authcode = '',
  nav = {},
  size = pageSize,
  currentPage = 1,
  isLoadMore = false,
) {
  const formData = new FormData();
  formData.append('authcode', authcode);
  formData.append('per_page', size);
  formData.append('current_page', currentPage);

  !isLoadMore && store.dispatch(startLoading());

  return async (dispatch) => {
    await http
      .postForm('api/getmemberlist_V2', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((res) => {
        if (res.type === `error`) {
          checkAuth(res?.message);
        }
        if (res.getmember)
          dispatch(
            loadMemberListSuccess({
              list: res.getmember,
              total: res.total_record,
              isLoadMore,
            }),
          );
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        store.dispatch(stopLoading());
      });
  };
}

export function loadRoutingList(authcode = '', sid_id = '') {
  const formData = new FormData();
  formData.append('authcode', authcode);
  formData.append('sid_id', sid_id);

  return async (dispatch) => {
    await http
      .postForm('api/getroutingdetail_V2', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((res) => {
        dispatch(loadRoutingListSuccess(res.routing_detail));
      })
      .catch((err) => {
        console.log(err);
      });
  };
}

export function loadCallHistory(authcode = '', caller_num = '') {
  const formData = new FormData();
  formData.append('authcode', authcode);
  formData.append('caller_num', caller_num);
  return http.postForm('api/call_list_v2', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

export function BlockUnblockUser(
  authcode = '',
  caller_num = '',
  block = true,
  filtersLog,
  cb = () => {},
) {
  const formData = new FormData();
  const pattern = /^0/;
  const newPhoneNumber = caller_num.replace(pattern, '');
  const path = block ? 'block_number' : 'unblock_number';
  formData.append('authcode', authcode);
  formData.append('caller_number', newPhoneNumber);
  return async (dispatch) => {
    await http
      .postForm(`api/${path}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((res) => {
        dispatch(loadCallLogList(authcode, filtersLog, true));
        dispatch(
          loadBlockList(authcode, { currentPage: 1, block: 'NO' }, true),
        );
        dispatch(blockUnblockSuccess({ caller_num, block }));

        if (res.type === 'success') {
          toastShow(res.message);
        } else if (res.type === 'error') {
          toastShow(res.message);
        } else {
          toastShow('Unable to process your request.');
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
}

export function loadBlockList(
  authcode = '',
  filters = filterObj,
  reset = false,
) {
  const formData = new FormData();
  store.dispatch(startLoading());

  formData.append('authcode', authcode);
  formData.append('per_page', pageSize);

  return async (dispatch) => {
    await http
      .postForm('api/getblocknumber', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((res) => {
        if (res.blocklist_number == []) {
          res.blocklist_number = [];
        }
        dispatch(
          blockListSuccess({
            blockListData: res.blocklist_number,
            resetBlockList: reset,
          }),
        );
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        store.dispatch(stopLoading());
      });
  };
}

export function UpdateMemberStatus(
  authcode = '',
  member_id = '',
  status = 1,
  member_num,
  cb = () => {},
) {
  const formData = new FormData();
  formData.append('authcode', authcode);
  formData.append('member_id', member_id);
  formData.append('status', status);
  const phoneNumber = member_num.substring(1);
  formData.append('member_num', phoneNumber);

  return async (dispatch) => {
    await http
      .postForm(`api/updatemember_v2`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((res) => {
        dispatch(UpdateMemberStatusSuccess({ member_id, status }));
        // cb();
      })
      .catch((err) => {
        console.log(err);
      });
  };
}

export const UpdateMemberStatusSuccess = (payload) => ({
  type: ConstCalllog.MEMBER_STATUS_UPDATE,
  payload,
});

export const blockListSuccess = (payload) => ({
  type: ConstCalllog.BLOCK_LIST,
  payload,
});

export const blockUnblockSuccess = (payload) => ({
  type: ConstCalllog.BLOCK_UNBLOCK_SUCCESS,
  payload,
});

export const loadHomePageSummarySuccess = (payload) => ({
  type: ConstCalllog.HOME_PAGE_SUMMARY,
  payload,
});

export const loadMemberListSuccess = (payload) => ({
  type: ConstCalllog.MEM_LIST,
  payload,
});
export const loadIVRListSuccess = (payload) => ({
  type: ConstCalllog.IVR_LIST,
  payload,
});
export const loadCallLogListSuccess = (payload) => ({
  type: ConstCalllog.LOAD_LIST,
  payload,
});
export const loadCallLogStatusSuccess = (payload) => ({
  type: ConstCalllog.LOG_STATUS,
  payload,
});

export const loadRoutingListSuccess = (payload) => ({
  type: ConstCalllog.ROUTING_LIST,
  payload,
});

export const clearRoutingList = () => ({
  type: ConstCalllog.CLEAR_ROUTING_LIST,
  payload: {},
});
export const loadHomeScreenData = (payload) => ({
  type: ConstScreens.LOAD_HOME_SCREEN,
  payload,
});

export const loadSimCallLog=(payload)=>({
  type: ConstCalllog.GET_SIM_CALL_LOG,
  payload,
})

export const setSimCallLogFilters = (filters) => ({ 
  type: ConstCalllog.SET_SIM_CALL_LOG_FILTERS, 
  payload: filters 
});

export const setSimCallLogMetaData=(metaData)=>({
  type: ConstCalllog.SET_SIM_CALL_LOG_META,
  payload: metaData
})


export const BreakApiCall = ({ authcode, status, name, num, dir }) => {
  const url = `api/update-working-status-v3/?authcode=${authcode}&working_status=${status === '0' ? 'Short Break' : 'Ready'}&member_name=${name}&member_num=${num}&direction=${dir}`;
  return new Promise((resolve, reject) => {
    http
      .get(url)
      .then(async (res) => {
        // console.log('changeagentstatus', res);
        if (res.type === 'success') {
          if (status === '0') {
            await AsyncStorage.setItem('Break', '0');
          } else {
            await AsyncStorage.setItem('Break', '1');
          }
          resolve(res);
        } else {
          reject(res);
        }
      })
      .catch((err) => {
        console.log(err);
        reject(err);
      })
      .finally(() => {
        store.dispatch(loadHomePageSummary(authcode));
        store.dispatch(stopLoading());
      });
  });
};
export const EntryApiCall = ({ authcode, status }) => {
  store.dispatch(startLoading());
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append('authcode', authcode);
    formData.append('agent_status', status);
    // console.log(formData, `formData`);

    http
      .postForm('api/changeagentstatus', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(async (res) => {
        // console.log('changeagentstatus', res);
        if (res.type === 'success') {
          if (status === '0') {
            await AsyncStorage.setItem('Entry', '0');
          } else {
            await AsyncStorage.setItem('Entry', '1');
          }
          resolve(res);
        } else {
          reject(res);
        }
        store.dispatch(loadHomePageSummary(authcode));
      })
      .catch((err) => {
        console.log(err);
        reject(err);
      })
      .finally(() => {
        store.dispatch(stopLoading());
      });
  });
};
export const EntryApi = ({ authcode, status }) => {
  store.dispatch(startLoading());
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append('authcode', authcode);
    formData.append('agent_status', status);

    http
      .postForm('api/changeagentstatus', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(async (res) => {
        store.dispatch(loadHomePageSummary(authcode));
      })
      .catch((err) => {
        console.log(err);
        reject(err);
      })
      .finally(() => {
        store.dispatch(stopLoading());
      });
  });
};

export const getSimCallLog=({pageNumber=0, status="total", from=null, to=null, reset=false}={})=>{
  return async(dispatch ,getState)=>{

    try {

      const now = Date.now();
      const defaultFrom = now - 30 * 24 * 60 * 60 * 1000; // 30 days default
      const fromTs = (typeof from === 'number' && !isNaN(from)) ? from : defaultFrom;
      const toTs = (typeof to === 'number' && !isNaN(to)) ? to : now;
       

        // Optionally reset list in store
      if (reset) {
        dispatch(loadSimCallLog([]));
      }

      // Pass the page to fetch to the native module
      const entries = await CallLogModule.getCallLogsPageWithFilter(pageNumber, status, fromTs, toTs);
      

      if (pageNumber === 0) {
        dispatch(loadSimCallLog(entries))
      } else {
        const currentState=getState().callLog
        let updateList
        updateList=[...currentState.simCallLogData, ...entries]
        dispatch(loadSimCallLog(updateList))
      }
      const isFullyLoaded=(Array.isArray(entries) && entries.length< 10)
      let payload={
        lastFilters: { status, from: fromTs, to: toTs, rangeKey: getState().callLog.simCallLogFilters?.rangeKey },
        nextPage: pageNumber + 1,
        isFullyLoaded,
        lastFetchedAt: Date.now(),
        initialized: true
      }
      dispatch(setSimCallLogMetaData(payload))

      return entries
    } catch (e) {
      console.error(e);
      return []
    } finally {
      // setLoading(false);
    }
  }
}

export const fetchSimCallLogCount = ({ status = 'total', from, to } = {}) => {
  return async (dispatch, getState) => {
    try {
      const meta = getState().callLog.simCallLogMeta || {};
      const lastFilters = meta.lastFilters || null;
      const now = Date.now();
      const isStale = (now - (meta.lastFetchedAt || 0)) > CACHE_TTL;

      // if cached count exists and filters match and cache is not stale -> reuse
      if (
        typeof meta.totalCount === 'number' &&
        lastFilters &&
        lastFilters.status === status &&
        lastFilters.from === from &&
        lastFilters.to === to &&
        !isStale
      ) {
        return meta.totalCount;
      }

      
      const count = await CallLogModule.getFilteredCallLogsCount(status, from, to);
      // merge meta (do not clobber other fields)
      const newMeta = {
        ...meta,
        totalCount: count,
        lastFilters: { status, from, to, rangeKey: getState().callLog.simCallLogFilters?.rangeKey },
        lastFetchedAt: Date.now()
      };
      dispatch(setSimCallLogMetaData(newMeta));
      return count;
    } catch (err) {
      console.error('fetchSimCallLogCount error', err);
      return 0;
    }
  };
};
