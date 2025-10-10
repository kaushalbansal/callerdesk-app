import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from '@ui-kitten/components';
import { useSelector, useDispatch } from 'react-redux';
import DragList from 'react-native-draglist';

import { colors } from '../../../themes/vars';
import CustomSwitch from '../../../common/components/switch';
import { IconProfile } from '../../../common/icons/iconprofile';
import { IconDrag } from '../../../common/icons/icondrag';
import { IconApp } from '../../../common/icons/callicon';
import { IconIncoming } from '../../../common/icons/iconincoming';
import { rh, rw } from '../../../common/helpers/dimentions';
import { MyView } from '../../../common/components/MyView';
import { UpdateMemberStatus } from '../../../common/redux/actions/callLog';
import { RingOrderHead } from '../../../common/Constants';
import CustomHeader from '../../../common/components/CustomHeader';

const ManageOrder = () => {
  const [data, setData] = useState([]);
  const { memList } = useSelector((state) => state.callLog);
  const { user } = useSelector((state) => state.global);
  const dispatch = useDispatch();

  useEffect(() => {
    setData(memList);
  }, []);

  async function onReordered(fromIndex, toIndex) {
    const copy = [...data]; // Don't modify react data in-place
    const removed = copy.splice(fromIndex, 1);
    copy.splice(toIndex, 0, removed[0]); // Now insert at the new pos
    setData(copy);
  }

  const onStatusChange = (member) => {
    dispatch(
      UpdateMemberStatus(
        user?.authcode,
        member.member_id,
        member.status === '1' ? '2' : '1',
      ),
    );
  };

  function renderItem(info) {
    const { item, onDragStart, onDragEnd, index = 0 } = info;
    return (
      <View key={`${item.member_id}_${index}`}>
        <View style={styles.item}>
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
                onChange={() => onStatusChange(item)}
              />
              <TouchableOpacity onPressIn={onDragStart} onPressOut={onDragEnd}>
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
  }

  return (
    <View style={styles.container}>
      <CustomHeader title="Ring Order"></CustomHeader>
      <View style={styles.content}>
        <View style={[styles.flex, styles.flex2]}>
          <Text category="s1" appearance="hint" style={styles.text}>
            {RingOrderHead}
          </Text>
        </View>
        <IconApp size={rw(6)} />
      </View>
      <View style={[styles.flex, styles.flex1]}>
        <View style={styles.circle}>
          <IconIncoming color={colors.white} />
        </View>
      </View>
      {/* <ScrollView style={{ paddingHorizontal: ph - 6, marginVertical: rh(1), height: deviceHeight }}> */}
      <View style={styles.drag}>
        <DragList
          data={data}
          keyExtractor={(item) => item.member_id}
          onReordered={onReordered}
          renderItem={renderItem}
        />
      </View>
      {/* </ScrollView> */}
      <View style={styles.end}></View>
    </View>
  );
};
export default ManageOrder;

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

    // Drop shadow for iOS
  },
  container: {
    backgroundColor: colors.white,
    flex: 1,
    paddingVertical: 8,
  },
  content: { alignItems: 'center', width: '100%' },
  drag: { height: '90%', padding: 16 },
  end: { minHeight: 24 },
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
  item: { alignItems: 'center', position: 'relative' },
  lFlex: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
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
  text: { textAlign: 'center' },
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
