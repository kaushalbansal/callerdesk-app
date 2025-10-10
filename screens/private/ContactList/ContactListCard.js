/* eslint-disable react-native/no-raw-text */
import React, { useEffect, useMemo } from 'react';
import { Pressable, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Layout, Text } from '@ui-kitten/components';

import { colors } from '../../../themes/vars';
import { IconCold } from '../../../common/icons/iconcold';
import { IconWarm } from '../../../common/icons/iconwarm';
import { IconHot } from '../../../common/icons/iconhot';
import { IconInvalid } from '../../../common/icons/contactstatus';
import { IconProspect } from '../../../common/icons/iconprospect';
import { IconDisqualified } from '../../../common/icons/icondisqualified';
import { rf, rh, rw } from '../../../common/helpers/dimentions';
import {
  getRandomColor,
  copyToClipboard,
  navigateToLink,
  formatCallLogDate,
  sendSms,
} from '../../../common/helpers/utils';
import { CopyIconNew } from '../../../common/icons/copyiconnew';
import { Money } from '../../../common/icons/money';
import { WABiz } from '../../../common/icons/wabiz';
import PreviewPayment from '../CallLog/Preview/PreviewPayment';
import PreviewBusinessAddress from '../CallLog/Preview/PreviwBusinessAddress';
import Editcontact from '../CallLog/EditContact';
import ModalBottom from '../../../common/components/ModalBottom';
import CallDownload from '../CallLog/CallDownload';
import {
  ChooseOption,
  ClickText,
  ConfirmWA,
  CreateContactLabel,
  DeletekText,
  RedirectText,
  RedirectTextTitle,
  SendLabel,
  SendPreConfigure,
  SendWhatsappBiz,
  SendWhatsappBizTitle,
  SendWhatsappInstant,
  SendWhatsappLocation,
  SendWhatsappLocationTitle,
} from '../../../common/Constants';
import { TextIcon } from '../../../common/icons/texticon';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { InfoIcon } from '../../../common/icons/infoicon';
import { CallPhone } from '../../../common/icons/callphone';
import { SmsIcon } from '../../../common/icons/smsicon';
import ModalMid from '../../../common/components/ModalMid';
import MyText from '../../../common/components/MyText';
import { IconLocation } from '../../../common/icons/wlocation';
import { EditIcon } from '../../../common/icons/editiconnew';
import CreateContact from './CreateContact';
import TextInputWithIcon from '../../../common/components/textinputwithicon';
// import Swipeout from 'react-native-swipeout';
// import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { IconDelete1 } from '../../../common/icons/icondelete1';
import { useDispatch, useSelector } from 'react-redux';
import { handleOpenKeypadDialer } from '../../../common/helpers/dialerHelpers';
import PropTypes from 'prop-types';
import NoPermissionModal from '../../../common/helpers/NoPermissionModal';
import NoAppRoutingModal from '../../../common/helpers/NoAppRoutingModal';
import { IconGoBack } from '../../../common/icons/goback';

const ContactListCard = ({ data, onSelect, navFunction, onDelete }) => {
  const bg = useMemo(() => getRandomColor(), []);
  // eslint-disable-next-line no-unused-vars
  const [showDiler, setShowDiler] = React.useState(false);
  const [showDilerAppRoute, setShowDilerAppRoute] = React.useState(false);
  const [mobileNo, setMobileNo] = React.useState(data.contact_num);
  const [openCreateModal, setOpenCreateModal] = React.useState(false);
  const [choosePre, setChoosePre] = React.useState(false);

  const wappUrl = `https://api.whatsapp.com/send?phone=+91${mobileNo}&text= `;
  const swipeBtns = [
    {
      component: (
        <View style={styles.swipeBtnStyle}>
          <IconDelete1 size={20} />
        </View>
      ),
      backgroundColor: 'white',
      underlayColor: 'transparent',
      onPress: () => {
        onDelete(data, true);
      },
    },
  ];
  const renderSwipeRightAction=()=>{
    return (
      <TouchableOpacity onPress={()=>onDelete(data, true)}>
      <View style={styles.swipeBtnStyle}>
          <IconDelete1 size={rf(2.8)} />
        </View>
        </TouchableOpacity>
    )
  }
  const { user, selectedDialerMode } = useSelector((state) => state.global);
  const dispatch = useDispatch();

  const _defaultModal = {
    whatsapp: false,
    blockUser: false,
    paymentUpi: false,
    businessAddress: false,
    editContact: false,
    fileDownload: false,
    info: false,
    whatsappConfirm: false,
  };
  const closeModal = () => {
    setMobileNo(data.contact_num);
    setModals({ ..._defaultModal });
  };
  const dialerOpen = async () => {
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
        data?.contact_num,
        'list',
      );
    }
  };
  const [modals, setModals] = React.useState(_defaultModal);
  const closeModalNew = () => {
    setOpenCreateModal(false);
  };

  // eslint-disable-next-line no-unused-vars
  const [userRole, setUserRole] = React.useState();
  const [role, setRole] = React.useState();
  const getRole = async () => {
    const ans = await AsyncStorage.getItem('user_role');
    const ansRole = await AsyncStorage.getItem('role');
    setUserRole(ans);
    setRole(ansRole);
  };

  useEffect(() => {
    getRole();
  }, []);
  const CreateEditContact = () => {
    return !data.member_name ? (
      openCreateModal && (
        <ModalBottom
          open={openCreateModal}
          title={CreateContactLabel}
          onClose={() => setOpenCreateModal(false)}
        >
          <CreateContact meta={{}} onClose={() => setOpenCreateModal(false)} />
        </ModalBottom>
      )
    ) : (
      <Editcontact
        from={`list`}
        data={data}
        open={openCreateModal}
        onClose={() => {
          closeModalNew();
        }}
      />
    );
  };

  return (
    <View style={styles.ContactCard}>
      {
        <PreviewPayment
          from={`contact`}
          data={data}
          open={modals.paymentUpi}
          onClose={closeModal}
        />
      }

      {modals.businessAddress && (
        <PreviewBusinessAddress
          from={`contact`}
          fromScreen={`contact`}
          data={data}
          open={modals.businessAddress}
          onClose={closeModal}
        />
      )}

      {modals.editContact && (
        <Editcontact
          from={`list`}
          data={data}
          open={modals.editContact}
          onClose={() => {
            closeModal();
          }}
        />
      )}
      {modals.fileDownload && data.file && (
        <CallDownload
          data={data}
          open={modals.fileDownload}
          onClose={closeModal}
        />
      )}
      <ModalBottom
        height="24%"
        title={RedirectTextTitle}
        open={modals.whatsapp}
        onClose={closeModal}
      >
        <View style={styles.redirectViewStyle}>
          <Text style={styles.redirectTextStyle}>{RedirectText}</Text>
          <TouchableOpacity onPress={() => navigateToLink(wappUrl)}>
            <Text style={styles.wappUrlStyle}>{wappUrl}</Text>
          </TouchableOpacity>
        </View>
      </ModalBottom>
      {/* <ModalMid
        height="24%"
        title={ChooseOption}
        open={modals.info}
        onClose={closeModal}
      >
        <View style={styles.list}>
          <TouchableOpacity
            style={styles.chooseStyle}
            onPress={() =>
              setModals({ ..._defaultModal, whatsappConfirm: true })
            }
          >
            <WABiz size={20}></WABiz>
            <View style={styles.chooseTextStyle}>
              <MyText bold responsiveSize={1.9}>
                {SendWhatsapp}
              </MyText>
              <Text style={styles.textStyle}>{SendWhatsappTitle}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.chooseStyle}
            onPress={() => setModals({ ..._defaultModal, paymentUpi: true })}
          >
            <Money size={20}></Money>
            <View style={styles.chooseTextStyle}>
              <MyText bold responsiveSize={1.9}>
                {SendWhatsappBiz}
              </MyText>
              <Text style={styles.textStyle}>{SendWhatsappBizTitle}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.chooseStyle}
            onPress={() =>
              setModals({ ..._defaultModal, businessAddress: true })
            }
            activeOpacity={0.6}
          >
            <IconLocation color={colors.warning} size={rw(6)} />
            <View style={styles.chooseTextStyle}>
              <MyText bold responsiveSize={1.9}>
                {SendWhatsappLocation}
              </MyText>
              <Text style={styles.textStyle}>{SendWhatsappLocationTitle}</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ModalMid> */}
      <ModalBottom
        height="40%"
        title={ChooseOption}
        open={modals.info}
        onClose={closeModal}
        hideTitle={choosePre}
      >
        <View style={styles.rowStyle}>
          {!choosePre && (
            <TouchableOpacity
              style={styles.chooseStyle}
              onPress={() =>
                setModals({ ..._defaultModal, whatsappConfirm: true })
              }
            >
              <WABiz size={20}></WABiz>
              <View style={styles.chooseTextStyle}>
                <MyText bold responsiveSize={1.9}>
                  {SendWhatsappInstant}
                </MyText>
                {/* <Text style={styles.textStyle}>{SendWhatsappTitle}</Text> */}
              </View>
            </TouchableOpacity>
          )}
          {!choosePre && (
            <TouchableOpacity
              style={styles.chooseStyle}
              // onPress={() => setModals({ ..._defaultModal, paymentUpi: true })}
              onPress={() => setChoosePre(!choosePre)}
            >
              <Money size={20}></Money>
              <View style={styles.chooseTextStyle}>
                <MyText bold responsiveSize={1.9}>
                  {SendPreConfigure}
                </MyText>
                {/* <Text style={styles.textStyle}>{SendWhatsappBizTitle}</Text> */}
              </View>
            </TouchableOpacity>
          )}
          {choosePre && (
            <TouchableOpacity
              style={[
                styles.chooseStyle,
                {
                  width: rw(95),
                  marginTop: rh(-2),
                  marginLeft: rw(1),
                  paddingVertical: rh(1),
                },
              ]}
              // onPress={() => setModals({ ..._defaultModal, paymentUpi: true })}
              onPress={() => setChoosePre(!choosePre)}
            >
              <IconGoBack size={20}></IconGoBack>
              <View style={styles.chooseTextStyle}>
                <MyText bold responsiveSize={1.9}>
                  Back
                </MyText>
                {/* <Text style={styles.textStyle}>{SendWhatsappBizTitle}</Text> */}
              </View>
            </TouchableOpacity>
          )}
          {choosePre && (
            <TouchableOpacity
              style={styles.chooseStyle}
              onPress={() => setModals({ ..._defaultModal, paymentUpi: true })}
            >
              <Money size={20}></Money>
              <View style={styles.chooseTextStyle}>
                <MyText bold responsiveSize={1.9}>
                  {SendWhatsappBiz}
                </MyText>
                <Text style={styles.textStyle}>{SendWhatsappBizTitle}</Text>
              </View>
            </TouchableOpacity>
          )}
          {choosePre && (
            <TouchableOpacity
              style={styles.chooseStyle}
              onPress={() =>
                setModals({ ..._defaultModal, businessAddress: true })
              }
              activeOpacity={0.6}
            >
              <IconLocation color={colors.warning} size={rw(6)} />
              <View style={styles.chooseTextStyle}>
                <MyText bold responsiveSize={1.9}>
                  {SendWhatsappLocation}
                </MyText>
                <Text style={styles.textStyle}>
                  {SendWhatsappLocationTitle}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
      </ModalBottom>
      <ModalMid
        // height="24%"
        title={ConfirmWA}
        open={modals.whatsappConfirm}
        onClose={closeModal}
      >
        <View style={styles.sendLabelStyle}>
          <TextInputWithIcon
            defaultValue={data.contact_num}
            inputMode={`number-pad`}
            onChangeText={(text) => setMobileNo(text)}
          ></TextInputWithIcon>
          <Pressable style={styles.btn} onPress={() => navigateToLink(wappUrl)}>
            <Text style={styles.btnText}>{SendLabel}</Text>
          </Pressable>
        </View>
      </ModalMid>
      <Layout>
        <Pressable
          onPress={() => navFunction(data)}
          style={[cardStyle.leftBox, { paddingTop: rh(1) }]}
        >
          <View>
            <View
              style={{
                flexDirection: `row`,
                width: rw(85),
                alignSelf: `center`,
                marginTop: rh(-0.2),
              }}
            >
              <View
                style={[
                  cardStyle.circle,
                  { backgroundColor: bg, marginLeft: rw(-2) },
                ]}
              >
                <Text style={{ color: colors.white, fontSize: rf(1.8) }}>
                  {data.contact_name
                    ? data.contact_name[0].toLocaleUpperCase()
                    : 'U'}
                </Text>
              </View>
              <View style={cardStyle.nameBox}>
                <Text style={{ fontSize: rf(1.8) }}>
                  {data.contact_name || 'Unknown'}
                </Text>
                <Text appearance="hint" style={{ fontSize: rf(1.5) }}>
                  {data.contact_num} by{' '}
                  {data.member_name ? data.member_name : `Unknown`}
                </Text>
                <Text appearance="hint" style={{ fontSize: rf(1.5) }}>
                  {formatCallLogDate(data.contact_savedate)}
                </Text>
              </View>
              <View style={cardStyle.nameBox1}>
                {data.contact_status === '1' && (
                  <IconHot color={colors.error} />
                )}
                {data.contact_status === '2' && (
                  <IconWarm color={colors.primary} />
                )}
                {data.contact_status === '3' && (
                  <IconCold color={colors.link} />
                )}
                {data.contact_status === '4' && (
                  <IconInvalid color={colors.error} />
                )}
                {data.contact_status === '5' && (
                  <IconDisqualified color={colors.grey} />
                )}
                {data.contact_status === '6' && (
                  <IconProspect color={colors.blue} />
                )}
              </View>
            </View>
          </View>
          {openCreateModal && <CreateEditContact />}
          <View style={styles.bottom}>
            <TouchableOpacity
              style={styles.iconsButton}
              onPress={() => {
                copyToClipboard(data.contact_num);
              }}
            >
              <CopyIconNew size={16} color={colors.grey}></CopyIconNew>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconsButton}
              onPress={() => sendSms(data.contact_num, ``)}
            >
              <SmsIcon size={16} color={colors.grey}></SmsIcon>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconsButton}
              // disabled={data.contact_num.slice(-4) == `XXXX`}
              onPress={() => setModals({ ..._defaultModal, info: true })}
            >
              <InfoIcon size={16} color={colors.grey}></InfoIcon>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconsButton}
              onPress={() => onSelect(data, true)}
            >
              <EditIcon size={16} color={colors.grey}></EditIcon>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconsButton}
              onPress={() => dialerOpen()}
            >
              <CallPhone size={16} />
            </TouchableOpacity>
          </View>
          <Swipeable
            renderRightActions={renderSwipeRightAction}
            autoClose={true}
            backgroundColor="transparent"
            containerStyle={{ width: rw(95), alignSelf: `center` }}
          >
            <View style={styles.swipeView}>
              <TextIcon size={16}></TextIcon>
              <Text style={styles.swipeText}>
                {ClickText} {DeletekText}
              </Text>
            </View>
          </Swipeable>
        </Pressable>
      </Layout>
      <NoPermissionModal showDiler={showDiler} setShowDiler={setShowDiler} dialerMode={selectedDialerMode}/>

      <NoAppRoutingModal
        showDiler={showDilerAppRoute}
        setShowDiler={setShowDilerAppRoute}
      />
    </View>
  );
};
export default ContactListCard;
ContactListCard.propTypes = {
  data: PropTypes.shape({
    type: PropTypes.string,
    contact_num: PropTypes.string,
    callresult: PropTypes.string,
    contact_status: PropTypes.string,
    file: PropTypes.string,
    member_name: PropTypes.string,
    contact_savedate: PropTypes.string,
    startdatetime: PropTypes.string,
    contact_name: PropTypes.string,
    member_num: PropTypes.string,
    created_at: PropTypes.string,
    id: PropTypes.string,
    sid_id: PropTypes.string,
  }),
  bg: PropTypes.string,
  index: PropTypes.number,
  customerName: PropTypes.string,
  onSelect: PropTypes.func,
  navFunction: PropTypes.func,
  onDelete: PropTypes.func,
};
const styles = StyleSheet.create({
  ContactCard: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: `center`,
    marginVertical: rh(0.5),
    width: '100%',
    // paddingVertical: rh(1),
  },
  bottom: {
    alignSelf: `center`,
    flexDirection: 'row',
    justifyContent: `space-between`,
    width: `90%`,
  },
  btn: {
    alignSelf: `center`,
    backgroundColor: colors.primary,
    borderRadius: 6,
    marginTop: rh(1),
    paddingVertical: rh(1),
    width: rw(85),
  },
  btnText: { color: colors.white, fontWeight: `700`, textAlign: `center` },
  chooseStyle: {
    alignItems: `center`,
    flexDirection: `row`,
    marginHorizontal: rw(5),
  },
  chooseTextStyle: {
    marginHorizontal: rw(2),
  },
  iconsButton: {
    justifyContent: `center`,
  },
  redirectTextStyle: { fontSize: 20, textAlign: 'center' },
  redirectViewStyle: {
    alignItems: 'center',
    gap: 10,
    justifyContent: 'center',
  },
  rowStyle: {
    gap: 10,
    marginVertical: rh(2),
  },
  sendLabelStyle: { alignItems: 'center', justifyContent: 'center' },
  swipeBtnStyle: {
    alignItems: `center`,
    backgroundColor: colors.primary,
    borderBottomEndRadius: 6,
    borderColor: `#C4C4C4`,
    borderTopRightRadius: 6,
    borderWidth: 1,
    height: rh(4),
    justifyContent: `center`,
    marginTop: rh(0.7),
    width: rw(12),
  },
  swipeText: { color: colors.swipe, fontSize: 11, paddingLeft: `2%` },
  swipeView: {
    alignItems: `center`,
    backgroundColor: colors.swipeBg,
    borderBottomLeftRadius: 10,
    flexDirection: `row`,
    marginTop: rh(0.7),
    paddingHorizontal: 12,
    paddingVertical: rh(1),
    width: '100%',
  },
  textStyle: {
    fontSize: rf(1.5),
  },
  wappUrlStyle: {
    color: colors.primary,
    fontSize: 18,
    textAlign: 'center',
  },
});
const cirleDim = 45;
const cardStyle = StyleSheet.create({
  circle: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: colors.white,
    borderRadius: cirleDim,
    elevation: 4,
    height: cirleDim,
    justifyContent: 'center',
    width: cirleDim,
  },
  leftBox: {
    alignSelf: `center`,
    backgroundColor: colors.white,
    borderRadius: 10,
    elevation: 3,
    marginVertical: rh(0),
    width: rw(95),
  },
  nameBox: {
    height: rh(7),
    justifyContent: 'center',
    paddingLeft: rw(1.5),
    width: rw(67),
  },
  nameBox1: {
    height: rh(6),
    justifyContent: 'center',
    marginLeft: rw(5),
  },
});
