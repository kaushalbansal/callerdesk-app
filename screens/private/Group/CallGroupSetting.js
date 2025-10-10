/* eslint-disable no-unused-vars */
/* eslint-disable camelcase */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableHighlight,
  TouchableOpacity,
  View,
  Text,
  Image,
} from 'react-native';
import { colors } from '../../../themes/vars';
import { rf, rh, rw } from '../../../common/helpers/dimentions';
import { IconRouting } from '../../../common/icons/iconrouting';
import { IconCallMutliSticky } from '../../../common/icons/iconcallmutlisticky';
import { useNavigation } from '@react-navigation/native';
import { UserAvatar } from '../../../common/icons/useravatar';
import {
  AddGroupMembersHead,
  DeleteAlertHead,
  DeleteLabel,
  EditCallGroupLabel,
  GroupDetailsLabel,
  MembersLabel,
  MultiStickyLabel,
  NoMembersLabel,
  RouteStrategyLabel,
  StickyLabel,
  StrategyLabel,
  TimeSchLabel,
  TimeSchSettingLabel,
  UpdateMultiStickyLabel,
  UpdateStickyLabel,
  UpdateStrategyLabel,
} from '../../../common/Constants';
import CustomHeader from '../../../common/components/CustomHeader';
import ModalBottom from '../../../common/components/ModalBottom';
import AddMember from './AddMember';
import TimeSchedule from './TimeSchedule';
import UpdateStrategy from './UpdateStrategy';
import UpdateSticky from './UpdateSticky';
import UpdateMultiSticky from './UpdateMultiSticky';
import { IconPlusCircle } from '../../../common/icons/iconplusround';
// import Swipeout from 'react-native-swipeout';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { IconProfileNew } from '../../../common/icons/iconprofilenew';
import { IconMultiDots } from '../../../common/icons/iconmultidots';
import { IconHistory } from '../../../common/icons/iconhistory';
import { IconStickyMember } from '../../../common/icons/iconstickymember';
import { IconDelete1 } from '../../../common/icons/icondelete1';
import { useDispatch, useSelector } from 'react-redux';
import {
  deleteUserCallGroup,
  getCallGroupDetail,
  updateCallGroup,
} from '../../../common/redux/actions/contact';
import { EditIcon } from '../../../common/icons/editiconnew';
import TextInputWithIcon from '../../../common/components/textinputwithicon';
import { Select, SelectItem, IndexPath } from '@ui-kitten/components';
import { IconArrowDown } from '../../../common/icons/iconarrowdown';
import { toastShow } from '../../../common/helpers/utils';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
const CallGroupSetting = () => {
  const navigation = useNavigation();
  const deleteNote = useCallback(() => {
    setOpenDeleteMember(true);
  }, []);
  const viewNote = useCallback(() => {
    // Your viewNote logic here
  }, []);

  const [openAddMember, setOpenAddMember] = useState(false);
  const [openDeleteMember, setOpenDeleteMember] = useState(false);
  const [openTimeSch, setOpenTimeSch] = useState(false);
  const [openStrategy, setOpenStrategy] = useState(false);
  const [radius, setRadius] = useState(6);
  const [openSticky, setOpenSticky] = useState(false);
  const [group_user_live, setGroupUserLive] = useState([]);
  const [group_user_nonlive, setGroupUserNonLive] = useState([]);
  const [deleteData, setDeleteData] = useState({});
  const [openMultiSticky, setOpenMultiSticky] = useState(false);
  const { user, loading } = useSelector((state) => state.global);
  const group = useSelector((state) => state.group);
  const dispatch = useDispatch();
  const [modalView, setModalView] = useState(false);
  const [groupName, setGroupName] = useState(group.group_name);
  const [groupOwnerName, setGroupOwnerName] = useState();
  const [deskphone, setDeskphone] = useState(``);
  const [memberNo, setMemberNo] = useState(``);
  const [callGroupData] = useState(``);
  const [memberID, setMemberID] = useState(``);
  const [groupMemberID, setGroupMemberID] = useState(``);
  const [selectedIndex, setSelectedIndex] = useState(new IndexPath(0));
  const [selectedIndexGroupOwner, setSelectedIndexGroupOwner] = useState(
    new IndexPath(0),
  );
  const rowRefs = useRef(new Map());
  const { ivrList, memList } = useSelector((state) => state.callLog);
  const swipeBtns = [
    {
      component: (
        <View style={styles.swipeBtnsStyle}>
          <IconDelete1 size={25} />
        </View>
      ),
      backgroundColor: 'white',
      underlayColor: 'transparent',
      onPress: deleteNote,
    },
  ];
  const renderSwipeRightAction=(key, user, index)=>{
    return (
      <TouchableOpacity onPress={()=>onDeletePress(key, user, index)} >
         <View style={styles.swipeBtnsStyle}>
          <IconDelete1 size={rf(2.8)} />
        </View>
      </TouchableOpacity>
    )
  }
  // helper: close all rows except current
const closeOtherRows = (currentKey) => {
  try {
    rowRefs.current.forEach((r, k) => {
      if (k !== currentKey && r && typeof r.close === 'function') {
        try { r.close(); } catch (e) {}
      }
    });
  } catch (e) {
    // ignore
  }
};

const closeRow=(key)=>{
  try{
    const r=rowRefs.current.get(key)
    if(r && typeof r.close=== "function"){
      r.close()
    }
  }catch(e){}
}

// open delete modal and close the swiped row immediately
const onDeletePress = (key, user, index) => {
  // close the row immediately for good UX
  // const r = rowRefs.current.get(key);
  // if (r && typeof r.close === 'function') {
  //   try { r.close(); } catch (e) {}
  // }

  // set the data and open the modal
  setDeleteData({ user, index });
  setOpenDeleteMember(true);
};

// cleanup map on unmount
useEffect(() => {
  return () => {
    try { rowRefs.current.clear(); } catch (e) {}
  };
}, []);

  const modalCloseData = () => {
    setModalView(false);
    clearDataCard();
  };
  const clearDataCard = () => {
    setModalView(false);
  };
  useEffect(() => {
    getCallGroupDetail(user?.authcode, group.group_id).then((res) => {
      setGroupUserLive(res.group_user_live);
      setGroupUserNonLive(res.group_user_nonlive);
    });
  }, [group]);
  const groupUpdateApi = (objParams) => {
    const nav = {
      navigation,
      edit_group: ``,
    };
    dispatch(updateCallGroup(user?.authcode, objParams, nav));
    setOpenAddMember(false);
    setOpenDeleteMember(false);
    setOpenTimeSch(false);
    setOpenStrategy(false);
    setOpenSticky(false);
    setOpenMultiSticky(false);
  };
  const deleteFunc = () => {
    closeRow(deleteData.index)
    const obj = {
      id: deleteData.user.group_member_id,
    };
    dispatch(deleteUserCallGroup(user?.authcode, obj)).then((res) => {
      if (res.type === 'success') {
        group_user_live.splice(deleteData.index, 1);
        setDeleteData({});
        setOpenDeleteMember(false);
      }
      getCallGroupDetail(user?.authcode, group.group_id).then((res) => {
        setGroupUserLive(res.group_user_live);
        setGroupUserNonLive(res.group_user_nonlive);
      });
    });
  };
  const submitEditApi = () => {
    if (!user?.authcode) {
      toastShow('User authentication code is required!');
      return;
    }
    if (!groupName) {
      toastShow('Group name is required!');
      return;
    }
    setModalView(false);
    const obj = {
      ...group,
      group_name: groupName,
      deskphone_id: deskphone,
      group_owner_name: groupOwnerName,
      member_id: memberID,
      group_owner_id: groupMemberID,
    };
    groupUpdateApi(obj);
    clearDataCard();
  };
  const insets=useSafeAreaInsets()
   const filteredMemList=memList.filter(
  item => item.access === `1` || item.access === `3`
);
  return (
    <>
      {loading && (
        <View style={styles.imageStyle}>
          <Image
            source={require(`../../../assets/loaderimage.gif`)}
            style={{ width: rw(50), height: rh(10) }}
            resizeMode="contain"
          ></Image>
        </View>
      )}
      <ScrollView style={styles.container}>
        <CustomHeader
          title="Group Details"
          right={
            <TouchableOpacity
              onPress={() => {
                setModalView(true);
              }}
            >
              <EditIcon color={colors.grey} />
            </TouchableOpacity>
          }
        ></CustomHeader>
        <ModalBottom
        // Edit group screen detail modal
          title={EditCallGroupLabel}
          isInsetPadding={true}
          open={modalView}
          onClose={clearDataCard}
        >
          <TextInputWithIcon
            placeholder={callGroupData.group_name}
            from={`contact`}
            value={groupName}
            onChangeText={(text) => {
              setGroupName(text);
            }}
          ></TextInputWithIcon>
          <View style={{ marginVertical: rh(1) }}>
            <Select
              // disabled={true}
              accessoryRight={<IconArrowDown size={14} />}
              placeholder={callGroupData.deskphone_id}
              // selectedIndex={selectedIndex}
              value={
                deskphone
                  ? ivrList[selectedIndex.row].deskphone
                  : group.desk_phone
              }
              onSelect={(index) => {
                setSelectedIndex(index);
                const selectedItem = ivrList[index.row];
                setDeskphone(selectedItem.did_id);
              }}
            >
              {ivrList.map((item, index) => (
                <SelectItem
                  key={index}
                  title={() => (
                    <View style={styles.itemDeskphoneStyle}>
                      <Text>{item.deskphone}</Text>
                    </View>
                  )}
                />
              ))}
            </Select>
          </View>
          <View style={{ marginVertical: rh(0.5), paddingBottom: insets.bottom }}>
            <Select
              // disabled={true}
              accessoryRight={<IconArrowDown size={14} />}
              placeholder={group.group_owner_name || `Unknown`}
              value={
                memberNo
                  ? memList.filter(
                      (item) => item.access === `1` || item.access === `3`,
                    )[selectedIndexGroupOwner.row].member_name
                  : group.group_owner_name
              }
              onSelect={(index) => {
                setSelectedIndexGroupOwner(index);
                const selectedItem = memList.filter(
                  (item) => item.access === `1` || item.access === `3`,
                )[index.row];
                setMemberNo(selectedItem.member_num);
                setGroupMemberID(selectedItem.member_id);
                setGroupOwnerName(selectedItem.member_name);
              }}
            >
              {filteredMemList.map((item, index) => (
                  <SelectItem
                  style={filteredMemList.length===4 ?{paddingBottom: insets.bottom}: undefined}
                    key={index}
                    title={() => (
                      <View style={styles.memberNameStyle1}>
                        <Text>{item.member_name}</Text>
                      </View>
                    )}
                  />
                ))}
            </Select>
          </View>
          <View
            style={{
              flexDirection: `row`,
              marginTop: rh(2),
              marginBottom: rh(1),
            }}
          >
            <TouchableOpacity
              style={styles.cancelBtnStyle}
              onPress={modalCloseData}
            >
              <Text style={{ fontSize: rf(2), color: colors.primary }}>
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={submitEditApi}
              style={styles.submitBtnStyle}
            >
              <Text style={{ fontSize: rf(2), color: colors.white }}>
                Submit
              </Text>
            </TouchableOpacity>
          </View>
        </ModalBottom>
        <View style={{ alignItems: `center` }}>
          <UserAvatar></UserAvatar>
          <Text style={styles.layoutText}>{group.group_name}</Text>
          {group.group_extn && (
            <Text style={styles.layout} appearance="hint" status="danger">
              Group ext. {group.group_extn}
            </Text>
          )}
        </View>
        <View>
          <View style={styles.container1}>
            <Pressable
              onPress={() => setOpenTimeSch(true)}
              style={[
                styles.layout4,
                {
                  borderColor: `rgba(85, 160, 111, 0.33)`,
                  backgroundColor: `rgba(85, 160, 111, 0.2)`,
                },
              ]}
            >
              <View style={styles.layout2}>
                <IconHistory color={`#55A06F`} />
                <Text style={styles.layout3}>{TimeSchLabel}</Text>
              </View>
            </Pressable>
            <Pressable
              onPress={() => setOpenStrategy(true)}
              style={[
                styles.layout5,
                { borderColor: `#8A8CFA33`, backgroundColor: `#8A8CFA20` },
              ]}
            >
              <View style={styles.layout2}>
                <IconRouting color={colors.blueBg} />
                <Text style={styles.container2}>{StrategyLabel}</Text>
              </View>
            </Pressable>
          </View>
          <View style={styles.container3}>
            <Pressable
              onPress={() => setOpenSticky(true)}
              style={[
                styles.layout4,
                { borderColor: `#F09E5433`, backgroundColor: `#F09E5420` },
              ]}
            >
              <View style={styles.layout6}>
                <IconStickyMember />
                <Text style={styles.sticky}>{StickyLabel}</Text>
              </View>
            </Pressable>
            <Pressable
              onPress={() => setOpenMultiSticky(true)}
              style={[
                styles.layout5,
                { borderColor: `#CA82FD33`, backgroundColor: `#CA82FD20` },
              ]}
            >
              <View style={styles.layout6}>
                <IconCallMutliSticky color={colors.multistickyCard} />
                <Text style={styles.multi}>{MultiStickyLabel}</Text>
              </View>
            </Pressable>
          </View>

          <View>
            <View style={styles.group}>
              <Text style={styles.groupText}>{GroupDetailsLabel}</Text>
              <View
                style={{
                  alignItems: `center`,
                  marginHorizontal: rw(5),
                }}
              ></View>
            </View>
            <View style={styles.group1}>
              <View>
                <Text
                  style={{
                    color: `#656565`,
                    fontWeight: `400`,
                    fontFamily: `Epilogue`,
                  }}
                >
                  {NoMembersLabel}
                </Text>
                <Text
                  style={{
                    color: colors.black,
                    fontWeight: `400`,
                    fontFamily: `Epilogue`,
                  }}
                >
                  {group_user_live.length}
                </Text>
              </View>
              <View>
                <Text
                  style={{
                    color: `#656565`,
                    fontWeight: `400`,
                    fontFamily: `Epilogue`,
                  }}
                >
                  {RouteStrategyLabel}
                </Text>
                <Text
                  style={{
                    color: colors.black,
                    fontWeight: `400`,
                    fontFamily: `Epilogue`,
                  }}
                >
                  {group.call_strategy === `1`
                    ? `ROUND ROBIN`
                    : group.call_strategy === `2`
                      ? `SEQUENTIAL`
                      : group.call_strategy === `3`
                        ? `RANDOM`
                        : group.call_strategy === `4`
                          ? `Least Occupied`
                          : group.call_strategy === `5`
                            ? `Parallel`
                            : group.call_strategy === `6`
                              ? `Least Idle`
                              : `Not assigned`}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.cardHead}>
            <View style={styles.card}>
              <Text style={styles.groupText}>{MembersLabel}</Text>
            </View>
            {group_user_live.map((user, index) => (
              <Swipeable
                key={index}
                ref={(ref)=>{
                  if(ref) rowRefs.current.set(index, ref)
                    else rowRefs.current.delete(index)
                }}
                renderRightActions={()=>renderSwipeRightAction(index, user, index)}
                autoClose={true}
                backgroundColor="transparent"
                containerStyle={{ width: rw(95), alignSelf: `center`, marginTop: rh(1)}}
                onSwipeableWillOpen={() => {
                  // console.log('this on open')
                  closeOtherRows(index)
                  // setRadius(2);
                  // setDeleteData({ user, index });
                }}
                onSwipeableWillClose={() => {
                  // console.log("this on close")
                  // setRadius(6)
                }}
              >
                <TouchableHighlight
                  underlayColor="rgba(192,192,192,1,0.6)"
                  onPress={viewNote}
                  style={{backgroundColor: 'white'}}
                >
                  <View style={styles.profileBtnStyle}>
                    <IconProfileNew />
                    <Text style={styles.memberNameStyle}>
                      {user.member_name}
                    </Text>
                    <Text style={styles.memberNumStyle}>{user.member_num}</Text>
                    <IconMultiDots />
                  </View>
                </TouchableHighlight>
              </Swipeable>
            ))}
          </View>
        </View>
      </ScrollView>
      <View style={styles.fab}>
        <TouchableOpacity onPress={() => setOpenAddMember(true)}>
          <IconPlusCircle />
        </TouchableOpacity>
      </View>
      <ModalBottom
        height="26%"
        title={AddGroupMembersHead}
        from="group"
        open={openAddMember}
        onClose={() => setOpenAddMember(false)}
      >
        <AddMember
          members={group_user_nonlive}
          handleUpdate={groupUpdateApi}
          group={group}
        />
      </ModalBottom>
      <ModalBottom
        height="26%"
        title={DeleteLabel}
        from="group"
        open={openDeleteMember}
        onClose={() => setOpenDeleteMember(false)}
      >
        <Text
          style={{
            color: colors.primary,
            textAlign: `center`,
            marginTop: rh(2),
          }}
        >
          {DeleteAlertHead}
        </Text>
        <View style={{ flexDirection: `row`, marginVertical: rh(2) }}>
          <TouchableOpacity
            style={styles.noButtonStyle}
            onPress={() => {
              closeRow(deleteData.index)
              setOpenDeleteMember(false);
              setDeleteData({})
              //
            }}
          >
            <Text style={{ fontSize: rf(2), color: colors.primary }}>NO</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.yesButtonStyle}
            onPress={() => {
              deleteFunc();
            }}
          >
            <Text style={{ fontSize: rf(2), color: colors.white }}>YES</Text>
          </TouchableOpacity>
        </View>
      </ModalBottom>
      <ModalBottom
        height="26%"
        title={TimeSchSettingLabel}
        from="group"
        open={openTimeSch}
        onClose={() => setOpenTimeSch(false)}
      >
        <TimeSchedule
          group={group}
          authcode={user?.authcode}
          handleUpdate={groupUpdateApi}
        />
      </ModalBottom>
      <ModalBottom
        height="26%"
        title={UpdateStrategyLabel}
        from="group"
        open={openStrategy}
        onClose={() => setOpenStrategy(false)}
      >
        <UpdateStrategy group={group} handleUpdate={groupUpdateApi} />
      </ModalBottom>
      <ModalBottom
        height="26%"
        title={UpdateStickyLabel}
        from="group"
        open={openSticky}
        onClose={() => setOpenSticky(false)}
      >
        <UpdateSticky group={group} handleUpdate={groupUpdateApi} />
      </ModalBottom>
      <ModalBottom
        height="26%"
        title={UpdateMultiStickyLabel}
        from="group"
        open={openMultiSticky}
        onClose={() => setOpenMultiSticky(false)}
      >
        <UpdateMultiSticky group={group} handleUpdate={groupUpdateApi} />
      </ModalBottom>
    </>
  );
};

export default CallGroupSetting;

const styles = StyleSheet.create({
  cancelBtnStyle: {
    alignItems: `center`,
    borderColor: colors.primary,
    borderRadius: 5,
    borderWidth: 1,
    flex: 1,
    paddingVertical: rh(1),
  },
  card: {
    flexDirection: `row`,
    justifyContent: `space-between`,
    marginVertical: rh(1),
  },
  cardHead: { marginBottom: rh(1) },
  container: {
    backgroundColor: colors.white,
  },
  container1: { flexDirection: `row`, justifyContent: `space-between` },
  container2: { color: colors.blueBg, marginHorizontal: rw(1) },
  container3: {
    flexDirection: `row`,
    justifyContent: `space-between`,
    marginTop: rh(1),
  },
  fab: {
    bottom: 0,
    elevation: 100,
    marginBottom: rh(1),
    marginRight: rw(80),
    position: 'absolute',
    right: 0,
  },
  group: {
    flexDirection: `row`,
    justifyContent: `space-between`,
    marginVertical: rh(1),
  },
  group1: {
    alignSelf: `center`,
    borderColor: colors.borderColor,
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: `row`,
    justifyContent: `space-between`,
    paddingHorizontal: rw(4),
    paddingVertical: rh(2),
    width: rw(95),
  },
  groupText: {
    fontFamily: `Inter`,
    fontSize: rh(2),
    fontWeight: `500`,
    marginLeft: rw(3),
    marginVertical: rh(1),
    opacity: 1,
  },
  imageStyle: {
    alignItems: 'center',
    bottom: rh(40),
    elevation: 1,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    left: rw(25),
    position: 'absolute',
    shadowColor: `transparent`,
    zIndex: 999,
  },
  itemDeskphoneStyle: { flexDirection: 'row', gap: 12 },
  layout: { marginBottom: rh(2), marginTop: rh(0.1), opacity: 1 },
  layout2: {
    alignItems: `center`,
    flexDirection: `row`,
    marginHorizontal: rw(2),
    marginVertical: rh(1),
  },
  layout3: {
    color: colors.primary1,
    fontFamily: `Epilogue`,
    fontWeight: `500`,
    marginHorizontal: rw(1),
  },
  layout4: {
    alignItems: `center`,
    alignSelf: `center`,
    borderColor: colors.borderColor,
    borderRadius: 10,
    borderWidth: 0.5,
    fontFamily: `Epilogue`,
    fontWeight: `500`,
    marginLeft: rw(4),
    paddingVertical: rh(1),
    width: rw(45),
  },
  layout5: {
    alignItems: `center`,
    alignSelf: `center`,
    borderColor: colors.borderColor,
    borderRadius: 10,
    borderWidth: 0.5,
    fontFamily: `Epilogue`,
    fontWeight: `500`,
    marginRight: rw(4),
    paddingVertical: rh(1),
    width: rw(45),
  },
  layout6: {
    alignItems: `center`,
    flexDirection: `row`,
    fontFamily: `Epilogue`,
    fontWeight: `500`,
    marginHorizontal: rw(2),
    marginVertical: rh(1),
  },
  layoutText: {
    fontFamily: `Nunito`,
    fontSize: rh(2.4),
    fontWeight: `600`,
    marginTop: rh(1),
    opacity: 1,
  },
  memberNameStyle: {
    flex: 1,
    fontFamily: `Epilogue`,
    fontWeight: `400`,
    marginLeft: rw(1),
  },
  memberNameStyle1: { flexDirection: 'row', gap: 12 },
  memberNumStyle: {
    flex: 1,
    fontFamily: `Epilogue`,
    fontWeight: `500`,
    marginLeft: rw(0),
    textAlign: `right`,
  },
  multi: { color: colors.multistickyCard, marginHorizontal: rw(1) },
  noButtonStyle: {
    alignItems: `center`,
    borderColor: colors.primary,
    borderRadius: 5,
    borderWidth: 1,
    flex: 1,
    paddingVertical: rh(0.7),
  },
  profileBtnStyle: {
    flexDirection: `row`,
    justifyContent: `space-between`,
    // eslint-disable-next-line react-native/sort-styles
    borderWidth: 1,
    paddingVertical: rh(1),
    // width: rw(95),
    paddingHorizontal: rw(5),
    alignSelf: `center`,
    borderColor: `#C4C4C4`,
    alignItems: `center`,
    zIndex: 999,
  },
  sticky: { color: colors.warning, marginHorizontal: rw(1) },
  submitBtnStyle: {
    alignItems: `center`,
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    borderRadius: 5,
    borderWidth: 1,
    flex: 1,
    marginLeft: rw(5),
    paddingVertical: rh(1),
  },
  swipeBtnsStyle: {
    alignItems: `center`,
    backgroundColor: colors.primary,
    borderBottomEndRadius: 6,
    borderColor: `#C4C4C4`,
    borderTopRightRadius: 6,
    borderWidth: 1,
    height: rh(5.3),
    justifyContent: `center`,
    width: rw(12),
  },
  yesButtonStyle: {
    alignItems: `center`,
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    borderRadius: 5,
    borderWidth: 1,
    flex: 1,
    marginLeft: rw(5),
    paddingVertical: rh(0.7),
  },
});
