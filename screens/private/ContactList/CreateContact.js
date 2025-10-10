import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import {
  Button,
  Select,
  SelectItem,
  Datepicker,
  Text,
  IndexPath,
} from '@ui-kitten/components';
import { useSelector, useDispatch } from 'react-redux';
import { colors } from '../../../themes/vars';
import TextArea from '../../../common/components/TextArea';
import { IconCall } from '../../../common/icons/Contactdetailsicons/iconcall';
import { IconProfile } from '../../../common/icons/iconprofile';
import { IconMail } from '../../../common/icons/Contactdetailsicons/mail';
import { IconAddress } from '../../../common/icons/iconaddress';
import { IconArrowDown } from '../../../common/icons/iconarrowdown';
import { IconCalendar } from '../../../common/icons/iconcalendar';
import {
  Address,
  Cold,
  Comments,
  ContactName,
  ContactNo,
  CreateContactLabel,
  Disqualified,
  Email,
  EnterContactEmail,
  EnterContactName,
  EnterContactNo,
  EnterValidContactNo,
  Hot,
  Invalid,
  Prospect,
  Warm,
  contactObj,
  contactStatusList,
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
import { saveContact } from '../../../common/redux/actions/contact';
import { MyText } from '../../../common/components/MyText';
import { rh, rw } from '../../../common/helpers/dimentions';
import TextInputWithIcon from '../../../common/components/textinputwithicon';
import {
  startLoading,
  stopLoading,
} from '../../../common/redux/actions/common';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PropTypes from 'prop-types';

const CreateContact = ({ meta, onClose = () => {}, loadData = () => {} }) => {
  const selectText = 'Select Agent';
  const dispatch = useDispatch();

  const [formData, setData] = useState({
    ...contactObj,
    member_name: new IndexPath(0),
    contact_status: new IndexPath(2),
  });
  const [err, setError] = useState({ ...contactObj });
  const [date, setdate] = useState(new Date());

  const { memList } = useSelector((state) => state.callLog);
  const { user, loading } = useSelector((state) => state.global);
  const [role, setRole] = useState();

  const getRole = async () => {
    const ansRole = await AsyncStorage.getItem('role');
    setRole(ansRole);
    console.log(user?.fname);
  };
  const memListData = [
    { member_name: role === `3` ? user?.fname : selectText, member_id: 0 },
    ...filterMemberListForRole(user, memList),
  ];

  useEffect(() => {
    getRole();
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
      dispatch(startLoading());
      onClose();
      saveContact(user?.authcode, _data)
        .then((res) => {
          toastShow(res.message);
          // nav.goBack();
        })
        .catch((err) => {
          toastShow(`Error while creating contact`);
          console.log(`Error while creating contact.`, err);
        })
        .finally(() => {
          dispatch(stopLoading());
          loadData();
        });
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
    <>
      <ScrollView style={styles.container}>
        <TextInputWithIcon
          from={`contact`}
          value={formData.contact_num}
          inputMode={`number-pad`}
          onChangeText={(val) => {
            if (isNaN(val)) return false;
            setData({ ...formData, contact_num: val });
            valid({ ...formData, contact_num: val }, 'contact_num');
          }}
          placeholder={ContactNo}
          icon={<IconCall color={colors.black} />}
        ></TextInputWithIcon>
        {err.contact_num && (
          <MyText error={err.contact_num}>{err.contact_num || ''}</MyText>
        )}
        <TextInputWithIcon
          from={`contact`}
          value={formData.contact_name}
          inputMode={`default`}
          onChangeText={(val) => {
            setData({ ...formData, contact_name: val });
            valid({ ...formData, contact_name: val }, 'contact_name');
          }}
          placeholder={ContactName}
          icon={<IconProfile size={14} color={colors.black} />}
        ></TextInputWithIcon>
        {err.contact_name && (
          <MyText error={err.contact_name}>{err.contact_name || ''}</MyText>
        )}
        <TextInputWithIcon
          from={`contact`}
          value={formData.contact_email}
          inputMode={`email-address`}
          onChangeText={(val) => {
            setData({ ...formData, contact_email: val });
            valid({ ...formData, contact_email: val }, 'contact_email');
          }}
          placeholder={Email}
          icon={<IconMail size={16} color={colors.black} />}
        ></TextInputWithIcon>
        {err.contact_email && (
          <MyText error={err.contact_email}>{err.contact_email || ''}</MyText>
        )}
        <TextInputWithIcon
          from={`contact`}
          value={formData.contact_address}
          onChangeText={(val) => {
            setData({ ...formData, contact_address: val });
          }}
          placeholder={Address}
          icon={<IconAddress color={colors.black} />}
        ></TextInputWithIcon>
        {err.contact_address && (
          <MyText error={err.contact_address}>
            {err.contact_address || ''}
          </MyText>
        )}
        <View style={{ marginVertical: rh(0.5) }}>
          <Select
            selectedIndex={formData.contact_status}
            onSelect={(idx) => {
              setData({ ...formData, contact_status: idx });
            }}
            accessoryRight={<IconArrowDown size={14} />}
            value={() => (
              <StatusComponent
                title={contactStatusList[formData.contact_status.row + 1].name}
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
        </View>
        {err.contact_status && (
          <MyText error={err.contact_status}>{err.contact_status || ''}</MyText>
        )}
        <View style={{ marginTop: rh(1) }}>
          <Datepicker
            date={date}
            onSelect={(val) => {
              setdate(val);
            }}
            accessoryRight={<IconCalendar size={16} />}
          />
        </View>
        <View style={{ marginVertical: rh(1.2) }}>
          <Select
            selectedIndex={formData.member_name}
            disabled={role === `3`}
            value={memListData[formData.member_name - 1]?.member_name || ''}
            onSelect={(idx) => {
              setData({ ...formData, member_name: idx });
            }}
            accessoryRight={<IconArrowDown size={14} />}
          >
            {memListData.map((item) => {
              return (
                <SelectItem key={item.member_id} title={item.member_name} />
              );
            })}
          </Select>
        </View>
        {err.member_name && (
          <MyText error={err.member_name}>{err.member_name || ''}</MyText>
        )}
        <TextArea
          from={`contact`}
          rows={4}
          placeholder={Comments}
          onChange={(val) => {
            setData({ ...formData, contact_comment: val });
          }}
          style={{ width: rw(86) }}
        />
        {err.contact_comment && (
          <MyText error={err.contact_comment}>
            {err.contact_comment || ''}
          </MyText>
        )}
        <View style={{ marginTop: rh(1.5) }}>
          <Button
            disabled={loading}
            onPress={onSubmit}
            accessoryLeft={
              loading ? (
                <ActivityIndicator color={colors.primary} size="small" />
              ) : (
                <></>
              )
            }
          >
            {CreateContactLabel}
          </Button>
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flex: 1,
    // paddingHorizontal: rw(3.5),
    paddingTop: rh(1),
  },
  select: { flexDirection: 'row', gap: 12 },
  status: { flexDirection: 'row', gap: 12 },
});

export default CreateContact;
CreateContact.propTypes = {
  data: PropTypes.shape({
    type: PropTypes.string,
    caller_num: PropTypes.string,
    contact_id: PropTypes.string,
    callresult: PropTypes.string,
    file: PropTypes.string,
    member_name: PropTypes.string,
    enddatetime: PropTypes.string,
    startdatetime: PropTypes.string,
    caller_name: PropTypes.string,
    member_num: PropTypes.string,
    created_at: PropTypes.string,
  }),
  meta: PropTypes.object,
  onClose: PropTypes.func,
  loadData: PropTypes.func,
};
