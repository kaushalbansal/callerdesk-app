/* eslint-disable no-unused-expressions */
/* eslint-disable no-unused-vars */
/* eslint-disable react-native/no-raw-text */
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { IndexPath } from '@ui-kitten/components/devsupport';
import { Button, Text, Datepicker } from '@ui-kitten/components';
import { useSelector } from 'react-redux';

import { colors } from '../../themes/vars';
import { IconClose } from '../../common/icons/iconclose';
import { IconCalendar } from '../../common/icons/iconcalendar';
import {
  ContactfilterObj,
  FilterLabel,
  SubmitText,
} from '../../common/Constants';
import { filterMemberListForRole } from '../../common/helpers/utils';
import { rf, rh, rw } from '../../common/helpers/dimentions';
import PropTypes from 'prop-types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ModalBottom from '../../common/components/ModalBottom';

const HomeFilter = ({
  onFilterChange = () => {},
  visible = false,
  reset = false,
  onClose = () => {},
}) => {
  const selectText = '-Select-';
  // eslint-disable-next-line no-unused-vars
  const { user, dateFilterObj } = useSelector((state) => state?.global);
  const [filterVisible, setfilterVisible] = useState(visible);
  const [filters, setFilters] = useState({
    ...ContactfilterObj,
    status: { index: new IndexPath(0) },
    from: dateFilterObj.from,
    to: dateFilterObj.to,
  });
  // eslint-disable-next-line no-unused-vars
  const [userRole, setUserRole] = useState();
  // eslint-disable-next-line no-unused-vars
  const [role, setRole] = useState();
  const { memList } = useSelector((state) => state.callLog);
  // const ivrListData = [{ deskphone: selectText }, ...ivrList];
  const memListData = [
    { member_name: selectText, member_id: 0 },
    ...filterMemberListForRole(user, memList),
  ];
  const pageSizeList = [25, 50, 75, 100];
  const getRole = async () => {
    const ans = await AsyncStorage.getItem('user_role');
    const ansRole = await AsyncStorage.getItem('role');
    setUserRole(ans);
    setRole(ansRole);
  };

  useEffect(() => {
    getRole();
    setFilters({
      ...ContactfilterObj,
      status: { index: new IndexPath(0) },
      from: dateFilterObj.from,
      to: dateFilterObj.to,
    });
  }, [dateFilterObj]);
  // useEffect(() => {
  //   if (reset) {
  //     setFilters({
  //       ...ContactfilterObj,
  //       status: { index: new IndexPath(0) },
  //     });
  //   }
  // }, [reset]);
  const onSubmit = () => {
    const _filter = { ...filters };
    console.log(_filter);
    const memName = _filter.member
      ? memListData[_filter.member.row]?.member_name
      : undefined;

    _filter.pageSize = pageSizeList[_filter.pageSize];
    _filter.member = memName === selectText ? undefined : memName;
    onFilterChange(_filter);
    setfilterVisible(false);
  };

  return (
    <>
      <ModalBottom animationType="slide" onClose={onClose} open={visible}>
        <View style={styles.container}>
          <View style={styles.title}>
            <Text category="h5">{FilterLabel}</Text>
            <TouchableOpacity onPress={() => onClose()}>
              <View style={styles.close}>
                <IconClose />
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.content}>
            <Text style={[styles.label, { marginTop: rh(2) }]}>
              SELECT DATE RANGE
            </Text>
            <View style={styles.selectDate}>
              <Datepicker
                date={new Date(filters.from)}
                style={styles.datePick}
                accessoryRight={<IconCalendar />}
                placement={'top start'}
                onSelect={(date) => {
                  if (filters.to && date > filters.to) {
                    setFilters({ ...filters, from: date, to: date });
                  } else {
                    setFilters({ ...filters, from: date });
                  }
                }}
                max={new Date()}
              />
              <Datepicker
                date={new Date(filters.to)}
                style={styles.datePick}
                min={new Date(filters.from)}
                accessoryRight={<IconCalendar />}
                onSelect={(date) => setFilters({ ...filters, to: date })}
                placement={'top end'}
                max={new Date()}
              />
            </View>
            <Button
              onPress={onSubmit}
              style={{ marginTop: rh(4), width: rw(85) }}
            >
              {SubmitText}
            </Button>
          </View>
        </View>
      </ModalBottom>
    </>
  );
};

export default HomeFilter;

const styles = StyleSheet.create({
  close: {
    alignItems: 'center',
    borderRadius: rw(6),
    height: rw(6),
    justifyContent: 'center',
    marginRight: -8,
    width: rw(8),
  },
  container: {
    backgroundColor: colors.white,
    // padding: 20,
    width: rw(100),
  },
  content: {
    paddingVertical: rh(1),
  },
  datePick: { borderRadius: 8, width: rw(42) },
  label: {
    color: `#656565`,
    fontSize: rf(1.7),
    fontWeight: `700`,
    marginBottom: rh(0.7),
  },
  selectDate: {
    flexDirection: 'row',
    gap: 12,
    marginTop: rh(1),
  },
  title: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
HomeFilter.propTypes = {
  onFilterChange: PropTypes.func,
  onClose: PropTypes.func,
  visible: PropTypes.bool,
  reset: PropTypes.bool,
};
