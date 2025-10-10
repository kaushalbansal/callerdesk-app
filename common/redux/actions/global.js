/* eslint-disable eqeqeq */
import { Alert } from 'react-native';
import {
  ProfileAndBalanceSuccess,
  loginSuccess,
  startLoading,
  stopLoading,
} from './common';
import { http } from '../../helpers/http';
import { removeWhatsappUser, saveUser, toastShow } from '../../helpers/utils';
import store from '../store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loadHomePageSummary } from './callLog';
import { resetWhatsappUser } from './whatsappEmbedSignup';
import { ConstGlobal } from '../action-consts';
// import { loadHomePageSummary } from './callLog';

export function SubmitLogin(data, cb = () => {}) {
  const formData = new FormData();
  formData.append('email', data.email);
  formData.append('pwd', data.pwd);

  return async (dispatch) => {
    await http
      .postForm('api_v2/signin', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((res) => {
        if (res.type !== 'error') {
          saveUser(JSON.stringify(res));
          dispatch(loginSuccess(res));
           removeWhatsappUser()
          dispatch(resetWhatsappUser())
          cb(res);
        } else {
          Alert.alert(res.message);
        }
      })
      .catch((err) => {
        console.log({ err });
      });
  };
}

export function GetProfileAndBalance(authcode, cb = () => {}) {
  const formData = new FormData();
  formData.append('authcode', authcode);

  return async (dispatch) => {
    if (http.fake) {
      console.log('is it inside fake')
      await http
        .get('https://dev-039l3tyhnsdnp40.api.raw-labs.com/profile_billing')
        .then((res) => {
          dispatch(ProfileAndBalanceSuccess(res));
          cb();
        });
      return;
    }

    await http
      .postForm('api/profile_billing_v2', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((res) => {
        const _temp = { ...res };
        _temp.login_account.plan_id = +res.login_account.plan_id || 1;
        _temp.current_plan = res.plan_details.filter(
          (x) => x.plan_id == res.login_account.plan_id,
        )[0];
        dispatch(ProfileAndBalanceSuccess(_temp));
        cb();
      })
      .catch((err) => {
        console.log('GetProfileAndBalance', err);
        // if(err){
        //     dispatch(showError([err]));
        // }
      });
  };
}
export function UpdateProfile(authcode, data, cb = () => {}, gst) {
  const formData = new FormData();
  formData.append('authcode', authcode);
  data?.businessName && formData.append('company_name', data?.businessName);
  data?.address && formData.append('company_address', data?.address);
  data?.pinCode && formData.append('pincode', data?.pinCode);
  data?.state && formData.append('state', data?.state);
  if (!gst) {
    data?.gstNo && formData.append('gst_no', data?.gstNo);
  }
  data?.plan_id && formData.append('plan_id', data?.plan_id);
  console.log(`gst???`, gst);
  console.log(`formData???`, formData);
  store.dispatch(startLoading());
  return async (dispatch) => {
    await http
      .postForm('api/update-profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((res) => {
        dispatch(GetProfileAndBalance(authcode, cb));
        console.log(`res??????`, res?.type);
        if (res?.type == `success`) {
          toastShow(`Profile updated successfully!`);
        } else {
          toastShow(`Unable to process your request.`);
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        store.dispatch(stopLoading());
      });
  };
}

export const SingleLegCall = (authcode, data) => {
  const formData = new FormData();
  formData.append('authcode', authcode);
  formData.append('agent_number', data.agent_number);
  formData.append('customer_number', data.customer_number);
  formData.append('callerid', data.callerid);
  http
    .postForm('api/singleleg-clicktocall', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then((res) => {
      console.log('SingleLeg Call connected');
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      store.dispatch(stopLoading());
    });
};
export const BreakApiCall = ({ authcode, status, name, num, dir }) => {
  const url = `api/update-working-status-v3/?authcode=${authcode}&working_status=${status === '0' ? 'Short Break' : 'Ready'}&member_name=${name}&member_num=${num}&direction=${dir}`;
  console.log(url, `formmmmmmmmm`);

  return new Promise((resolve, reject) => {
    http
      .get(url)
      .then(async (res) => {
        console.log('changeagentstatus', res);
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
    console.log(formData, `formData`);

    http
      .postForm('api/changeagentstatus', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(async (res) => {
        console.log('changeagentstatus', res);
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
        // store.dispatch(loadHomePageSummary(authcode));
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
    console.log(formData, `formData`);

    http
      .postForm('api/changeagentstatus', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(async (res) => {
        console.log('changeagentstatus', res);
        // store.dispatch(loadHomePageSummary(authcode));
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

export const setDialerMode=(selectedMode)=>{
  return{
    type: ConstGlobal.SAVE_DIALER_MODE,
    payload:selectedMode
  }
}
