import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
} from 'react-native';
import { colors } from '../../../themes/vars';
import { rf, rh, rw } from '../../../common/helpers/dimentions';
import { useNavigation } from '@react-navigation/native';
import { UserAvatar } from '../../../common/icons/useravatar';
import {
  EditTeamLabel,
  MemberEmailLabel,
  MemberExtLabel,
  MemberIdLabel,
  MemberNoLabel,
  MemberStatusLabel,
  MemberTypeLabel,
  TeamDetailsLabel,
  UpdateLabel,
} from '../../../common/Constants';
import CustomHeader from '../../../common/components/CustomHeader';
import ModalBottom from '../../../common/components/ModalBottom';
import { useDispatch, useSelector } from 'react-redux';
import MyText from '../../../common/components/MyText';
import {
  copyToClipboard,
  makePhoneCall,
  toastShow,
} from '../../../common/helpers/utils';
import { IconCall } from '../../../common/icons/Contactdetailsicons/iconcall';
import { CopyIcon } from '../../../common/icons/copyicon';
import { EditIcon } from '../../../common/icons/editiconnew';
import TextInputWithIcon from '../../../common/components/textinputwithicon';
import { IconContactDetails } from '../../../common/icons/iconcontactdetails';
import { Select, SelectItem, IndexPath } from '@ui-kitten/components';
import { IconArrowDown } from '../../../common/icons/iconarrowdown';
import { updateTeam } from '../../../common/redux/actions/contact';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const TeamDetails = (props) => {
  const [call, setCall] = useState(false);
  const teamDetails = useSelector((state) => state.teamDetails);

  const item = teamDetails;

  const dispatch = useDispatch();
  const [name, setName] = useState(item.member_name);
  const [email, setEmail] = useState(item.member_email);
  const [password, setPassword] = useState(item.password);
  const [extn, setExtn] = useState(item.agent_extn);
  const [mNo, setMNo] = useState(item.member_num);
  const [access, setAccess] = useState(item.access);
  const [active, setActive] = useState(item.status);

  const { user } = useSelector((state) => state.global);
  const [memberType] = useState([
    { type: `Admin`, value: 1 },
    { type: `Regular`, value: 2 },
    { type: `Group Owner`, value: 3 },
  ]);
  const [selectedIndexMemberType, setSelectedIndexMemberType] = useState(
    new IndexPath(0),
  );
  const [modalView, setModalView] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [teamData, setTeamData] = useState(``);
  const nav = useNavigation();

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
    if (!email) {
      toastShow('Email is required!');
      return;
    }
    if (!password) {
      toastShow('Password is required!');
      return;
    }
    if (!extn) {
      toastShow('Extension is required!');
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
      access,
      status: active,
      member_id: item.member_id,
      member_num: cleanedPhoneNumber.replace(/\s+/g, ''),
      member_email: email,
      member_name: name,
      password,
      agent_extn: extn,
    };
    console.log(obj);
    setModalView(false);
    dispatch(updateTeam(user?.authcode, obj));
    clearData();
  };
  const clearData = () => {
    setModalView(false);
    setName(``);
    setMNo(``);
    setAccess(``);
    setActive(``);
    setPassword(``);
    setEmail(``);
    nav.goBack();
  };
  const insets=useSafeAreaInsets()
  return (
    <>
      <ScrollView style={styles.container}>
        <CustomHeader
          title="Team Details"
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
        <View style={{ alignItems: `center` }}>
          <TouchableOpacity onPress={() => setCall(!call)}>
            <UserAvatar></UserAvatar>
          </TouchableOpacity>
          <Text style={styles.layoutText}>{item.member_name}</Text>
        </View>
        <View>
          <View>
            <View style={styles.group}>
              <Text style={styles.groupText}>{TeamDetailsLabel}</Text>
              <View
                style={{
                  alignItems: `center`,
                  marginHorizontal: rw(5),
                }}
              ></View>
            </View>
            <View
              style={[
                styles.group1,
                { flexDirection: `column`, paddingVertical: rh(1) },
              ]}
            >
              <View style={[styles.group1, styles.group12]}>
                <View style={styles.group3}>
                  <MyText type="help" hint style={{ fontSize: rf(1.4) }}>
                    {MemberNoLabel}
                  </MyText>
                  <TouchableOpacity
                    style={styles.callIconStyle}
                    onPress={() => makePhoneCall(item?.member_num)}
                  >
                    <IconCall size={18} />
                  </TouchableOpacity>
                  <MyText style={{ fontSize: rf(2) }}>
                    {item?.member_num}
                  </MyText>
                </View>
                <View style={styles.group3}>
                  <MyText type="help" hint style={{ fontSize: rf(1.4) }}>
                    {MemberEmailLabel}
                  </MyText>
                  <MyText style={{ fontSize: rf(2) }}>
                    {item?.member_email}
                  </MyText>
                  <TouchableOpacity
                    style={styles.copyIconStyle}
                    onPress={async () =>
                      await copyToClipboard(item?.member_email || 'Unknown')
                    }
                  >
                    <CopyIcon size={18} />
                  </TouchableOpacity>
                </View>
                <View style={styles.group3}>
                  <MyText type="help" hint style={{ fontSize: rf(1.4) }}>
                    {MemberIdLabel}
                  </MyText>
                  <MyText style={{ fontSize: rf(2) }}>{item?.member_id}</MyText>
                </View>
                <View style={styles.group3}>
                  <MyText type="help" hint style={{ fontSize: rf(1.4) }}>
                    {MemberExtLabel}
                  </MyText>
                  <MyText style={{ fontSize: rf(2) }}>
                    {item?.agent_extn}
                  </MyText>
                </View>
                <View style={styles.group3}>
                  <MyText type="help" hint style={{ fontSize: rf(1.4) }}>
                    {MemberTypeLabel}
                  </MyText>
                  <MyText style={{ fontSize: rf(2) }}>
                    {item?.access === `1`
                      ? `Admin`
                      : item?.access === `2`
                        ? `Regular`
                        : `Group owner`}
                  </MyText>
                </View>
                <View style={styles.group3}>
                  <MyText type="help" hint style={{ fontSize: rf(1.4) }}>
                    {MemberStatusLabel}
                  </MyText>
                  <MyText style={{ fontSize: rf(2) }}>
                    {item?.status === `1` ? `Active` : `In Active`}
                  </MyText>
                </View>
                <View style={styles.group3}>
                  <MyText type="help" hint style={{ fontSize: rf(1.4) }}>
                    {MemberTypeLabel}
                  </MyText>
                  <MyText style={{ fontSize: rf(2) }}>{item?.type}</MyText>
                </View>
              </View>
            </View>
          </View>
        </View>
        <ModalBottom
        // edit team modal in detail team screen
        isInsetPadding={true}
          height="26%"
          title={EditTeamLabel}
          from="group"
          open={modalView}
          onClose={() => {
            setModalView(false);
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
            value={extn}
            inputMode={'phone-pad'}
            maxLength={8}
            onChangeText={(text) => setExtn(text)}
            icon={<Text style={{ color: colors.greyNew }}>Ext.</Text>}
          />
          <View style={{ marginVertical: rh(0.5), paddingBottom: insets.bottom }}>
            <Select
              accessoryRight={<IconArrowDown size={14} />}
              selectedIndex={selectedIndexMemberType}
              placeholder={
                item.access === `1`
                  ? `Admin`
                  : item.access === `2`
                    ? `Regular`
                    : item.access === `3`
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
                    <View style={styles.itemTypeStyle}>
                      <Text>{item.type}</Text>
                    </View>
                  )}
                />
              ))}
            </Select>
          </View>
          <View style={{ flexDirection: `row`, marginVertical: rh(2) }}>
            <TouchableOpacity
              style={styles.updateLabelStyle}
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
      </ScrollView>
    </>
  );
};

export default TeamDetails;

const styles = StyleSheet.create({
  callIconStyle: {
    marginTop: rh(1.5),
    position: `absolute`,
    right: 0,
  },
  container: {
    backgroundColor: colors.white,
  },
  copyIconStyle: {
    marginTop: rh(1.5),
    position: `absolute`,
    right: 0,
  },
  group: {
    flexDirection: `row`,
    justifyContent: `space-between`,
    marginBottom: rh(1),
  },
  group1: {
    alignSelf: `center`,
    borderColor: colors.borderColor,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: rw(4),
    width: rw(95),
  },
  group12: { borderWidth: 0, paddingVertical: 0 },
  group3: {
    marginVertical: rh(1),
  },
  groupText: {
    fontFamily: `Inter`,
    fontSize: rh(2),
    fontWeight: `500`,
    marginLeft: rw(3),
    marginVertical: rh(1),
    opacity: 1,
  },
  itemTypeStyle: { flexDirection: 'row', gap: 12 },
  layoutText: {
    fontFamily: `Nunito`,
    fontSize: rh(2.4),
    fontWeight: `600`,
    marginTop: rh(1),
    opacity: 1,
  },
  updateLabelStyle: {
    alignItems: `center`,
    alignSelf: `center`,
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    borderRadius: 5,
    borderWidth: 1,
    flex: 1,
    paddingVertical: rh(0.7),
  },
});
