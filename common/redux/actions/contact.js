/* eslint-disable camelcase */
import axios from 'axios';
import { ConstContact, ConstScreens, WhatsAppTemplate } from '../action-consts';
import { http } from '../../helpers/http';
import { checkAuth, groupContacts, toastShow } from '../../helpers/utils';
import store from '../../../common/redux/store';
import { startLoading, stopLoading } from './common';
import { loadCallGroupList } from './voiceTemplate';
import { loadMemberList } from './callLog';
import moment from 'moment';
import { NativeModules } from 'react-native';
import { pageSize } from '../../Constants';

const { ContactModule } = NativeModules;
export function loadContactList(
  authcode = '',
  filters,
  reset = false,
  isLoadMore = false,
) {
  const obj = store.getState();
  const formData = new FormData();
  // let _from;
  // if (filters?.from) {
  //   const { dd, mm, yyyy } = DatePart(filters?.from);
  //   _from = `${yyyy}-${mm}-${dd}`;
  // }
  // let _to;
  // if (filters?.to) {
  //   const { dd, mm, yyyy } = DatePart(filters?.to);
  //   _to = `${yyyy}-${mm}-${dd}`;
  // }
  !isLoadMore && store.dispatch(startLoading());

  formData.append('authcode', authcode);
  formData.append('current_page', filters?.currentPage);
  formData.append('per_page', filters?.pageSize || pageSize);
  filters?.from && formData.append('start_date', obj.global.dateFilterObj.from);
  filters?.to && formData.append('end_date', obj.global.dateFilterObj.to);

  filters?.member && formData.append('member_name', filters?.member);
  filters?.status.id > 0 &&
    formData.append('contact_status', filters?.status.id);
  return async (dispatch) => {
    try {
      const res = await http.postForm('api/contact_list_v2', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      if (res.type === `error`) {
        checkAuth(res?.message);
      }
      
      dispatch(loadContactSuccess({ data: res, reset }));
      return res;
    } catch (err) {
      console.log('loadContactList error:', err);
      throw err;
    } finally {
      store.dispatch(stopLoading());
    }
  };
}
export function loadSavedContactList(quickSearch) {
  return async (dispatch) => {
    try {
      const contactSource = await ContactModule.getContacts();
      const groupData = groupContacts(contactSource);
      dispatch(loadSavedContactSuccess({ data: groupData }));
    } catch (error) {
      toastShow(`Contact permission not granted`);
      return [];
    }
  };
}
export function addCallGroup(
  authcode = '',
  group_name = ``,
  deskphone_id = ``,
  member_id = ``,
  group_owner_name = ``,
) {
  const extension = Math.floor(1000 + Math.random() * 9000);
  const formData = new FormData();
  formData.append('authcode', authcode);
  formData.append('group_name', group_name);
  formData.append('deskphone_id', deskphone_id);
  formData.append('group_owner_name', group_owner_name);
  formData.append('group_owner__id', member_id);
  formData.append('group_extn', '*' + extension);
  store.dispatch(startLoading());
  return async (dispatch) => {
    await http
      .postForm('api/createcallgroup', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((res) => {
        if (res.type === 'success' && res.grouplist) {
          toastShow('Call group added successfully');
        } else if (res.type === 'error') {
          toastShow(res.message);
        } else {
          toastShow('Unable to process your request.');
        }
        dispatch(loadCallGroupList(authcode));
      })
      .catch((err) => {
        console.log(err);
        toastShow(`Unable to process your request.`);
      })
      .finally(() => {
        store.dispatch(stopLoading());
      });
  };
}
export function addTeam(authcode = '', obj = {}) {
  const formData = new FormData();
  formData.append('authcode', authcode);
  formData.append('member_num', parseInt(obj?.member_num, 10));
  formData.append('member_name', obj?.member_name);
  formData.append('active', 1);
  obj?.access && formData.append('access', parseInt(obj?.access, 10));
  obj?.member_email && formData.append('member_email', obj?.member_email);
  obj?.password && formData.append('password', obj?.password);
  store.dispatch(startLoading());
  return async (dispatch) => {
    await http
      .postForm('api/addmember_v2', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((res) => {
        if (res.type === 'success' && res.getmember) {
          toastShow('Team added successfully');
        } else if (res.type === 'error') {
          toastShow(res.message);
        } else {
          toastShow('Unable to process your request.');
        }
        dispatch(loadMemberList(authcode));
      })
      .catch((err) => {
        console.log(err);
        toastShow(`Unable to process your request.`);
      })
      .finally(() => {
        store.dispatch(stopLoading());
      });
  };
}
export function updateTeam(authcode = '', obj = {}) {
  const formData = new FormData();
  formData.append('authcode', authcode);
  obj.member_num &&
    formData.append('member_num', parseInt(obj?.member_num, 10));
  obj.member_name && formData.append('member_name', obj?.member_name);
  obj.password && formData.append('password', obj?.password);
  obj.member_email && formData.append('member_email', obj?.member_email);
  obj.active && formData.append('status', parseInt(obj?.active, 10));
  obj.status && formData.append('status', parseInt(obj?.status, 10));
  obj.access && formData.append('access', obj?.access);
  obj.agent_extn && formData.append('agent_extn', obj?.agent_extn);
  obj.member_id && formData.append('member_id', parseInt(obj?.member_id, 10));
  store.dispatch(startLoading());
  return async (dispatch) => {
    await http
      .postForm('api/updatemember_v2', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((res) => {
        if (res.type === 'success') {
          toastShow('Team updates successfully');
        } else if (res.type === 'error') {
          toastShow(res.message);
        } else {
          toastShow('Unable to process your request.');
        }
        dispatch(loadMemberList(authcode));
      })
      .catch((err) => {
        console.log(err);
        toastShow(`Unable to process your request.`);
      })
      .finally(() => {
        store.dispatch(stopLoading());
      });
  };
}
export function updateCallGroup(authcode = '', obj, nav) {
  store.dispatch(startLoading());
  const formData = new FormData();
  formData.append('authcode', authcode);
  obj.group_id && formData.append('group_id', obj?.group_id);
  obj.group_name && formData.append('group_name', obj?.group_name);
  obj.call_strategy && formData.append('strategy_check', obj?.call_strategy);
  obj.is_sticky === 0 && formData.append('sticky_member', obj?.is_sticky);
  obj.is_sticky && formData.append('sticky_member', obj?.is_sticky);
  obj.group_owner_id && formData.append('group_owner_id', obj?.group_owner_id);
  obj.is_multi_sticky === 0 &&
    formData.append('multi_sticky', obj?.is_multi_sticky);
  obj.is_multi_sticky !== `` &&
    obj.is_multi_sticky &&
    formData.append('multi_sticky', obj?.is_multi_sticky);
  obj.group_owner_name &&
    formData.append('group_owner_name', obj?.group_owner_name);
  obj.deskphone_id && formData.append('deskphone_id', obj?.deskphone_id);
  if (obj?.timeSchedule) {
    formData.append('day', obj.day.toString());
    if (obj.business_hours) {
      formData.append('bussiness_hours', 1);
      if (!obj.wholeWeek) {
        formData.append(
          'holiday_prompt_file_name',
          obj.holiday_prompt_file_name,
        );
        formData.append('holiday_prompt_type', obj.holiday_prompt_type);
      }
    } else {
      formData.append('bussiness_hours', 0);
      formData.append('starttime', obj.starttime);
      formData.append('endtime', obj.endtime);
      formData.append(
        'business_hours_prompt_file_name',
        obj.business_hours_prompt_file_name,
      );
      formData.append(
        'business_hours_prompt_type',
        obj.business_hours_prompt_type,
      );
      formData.append('holiday_prompt_file_name', obj.holiday_prompt_file_name);
      formData.append('holiday_prompt_type', obj.holiday_prompt_type);
    }
  }
  if (obj?.member_id) {
    formData.append('member_id', obj?.member_id);
  }
  store.dispatch(startLoading());
  return async (dispatch) => {
    await http
      .postForm('api/updategroup_v2', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((res) => {
        if (res.type === 'success') {
          toastShow('Call group update successfully');
        } else if (res.type === 'error') {
          // toastShow(res.message);
        } else {
          toastShow('Unable to process your request.');
        }
        dispatch(loadCallGroupList(authcode));
      })
      .catch((err) => {
        console.log(err);
        toastShow(`Unable to process your request.`);
      })
      .finally(() => {
        if (nav.edit_group === `edit_group`) {
          store.dispatch(stopLoading());
        } else {
          store.dispatch(stopLoading());
          nav.navigation.goBack();
        }
      });
  };
}

export const getCallGroupSchedule = async (authCode, group_id) => {
  try {
    const form_data = new FormData();
    form_data.append('authcode', authCode);
    form_data.append('group_id', group_id);
    //   console.log(form_data)
    const res = await axios.post(
      'https://app.callerdesk.io/api/getgroupschedule',
      form_data,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
    return res;
  } catch (error) {
    console.log('error', error);
    return error.response;
  }
};

export const getPromptList = async (authCode) => {
  try {
    const form_data = new FormData();
    form_data.append('authcode', authCode);
    const res = await axios.post(
      'https://app.callerdesk.io/api/getprompt',
      form_data,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
    return res;
  } catch (error) {
    console.log(error);
    return error.response;
  }
};

export function deleteUserCallGroup(authcode = '', obj) {
  const formData = new FormData();
  formData.append('authcode', authcode);
  formData.append('id', parseInt(obj?.id, 10));
  store.dispatch(startLoading());

  return async (dispatch) => {
    try {
      const res = await http.postForm('api/delete_user_call_group', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(res);
      if (res.type === 'success') {
        toastShow('Call group update successfully');
      } else if (res.type === 'error') {
        toastShow(res.message);
      } else {
        toastShow('Unable to process your request.');
      }
      dispatch(loadCallGroupList(authcode));
      return res; // Return the response so it can be used in the component
    } catch (err) {
      console.log(err);
      toastShow('Unable to process your request.');
      return err; // Return the error so it can be handled in the component
    } finally {
      store.dispatch(stopLoading());
    }
  };
}

export function deleteCallGroup(authcode = '', group_id = ``) {
  const formData = new FormData();
  formData.append('authcode', authcode);
  formData.append('group_id', group_id);
  //   formData.append('deskphone_id', deskphone_id);
  //   formData.append('member_id', member_id);
  store.dispatch(startLoading());
  return async (dispatch) => {
    await http
      .postForm('api/deletegroup', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((res) => {
        if (res.type === 'success') {
          toastShow('Call group deleted successfully');
        } else if (res.type === 'error') {
          toastShow(res.message);
        } else {
          toastShow('Unable to process your request.');
        }
        dispatch(loadCallGroupList(authcode));
      })
      .catch(() => {
        toastShow(`Unable to process your request.`);
      })
      .finally(() => {
        store.dispatch(stopLoading());
      });
  };
}
export function deleteMember(authcode = '', member_id = ``) {
  const formData = new FormData();
  formData.append('authcode', authcode);
  formData.append('member_id', member_id);
  store.dispatch(startLoading());
  return async (dispatch) => {
    await http
      .postForm('api/deletemember_v2', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((res) => {
        if (res.type === 'success') {
          toastShow('Team member deleted successfully');
        } else if (res.type === 'error') {
          toastShow(res.message);
        } else {
          toastShow('Unable to process your request.');
        }
        dispatch(loadMemberList(authcode));
      })
      .catch(() => {
        toastShow(`Unable to process your request.`);
      })
      .finally(() => {
        store.dispatch(stopLoading());
      });
  };
}

export function getCallGroupDetail(authcode, group_id) {
  const form_data = new FormData();
  form_data.append('authcode', authcode);
  form_data.append('group_id', group_id);
  return http.postForm('api/getgroupbyid_v2', form_data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

export function deleteContact(authcode = '', contact_num = ``, filters = {}) {
  const formData = new FormData();
  formData.append('authcode', authcode);
  formData.append('contact_num', contact_num);
  //   formData.append('deskphone_id', deskphone_id);
  //   formData.append('member_id', member_id);
  store.dispatch(startLoading());
  return async (dispatch) => {
    await http
      .postForm('api/deleteContact', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((res) => {
        if (res.type === 'success') {
          toastShow('Contact deleted successfully');
        } else if (res.type === 'error') {
          toastShow(res.message);
        } else {
          toastShow('Unable to process your request.');
        }
        dispatch(loadContactList(authcode, filters, true));
      })
      .catch(() => {
        toastShow(`Unable to process your request.`);
      })
      .finally(() => {
        store.dispatch(stopLoading());
      });
  };
}
export function loadCallHistory(authcode = '', caller_num = '', reset = false) {
  const formData = new FormData();
  formData.append('authcode', authcode);
  formData.append('caller_num', caller_num);

  return async (dispatch) => {
    await http
      .postForm('api/call_list_v2', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((res) => {
        dispatch(loadContactHistory({ data: res, reset }));
      })
      .catch((err) => {
        console.log(`hoooooooooo`, err);
      });
  };
}
export function loadCallGroup(authcode = '', reset = false) {
  // const formData = new FormData();
  // formData.append('authcode', authcode);
  // formData.append('caller_num', caller_num);

  return async (dispatch) => {
    //     await http.postForm('api/call_list_v2', formData, {
    //         headers: {
    //             'Content-Type': 'multipart/form-data'
    //         }
    //     }).then(res => {

    dispatch(
      groupScreen({
        data: [
          {
            group_name: `test`,
            schedule: true,
            name: `Shiv`,
            strategy: `Roundrobin`,
            id: 1,
          },
          {
            group_name: `test`,
            schedule: true,
            name: `Shiv`,
            strategy: `Roundrobin`,
            id: 1,
          },
          {
            group_name: `test`,
            schedule: true,
            name: `Shiv`,
            strategy: `Roundrobin`,
            id: 1,
          },
        ],
        reset,
      }),
    );
    // }).catch(err => {
    //             console.log(`hoooooooooo`,err);
    //         });
  };
}
export function getContact(authcode = '', contactId = '') {
  const formData = new FormData();
  formData.append('authcode', authcode);
  formData.append('current_page', 1);
  formData.append('per_page', 10);
  formData.append('contact_id', contactId);

  return http.postForm('api/contact_list_v2', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

export function saveContact(authcode = '', obj = {}) {
  try {
    const formData = new FormData();

    formData.append('authcode', authcode);
    obj?.contact_num && formData.append('contact_num', obj?.contact_num);
    obj?.contact_name && formData.append('contact_name', obj?.contact_name);
    obj?.contact_email && formData.append('contact_email', obj?.contact_email);
    obj?.contact_address &&
      obj?.contact_address &&
      formData.append('contact_address', obj?.contact_address);
    obj?.contact_status &&
      formData.append('contact_status', obj?.contact_status);
    obj.contact_followupdate &&
      formData.append(
        'contact_followupdate',
        moment(obj.contact_followupdate).format('YYYY-MM-DD'),
      );
    obj?.member_name && formData.append('member_name', obj?.member_name);
    obj?.contact_comment &&
      obj?.contact_comment &&
      formData.append('contact_comment', obj?.contact_comment);
    return http.postForm('api/savecontact_v2', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  } catch (error) {
    console.log('error', error);
  }
}

export function updateContact(authcode = '', obj = {}) {
  const formData = new FormData();
  formData.append('authcode', authcode);
  formData.append('contact_id', obj.contact_id);
  formData.append('contact_num', obj.contact_num);
  formData.append('contact_name', obj.contact_name);
  obj.contact_email && formData.append('contact_email', obj.contact_email);
  obj.contact_address &&
    formData.append('contact_address', obj.contact_address);
  obj.contact_status && formData.append('contact_status', obj.contact_status);
  obj.contact_followupdate &&
    formData.append(
      'contact_followupdate',
      moment(obj.contact_followupdate).format('YYYY-MM-DD'),
    );
  obj.member_name && formData.append('member_name', obj.member_name);
  obj.contact_comment &&
    formData.append('contact_comment', obj.contact_comment);
  return http.postForm('api/editContact_v2', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}
export function addWhatsAppTemplate(authcode = '', obj = {}) {
  const formData = new FormData();
  formData.append('authcode', authcode);
  obj?.wa_template_name &&
    formData.append('wa_template_name', obj.wa_template_name);
  obj?.wa_template_content &&
    formData.append('wa_template_content', obj.wa_template_content);
  obj?.wa_template_type &&
    formData.append('wa_template_type', obj.wa_template_type);
  obj?.wa_template_title &&
    formData.append('wa_template_title', obj.wa_template_title);
  console.log(`formdata??`, formData);
  store.dispatch(startLoading());
  return async (dispatch) => {
    await http
      .postForm('api/add-whatsapp-template', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((res) => {
        console.log(`res??`, res);
        const obj = {
          wa_template_type: ``,
        };
        dispatch(getWhatsAppTemplate(authcode, obj, true));
        if (res.type === 'success') {
          toastShow(res.message);
        } else if (res.type === 'error') {
          toastShow(res.message);
        } else {
          toastShow('Unable to process your request.');
        }
        // dispatch(loadMemberList(authcode))
      })
      .catch((err) => {
        console.log(err);
        toastShow(`Unable to process your request.`);
      })
      .finally(() => {
        store.dispatch(stopLoading());
      });
  };
}
export function updateWhatsAppTemplate(authcode = '', obj = {}) {
  const formData = new FormData();
  formData.append('authcode', authcode);
  obj?.wa_template_name &&
    formData.append('wa_template_name', obj.wa_template_name);
  obj?.wa_template_content &&
    formData.append('wa_template_content', obj.wa_template_content);
  obj?.wa_template_type &&
    formData.append('wa_template_type', obj.wa_template_type);
  obj?.wa_template_title &&
    formData.append('wa_template_title', obj.wa_template_title);
  obj?.wa_template_id && formData.append('wa_template_id', obj.wa_template_id);
  store.dispatch(startLoading());
  return async (dispatch) => {
    await http
      .postForm('api/update-whatsapp-template', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((res) => {
        const obj = {
          wa_template_type: ``,
        };
        dispatch(getWhatsAppTemplate(authcode, obj, true));

        if (res.type === 'success') {
          toastShow(res.message);
        } else if (res.type === 'error') {
          toastShow(res.message);
        } else {
          toastShow('Unable to process your request.');
        }
        // dispatch(loadMemberList(authcode))
      })
      .catch((err) => {
        console.log(err);
        toastShow(`Unable to process your request.`);
      })
      .finally(() => {
        store.dispatch(stopLoading());
      });
  };
}
export function getWhatsAppTemplate(authcode = '', obj = {}, reset = true) {
  const formData = new FormData();
  formData.append('authcode', authcode);
  formData.append('per_page', pageSize);
  // formData.append('wa_template_type', obj.wa_template_type);
  store.dispatch(startLoading());
  return async (dispatch) => {
    await http
      .postForm('api/get-whatsapp-template', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((res) => {
        dispatch(getWhatsAppTemplateSuccess({ data: res, reset }));
        if (res.type === 'success') {
          // toastShow(res.message);
        } else if (res.type === 'error') {
          // toastShow(res.message);
        } else {
          // toastShow('Unable to process your request.');
        }
        // dispatch(loadMemberList(authcode))
      })
      .catch((err) => {
        console.log(err);
        toastShow(`Unable to process your request.`);
      })
      .finally(() => {
        store.dispatch(stopLoading());
      });
  };
}
export const loadContactSuccess = (payload) => ({
  type: ConstContact.LOAD_LIST,
  payload,
});
export const loadSavedContactSuccess = (payload) => ({
  type: ConstContact.LOAD_SAVED_CONTACT_LIST,
  payload,
});
export const loadContactHistory = (payload) => ({
  type: ConstContact.LOAD_HISTORY,
  payload,
});
export const loadCallResultAnalysis = (payload) => ({
  type: ConstScreens.LOAD_CALL_RESULT_ANALYSIS,
  payload,
});
export const contactDetailsScreen = (payload) => ({
  type: ConstScreens.CONTACT_DETAILS_SCREEN,
  payload,
});
export const teamDetailsScreen = (payload) => ({
  type: ConstScreens.TEAM_DETAILS_SCREEN,
  payload,
});
export const teamMemberDataScreen = (payload) => ({
  type: ConstScreens.TEAM_MEMBER_DATA_SCREEN,
  payload,
});
export const groupScreen = (payload) => ({
  type: ConstScreens.GROUP_DETAILS_SCREEN,
  payload,
});
export const savedContact = (payload) => ({
  type: ConstContact.LOAD_SAVED_CONTACT_LIST,
  payload,
});
export const getWhatsAppTemplateSuccess = (payload) => ({
  type: WhatsAppTemplate.LOAD_WHATSAPP_TEMPLATE,
  payload,
});

// export const loadContactHistory = (payload) => {
//     // type: ConstContact.LOAD_HISTORY,
//     // payload
//     {console.log(`payload`,payload)}
// };
