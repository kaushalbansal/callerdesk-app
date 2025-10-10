import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';

import { colors } from '../../../themes/vars';
import { rf, rh, rw } from '../../../common/helpers/dimentions';
import { loadMemberList } from '../../../common/redux/actions/callLog';
import {
  AddMemberLabel,
  DeleteAlertHeadTeams,
  DeleteLabel,
  EditTeamLabel,
  MNoLabel,
  NameLabel,
  SelectMemberLabel,
  Teams,
  UpdateLabel,
  pageSize,
} from '../../../common/Constants';
import CustomHeader from '../../../common/components/CustomHeader';
import { IconPlusCircle } from '../../../common/icons/iconplusround';
import { toastShow } from '../../../common/helpers/utils';
import TeamCard from './TeamCard';
import ModalBottom from '../../../common/components/ModalBottom';
import TextInputWithIcon from '../../../common/components/textinputwithicon';
import { Select, SelectItem, Text, IndexPath } from '@ui-kitten/components';
import { IconArrowDown } from '../../../common/icons/iconarrowdown';
import { ContactIcon } from '../../../common/icons/contacticon';
import InvitePerson from './InvitePerson';
import {
  addTeam,
  deleteMember,
  updateTeam,
} from '../../../common/redux/actions/contact';
import { IconCall } from '../../../common/icons/Contactdetailsicons/iconcall';
import { IconContactDetails } from '../../../common/icons/iconcontactdetails';
import { NoDataFound } from '../../../common/components/NoDataFound';
import { SkeletonLoaderComponent } from '../../../common/helpers/skeletonLoader';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const AddTeam = () => {
  const nav = useNavigation();
  const dispatch = useDispatch();
  const [openDeleteMember, setOpenDeleteMember] = React.useState(false);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [, setTeamMemberDataScreen] = React.useState({});
  const [name, setName] = React.useState(``);
  const [email, setEmail] = React.useState(``);
  const [password, setPassword] = React.useState(``);
  const [extn, setExtn] = React.useState(``);

  const [, setShowConfirmPassword] = React.useState(true);
  const [, setMemberId] = React.useState(``);
  const [mNo, setMNo] = React.useState(``);
  const [access, setAccess] = React.useState(``);
  const [active, setActive] = React.useState(``);
  const [isLodaMore, setIsLoadMore] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState(1);

  const insets=useSafeAreaInsets()

  const { memList, totalMember } = useSelector((state) => state.callLog);
  const { user, loading } = useSelector((state) => state.global);
  const [refreshing, setRefreshing] = React.useState(false);
  const [memberType] = React.useState([
    { type: `Admin`, value: 1 },
    { type: `Regular`, value: 2 },
    { type: `Group Owner`, value: 3 },
  ]);
  const [selectedIndexMemberType, setSelectedIndexMemberType] = React.useState(
    new IndexPath(0),
  );
  const [modalView, setModalView] = React.useState(false);
  const [teamData, setTeamData] = React.useState(``);

  const handleRefresh = () => {
    setRefreshing(true);
    setCurrentPage(1);
    dispatch(loadMemberList(user?.authcode, nav)).then(() => {
      setRefreshing(false);
    });
    setRefreshing(false);
  };
  const onSelect = (item, modalView) => {
    setModalView(modalView);
    setTeamData(item);
    setExtn(item?.agent_extn);
    setMNo(item.member_num);
    setName(item.member_name);
    setPassword(item.password);
    setEmail(item.member_email);
    setMemberId(item.member_id);
    switch (item.status) {
      case `0`:
        setActive(0);
        break;
      case `1`:
        setActive(1);
        break;

      default:
        break;
    }
    switch (item.access) {
      case `1`:
        setAccess(`1`);
        break;
      case `2`:
        setAccess(`2`);
        break;
      case `3`:
        setAccess(`3`);
        break;

      default:
        break;
    }
  };

  const deleteNote = (item, modalView) => {
    setOpenDeleteMember(modalView);
    setTeamData(item);
  };
  const [modal, setModal] = React.useState(false);
  const onStatusChange = (member) => {
    const obj = {
      member_num: member?.member_num.replace(/\s+/g, ''),
      member_name: member?.member_name,
      status: member?.status === '1' ? '2' : '1',
      access: member?.access,
      member_email: member?.member_email,
      password: member?.password,
      member_id: member?.member_id,
      agent_extn: member?.agent_extn,
    };
    dispatch(updateTeam(user?.authcode, obj));
  };
  const modalOpen = (item) => {
    setModalVisible(false);
    setModal(true);
  };
  const onSelectNew = (item) => {
    setTeamMemberDataScreen(item);
    saveMNo(item.member_num);
  };
  const saveMNo = (item) => {
    item && setMNo(item?.replace(/\+91|[-\s]/g, ''));
  };
  const submitApi = () => {
    if (!user?.authcode) {
      toastShow('User authentication code is required!');
      return;
    }
    if (!mNo) {
      toastShow('Mobile no. is required!');
      return;
    }
    if (!name) {
      toastShow('Name is required!');
      return;
    }
    if (!active === 0 || !active === 1) {
      toastShow('Team status is required!');
      return;
    }
    if (!access === 1 || !access === 2 || !access === 3) {
      toastShow('Member type is required!');
      return;
    }
    const regex = /^\+\d{1,2}/;
    const cleanedPhoneNumber = mNo.replace(regex, '');
    const obj = {
      member_num: cleanedPhoneNumber.replace(/\s+/g, ''),
      member_name: name,
      status: active,
      access,
      member_email: email,
      password,
    };
    setModal(false);
    dispatch(addTeam(user?.authcode, obj));
    clearData();
  };
  const renderSkeletonLoaders = () => {
    if (refreshing || loading) {
      return Array.from({ length: 5 }).map((_, index) => (
        <SkeletonLoaderComponent key={index} />
      ));
    }
    return null;
  };
  const editApi = () => {
    if (!user?.authcode) {
      toastShow('User authentication code is required!');
      return;
    }
    if (!mNo) {
      toastShow('Mobile no. is required!');
      return;
    }
    if (!name) {
      toastShow('Name is required!');
      return;
    }
    if (!active === 0 || !active === 1) {
      toastShow('Team status is required!');
      return;
    }
    if (!access === 1 || !access === 2 || !access === 3) {
      toastShow('Member type is required!');
      return;
    }
    const regex = /^\+\d{1,2}/;
    console.log(`mNo`, mNo);
    const cleanedPhoneNumber = mNo.replace(regex, '');
    console.log(`cleanedPhoneNumber`, cleanedPhoneNumber.replace(/\s+/g, ''));
    const obj = {
      member_num: cleanedPhoneNumber.replace(/\s+/g, ''),
      member_name: name,
      status: active,
      access,
      member_email: email,
      password,
      member_id: teamData.member_id,
      agent_extn: extn,
    };
    setModalView(false);
    dispatch(updateTeam(user?.authcode, obj));
    clearData();
  };
  const clearData = () => {
    setModal(false);
    setName(``);
    setMNo(``);
    setAccess(``);
    setActive(``);
    setPassword(``);
    setShowConfirmPassword(false);
    setEmail(``);
  };

  const loadMore = () => {
    if (memList.length < totalMember) {
      setIsLoadMore(true);
      const count = currentPage + 1;
      setCurrentPage(count);
      dispatch(loadMemberList(user?.authcode, nav, pageSize, count, true)).then(
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
  const card = React.useCallback(
    ({ item, index }) => (
      <TeamCard
        key={index}
        item={item}
        deleteBtn={deleteNote}
        onSelect={onSelect}
        onStatusChange={onStatusChange}
      />
    ),
    [],
  );
  return (
    <View style={styles.container}>
      <CustomHeader title={Teams}></CustomHeader>
      <View style={styles.fab}>
        <TouchableOpacity
          onPress={() => {
            setModal(true);
          }}
        >
          <IconPlusCircle />
        </TouchableOpacity>
      </View>
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
          Total Members:{' '}
          <Text style={{ color: colors.primary }}>
            {`${memList.length}/${totalMember}`}
          </Text>
        </Text>
      </View>
      {memList?.length > 0 && (
        <FlatList
          data={memList}
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
        />
      )}
      {!isLodaMore && renderSkeletonLoaders()}
      {!loading && memList.length === 0 && (
        <NoDataFound
          style={{ alignSelf: 'center',  }}
          msg="no-member"
        />
      )}
      {/* <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[colors.primary]}
          />
        }
      >
        <View style={{ paddingHorizontal: ph, marginTop: rh(1) }}>
          {memList &&
            memList.length > 0 &&
            !loading &&
            memList.map((item, index) => (
              <TeamCard
                key={index}
                item={item}
                deleteBtn={deleteNote}
                onSelect={onSelect}
                onStatusChange={onStatusChange}
              />
            ))}
          {memList.length === 0 && !loading && (
            <View style={{ marginTop: rh(20) }}>
              <NoDataFound msg={`no-member`} />
            </View>
          )}
        </View>
        {renderSkeletonLoaders()}
      </ScrollView> */}
      <ModalBottom
      // Add team modal
        isInsetPadding={true}
        title={AddMemberLabel}
        open={modal}
        onClose={() => {
          setModal(false);
          setTeamMemberDataScreen({});
          setName(``);
          setMNo(``);
          setAccess(``);
          setActive(``);
          setEmail(``);
          setPassword(``);
          setShowConfirmPassword(false);
        }}
      >
        <View style={{ flexDirection: `row` }}>
          <TextInputWithIcon
            placeholder={MNoLabel}
            value={mNo}
            inputMode={'phone-pad'}
            from={`contact`}
            onChangeText={(text) => {
              setMNo(text);
            }}
            addteam={true}
            icon={
              <TouchableOpacity
                style={{
                  marginLeft: rw(2),
                  alignItems: `center`,
                  justifyContent: `center`,
                }}
                onPress={() => {
                  setModalVisible(true);
                  setModal(false);
                }}
              >
                <ContactIcon color={colors.grey} size={20} />
              </TouchableOpacity>
            }
          ></TextInputWithIcon>
        </View>
        <TextInputWithIcon
          placeholder={NameLabel}
          from={`contact`}
          value={name}
          onChangeText={(text) => {
            setName(text);
          }}
        ></TextInputWithIcon>
        <View style={{ marginVertical: rh(0.5), paddingBottom: insets.bottom }}>
          <Select
            accessoryRight={<IconArrowDown size={14} />}
            selectedIndex={selectedIndexMemberType}
            placeholder={
              access === `1`
                ? `Admin`
                : access === `2`
                  ? `Regular`
                  : access === `3`
                    ? `Group Owner`
                    : `Select Member Type`
            }
            value={
              access === `1`
                ? `Admin`
                : access === `2`
                  ? `Regular`
                  : access === `3`
                    ? `Group Owner`
                    : `Select Member Type`
            }
            onSelect={(index) => {
              setSelectedIndexMemberType(index);
              setAccess(memberType[index.row].value.toString());
            }}
          >
            {memberType.map((item, index) => (
              <SelectItem
                key={index}
                title={() => (
                  <View style={styles.type}>
                    <Text>{item.type}</Text>
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
            style={styles.submitApi}
            onPress={() => {
              submitApi();
            }}
          >
            <Text style={styles.submitApiText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </ModalBottom>
      <ModalBottom
        title={SelectMemberLabel}
        open={modalVisible}
        onClose={() => {
          setModalVisible(false);
        }}
      >
        <InvitePerson modalOpen={modalOpen} onSelectNew={onSelectNew} />
      </ModalBottom>
      <ModalBottom
        height="26%"
        title={EditTeamLabel}
        //Inside add team screen edit team modal
        isInsetPadding={true}
        from="group"
        open={modalView}
        onClose={() => {
          setModalView(false);
          setTeamData(``);
          setName(``);
          setMNo(``);
          setAccess(``);
          setActive(``);
          setPassword(``);
          setEmail(``);
        }}
      >
        <TextInputWithIcon
          from={`contact`}
          accessible={false}
          value={mNo}
          onChangeText={(text) => {
            setMNo(text);
          }}
          icon={<IconCall color={colors.greyNew} size={20}></IconCall>}
        />
        <TextInputWithIcon
          from={`contact`}
          value={name}
          icon={
            <IconContactDetails
              color={colors.greyNew}
              size={20}
            ></IconContactDetails>
          }
          onChangeText={(text) => {
            setName(text);
          }}
        />
        <TextInputWithIcon
          from={`contact`}
          value={email}
          icon={<Text style={{ color: colors.greyNew }}>Email</Text>}
          onChangeText={(text) => {
            setEmail(text);
          }}
        />
        <TextInputWithIcon
          from={`contact`}
          value={password}
          icon={<Text style={{ color: colors.greyNew }}>Password</Text>}
          onChangeText={(text) => {
            setPassword(text);
          }}
        />
        <TextInputWithIcon
          from={`contact`}
          inputMode={'phone-pad'}
          value={extn}
          onChangeText={(text) => {
            setExtn(text);
          }}
          maxLength={8}
          icon={<Text style={{ color: colors.greyNew }}>Ext.</Text>}
        />
        <View style={{ marginVertical: rh(0.5),  paddingBottom: insets.bottom}}>
          <Select
            accessoryRight={<IconArrowDown size={14} />}
            selectedIndex={selectedIndexMemberType}
            placeholder={
              access === `1`
                ? `Admin`
                : access === `2`
                  ? `Regular`
                  : access === `3`
                    ? `Group Owner`
                    : `Select Member Type`
            }
            value={
              access === `1`
                ? `Admin`
                : access === `2`
                  ? `Regular`
                  : access === `3`
                    ? `Group Owner`
                    : `Select Member Type`
            }
            onSelect={(index) => {
              setSelectedIndexMemberType(index);
              setAccess(memberType[index.row].value.toString());
            }}
          >
            {memberType.map((item, index) => (
              <SelectItem
                key={index}
                title={() => (
                  <View style={styles.itemType}>
                    <Text>{item.type}</Text>
                  </View>
                )}
              />
            ))}
          </Select>
        </View>
        <View style={{ flexDirection: `row`, marginVertical: rh(2) }}>
          <TouchableOpacity
            style={styles.editApi}
            onPress={() => {
              editApi();
            }}
          >
            <Text style={{ fontSize: rf(2), color: colors.white }}>
              {UpdateLabel.toUpperCase()}
            </Text>
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
          setTeamData(``);
        }}
      >
        <Text
          style={{
            color: colors.primary,
            textAlign: `center`,
            marginTop: rh(2),
          }}
        >
          {DeleteAlertHeadTeams}
        </Text>
        <View style={{ flexDirection: `row`, marginVertical: rh(2) }}>
          <TouchableOpacity
            style={styles.noBtn}
            onPress={() => {
              setOpenDeleteMember(false);
              setTeamData(``);
            }}
          >
            <Text style={{ fontSize: rf(2), color: colors.primary }}>NO</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.yesBtn}
            onPress={() => {
              dispatch(deleteMember(user?.authcode, teamData.member_id));
              setOpenDeleteMember(false);
              setTeamData(``);
            }}
          >
            <Text style={{ fontSize: rf(2), color: colors.white }}>YES</Text>
          </TouchableOpacity>
        </View>
      </ModalBottom>
    </View>
  );
};
export default AddTeam;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flex: 1,
  },
  editApi: {
    alignItems: `center`,
    alignSelf: `center`,
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    borderRadius: 5,
    borderWidth: 1,
    flex: 1,
    paddingVertical: rh(0.7),
  },
  fab: {
    bottom: 0,
    marginBottom: rh(1),
    marginRight: rw(80),
    position: 'absolute',
    right: 0,
    zIndex: 999,
  },
  itemType: { flexDirection: 'row', gap: 12 },
  noBtn: {
    alignItems: `center`,
    borderColor: colors.primary,
    borderRadius: 5,
    borderWidth: 1,
    flex: 1,
    paddingVertical: rh(0.7),
  },
  submitApi: {
    alignItems: `center`,
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    borderRadius: 5,
    borderWidth: 1,
    flex: 1,
    paddingVertical: rh(1),
  },
  submitApiText: { color: colors.white, fontSize: rf(2) },
  type: { flexDirection: 'row', gap: 12 },
  yesBtn: {
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
