/* eslint-disable react/prop-types */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react-native/no-color-literals */
/* eslint-disable react-native/no-inline-styles */
// DateFilterButtons.js

import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { dateFilterObject } from '../../common/redux/actions/common';
import { colors } from '../../themes/vars';
import { rf, rh, rw } from '../../common/helpers/dimentions';
import PropTypes from 'prop-types';
import { loadCallLogStatusSuccess } from '../../common/redux/actions/callLog';
import { TotalCallIcon } from '../../common/icons/totalcallicon';
import { AnsweredCallsIcon } from '../../common/icons/answeredcallsicon';
import { IconMissed } from '../../common/icons/iconmissedcall';
import { IconVoice } from '../../common/icons/iconvoice';

const CallStatusFilterButton = ({
  setDateFilter,
  fromScreen = false,
  logFilter,
  reset,
}) => {
  const dispatch = useDispatch();
  const { dateFilterObj } = useSelector((state) => state.global);
  const { logStatus } = useSelector((state) => state.callLog);

  const handleFilterPress = (callstatus, callresult) => {
    dispatch(loadCallLogStatusSuccess({ logStatus: callresult }));
    !reset
      ? dispatch(
          dateFilterObject({
            ...dateFilterObj,
            from: dateFilterObj?.from,
            to: dateFilterObj?.to,
            log: logFilter,
            callresult,
            callstatus: callresult,
          }),
        )
      : dispatch(
          dateFilterObject({
            ...dateFilterObj,
            from: dateFilterObj?.from,
            to: dateFilterObj?.to,
          }),
        );
  };

  return (
    <View style={styles.row}>
      <TouchableOpacity
        style={[
          styles.activeStyle,
          // eslint-disable-next-line react-native/no-color-literals, react-native/no-inline-styles
          {
            borderBottomWidth: logStatus === `total` ? 2 : 0,
            borderBottomColor:
              logStatus === `total` ? 'rgba(238, 9, 64, 1)' : 'black',
          },
        ]}
        onPress={() => handleFilterPress(`total`, `total`)}
      >
        <TotalCallIcon size={rw(10)} color={colors.grey} />
        <Text style={styles.activeText}>Total Calls</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.activeStyle,
          // eslint-disable-next-line react-native/no-inline-styles, react-native/no-color-literals
          {
            borderBottomWidth: logStatus === 'answered' ? 2 : 0,
            borderBottomColor:
              logStatus === 'answered' ? 'rgba(238, 9, 64, 1)' : 'black',
          },
        ]}
        onPress={() => handleFilterPress('answered', 'answered')}
      >
        <AnsweredCallsIcon size={rw(10)} color={colors.green} />
        <Text style={styles.activeText}>Answered</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.activeStyle,
          // eslint-disable-next-line react-native/no-inline-styles, react-native/no-color-literals
          {
            borderBottomWidth: logStatus === 'missed' ? 2 : 0,
            borderBottomColor:
              logStatus === 'missed' ? 'rgba(238, 9, 64, 1)' : 'black',
          },
        ]}
        onPress={() => handleFilterPress('No Answer', 'missed')}
      >
        <IconMissed size={rw(10)} />
        <Text style={styles.activeText}>Missed</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.activeStyle,
          // eslint-disable-next-line react-native/no-inline-styles, react-native/no-color-literals
          {
            borderBottomWidth: logStatus === 'voice' ? 2 : 0,
            borderBottomColor:
              logStatus === 'voice' ? 'rgba(238, 9, 64, 1)' : 'black',
          },
        ]}
        onPress={() => handleFilterPress('voice', 'voice')}
      >
        <IconVoice size={rw(10)} />
        <Text style={styles.activeText}>Voice</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  activeStyle: {
    alignContent: `center`,
    alignItems: `center`,
    justifyContent: `center`,
    paddingBottom: rh(1),
    width: rw(25),
  },
  activeText: {
    color: colors.black,
    fontSize: rf(1.2),
    fontWeight: `600`,
    paddingTop: rh(1),
    textAlign: `center`,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // marginBottom: rh(1),
  },
});

export default CallStatusFilterButton;
CallStatusFilterButton.propTypes = {
  from: PropTypes.bool,
  setDateFilter: PropTypes.func,
  logFilter: PropTypes.object,
};
