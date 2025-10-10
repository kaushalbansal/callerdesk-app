import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  View,
  Pressable,
} from 'react-native';
import { Text, IndexPath } from '@ui-kitten/components';
import { colors } from '../../../themes/vars';
import { IconCall } from '../../../common/icons/Contactdetailsicons/iconcall';
import ContactHeader from './ContactHeader';
import { UserAvatar } from '../../../common/icons/useravatar';
import { IconChat } from '../../../common/icons/messageicon';
import { IconPayment } from '../../../common/icons/wpayment';
import { IconLocation } from '../../../common/icons/wlocation';
import { CopyIcon } from '../../../common/icons/copyicon';
import Editcontact from '../CallLog/EditContact';
import PreviewBusinessAddress from '../CallLog/Preview/PreviwBusinessAddress';
import PreviewPayment from '../CallLog/Preview/PreviewPayment';
import ModalBottom from '../../../common/components/ModalBottom';
import {
  DatePart,
  copyToClipboard,
  navigateToLink,
} from '../../../common/helpers/utils';
import {
  Address,
  AssignedMemberLabel,
  ConfirmWA,
  ContactDetailsLabel,
  ContactfilterObjHome,
  DateTime,
  Email,
  LocationLabel,
  MNoLabel,
  PaymentsLabel,
  RedirectText,
  RedirectTextTitle,
  SendLabel,
  Status,
  WABiz,
  contactStatusList,
} from '../../../common/Constants';
import { rf, rh, rw } from '../../../common/helpers/dimentions';
import { MyText } from '../../../common/components/MyText';
import { useDispatch, useSelector } from 'react-redux';
import { EditIcon } from '../../../common/icons/editiconnew';
import ModalMid from '../../../common/components/ModalMid';
import TextInputWithIcon from '../../../common/components/textinputwithicon';
import { handleOpenKeypadDialer } from '../../../common/helpers/dialerHelpers';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NoPermissionModal from '../../../common/helpers/NoPermissionModal';
import NoAppRoutingModal from '../../../common/helpers/NoAppRoutingModal';

const ContactDetail = () => {
  const contactDetails = useSelector((state) => state.contactDetails);
  const [data, setData] = useState(contactDetails);
  const [open, setOpen] = useState(false);
  const _defaultModal = {
    wa: false,
    edit: false,
    payment: false,
    address: false,
    history: false,
  };
  const dispatch = useDispatch();
  const [modals, setModal] = useState({ ..._defaultModal });
  const [mobileNo, setMobileNo] = React.useState(contactDetails.contact_num);
  const wappUrl = `https://api.whatsapp.com/send?phone=${`+91 ${mobileNo}`}`;
  const [filters] = useState({
    ...ContactfilterObjHome,
    status: new IndexPath(0),
  });
  const closeModal = (_data) => {
    setModal({ ..._defaultModal });
    const { yyyy, mm, dd, hh, min, ss } = DatePart(_data?.contact_savedate);
    if (_data)
      setData({
        ...data,
        ..._data,
        contact_savedate: `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`,
      });
  };
  // eslint-disable-next-line no-unused-vars
  const [userRole, setUserRole] = useState();
  const [role, setRole] = useState();
  const [showDiler, setShowDiler] = useState(false);
  const [showDilerAppRoute, setShowDilerAppRoute] = useState(false);
  const { user, selectedDialerMode } = useSelector((state) => state.global);
  const getRole = async () => {
    const ans = await AsyncStorage.getItem('user_role');
    const ansRole = await AsyncStorage.getItem('role');
    setUserRole(ans);
    setRole(ansRole);
  };

  useEffect(() => {
    getRole();
  }, [role]);
  return (
    <>
      <ContactHeader
        title="Contact details"
        hideUserIcon
        right={
          <TouchableOpacity
            onPress={() => {
              setModal({ ...modals, edit: true });
            }}
          >
            <EditIcon color={colors.grey} />
          </TouchableOpacity>
        }
      />
      {modals.edit && (
        <Editcontact
          from={`details`}
          data={contactDetails}
          open={modals.edit}
          onClose={closeModal}
          filters={filters}
        />
      )}
      {modals.address && (
        <PreviewBusinessAddress
          from={`contact`}
          data={contactDetails}
          open={modals.address}
          onClose={closeModal}
        />
      )}
      {modals.payment && (
        <PreviewPayment
          data={contactDetails}
          from={`contact`}
          open={modals.payment}
          onClose={closeModal}
        />
      )}
      <ModalBottom
        title={RedirectTextTitle}
        open={modals.wa}
        onClose={closeModal}
      >
        <View>
          <Text style={styles.redirectTextStyle}>{RedirectText}</Text>
          <TouchableOpacity onPress={() => navigateToLink(wappUrl)}>
            <Text style={styles.waapUrlStyle}>{wappUrl}</Text>
          </TouchableOpacity>
        </View>
      </ModalBottom>
      <ModalMid
        title={ConfirmWA}
        open={modals.whatsappConfirm}
        onClose={closeModal}
      >
        <View style={styles.sendLabelStyle}>
          <TextInputWithIcon
            defaultValue={contactDetails.contact_num}
            inputMode={`number-pad`}
            onChangeText={(text) => setMobileNo(text)}
          ></TextInputWithIcon>
          <Pressable style={styles.btn} onPress={() => navigateToLink(wappUrl)}>
            <Text style={styles.btnText}>{SendLabel}</Text>
          </Pressable>
        </View>
      </ModalMid>
      <ScrollView style={styles.container}>
        <View style={styles.userSection}>
          <View style={{ marginBottom: rh(1) }}>
            <UserAvatar size={rw(18)} />
          </View>
          {contactDetails.contact_name ? (
            <MyText responsiveSize={2} color="black" weight={`700`}>
              {contactDetails.contact_name}
            </MyText>
          ) : (
            // eslint-disable-next-line react-native/no-raw-text
            <MyText responsiveSize={2} color="black" weight={`700`}>
              Unknown
            </MyText>
          )}
        </View>
        <View style={[styles.container1, { marginTop: rh(2) }]}>
          <TouchableOpacity
            onPress={() => setOpen(true)}
            style={[
              styles.layout4,
              {
                borderColor: `rgba(85, 160, 111, 0.33)`,
                backgroundColor: `rgba(85, 160, 111, 0.2)`,
              },
            ]}
          >
            <View style={styles.layout2}>
              <IconChat color={`#55A06F`} size={23} />
              <Text style={[styles.layout3, { color: colors.primary1 }]}>
                {WABiz}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setModal({ ...modals, payment: true })}
            style={[
              styles.layout5,
              { borderColor: `#8A8CFA33`, backgroundColor: `#8A8CFA20` },
            ]}
          >
            <View style={styles.layout2}>
              <IconPayment color={colors.blueBg} size={23} />
              <Text style={[styles.container2, { color: colors.blueBg }]}>
                {PaymentsLabel}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.layoutHead}>
          <TouchableOpacity
            onPress={() => setModal({ ...modals, address: true })}
            style={[
              styles.layout4,
              {
                borderColor: `rgba(240, 158, 84, 0.33)`,
                backgroundColor: `rgba(240, 158, 84, 0.2)`,
              },
            ]}
          >
            <View style={styles.layout2}>
              <IconLocation color={`#F09E54`} size={23} />
              <Text style={[styles.layout3, { color: `#F09E54` }]}>
                {LocationLabel}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.contactLabel}>
          <MyText color="#656565" weight="600" style={{ fontSize: rf(1.4) }}>
            {ContactDetailsLabel}
          </MyText>
        </View>
        <View style={styles.detailCard}>
          <TouchableOpacity
            disabled={contactDetails?.contact_num.slice(-4) === `XXXX`}
            onPress={() =>
              // {() => makePhoneCall(contactDetails.contact_num)}
              {
                if(selectedDialerMode===1){
                setShowDiler(true)
                }else if (
                  user?.appcall_routing_did === null ||
                  user?.appcall_routing_did === ''
                ) {
                  setShowDilerAppRoute(true);
                } else {
                  handleOpenKeypadDialer(
                    dispatch,
                    role,
                    setShowDiler,
                    user,
                    contactDetails?.contact_num?.slice(-10),
                    'list',
                  );
                }
              }
            }
          >
            <View style={styles.row}>
              <MyText
                type="help"
                hint
                style={{ fontSize: rf(1.4) }}
                color={colors.grey}
              >
                {MNoLabel}
              </MyText>
              <View style={styles.contactCallIcon}>
                <IconCall
                  size={18}
                  color={
                    contactDetails?.contact_num.slice(-4) === `XXXX`
                      ? colors.lightGreyNewLess
                      : colors.grey
                  }
                />
              </View>
            </View>
            <MyText
              style={{ fontSize: rf(2) }}
              // eslint-disable-next-line react-native/no-raw-text
            >{`+91 ${contactDetails.contact_num}`}</MyText>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={async () =>
              await copyToClipboard(contactDetails.contact_email || 'Unknown')
            }
          >
            <View style={styles.row}>
              <MyText type="help" hint style={{ fontSize: rf(1.4) }}>
                {Email}
              </MyText>
              <View style={styles.copyIcon}>
                <CopyIcon size={18} />
              </View>
            </View>
            <MyText style={{ fontSize: rf(2) }}>
              {contactDetails.contact_email || 'Unknown'}
            </MyText>
          </TouchableOpacity>
          <View>
            <MyText type="help" hint style={{ fontSize: rf(1.4) }}>
              {Address}
            </MyText>
            <View style={styles.row}>
              <MyText style={{ fontSize: rf(2) }}>
                {contactDetails.contact_address || 'Unknown'}
              </MyText>
            </View>
          </View>
          <View>
            <MyText type="help" hint style={{ fontSize: rf(1.4) }}>
              {Status}
            </MyText>
            <View style={styles.row}>
              <MyText style={{ fontSize: rf(2) }}>
                {contactStatusList[+contactDetails.contact_status].name}
              </MyText>
            </View>
          </View>
          <View>
            <MyText type="help" hint style={{ fontSize: rf(1.4) }}>
              {DateTime}
            </MyText>
            <View style={styles.row}>
              <MyText style={{ fontSize: rf(2) }}>
                {contactDetails?.contact_savedate}
              </MyText>
            </View>
          </View>
          <View>
            <MyText type="help" hint style={{ fontSize: rf(1.4) }}>
              {AssignedMemberLabel}
            </MyText>
            <View style={styles.row}>
              <MyText style={{ fontSize: rf(2) }}>
                {contactDetails.member_name || 'Unknown'}
              </MyText>
            </View>
          </View>
        </View>
        <ModalMid
          height="24%"
          title={ConfirmWA}
          open={open}
          onClose={() => {
            setOpen(false);
          }}
          from={`payment`}
        >
          <View style={styles.sendLabelStyleView}>
            <TextInputWithIcon
              defaultValue={mobileNo}
              inputMode={`number-pad`}
              onChangeText={(text) => setMobileNo(text)}
            ></TextInputWithIcon>
            <Pressable
              style={styles.btn}
              onPress={() => {
                console.log(wappUrl);
                navigateToLink(wappUrl);
              }}
            >
              <Text style={styles.btnText}>{SendLabel}</Text>
            </Pressable>
          </View>
        </ModalMid>
        <NoPermissionModal showDiler={showDiler} setShowDiler={setShowDiler} dialerMode={selectedDialerMode} />
        <NoAppRoutingModal
          showDiler={showDilerAppRoute}
          setShowDiler={setShowDilerAppRoute}
        />
      </ScrollView>
    </>
  );
};
export default ContactDetail;

const styles = StyleSheet.create({
  btn: {
    alignSelf: `center`,
    backgroundColor: colors.primary,
    borderRadius: 6,
    marginTop: rh(1),
    paddingVertical: rh(1),
    width: rw(85),
  },
  btnText: { color: colors.white, fontWeight: `700`, textAlign: `center` },
  contactCallIcon: { marginTop: rh(1.5), position: `absolute`, right: 0 },
  contactLabel: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: rw(2),
    marginVertical: rh(1.5),
    paddingHorizontal: 8,
  },
  container: {
    backgroundColor: colors.white,
    flex: 1,
    paddingHorizontal: rw(3.5),
    paddingVertical: rh(2),
  },
  container1: { flexDirection: `row`, justifyContent: `space-between` },
  container2: { color: colors.blueBg, marginHorizontal: rw(1) },
  copyIcon: { marginTop: rh(1.5), position: `absolute`, right: 0 },
  detailCard: {
    alignSelf: `center`,
    borderColor: `#DADADA`,
    borderRadius: 10,
    borderWidth: 1,
    gap: 16,
    paddingHorizontal: rw(4),
    paddingVertical: rh(1.5),
    width: rw(93),
  },
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
  layoutHead: { marginTop: rh(1) },
  redirectTextStyle: { fontSize: rf(2), textAlign: 'center' },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  sendLabelStyle: { alignItems: 'center', justifyContent: 'center' },
  sendLabelStyleView: {
    alignItems: 'center',
    gap: 10,
    justifyContent: 'center',
  },
  userSection: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  waapUrlStyle: {
    color: colors.primary,
    fontSize: rf(2),
    textAlign: 'center',
  },
});
