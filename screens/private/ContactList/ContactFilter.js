/* eslint-disable react-native/no-raw-text */
import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Modal,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {
  IndexPath,
  TouchableWithoutFeedback,
} from '@ui-kitten/components/devsupport';
import {
  Button,
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
  ContactfilterObj,
  FilterLabel,
  MEMBERLabel,
  RangeLabel,
  SubmitText,
} from '../../../common/Constants';
import { filterMemberListForRole } from '../../../common/helpers/utils';
import CallStatusSelect from '../../../common/components/CustomSelect/CallStatusSelect';
import { rf, rh, rw } from '../../../common/helpers/dimentions';
import PropTypes from 'prop-types';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ContactFilter = ({ onFilterChange = () => {}, reset = false }) => {
  const selectText = '-Select-';
  const rowGap = rh(1);
  const [filterVisible, setfilterVisible] = useState(false);
  const { user, dateFilterObj } = useSelector((state) => state?.global);
  const [filters, setFilters] = useState({
    ...ContactfilterObj,
    status: { index: new IndexPath(0) },
    from: dateFilterObj.from,
    to: dateFilterObj.to,
  });
  // eslint-disable-next-line no-unused-vars
  const [userRole, setUserRole] = useState();
  const [role, setRole] = useState();
  const { memList } = useSelector((state) => state.callLog);
  // const ivrListData = [{ deskphone: selectText }, ...ivrList];
  let memListData = [
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
    setFilters({
      ...filters,
      status: { index: new IndexPath(0) },
      from: dateFilterObj.from,
      to: dateFilterObj.to,
    });
  }, [dateFilterObj]);
  useEffect(() => {
    getRole();
  }, []);
  useEffect(() => {
    if (reset) {
      setFilters({
        ...ContactfilterObj,
        status: { index: new IndexPath(0) },
        from: dateFilterObj.from,
        to: dateFilterObj.to,
      });
      memListData = [
        { member_name: selectText, member_id: 0 },
        ...filterMemberListForRole(user, memList),
      ];
    }
    console.log(`reset???`, reset);
  }, [reset]);
  const onSubmit = () => {
    const _filter = { ...filters };
    // const deskphn = _filter.ivr ? ivrListData[_filter.ivr.row]?.deskphone : undefined;
    const memName = _filter.member
      ? memListData[_filter.member.row]?.member_name
      : undefined;

    _filter.pageSize = pageSizeList[_filter.pageSize];
    // _filter.ivr = deskphn == selectText ? undefined : deskphn;
    _filter.member = memName === selectText ? undefined : memName;

    onFilterChange(_filter);
    setfilterVisible(false);
  };

  return (
    <>
      <TouchableWithoutFeedback
        onPress={() => setfilterVisible(true)}
        style={styles.filter}
      >
        <IconFilter color={colors.primary} size={60} />
      </TouchableWithoutFeedback>

      <Modal
        animationType="slide"
        onRequestClose={() => setfilterVisible(false)}
        transparent={true}
        visible={filterVisible}
      >
        <View style={styles.backdrop}>
          <View style={styles.container}>
            <View style={styles.title}>
              <Text category="h5">{FilterLabel}</Text>
              <TouchableOpacity onPress={() => setfilterVisible(false)}>
                <View style={styles.close}>
                  <IconClose />
                </View>
              </TouchableOpacity>
            </View>
            <View style={styles.content}>
              <ScrollView style={styles.content}>
                {/* <Text style={[styles.label, { marginTop: rh(2) }]}>
                  SELECT DATE RANGE
                </Text>
                <View style={styles.selectDate}>
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
                    onSelect={(date) => setFilters({ ...filters, to: date })}
                    placement={`bottom end`}
                    max={new Date()}
                  />
                </View> */}
                <View style={{ marginVertical: rowGap }}>
                  <Text style={styles.label}>{RangeLabel}</Text>
                  <RadioGroup
                    selectedIndex={filters.pageSize}
                    onChange={(index) => {
                      setFilters({ ...filters, pageSize: index });
                    }}
                    style={styles.radio}
                  >
                    <Radio>25</Radio>
                    <Radio>50</Radio>
                    <Radio>75</Radio>
                    <Radio>100</Radio>
                  </RadioGroup>
                </View>
                <View style={{ marginVertical: rowGap }}>
                  <Text style={styles.label}>{MEMBERLabel}</Text>
                  <Select
                    style={styles.select1}
                    disabled={role === `3`}
                    selectedIndex={filters.member}
                    value={memListData[filters.member - 1]?.member_name || ''}
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
                <View style={{ marginTop: rowGap }}>
                  <Text style={[styles.label, styles.label1]}>STATUS</Text>
                  <CallStatusSelect
                    selectedIndex={filters.status.index}
                    onChange={(val, _i) => {
                      setFilters({ ...filters, status: { ...val, index: _i } });
                    }}
                  />
                </View>
                <Button onPress={onSubmit} style={{ marginTop: rh(4) }}>
                  {SubmitText}
                </Button>
              </ScrollView>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default ContactFilter;

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: colors.backdrop,
    height: rh(100),
    justifyContent: `center`,
    width: rw(100),
  },
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
    height: rh(100),
    padding: 20,
    width: rw(100),
  },
  content: {
    flex: 1,
    paddingVertical: rh(1),
  },
  filter: {
    bottom: 0,
    elevation: 100,
    left: rw(5),
    marginBottom: rh(1.8),
    marginRight: rw(5),
    position: 'absolute',
    zIndex: 999,
  },
  label: {
    color: `#656565`,
    fontSize: rf(1.7),
    fontWeight: `700`,
    marginBottom: rh(0.7),
  },
  label1: { marginBottom: 6 },
  radio: { flexDirection: 'row' },
  select1: { marginTop: 6 },
  title: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
ContactFilter.propTypes = {
  onFilterChange: PropTypes.func,
  reset: PropTypes.bool,
};
