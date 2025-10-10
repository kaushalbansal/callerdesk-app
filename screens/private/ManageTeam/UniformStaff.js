import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Dimensions,
  ScrollView,
} from 'react-native';
import { Text } from '@ui-kitten/components';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { colors } from '../../../themes/vars';
import CustomSwitch from '../../../common/components/switch';
import { IconProfile } from '../../../common/icons/iconprofile';
import { IconDrag } from '../../../common/icons/icondrag';
import { IconApp } from '../../../common/icons/callicon';
import { IconIncoming } from '../../../common/icons/iconincoming';
import { rh, rw } from '../../../common/helpers/dimentions';
import { MyView } from '../../../common/components/MyView';
import { UpdateMemberStatus } from '../../../common/redux/actions/callLog';
import { UniformHead } from '../../../common/Constants';
import CustomHeader from '../../../common/components/CustomHeader';

const UniformStaff = () => {
  const [data, setData] = useState([]);
  const { memList } = useSelector((state) => state.callLog);
  const { user } = useSelector((state) => state.global);
  const dispatch = useDispatch();

  const ph = rw(4.5);
  const deviceHeight = Dimensions.get('window').height;

  useEffect(() => {
    setData(memList);
  }, []);

  const onStatusChange = (member) => {
    dispatch(
      UpdateMemberStatus(
        user?.authcode,
        member.member_id,
        member.status === '1' ? '2' : '1',
      ),
    );
  };
  const RenderItem = ({ item, index, statusChange }) => {
    if (!item) return null;

    return (
      <View key={`${item.member_id}_${index}`}>
        <View style={styles.container1}>
          <View
            style={[
              styles.rlFlex,
              styles.card,
              {
                backgroundColor: index === 0 ? colors.blueBg : colors.lightGrey,
              },
            ]}
          >
            <View style={styles.lFlex}>
              <IconProfile
                color={index === 0 ? colors.white : colors.backdrop}
              />
              <View>
                <Text
                  style={{
                    color: index === 0 ? colors.white : colors.backdrop,
                  }}
                >
                  {item.member_name}
                </Text>
              </View>
            </View>
            <View style={styles.rFlex}>
              <View style={styles.badge}>
                <Text style={styles.extn}>Ext 10</Text>
              </View>
              <CustomSwitch
                checked={item.status === '1'}
                onChange={() => statusChange(item)}
              />
              <TouchableOpacity>
                <MyView p={rw(1)} pl={rw(1.5)} pr={rw(1.5)}>
                  <IconDrag />
                </MyView>
              </TouchableOpacity>
            </View>
          </View>
          <View
            style={[
              styles.vLine,
              // eslint-disable-next-line react-native/no-inline-styles
              {
                height: index === 0 ? 24 : 18,
                top: index === 0 ? -24 : -18,
              },
            ]}
          ></View>
        </View>
      </View>
    );
  };
  RenderItem.propTypes = {
    item: PropTypes.object,
    index: PropTypes.number,
    statusChange: PropTypes.func,
  };
  return (
    <View style={styles.container}>
      <CustomHeader title="Ring Order"></CustomHeader>
      <View style={styles.content}>
        <View style={[styles.flex, styles.flex2]}>
          <Text category="s1" appearance="hint" style={styles.head}>
            {UniformHead}.
          </Text>
        </View>
        <IconApp size={rw(6)} />
      </View>
      <View style={[styles.flex, styles.flex1]}>
        <View style={styles.circle}>
          <IconIncoming color={colors.white} />
        </View>
      </View>
      <ScrollView
        style={{
          paddingHorizontal: ph - 6,
          marginVertical: rh(1),
          height: deviceHeight,
        }}
      >
        {data &&
          data.map((item, i) => {
            return (
              <RenderItem
                item={item}
                index={i}
                key={i}
                statusChange={onStatusChange}
              />
            );
          })}
      </ScrollView>
      <View style={styles.line}></View>
    </View>
  );
};
export default UniformStaff;

const styles = StyleSheet.create({
  badge: {
    alignItems: 'center',
    backgroundColor: colors.warning,
    borderRadius: 5,
    paddingVertical: 2,
    width: 50,
  },
  card: {
    backgroundColor: colors.lightGrey,
    borderBottomColor: colors.redBorder,
    borderColor: colors.lightGrey,
    borderRadius: 8,
    borderWidth: 1,
    elevation: 5,
    marginBottom: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    // Drop shadow for iOS
    shadowColor: colors.grey,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.7,
    shadowRadius: 5,
    width: '100%',
  },
  circle: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: rh(4),
    elevation: 5,
    height: rh(4),
    justifyContent: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.7,
    shadowRadius: 5,
    width: rh(4),
  },
  container: {
    backgroundColor: colors.white,
    flex: 1,
    paddingVertical: 8,
  },
  container1: { alignItems: 'center', position: 'relative' },
  content: { alignItems: 'center', width: '100%' },
  extn: {
    color: colors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  flex: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  flex1: { marginBottom: rh(1), marginTop: rh(0.7), position: 'relative' },
  flex2: { alignItems: 'center', marginBottom: 16, width: '60%' },
  head: { textAlign: 'center' },
  lFlex: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  line: { minHeight: 24 },
  rFlex: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'flex-end',
  },
  rlFlex: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  vLine: {
    borderColor: colors.grey,
    borderLeftWidth: 1,
    borderStyle: 'dashed',
    height: 16,
    position: 'absolute',
    top: -16,
    width: 1,
  },
});
