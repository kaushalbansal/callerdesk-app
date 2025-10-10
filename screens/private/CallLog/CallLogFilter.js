/* eslint-disable react-native/no-raw-text */
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Modal,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { TouchableWithoutFeedback } from '@ui-kitten/components/devsupport';
import {
  Button,
  IndexPath,
  Select,
  SelectItem,
  RadioGroup,
  Radio,
  Text,
} from '@ui-kitten/components';
import { useSelector } from 'react-redux';

import { IconFilter } from '../../../common/icons/filter';
import { colors } from '../../../themes/vars';
import { IconClose } from '../../../common/icons/iconclose';
import {
  filterObj,
  initCallResult,
  initStatus,
} from '../../../common/Constants';
import { filterMemberListForRole } from '../../../common/helpers/utils';
import { rf, rh, rw } from '../../../common/helpers/dimentions';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PropTypes from 'prop-types';

const CallLogFilter = ({ onFilterChange, from, reset }) => {
  const selectText = '-Select-';
  const [filterVisible, setfilterVisible] = useState(false);
  const { ivrList, memList } = useSelector((state) => state.callLog);
  const { user, dateFilterObj } = useSelector((state) => state?.global);
  const [filters, setFilters] = useState({
    ...filterObj,
    from: dateFilterObj.from,
    to: dateFilterObj.to,
  });
  let ivrListData = [{ deskphone: selectText }, ...ivrList];
  let memListData = [
    { member_name: selectText, member_id: 0 },
    ...filterMemberListForRole(user, memList),
  ];
  const pageSizeList = [25, 50, 75, 100];
  // eslint-disable-next-line no-unused-vars
  const [userRole, setUserRole] = useState();
  const [role, setRole] = useState();
  const getRole = async () => {
    const ans = await AsyncStorage.getItem('user_role');
    const ansRole = await AsyncStorage.getItem('role');
    setUserRole(ans);
    setRole(ansRole);
  };

  useEffect(() => {
    getRole();
  }, []);
  useEffect(() => {
    setFilters({
      ...filters,
      callstatus: [...initStatus[from]],
      callresult: initCallResult[from],
      ivr: new IndexPath(0),
      member: new IndexPath(0),
    });
  }, []);
  useEffect(() => {
    setFilters({
      ...filters,
      status: { index: new IndexPath(0) },
      from: dateFilterObj.from,
      to: dateFilterObj.to,
    });
  }, [dateFilterObj]);
  useEffect(() => {
    if (reset) {
      setFilters({
        ...filterObj,
        from: dateFilterObj.from,
        to: dateFilterObj.to,
      });
      ivrListData = [{ deskphone: selectText }, ...ivrList];
      memListData = [
        { member_name: selectText, member_id: 0 },
        ...filterMemberListForRole(user, memList),
      ];
    }
  }, [reset]);
  const onSubmit = () => {
    const _filter = { ...filters };

    const deskphn = ivrListData[_filter?.ivr?.row]?.deskphone;
    const memNum = memListData[_filter?.member?.row]?.member_num;
    _filter.from = moment(_filter.from, 'YYYY-M-D');
    _filter.to = moment(_filter.to, 'YYYY-M-D');
    _filter.pageSize = pageSizeList[_filter.pageSize]
      ? pageSizeList[_filter.pageSize]
      : filterObj.pageSize;
    _filter.ivr = deskphn === selectText ? undefined : deskphn;
    _filter.member =
      memNum === selectText ? undefined : memNum?.replace(/^0+/, '');

    onFilterChange(_filter);
    setfilterVisible(false);
  };

  return (
    <>
      <TouchableWithoutFeedback
        onPress={() => setfilterVisible(true)}
        style={styles.container1}
      >
        <IconFilter color={colors.primary} />
      </TouchableWithoutFeedback>

      <Modal
        animationType="slide"
        onRequestClose={() => setfilterVisible(false)}
        transparent={true}
        visible={filterVisible}
      >
        <View style={styles.backdrop}>
          <View
            style={[
              styles.container,
              // eslint-disable-next-line react-native/no-inline-styles, eqeqeq
              { height: from == 'total' ? '100%' : '65%' },
            ]}
          >
            <View style={styles.title}>
              <Text category="h5">Filter</Text>
              <TouchableOpacity onPress={() => setfilterVisible(false)}>
                <IconClose />
              </TouchableOpacity>
            </View>
            <View style={styles.content}>
              <ScrollView style={styles.content}>
                <View style={styles.dateView}>
                  <View style={styles.dateView1}>
                    {/* <Text style={styles.label}>SELECT DATE RANGE</Text> */}
                    {/* <View style={styles.dateView2}>
                      <Datepicker
                        date={new Date(filters.from)}
                        style={styles.datePick}
                        accessoryRight={<IconCalendar />}
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
                        onSelect={(date) =>
                          setFilters({ ...filters, to: date })
                        }
                        placement={`bottom end`}
                        max={new Date()}
                      />
                    </View> */}
                    <View style={{ marginVertical: rh(1) }}>
                      <Text style={styles.label}>RANGE</Text>
                      <RadioGroup
                        selectedIndex={filters.pageSize}
                        onChange={(index) =>
                          setFilters({ ...filters, pageSize: index })
                        }
                        style={styles.radio}
                      >
                        <Radio>25</Radio>
                        <Radio>50</Radio>
                        <Radio>75</Radio>
                        <Radio>100</Radio>
                      </RadioGroup>
                    </View>
                    <View style={{ marginVertical: rh(1) }}>
                      <Text style={styles.label}>DESKPHONE</Text>
                      <Select
                        style={styles.select}
                        selectedIndex={filters.ivr}
                        value={ivrListData[filters.ivr - 1]?.deskphone || ''}
                        onSelect={(index) => {
                          setFilters({ ...filters, ivr: index });
                        }}
                      >
                        {ivrListData.map((item) => {
                          return (
                            <SelectItem
                              key={item.deskphone}
                              title={item.deskphone}
                            />
                          );
                        })}
                      </Select>
                    </View>
                    <View style={{ marginVertical: rh(1) }}>
                      <Text style={styles.label}>MEMBER</Text>
                      <Select
                        style={styles.select}
                        disabled={role === `3`}
                        selectedIndex={filters.member}
                        value={
                          memListData[filters.member - 1]?.member_name || ''
                        }
                        onSelect={(index) =>
                          setFilters({ ...filters, member: index })
                        }
                      >
                        {memListData.map((item) => {
                          return (
                            <SelectItem
                              key={item.member_id}
                              title={item.member_name}
                            />
                          );
                        })}
                      </Select>
                    </View>
                  </View>
                </View>
                <Button onPress={onSubmit} style={{ marginTop: rh(3) }}>
                  SUBMIT
                </Button>
              </ScrollView>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default CallLogFilter;

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: colors.backdrop,
    flex: 1,
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: colors.white,
    height: '70%',
    padding: 20,
    // borderTopLeftRadius: 10,
    // borderTopRightRadius: 10,
  },
  container1: { bottom: rh(2), position: 'absolute', right: rw(5), zIndex: 1 },
  content: {
    flex: 1,
    paddingVertical: 16,
  },
  dateView: { display: 'flex', flex: 1 },
  dateView1: { flex: 1 },
  label: {
    color: `#656565`,
    fontSize: rf(1.7),
    fontWeight: `700`,
    marginBottom: rh(0.7),
  },
  radio: { flexDirection: 'row' },
  select: { marginTop: 6 },
  title: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
CallLogFilter.propTypes = {
  onFilterChange: PropTypes.func,
  from: PropTypes.string,
  reset: PropTypes.bool,
};
