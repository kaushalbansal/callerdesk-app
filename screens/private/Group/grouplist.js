import React, { useCallback, useEffect, useState } from 'react';
import {
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  View,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { colors } from '../../../themes/vars';
import { NoDataFound } from '../../../common/components/NoDataFound';
import { rf, rh, rw } from '../../../common/helpers/dimentions';
import GroupCard from './GroupCard';
import CustomHeader from '../../../common/components/CustomHeader';
import {
  AddCallGroupLabel,
  DeleteAlertHeadGroup,
  DeleteLabel,
  EditCallGroupLabel,
  EnterCallGroupLabel,
  pageSize,
} from '../../../common/Constants';
import { IconPlusCircle } from '../../../common/icons/iconplusround';
import ModalBottom from '../../../common/components/ModalBottom';
import TextInputWithIcon from '../../../common/components/textinputwithicon';
import { Select, SelectItem, Text, IndexPath } from '@ui-kitten/components';
import { IconArrowDown } from '../../../common/icons/iconarrowdown';
import { useDispatch, useSelector } from 'react-redux';
import {
  addCallGroup,
  deleteCallGroup,
  updateCallGroup,
} from '../../../common/redux/actions/contact';
import { loadCallGroupList } from '../../../common/redux/actions/voiceTemplate';
import { toastShow } from '../../../common/helpers/utils';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SkeletonLoaderComponent } from '../../../common/helpers/skeletonLoader';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
const GroupList = () => {
  const { user, loading } = useSelector((state) => state.global);
  const group = useSelector((state) => state.voiceTemplate);
  const [modal, setModal] = useState(false);
  const [modalView, setModalView] = useState(false);
  const [groupName, setGroupName] = useState(``);
  const [deskphone, setDeskphone] = useState(``);
  const [memberNo, setMemberNo] = useState(``);
  const [callGroupData, setCallGroupData] = useState(``);
  const [callGroupDataDelete, setCallGroupDataDelete] = useState(``);
  const [didID, setDidID] = useState(``);
  const [memberID, setMemberID] = useState(``);
  const [selectedIndex, setSelectedIndex] = useState(new IndexPath(0));
  const [selectedIndexGroupOwner, setSelectedIndexGroupOwner] = useState(
    new IndexPath(0),
  );
  const [openDeleteMember, setOpenDeleteMember] = useState(false);
  const [isLodaMore, setIsLoadMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const navigation = useNavigation();
  const [userRole, setUserRole] = useState();
  const [role, setRole] = useState();
  const [groupOwnerName, setGroupOwnerName] = useState();

  const dispatch = useDispatch();
  const { ivrList, memList } = useSelector((state) => state.callLog);
  const [refreshing, setRefreshing] = useState(false);
  const getData = async () => {
    const ans = await AsyncStorage.getItem('user_role');
    const ansRole = await AsyncStorage.getItem('role');
    setUserRole(ans);
    setRole(ansRole);
  };
  useEffect(() => {
    !group?.callGroupList &&
      dispatch(loadCallGroupList(user?.authcode, pageSize));
    getData();
  }, []);
  const clearData = () => {
    setModal(false);
    setGroupName(``);
    setDeskphone(``);
    setDidID(``);
    setMemberID(``);
    setMemberNo(``);
  };
  const clearDataCard = () => {
    setModalView(false);
    setCallGroupData(``);
    setGroupName(``);
    setDeskphone(``);
    setDidID(``);
    setMemberID(``);
    setMemberNo(``);
  };

  const renderSkeletonLoaders = () => {
    if (refreshing || loading) {
      return Array.from({ length: 5 }).map((_, index) => (
        <SkeletonLoaderComponent key={index} />
      ));
    }
    return null;
  };
  const submitApi = () => {
    if (!user?.authcode) {
      toastShow('User authentication code is required!');
      return;
    }
    if (!groupName) {
      toastShow('Group name is required!');
      return;
    }
    if (!didID) {
      toastShow('Deskphone ID is required!');
      return;
    }
    if (!memberID) {
      toastShow('Member ID is required!');
      return;
    }

    setModal(false);
    dispatch(
      addCallGroup(user?.authcode, groupName, didID, memberID, memberNo),
    );
    clearData();
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
    groupUpdateApi();
    clearDataCard();
  };
  const groupUpdateApi = (objParams) => {
    const obj = {
      ...callGroupData,
      group_name: groupName,
      deskphone_id: deskphone,
      group_owner_name: groupOwnerName,
      group_owner_id: memberID,
      // member_id: memberID,
    };
    const nav = {
      navigation,
      edit_group: `edit_group`,
    };
    dispatch(updateCallGroup(user?.authcode, obj, nav));
  };
  const modalClose = () => {
    setModal(false);
    setGroupName(``);
    setDidID(``);
    setMemberID(``);
    setDeskphone(``);
    setMemberNo(``);
  };
  const modalCloseData = () => {
    setModalView(false);
    clearDataCard();
  };
  const onSelect = (item, modalView) => {
    setModalView(modalView);
    setCallGroupData(item);
  };
  const onDelete = (item, modalView) => {
    setOpenDeleteMember(modalView);
    setCallGroupDataDelete(item);
  };
  const card = useCallback(
    ({ item, index }) => (
      <GroupCard
        groupUpdateApi={groupUpdateApi}
        data={item}
        onDelete={onDelete}
        onSelect={onSelect}
      />
    ),
    [],
  );
  const handleRefresh = () => {
    setRefreshing(true);
    setCurrentPage(1);
    dispatch(loadCallGroupList(user?.authcode, pageSize, 1, false)).then(() => {
      setRefreshing(false);
    });
  };

  const loadMore = () => {
    if (group?.callGroupList.length < group?.totalGroup) {
      setIsLoadMore(true);
      const count = currentPage + 1;
      setCurrentPage(count);
      dispatch(loadCallGroupList(user?.authcode, pageSize, count, true)).then(
        () => {
          setIsLoadMore(false);
        },
      );
    } else {
      setIsLoadMore(false);
    }
  };

  const renderFooter = () => {
    if (!isLodaMore) return null;
    return (
      <View
        // eslint-disable-next-line react-native/no-inline-styles
        style={{
          padding: rh(4),
        }}
      >
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  };

  const renderEmptpyFallBackUi=()=>{
    return(
      <NoDataFound
            style={{ alignSelf: 'center',marginTop: rh(18)}}
            msg="no-group"
          />
    )
  }
  const insets=useSafeAreaInsets()
  const filteredMemList=memList.filter(
  item => item.access === `1` || item.access === `3`
);

  return (
    <>
      <CustomHeader title="Groups"></CustomHeader>
      <View style={styles.container}>
        <View
          // eslint-disable-next-line react-native/no-inline-styles
          style={{
            marginLeft: rw(2),
            marginTop: rh(1),
            marginRight: rh(2),
            alignItems: 'flex-end',
          }}
        >
          <Text>
            Total Groups:{' '}
            <Text style={{ color: colors.primary }}>
              {`${group?.callGroupList.length}/${group?.totalGroup}`}
            </Text>
          </Text>
        </View>
        {group?.callGroupList && (
          <FlatList
            data={group?.callGroupList}
            keyExtractor={(item, index) => `${item.id}_${index}`}
            renderItem={card}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                colors={[colors.primary]}
              />
            }
            removeClippedSubviews
            initialNumToRender={6}
            maxToRenderPerBatch={10}
            onEndReachedThreshold={50}
            onEndReached={loadMore}
            ListFooterComponent={renderFooter}
            ListEmptyComponent={renderEmptpyFallBackUi}
          />
        )}
        {!isLodaMore && renderSkeletonLoaders()}
      </View>
      <View style={styles.fab}>
        {role === `3` && userRole === `3` ? null : (
          <TouchableOpacity onPress={() => setModal(true)}>
            <IconPlusCircle />
          </TouchableOpacity>
        )}
        <ModalBottom
        // Add Group modal
          isInsetPadding={true}
          title={AddCallGroupLabel}
          open={modal}
          onClose={modalClose}
        >
          <TextInputWithIcon
            placeholder={EnterCallGroupLabel}
            from={`contact`}
            onChangeText={(text) => setGroupName(text)}
            value={groupName}
          ></TextInputWithIcon>
          <View style={{ marginVertical: rh(1) }}>
            <Select
              accessoryRight={<IconArrowDown size={14} />}
              placeholder={`Select deskphone`}
              selectedIndex={selectedIndex}
              value={
                deskphone
                  ? ivrList[selectedIndex.row].deskphone
                  : `Select deskphone`
              }
              onSelect={(index) => {
                setSelectedIndex(index);
                const selectedItem = ivrList[index.row];
                setDeskphone(selectedItem.deskphone);
                setDidID(selectedItem.did_id);
              }}
            >
              {ivrList.map((item, index) => (
                <SelectItem
                  key={index}
                  title={() => (
                    <View style={styles.itemDeskphone}>
                      <Text>{item.deskphone}</Text>
                    </View>
                  )}
                />
              ))}
            </Select>
          </View>
          <View style={{ marginVertical: rh(0.5),  paddingBottom: insets.bottom }}>
            <Select
              accessoryRight={<IconArrowDown size={14} />}
              placeholder={`Select group owner`}
              selectedIndex={selectedIndexGroupOwner}
              value={
                memList
                  .filter((item) => item.access === '1' || item.access === `3`)
                  .find((item) => item.member_name === memberNo)
                  ? memberNo
                  : `Select group owner`
              }
              onSelect={(index) => {
                setSelectedIndexGroupOwner(index);
                const filteredList = memList.filter(
                  (item) => item.access === `1` || item.access === `3`,
                );
                const selectedItem = filteredList[index.row];
                console.log(selectedItem, `selectedItem??`);
                setMemberNo(selectedItem.member_name);
                setMemberID(selectedItem.member_id);
              }}
            >
              {filteredMemList.map((item, index) => (
                  <SelectItem
                  style={filteredMemList.length===4 ? {paddingBottom: insets.bottom}: undefined}
                    key={index}
                    title={() => (
                      <View style={styles.itemMember}>
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
              style={styles.modalCloseStyle}
              onPress={modalClose}
            >
              <Text style={{ fontSize: rf(2), color: colors.primary }}>
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.submitButtonStyle}
              onPress={submitApi}
            >
              <Text style={{ fontSize: rf(2), color: colors.white }}>
                Submit
              </Text>
            </TouchableOpacity>
          </View>
        </ModalBottom>
      </View>
      <ModalBottom
      // edit group Modal
        isInsetPadding={true}
        title={EditCallGroupLabel}
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
            // placeholder={callGroupData.deskphone_id}
            // selectedIndex={selectedIndex}
            value={
              deskphone
                ? ivrList[selectedIndex.row].deskphone
                : callGroupData.desk_phone
            }
            onSelect={(index) => {
              setSelectedIndex(index);
              const selectedItem = ivrList[index.row];
              console.log(selectedItem);
              setDeskphone(selectedItem.did_id);
              console.log(deskphone);
              // setDidID(selectedItem.did_id);
            }}
          >
            {ivrList.map((item, index) => (
              <SelectItem
                key={index}
                title={() => (
                  <View style={styles.itemMember}>
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
            placeholder={
              callGroupData.group_owner_name
                ? callGroupData.group_owner_name
                : `Unknown`
            }
            value={
              memberNo
                ? memList[selectedIndexGroupOwner.row].member_name
                : callGroupData.group_owner_name
            }
            onSelect={(index) => {
              setSelectedIndexGroupOwner(index);
              const selectedItem = memList[index.row];
              setMemberNo(selectedItem.member_num);
              setMemberID(selectedItem.member_id);
              setGroupOwnerName(selectedItem.member_name);
              console.log(selectedItem, `selectedItem???`);
            }}
          >
            {memList.map((item, index) => (
              <SelectItem
              style={memList.length===4 ? {paddingBottom: insets.bottom}: undefined}
                key={index}
                title={() => (
                  <View style={styles.itemMember}>
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
            style={styles.closeButtonStyle}
            onPress={modalCloseData}
          >
            <Text style={{ fontSize: rf(2), color: colors.primary }}>
              Cancel
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={submitEditApi}
            style={styles.submitButtonStyle1}
          >
            <Text style={{ fontSize: rf(2), color: colors.white }}>Submit</Text>
          </TouchableOpacity>
        </View>
      </ModalBottom>
      <ModalBottom
        height="26%"
        title={DeleteLabel}
        from="group"
        open={openDeleteMember}
        onClose={() => {
          setOpenDeleteMember(false);
          setCallGroupDataDelete(``);
        }}
      >
        <Text
          style={{
            color: colors.primary,
            textAlign: `center`,
            marginTop: rh(2),
          }}
        >
          {DeleteAlertHeadGroup}
        </Text>
        <View style={{ flexDirection: `row`, marginVertical: rh(2) }}>
          <TouchableOpacity
            style={styles.noButtonStyle}
            onPress={() => {
              setOpenDeleteMember(false);
              setCallGroupDataDelete(``);
            }}
          >
            <Text style={{ fontSize: rf(2), color: colors.primary }}>NO</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.yesButtonStyle}
            onPress={() => {
              dispatch(
                deleteCallGroup(user?.authcode, callGroupDataDelete.group_id),
              );
              setOpenDeleteMember(false);
              setCallGroupDataDelete(``);
            }}
          >
            <Text style={{ fontSize: rf(2), color: colors.white }}>YES</Text>
          </TouchableOpacity>
        </View>
      </ModalBottom>
    </>
  );
};

export default GroupList;

const styles = StyleSheet.create({
  closeButtonStyle: {
    alignItems: `center`,
    borderColor: colors.primary,
    borderRadius: 5,
    borderWidth: 1,
    flex: 1,
    paddingVertical: rh(1),
  },
  container: {
    backgroundColor: colors.white,
    flex: 1,
    paddingHorizontal: rw(0),
    paddingTop: rh(1),
  },
  fab: {
    bottom: 0,
    elevation: 100,
    marginBottom: rh(1),
    marginRight: rw(80),
    position: 'absolute',
    right: 0,
  },
  itemDeskphone: { flexDirection: 'row', gap: 12 },
  itemMember: { flexDirection: 'row', gap: 12 },
  modalCloseStyle: {
    alignItems: `center`,
    borderColor: colors.primary,
    borderRadius: 5,
    borderWidth: 1,
    flex: 1,
    paddingVertical: rh(1),
  },
  noButtonStyle: {
    alignItems: `center`,
    borderColor: colors.primary,
    borderRadius: 5,
    borderWidth: 1,
    flex: 1,
    paddingVertical: rh(0.7),
  },
  submitButtonStyle: {
    alignItems: `center`,
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    borderRadius: 5,
    borderWidth: 1,
    flex: 1,
    marginLeft: rw(5),
    paddingVertical: rh(1),
  },
  submitButtonStyle1: {
    alignItems: `center`,
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    borderRadius: 5,
    borderWidth: 1,
    flex: 1,
    marginLeft: rw(5),
    paddingVertical: rh(1),
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
