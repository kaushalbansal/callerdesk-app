/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react-native/no-color-literals */
/* eslint-disable react-native/no-inline-styles */
// DateFilterButtons.js

import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { dateFilterObject } from '../../common/redux/actions/common';
import { colors } from '../../themes/vars';
import { IconCalenderHome } from '../../common/icons/iconcalenderhome';
import { rf, rh, rw } from '../../common/helpers/dimentions';
import {
  defaultDate,
  previousWeekDateStr,
  todayDate,
  yDate,
} from '../../common/Constants';
import PropTypes from 'prop-types';
import { loadCallLogStatusSuccess } from '../../common/redux/actions/callLog';

const DateFilterButtons = ({
  setDateFilter,
  fromScreen = false,
  logFilter,
  reset,
  fromContact = false,
}) => {
  const dispatch = useDispatch();
  const { dateFilterObj } = useSelector((state) => state.global);

  const handlePress = (from, to, type) => {
    !fromScreen && dispatch(loadCallLogStatusSuccess({ logStatus: `total` }));
    if (!fromContact) {
      !reset
        ? dispatch(dateFilterObject({ from, to, type, log: logFilter }))
        : dispatch(dateFilterObject({ from, to, type }));
    } else {
      !reset
        ? dispatch(
            dateFilterObject({ from, to, type, contactFilter: logFilter }),
          )
        : dispatch(dateFilterObject({ from, to, type }));
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.today,
          {
            backgroundColor:
              dateFilterObj.type === 'today' ? '#333333' : 'white',
            borderColor:
              dateFilterObj.type === 'today' ? colors.white : colors.grey,
            borderWidth: dateFilterObj.type === 'today' ? 0 : 1,
          },
        ]}
        onPress={() => handlePress(todayDate, todayDate, 'today')}
      >
        <Text
          style={{
            color: dateFilterObj.type === 'today' ? colors.white : colors.black,
            fontSize: rf(1.5),
          }}
        >
          Today
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.yDay,
          {
            backgroundColor:
              dateFilterObj.type === 'yday' ? '#333333' : 'white',
            borderColor:
              dateFilterObj.type === 'yday' ? colors.white : colors.grey,
            borderWidth: dateFilterObj.type === 'yday' ? 0 : 1,
          },
        ]}
        onPress={() => handlePress(yDate, yDate, 'yday')}
      >
        <Text
          style={{
            color: dateFilterObj.type === 'yday' ? colors.white : colors.black,
            fontSize: rf(1.5),
          }}
        >
          Y'Day
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.lastsday,
          {
            backgroundColor:
              dateFilterObj.type === 'seven' ? '#333333' : 'white',
            borderColor:
              dateFilterObj.type === 'seven' ? colors.white : colors.grey,
            borderWidth: dateFilterObj.type === 'seven' ? 0 : 1,
          },
        ]}
        onPress={() => handlePress(previousWeekDateStr, todayDate, 'seven')}
      >
        <Text
          style={{
            color: dateFilterObj.type === 'seven' ? colors.white : colors.black,
            fontSize: rf(1.5),
          }}
        >
          7 Days
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.all,
          {
            backgroundColor: dateFilterObj.type === 'all' ? '#333333' : 'white',
            borderColor:
              dateFilterObj.type === 'all' ? colors.white : colors.grey,
            borderWidth: dateFilterObj.type === 'all' ? 0 : 1,
          },
        ]}
        onPress={() => handlePress(defaultDate, todayDate, 'all')}
      >
        <Text
          style={{
            color: dateFilterObj.type === 'all' ? colors.white : colors.black,
            fontSize: rf(1.5),
          }}
        >
          30 Days
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.calenderStyle}
        onPress={() => setDateFilter(true)}
      >
        <IconCalenderHome />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  all: {
    alignItems: 'center',
    backgroundColor: '#333333',
    borderRadius: 5,
    justifyContent: 'center',
    marginHorizontal: rh(0.75),
    width: rw(19),
  },
  calenderStyle: {
    alignItems: 'flex-start',
    borderColor: colors.grey,
    borderRadius: 5,
    marginHorizontal: rh(1),
    width: rw(30),
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: rw(2),
  },
  lastsday: {
    alignItems: 'center',
    backgroundColor: '#333333',
    borderRadius: 5,
    justifyContent: 'center',
    marginHorizontal: rh(0.75),
    width: rw(15),
  },
  today: {
    alignItems: 'center',
    backgroundColor: 'white',
    borderColor: colors.grey,
    borderRadius: 5,
    borderWidth: 1,
    justifyContent: 'center',
    marginLeft: rh(1),
    marginRight: rh(1),
    width: rw(16),
  },
  yDay: {
    alignItems: 'center',
    backgroundColor: 'white',
    borderColor: colors.grey,
    borderRadius: 5,
    borderWidth: 1,
    justifyContent: 'center',
    marginHorizontal: rh(0.75),
    width: rw(15),
  },
});

export default DateFilterButtons;
DateFilterButtons.propTypes = {
  from: PropTypes.bool,
  fromScreen: PropTypes.bool,
  reset: PropTypes.bool,
  fromContact: PropTypes.bool,
  setDateFilter: PropTypes.func,
  logFilter: PropTypes.object,
};
