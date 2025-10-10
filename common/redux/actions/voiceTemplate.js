import { ConstVoiceList } from '../action-consts';
import { http } from '../../helpers/http';
import store from '../store';
import { startLoading, stopLoading } from './common';
import { pageSize } from '../../Constants';
import { checkAuth } from '../../helpers/utils';

export function loadVoiceTemplateList(authcode = '') {
  const formData = new FormData();
  formData.append('authcode', authcode);
  formData.append('per_page', pageSize);

  return async (dispatch) => {
    await http
      .postForm('api/getprompt', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((res) => {
        const _temp = transform(res.promptlist);
        dispatch(loadVoiceTemplateSuccess(_temp));
      })
      .catch((err) => {
        console.log(err);
      });
  };
}

export function loadCallGroupList(
  authcode = '',
  pg = pageSize,
  currentPage = 1,
  isLoadMore = false,
) {
  const formData = new FormData();
  formData.append('authcode', authcode);
  formData.append('per_page', pg);
  formData.append('current_page', currentPage);
  !isLoadMore && store.dispatch(startLoading());
  return async (dispatch) => {
    await http
      .postForm('api/getgrouplist_v2', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((res) => {
        if (res.type === `error`) {
          checkAuth(res?.message);
        }
        res?.grouplist && res?.grouplist.length > 0
          ? dispatch(
              loadCallGroupListSuccess({
                list: res?.grouplist,
                total: res?.total,
                isLoadMore,
              }),
            )
          : dispatch(
              loadCallGroupListSuccess({ list: [], total: 0, isLoadMore }),
            );
      })
      .catch((err) => {
        console.log('loadCallGroupList', err);
      })
      .finally(() => {
        store.dispatch(stopLoading());
      });
  };
}

const transform = (_data) => {
  const _types = [
    ...new Set(_data.map((element) => element.template_type_name)),
  ];

  const res = [];
  _types.map((x) => {
    const _list = _data.filter((el) => el.template_type_name == x);
    if (_list.length > 0) {
      res.push(x);
      res.push(..._list);
    }
    return x;
  });
  return res;
};

export const loadVoiceTemplateSuccess = (payload) => ({
  type: ConstVoiceList.LOAD_VOICE_TEMPLATE,
  payload,
});

export const loadCallGroupListSuccess = (payload) => ({
  type: ConstVoiceList.LOAD_CALLGROUP_LIST,
  payload,
});

export function saveIncomincomingIvr(authcode = '', ivr = {}) {
  const formData = new FormData();
  formData.append('authcode', authcode);
  formData.append('routing_id', 1);
  formData.append('did_id', ivr.did_id);
  formData.append('user_voice_mail_prompt', ivr.voiceMail.data.id);
  formData.append('routing_action', 'group');
  formData.append('call_groupid', ivr.callGroup.data.id);
  formData.append('call_strategy', ivr.callStrategy.data.id);
  formData.append('user_post_action', 2);
  return http.postForm('api/addivrflow', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}
