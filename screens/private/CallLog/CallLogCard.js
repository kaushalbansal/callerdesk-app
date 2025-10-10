/* eslint-disable react-native/no-raw-text */
import React, { useEffect, useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, ViewPager, Layout } from '@ui-kitten/components';

import {
  formatCallLogDate,
  calculateTimeDifference,
  getRandomColor,
} from '../../../common/helpers/utils.js';
import { colors } from '../../../themes/vars.js';
import CallLogDetailCard from './CallLogDetailCard.js';
import { CopyIconNew } from '../../../common/icons/copyiconnew.js';
import { TextIcon } from '../../../common/icons/texticon.js';
import { rf, rh, rw } from '../../../common/helpers/dimentions.js';
import { EditIcon } from '../../../common/icons/editiconnew.js';
import { SwipeText, UnknownText } from '../../../common/Constants.js';
import { CallPhone } from '../../../common/icons/callphone.js';
import { InfoIcon } from '../../../common/icons/infoicon.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SmsIcon } from '../../../common/icons/smsicon.js';
import { TotalCallIcon } from '../../../common/icons/totalcallicon.js';
import { AnsweredCallsIcon } from '../../../common/icons/answeredcallsicon.js';
import { IconMissed } from '../../../common/icons/iconmissedcall.js';
import { IconVoice } from '../../../common/icons/iconvoice.js';
import PropTypes from 'prop-types';
import NoPermissionModal from '../../../common/helpers/NoPermissionModal.js';
const CallLogCard = ({
  data,
  index,
  copyFunc = () => {},
  sendSmsCard = () => {},
  callRouting = () => {},
  modalUpdate = () => {},
  dialerOpen = () => {},
  getCustomerName = (number) => {},
  onSelect,
}) => {
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const bg = useMemo(() => getRandomColor(), []);
  const _defaultModal = {
    whatsapp: false,
    blockUser: false,
    paymentUpi: false,
    businessAddress: false,
    editContact: false,
    fileDownload: false,
    info: false,
    whatsappConfirm: false,
  };
  const [showDiler, setShowDiler] = React.useState(false);
  // eslint-disable-next-line no-unused-vars
  const [userRole, setUserRole] = React.useState();
  const [role, setRole] = React.useState();

  useEffect(() => {
    // console.log(data)
    setSelectedIndex(0);
  }, [data]);

  const getRole = async () => {
    const ans = await AsyncStorage.getItem('user_role');
    const ansRole = await AsyncStorage.getItem('role');
    setUserRole(ans);
    setRole(ansRole);
  };

  useEffect(() => {
    getRole();
  }, []);
  return (
    <View style={styles.container} key={index}>
      <ViewPager
        style={{ marginTop: rh(1) }}
        selectedIndex={selectedIndex}
        onSelect={(idx) => {
          setSelectedIndex(idx);
        }}
      >
        <Layout>
          <View style={styles.layout1}>
            <View style={styles.layout11}>
              <View style={styles.card1}>
                <View style={styles.leftBox}>
                  <View style={[styles.circle, { backgroundColor: bg }]}>
                    {data.type === `app` ? (
                      <Text style={styles.layout1Text}>
                        {data.caller_name
                          ? data.caller_name[0].toLocaleUpperCase()
                          : `U`}
                      </Text>
                    ) : (
                      <Text style={styles.layout1Text}>
                        {data.caller_name
                          ? data.caller_name[0].toLocaleUpperCase()
                          : `U`}
                      </Text>
                    )}
                  </View>
                  <View style={styles.nameBox}>
                    {data.type === `app` ? (
                      <Text style={{ fontSize: rf(1.8) }}>
                        {data.caller_name || UnknownText}
                      </Text>
                    ) : (
                      <Text style={{ fontSize: rf(1.8) }}>
                        {data.caller_name || UnknownText}
                      </Text>
                    )}
                    <View style={{ flexDirection: `row` }}>
                      <Text
                        appearance="hint"
                        style={{
                          fontSize: rf(1.5),
                          color:
                            data.callresult === 'No Answer'
                              ? `#EE0940`
                              : colors.grey,
                        }}
                        numberOfLines={1}
                      >
                        {data.type === `app`
                          ? data.member_num === '0'
                            ? data.caller_num
                            : data.member_num
                          : data.caller_num}
                      </Text>
                      {data.type === `app` ? (
                        <Text
                          appearance="hint"
                          style={{ fontSize: rf(1.5), paddingLeft: rw(1) }}
                          numberOfLines={1}
                        >
                          {data.member_num === '0'
                            ? 'to Not Assigned'
                            : `by  ${data.member_name} `}
                        </Text>
                      ) : (
                        <Text
                          appearance="hint"
                          style={{ fontSize: rf(1.5), paddingLeft: rw(1) }}
                          numberOfLines={1}
                        >
                          to{' '}
                          {data.member_num === '0'
                            ? 'Not Assigned'
                            : data.member_name || UnknownText}
                        </Text>
                      )}
                    </View>
                    <Text appearance="hint" style={{ fontSize: rf(1.5) }}>
                      {formatCallLogDate(data.enddatetime)}
                    </Text>
                  </View>
                </View>
                <View style={[styles.rightBox, styles.rightBox1]}>
                  <View style={[styles.leftBox, styles.leftBox1]}>
                    <Text appearance="hint">
                      {calculateTimeDifference(
                        data.startdatetime,
                        data.enddatetime,
                      )}
                    </Text>
                  </View>
                  <View style={[styles.rightBox, styles.rightBox2]}>
                    <TouchableOpacity activeOpacity={0.3} onPress={() => {}}>
                      {data.callresult === 'Answered' ? (
                        <AnsweredCallsIcon size={16} color={colors.grey} />
                      ) : data.callresult === 'Click-to-call' &&
                        data.callstatus === 'ANSWER' ? (
                        <AnsweredCallsIcon size={16} color={colors.grey} />
                      ) : /^cancel/i.test(data.callresult) ||
                        data.callresult === 'No Answer' ? (
                        <IconMissed size={16} color={colors.grey} />
                      ) : data.callresult === 'Voice Mail' ? (
                        <IconVoice size={16} color={colors.grey} />
                      ) : (
                        <TotalCallIcon size={rw(4)} color={colors.grey} />
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              <View style={styles.bottom}>
                <TouchableOpacity
                  style={styles.iconsButton}
                  onPress={() =>
                    copyFunc(
                      data.type === `app` ? data.member_num : data.caller_num,
                    )
                  }
                >
                  <CopyIconNew size={16} color={colors.grey}></CopyIconNew>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.iconsButton}
                  onPress={() =>
                    sendSmsCard(
                      data.type === `app` ? data.member_num : data.caller_num,
                      ``,
                    )
                  }
                >
                  <SmsIcon size={16} color={colors.grey}></SmsIcon>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.iconsButton}
                  onPress={() =>
                    modalUpdate({ ..._defaultModal, info: true }, data)
                  }
                >
                  <InfoIcon size={16} color={colors.grey}></InfoIcon>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => onSelect(data, true)}
                  style={styles.iconsButton}
                >
                  <EditIcon size={16} color={colors.grey}></EditIcon>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.iconsButton}
                  onPress={() => dialerOpen(data, role)}
                >
                  <CallPhone size={16} />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.swipeView}>
              <TextIcon size={16}></TextIcon>
              <Text style={styles.swipeText}>{SwipeText}</Text>
            </View>
          </View>
        </Layout>
        <Layout>
          <CallLogDetailCard
            index={index}
            bg={bg}
            data={data}
            callRouting={callRouting}
            modalUpdate={modalUpdate}
            dialerOpen={dialerOpen}
            customerName={
              data.type === `app` ? data.caller_name : data.caller_name
            }
          />
        </Layout>
      </ViewPager>
      <NoPermissionModal showDiler={showDiler} setShowDiler={setShowDiler} />
    </View>
  );
};
CallLogCard.propTypes = {
  data: PropTypes.shape({
    type: PropTypes.string,
    caller_num: PropTypes.string,
    callresult: PropTypes.string,
    callstatus: PropTypes.string,
    file: PropTypes.string,
    member_name: PropTypes.string,
    enddatetime: PropTypes.string,
    startdatetime: PropTypes.string,
    caller_name: PropTypes.string,
    member_num: PropTypes.string,
    created_at: PropTypes.string,
  }),
  index: PropTypes.number,
  getCustomerName: PropTypes.func,
  onSelect: PropTypes.func,
  modalUpdate: PropTypes.func,
  callRouting: PropTypes.func,
  dialerOpen: PropTypes.func,
  copyFunc: PropTypes.func,
  sendSmsCard: PropTypes.func,
};
const cirleDim = 45;

const styles = StyleSheet.create({
  bottom: {
    flexDirection: 'row',
    justifyContent: `space-between`,
    width: `90%`,
  },
  card1: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: rw(2),
  },
  circle: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: colors.white,
    borderRadius: cirleDim,
    elevation: 4,
    height: cirleDim,
    justifyContent: 'center',
    width: cirleDim,
  },
  container: { marginTop: 0, overflow: 'hidden' },
  iconsButton: {
    justifyContent: `center`,
  },
  layout1: {
    alignSelf: `center`,
    backgroundColor: colors.white,
    borderRadius: 10,
    elevation: 2,
    width: `98%`,
  },
  layout11: {
    alignItems: `center`,
    justifyContent: `center`,
  },
  layout1Text: { color: colors.white, fontSize: rf(1.8) },
  leftBox: { flexDirection: 'row', height: rh(7.5), width: '80%' },
  leftBox1: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingRight: 12,
  },
  nameBox: {
    height: rh(7),
    justifyContent: 'center',
    paddingLeft: rw(1.5),
    width: '80%',
  },
  rightBox: {
    alignItems: 'flex-end',
    flex: 1,
    height: rh(7),
    justifyContent: 'center',
    width: '20%',
  },
  rightBox1: { flexDirection: 'row' },
  rightBox2: { alignItems: 'center' },
  swipeText: { color: colors.swipe, fontSize: 11, paddingLeft: `2%` },
  swipeView: {
    alignItems: `center`,
    backgroundColor: colors.swipeBg,
    borderBottomEndRadius: 10,
    borderBottomLeftRadius: 10,
    flexDirection: `row`,
    marginTop: rh(0.7),
    paddingHorizontal: 12,
    paddingVertical: rh(1),
    width: '100%',
  },
});

export default CallLogCard;
