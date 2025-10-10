/* eslint-disable camelcase */
/* eslint-disable react-native/no-raw-text */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import {
  Button,
  Select,
  SelectItem,
  Datepicker,
  Text,
  IndexPath,
} from '@ui-kitten/components';
import { useDispatch, useSelector } from 'react-redux';

import { colors } from '../../../themes/vars';
import ModalBottom from '../../../common/components/ModalBottom';
import { IconCall } from '../../../common/icons/Contactdetailsicons/iconcall';
import { IconProfile } from '../../../common/icons/iconprofile';
import { IconMail } from '../../../common/icons/Contactdetailsicons/mail';
import { IconAddress } from '../../../common/icons/iconaddress';
import { IconArrowDown } from '../../../common/icons/iconarrowdown';
import { IconCalendar } from '../../../common/icons/iconcalendar';
import {
  Cold,
  Comments,
  ContactName,
  ContactNo,
  CreateContact,
  CreateLabel,
  Disqualified,
  EditContact,
  Email,
  EnterContactEmail,
  EnterContactName,
  EnterContactNo,
  EnterValidContactNo,
  Hot,
  Invalid,
  Prospect,
  UpdateLabel,
  Warm,
  contactObj,
  contactStatusList,
  filterObj,
  initCallResult,
} from '../../../common/Constants';
import {
  filterMemberListForRole,
  toastShow,
  validateEmail,
} from '../../../common/helpers/utils';
import { IconInvalid } from '../../../common/icons/contactstatus';
import { IconCold } from '../../../common/icons/iconcold';
import { IconDisqualified } from '../../../common/icons/icondisqualified';
import { IconHot } from '../../../common/icons/iconhot';
import { IconWarm } from '../../../common/icons/iconwarm';
import { IconProspect } from '../../../common/icons/iconprospect';
import {
  updateContact,
  saveContact,
  getContact,
  loadContactList,
} from '../../../common/redux/actions/contact';
import { MyText } from '../../../common/components/MyText';
import TextInputWithIcon from '../../../common/components/textinputwithicon';
import { rh } from '../../../common/helpers/dimentions';
import { useNavigation } from '@react-navigation/native';
import { loadCallLogList } from '../../../common/redux/actions/callLog';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PropTypes from 'prop-types';

const Editcontactlog = ({
  from = ``,
  data,
  open,
  onClose = () => {},
  filters,
  contactFilterArr,
}) => {
  const selectText = 'Select Agent';
  const current_phone_number =
    data.type === `app`
      ? data.member_num === '0'
        ? data.caller_num
        : data.member_num
      : data.caller_num;
  const rowGap = 4;
  const dispatch = useDispatch();
  const [formData, setData] = useState({
    ...contactObj,
    member_name: new IndexPath(0),
    contact_status: new IndexPath(2),
    contact_num: current_phone_number?.substr(current_phone_number.length - 10),
  });
  const [num, setNum] = useState(``);
  const [err, setError] = useState({ ...contactObj });
  const { memList } = useSelector((state) => state.callLog);
  const { user, loading } = useSelector((state) => state.global);
  const [filtersLog, setFiltersLog] = useState({
    ...filterObj,
    callstatus: '',
    callresult: initCallResult.total,
  });
  const [date, setdate] = useState(new Date());
  const navigation = useNavigation();
  const [role, setRole] = useState();

  const getRole = async () => {
    const ansRole = await AsyncStorage.getItem('role');
    setRole(ansRole);
  };
  const memListData = [
    { member_name: role === `3` ? user?.fname : selectText, member_id: 0 },
    ...filterMemberListForRole(user, memList),
  ];

  useEffect(() => {
    getRole();
  }, []);

  useEffect(() => {
    if (contactFilterArr.length === 0) {
      if (data.type === `app`) {
        const _num = data.member_num?.startsWith('0')
          ? data.member_num.substring(1, data.member_num.length)
          : data.member_num;
        setData({ ...formData, member_num: _num });
      } else {
        const _num = data.caller_num?.startsWith('0')
          ? data.caller_num.substring(1, data.caller_num.length)
          : data.caller_num;
        setData({ ...formData, contact_num: _num });
      }
    } else {
      const objFilter = contactFilterArr[0];
      try {
        getContact(user?.authcode, objFilter?.contact_id)
          .then((res) => {
            const _obj = res.result[0];
            const memberIndex = memListData.findIndex(
              (x) =>
                x.member_name?.toLowerCase() ===
                _obj.member_name?.toLowerCase(),
            );
            setData({
              ...formData,
              contact_id: data.contact_id,
              member_name:
                memberIndex > 0 ? new IndexPath(memberIndex) : new IndexPath(0),
              contact_name: _obj.contact_name,
              contact_num: _obj.contact_num,
              contact_email: _obj.contact_email,
              contact_address: _obj.contact_address,
              contact_followupdate: _obj.contact_followupdate
                ? new Date(_obj.contact_followupdate)
                : null,
              contact_comment: _obj.contact_comment,
              contact_status: _obj.contact_status
                ? new IndexPath(_obj.contact_status - 1)
                : new IndexPath(2),
            });
          })
          .catch((err) => {
            console.log(err);
          });
      } catch {}
    }
  }, []);

  const onSubmit = () => {
    if (valid(formData)) {
      const _data = { ...formData };
      _data.member_name =
        role === `3`
          ? user?.fname
          : _data.member_name.row > 0
            ? memListData[_data.member_name.row].member_name
            : '';
      _data.contact_status = _data.contact_status.row + 1;
      // _data.contact_followupdate = _data.contact_followupdate
      //   ? convertToIst(_data.contact_followupdate)
      //   : null;
      onClose(_data);
      if (data.contact_id) {
        updateContact(user?.authcode, _data)
          .then((res) => {
            toastShow(`Contact updated successfully`);
            if (from === `details`) {
              navigation.goBack();
            }
            dispatch(loadContactList(user?.authcode, filters, true));
            dispatch(loadCallLogList(user?.authcode, filtersLog, true));
          })
          .catch((err) => {
            console.log(`Unable to edit contact`, err);
          });
      } else {
        saveContact(user?.authcode, _data)
          .then((res) => {
            onClose();
            dispatch(loadCallLogList(user?.authcode, filtersLog, true));
            dispatch(loadContactList(user?.authcode, filters, true));
          })
          .catch((err) => {
            console.log(`Unable to edit contact`, err);
          });
      }
    }
  };

  const valid = (vals, key) => {
    const msg = {
      contact_num: EnterContactNo,
      contact_num_format: EnterValidContactNo,
      contact_name: EnterContactName,
      contact_email: EnterContactEmail,
    };
    const errs = { ...err, contact_followupdate: undefined };
    if (key) {
      errs[key] = vals[key] ? '' : msg[key];
      if (key === 'contact_email' && vals.contact_email) {
        errs.contact_email = validateEmail(vals.contact_email)
          ? ''
          : msg.contact_email;
      }
      if (key === 'contact_email' && !vals.contact_email) {
        errs.contact_email = '';
      }
      if (key === 'contact_num') {
        if (vals.contact_num) {
          errs.contact_num =
            vals.contact_num.length !== 10 ? msg.contact_num_format : '';
        } else {
          errs.contact_num = msg.contact_num;
        }
      }
    } else {
      if (vals.contact_num) {
        errs.contact_num =
          vals.contact_num.length !== 10 ? msg.contact_num_format : '';
      } else {
        errs.contact_num = msg.contact_num;
      }
      errs.contact_name = vals.contact_name ? '' : msg.contact_name;

      if (vals.contact_email)
        errs.contact_email = validateEmail(vals.contact_email)
          ? ''
          : msg.contact_email;
      else errs.contact_email = '';
    }
    setError({ ...errs });
    return !hasValue({ ...errs, contact_savedate: '' });
  };

  function hasValue(obj) {
    for (const key in obj) {
      if (Object.hasOwn(obj, key) && obj[key]) {
        return true;
      }
    }
    return false;
  }

  const status = [
    { icon: <IconCold />, title: '-Select-' },
    { icon: <IconCold />, title: 'Cold' },
    { icon: <IconWarm />, title: 'Warm' },
    { icon: <IconHot />, title: 'Hot' },
    { icon: <IconProspect />, title: 'Prospect' },
    { icon: <IconDisqualified />, title: 'Disqualified' },
    { icon: <IconInvalid />, title: 'Invalid' },
  ];

  const StatusComponent = ({ title }) => {
    return (
      <View style={styles.status}>
        {title === 'Cold' ? <IconCold /> : <></>}
        {title === 'Warm' ? <IconWarm /> : <></>}
        {title === 'Hot' ? <IconHot /> : <></>}
        {title === 'Prospect' ? <IconProspect /> : <></>}
        {title === 'Disqualified' ? <IconDisqualified /> : <></>}
        {title === 'Invalid' ? <IconInvalid /> : <></>}
        <Text>{title}</Text>
      </View>
    );
  };
  StatusComponent.propTypes = {
    title: PropTypes.string,
  };
  return (
    <ModalBottom
      height="auto"
      title={data.contact_id ? EditContact : CreateContact}
      open={open}
      onClose={onClose}
    >
      <View style={{ marginTop: rowGap }}>
        <TextInputWithIcon
          from={`contact`}
          accessible={false}
          placeholder={ContactNo}
          value={formData.contact_num}
          onChangeText={(val) => {
            setNum(`1`);
            setData({ ...formData, contact_num: val });
            valid({ ...formData, contact_num: val }, 'contact_num');
          }}
          icon={<IconCall color={colors.black} />}
        ></TextInputWithIcon>
        {err.contact_num && (
          <MyText error={err.contact_num}>{err.contact_num || ''}</MyText>
        )}
      </View>
      <TextInputWithIcon
        from={`contact`}
        placeholder={ContactName}
        value={formData.contact_name}
        onChangeText={(val) => {
          setData({ ...formData, contact_name: val });
          valid({ ...formData, contact_name: val }, 'contact_name');
        }}
        icon={<IconProfile size={14} color={colors.black} />}
      ></TextInputWithIcon>
      {err.contact_name && (
        <MyText error={err.contact_name}>{err.contact_name || ''}</MyText>
      )}
      <TextInputWithIcon
        from={`contact`}
        placeholder={Email}
        value={formData.contact_email}
        onChangeText={(val) => {
          setData({ ...formData, contact_email: val });
          valid({ ...formData, contact_email: val }, 'contact_email');
        }}
        icon={<IconMail size={16} color={colors.black} />}
      ></TextInputWithIcon>
      {err.contact_email && (
        <MyText error={err.contact_email}>{err.contact_email || ''}</MyText>
      )}
      <TextInputWithIcon
        from={`contact`}
        placeholder={`Address`}
        value={formData.contact_address}
        onChangeText={(val) => {
          setData({ ...formData, contact_address: val });
        }}
        icon={<IconAddress color={colors.black} />}
      ></TextInputWithIcon>
      {err.contact_address && (
        <MyText error={err.contact_address}>{err.contact_address || ''}</MyText>
      )}
      <View style={{ marginTop: rh(0.8) }}>
        <Select
          selectedIndex={formData.contact_status}
          onSelect={(idx) => {
            setData({ ...formData, contact_status: idx });
          }}
          accessoryRight={<IconArrowDown size={14} />}
          value={() => (
            <StatusComponent
              title={
                contactStatusList[formData.contact_status.row + 1]?.name || ''
              }
            />
          )}
        >
          <SelectItem
            title={() => {
              return (
                <View style={styles.select}>
                  <IconHot />
                  <Text>{Hot}</Text>
                </View>
              );
            }}
          />
          <SelectItem
            title={() => {
              return (
                <View style={styles.select}>
                  <IconWarm />
                  <Text>{Warm}</Text>
                </View>
              );
            }}
          />
          <SelectItem
            title={() => {
              return (
                <View style={styles.select}>
                  <IconCold />
                  <Text>{Cold}</Text>
                </View>
              );
            }}
          />
          <SelectItem
            title={() => {
              return (
                <View style={styles.select}>
                  <IconInvalid />
                  <Text>{Invalid}</Text>
                </View>
              );
            }}
          />
          <SelectItem
            title={() => {
              return (
                <View style={styles.select}>
                  <IconDisqualified />
                  <Text>{Disqualified}</Text>
                </View>
              );
            }}
          />
          <SelectItem
            title={() => {
              return (
                <View style={styles.select}>
                  <IconProspect />
                  <Text>{Prospect}</Text>
                </View>
              );
            }}
          />
        </Select>
        <MyText error={err.contact_status}>{err.contact_status || ''}</MyText>
      </View>
      <Datepicker
        style={{ marginTop: rh(-0.8) }}
        date={formData.contact_followupdate}
        // date={date}
        onSelect={(val) => {
          // console.log(val)
          setData({ ...formData, contact_followupdate: val });
          setdate(val);
        }}
        accessoryRight={<IconCalendar size={16} />}
      />
      <MyText>{''}</MyText>
      <Select
        style={{ marginTop: rh(-0.8) }}
        disabled={role === `3`}
        selectedIndex={formData.member_name}
        value={memListData[formData.member_name - 1]?.member_name || ''}
        onSelect={(idx) => {
          setData({ ...formData, member_name: idx });
        }}
        accessoryRight={<IconArrowDown size={14} />}
      >
        {memListData.map((item) => {
          return <SelectItem key={item.member_id} title={item.member_name} />;
        })}
      </Select>
      <MyText error={err.member_name}>{err.member_name || ''}</MyText>
      <TextInputWithIcon
        style={{ marginTop: rh(-0.8) }}
        from={`contact`}
        lines={4}
        placeholder={Comments}
        value={formData.contact_comment}
        onChangeText={(val) => {
          setData({ ...formData, contact_comment: val });
        }}
      ></TextInputWithIcon>
      {err.contact_comment && (
        <MyText error={err.contact_comment}>{err.contact_comment || ''}</MyText>
      )}
      <View style={{ marginVertical: rh(2) }}>
        <Button
          disabled={loading}
          onPress={onSubmit}
          accessoryLeft={
            loading ? (
              <ActivityIndicator color={colors.primary} size="small" />
            ) : undefined
          }
        >
          {data.contact_id ? UpdateLabel : CreateLabel}
        </Button>
      </View>
    </ModalBottom>
  );
};

const styles = StyleSheet.create({
  select: { flexDirection: 'row', gap: 12 },
  status: { flexDirection: 'row', gap: 12 },
});

export default Editcontactlog;
Editcontactlog.propTypes = {
  data: PropTypes.shape({
    type: PropTypes.string,
    caller_num: PropTypes.string,
    callresult: PropTypes.string,
    file: PropTypes.string,
    member_name: PropTypes.string,
    enddatetime: PropTypes.string,
    startdatetime: PropTypes.string,
    caller_name: PropTypes.string,
    member_num: PropTypes.string,
    contact_id: PropTypes.string,
    created_at: PropTypes.string,
  }),
  from: PropTypes.string,
  open: PropTypes.bool,
  onClose: PropTypes.func,
  contactFilterArr: PropTypes.array,
  filters: PropTypes.object,
};
