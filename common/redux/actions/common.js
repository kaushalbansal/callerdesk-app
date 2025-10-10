import { BreakApi, ConstGlobal } from '../action-consts';
export const startLoading = () => ({
  type: ConstGlobal.LOADING_START,
  payload: undefined,
});
export const stopLoading = () => ({
  type: ConstGlobal.LOADING_STOP,
  payload: undefined,
});

export const loginSuccess = (payload) => ({
  type: ConstGlobal.LOGIN_SUCCESS,
  payload,
});
export const dateFilterObject = (payload) => ({
  type: ConstGlobal.DEFAULT_DATE,
  payload,
});
export const logout = () => ({
  type: ConstGlobal.LOGOUT,
  payload: undefined,
});

export const ProfileAndBalanceSuccess = (payload) => ({
  type: ConstGlobal.PROFILE_BALANCE_SUCCESS,
  payload,
});
export const BreakApiStatus = (payload) => ({
  type: BreakApi.STATUS,
  payload,
});
