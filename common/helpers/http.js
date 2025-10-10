import axios from 'axios';
import store from '../redux/store';
import { startLoading, stopLoading } from '../redux/actions/common';

const apiUrl = 'https://app.callerdesk.io/';
const instance = axios.create({
  baseURL: apiUrl,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json; charset=utf-8',
  },
});

const instance2 = axios.create({
  baseURL: apiUrl,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json; charset=utf-8',
  },
});

// Intercept request
instance.interceptors.request.use((req) => {
  const global = store.getState().global;
  const token = global?.user?.authcode;
  store.dispatch(startLoading());
  if (token && req.headers) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// Intercept response
instance.interceptors.response.use(
  (res) => {
    store.dispatch(stopLoading());
    return res.data;
  },
  (err) => {
    store.dispatch(stopLoading());
    console.log('interceptors error', err);
    return Promise.reject(new Error('Request failed'));
  },
);

instance2.interceptors.response.use(
  (res) => {
    return res.data;
  },
  (err) => {
    console.log('interceptors error', err.response);
    return Promise.reject();
  },
);

instance.fake = false;

export { instance as http, instance2 as http2 };
export default instance;
