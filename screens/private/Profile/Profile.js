/* eslint-disable react-native/no-raw-text */
import {
  StyleSheet,
  View,
  ScrollView,
  Pressable,
  TouchableOpacity,
  NativeModules,
  PermissionsAndroid,
  Alert,
  Linking
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import { Text } from '@ui-kitten/components';
import { useDispatch, useSelector } from 'react-redux';

import CustomSwitch from '../../../common/components/switch';
import { colors, urls } from '../../../themes/vars';
import { UserAvatar } from '../../../common/icons/useravatar';
import { IconEdit } from '../../../common/icons/iconedit';
import { CopyIcon } from '../../../common/icons/copyicon';
import { IconArrowRight } from '../../../common/icons/iconarrowright';
import { IconLogout } from '../../../common/icons/iconlogout';
import EditProfile from './EditProfile';
import { rf, rh, rw } from '../../../common/helpers/dimentions';
import { MyText } from '../../../common/components/MyText';
import { Radio, RadioGroup} from '@ui-kitten/components';
import {
  copyToClipboard,
  navigateToLink,
  onLogout,
  removeWhatsappUser,
} from '../../../common/helpers/utils';
import { MyView } from '../../../common/components/MyView';
import {
  AboutOurAppLabel,
  AvailableLabel,
  HelpLabel,
  LegalLabel,
  LogoutAlertHead,
  LogoutText,
  LogoutWarningLabel,
  MyWATempLabel,
  ProfileAndBilling,
  RateOurAppLabel,
  SettingsLabel,
  SupportLabel,
  Version,
  VoiceTempLabel,
  WATempLabel,
  versionName,
} from '../../../common/Constants';
import { TwitterIcon } from '../../../common/icons/twittericon';
import { LinkedinIcon } from '../../../common/icons/linkedinicon';
import { InstagramIcon } from '../../../common/icons/instagramicon';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WATempIcon } from '../../../common/icons/waicontemp';
import { VoiceIcon } from '../../../common/icons/voiceiconprofile';
import { HelpIcon } from '../../../common/icons/helpicon';
import { AboutIcon } from '../../../common/icons/abouticon';
import { RateIcon } from '../../../common/icons/rateicon';
import { LegalIcon } from '../../../common/icons/legalicon';
import ModalBottom from '../../../common/components/ModalBottom';
import { HomeLoader } from '../../../common/helpers/homeLoader';
import PropTypes from 'prop-types';
import { Money } from '../../../common/icons/money';
import { resetWhatsappUser } from '../../../common/redux/actions/whatsappEmbedSignup';
import ModalMid from '../../../common/components/ModalMid';
import { setDialerMode } from '../../../common/redux/actions/global';

const Profile = () => {
  const [data, setData] = useState({ edit: false });
  const [logoutModal, setLogoutModal] = useState(false);
  const [showDialerSelecteModal, setDialerSelectModal]=useState(false)
  const { user, profile, selectedDialerMode } = useSelector((state) => state.global);
  const nav = useNavigation();
  // eslint-disable-next-line no-unused-vars
  const [userRole, setUserRole] = useState();
  const [role, setRole] = useState();
  const [loading, setLoading] = useState(true);
  const dispatch=useDispatch()
  const {whatsappAccessToken, whatsappIntegration}=useSelector((state)=>state?.whatsappEmbedSingnup)
  const isWhatsappRegister=whatsappAccessToken && whatsappIntegration
  const showMyWAText = role !== '3' && isWhatsappRegister;
  const showVoice   = role !== '3';

  const getRole = async () => {
    const ans = await AsyncStorage.getItem('user_role');
    const ansRole = await AsyncStorage.getItem('role');
    setUserRole(ans);
    setRole(ansRole);
    setLoading(false);
  };
  useEffect(() => {
    getRole();
  });

  const ListCard = ({
    disabled = false,
    title = '',
    mt = 0,
    onPress = () => {},
    icon,
  }) => {
    return (
      <TouchableOpacity onPress={onPress} disabled={disabled}>
        <View style={[styles.flexRow, { marginTop: mt }]}>
          <View style={styles.iconView}>
            <>{icon}</>
            <Text style={{ fontSize: rf(1.8), marginLeft: rw(3) }}>
              {title}
            </Text>
          </View>
          <View style={styles.iconRight}>
            <IconArrowRight />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  ListCard.propTypes = {
    disabled: PropTypes.bool,
    title: PropTypes.string,
    mt: PropTypes.number,
    onPress: PropTypes.func,
    navFunction: PropTypes.func,
    icon: PropTypes.node,
  };

  const handleLogout=()=>{
    if(role === '3'){
      // need to uncomment this follows lines must
      // const { KeypadDialerModule } = NativeModules;
      // KeypadDialerModule.clearOtpVerification()
    }
    onLogout(`logout screen`);
    removeWhatsappUser()
    dispatch(resetWhatsappUser())
  }

  const AvailableForCalls = ({ title = '', ActionComponent, mt = 0 }) => {
    return (
      // eslint-disable-next-line react-native/no-inline-styles
      <View style={[styles.flexRow, { marginBottom: 0, marginTop: mt }]}>
        <View style={styles.titleStyle}>
          <MyText>{title}</MyText>
        </View>
        <View style={styles.actionStyle}>{ActionComponent}</View>
      </View>
    );
  };
  AvailableForCalls.propTypes = {
    title: PropTypes.string,
    mt: PropTypes.number,
    ActionComponent: PropTypes.node,
  };
  if (loading) {
    return <HomeLoader />;
  }


  const handleSelectDialerMode = async (index) => {
    // "App" only needs no permission
    if (index === 0) {

      dispatch(setDialerMode(index))
      return;
    }

    // Only Android supports READ_CALL_LOG
    if (Platform.OS !== 'android') {
      dispatch(setDialerMode(index))
      return;
    }

    const permission = PermissionsAndroid.PERMISSIONS.READ_CALL_LOG;

    // Check existing status
    const hasPermission = await PermissionsAndroid.check(permission);
    if (hasPermission) {
       dispatch(setDialerMode(index))
      return;
    }

    // Request permission
    const result = await PermissionsAndroid.request(permission,
      {
        title: 'Call Log Permission',
        message: 'This app needs access to your call log to enable SIM or Both mode.',
        buttonPositive: 'OK',
        buttonNegative: 'Cancel',
      }
    );

    if (result === PermissionsAndroid.RESULTS.GRANTED) {
      dispatch(setDialerMode(index))
    } else if (result === PermissionsAndroid.RESULTS.DENIED) {
      Alert.alert(
        'Permission Denied',
        'You need to grant call log permission to select this mode.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open Settings', onPress: () => Linking.openSettings() },
        ],
        { cancelable: true }
      );
    } else if (result === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
      Alert.alert(
        'Permission Blocked',
        'Call log permission is blocked. Please enable it from settings to proceed.',
        [
          { text: 'Open Settings', onPress: () => Linking.openSettings() },
          { text: 'Cancel', style: 'cancel' },
        ],
        { cancelable: true }
      );
    }
  };

  const renderSelectDialerMode = () => {
    return (
      <ModalMid
        open={showDialerSelecteModal}
        onClose={() => setDialerSelectModal(false)}
        title={'Select Dialer Mode'}
      >
        <View>
          <RadioGroup
            selectedIndex={selectedDialerMode}
            onChange={handleSelectDialerMode}
            style={{  paddingHorizontal: rw(1)}}
          >
            <Radio style={styles.radioStyle}>
              App
            </Radio>
            <Radio style={styles.radioStyle}>
              Sim
            </Radio>
            <Radio style={styles.radioStyle}>
              Both
            </Radio>
          </RadioGroup>

        </View>
      </ModalMid>
    )
  }

  return (
    <ScrollView style={styles.container}>
      <EditProfile
        open={data.edit}
        profile={profile}
        onClose={() => setData({ ...data, edit: false })}
      />
      <View style={styles.content}>
        <View style={[styles.flexRow, { marginTop: rh(0) }]}>
          <View style={styles.userAvatar}>
            <UserAvatar size={rw(18)} />
            <View>
              <MyText hint>
                {user?.fname || 'Unknown'} {user?.lname}
              </MyText>
              <MyText hint>{user?.mobile_no || 'Unknown'}</MyText>
              <MyText responsiveSize={2.4}>
                {user?.user_name || 'Unknown'}
              </MyText>
            </View>
          </View>
          <View style={styles.iconEdit}>
            <TouchableOpacity onPress={() => setData({ ...data, edit: true })}>
              <MyView p={rw(2)}>
                <IconEdit size={rw(4.5)} color={colors.link} />
              </MyView>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.callCard}>
          <View style={[styles.flexRow, styles.flexRow1]}>
            <View style={styles.profileStyle}>
              <View style={{ paddingBottom: rh(2), paddingLeft: rw(2) }}>
                <MyText type="heading">
                  {profile?.login_account?.company_name || ''}
                </MyText>
                <MyText
                  type="heading"
                  responsiveSize={2.4}
                  color={colors.primary}
                >
                  {user?.appcall_routing_did?.split(',')[0] || 'Unknown'}
                </MyText>
              </View>
              <View style={{ paddingRight: rw(1) }}>
                <TouchableOpacity
                  onPress={async () =>
                    await copyToClipboard(
                      user?.appcall_routing_did?.split(',')[0] || '',
                    )
                  }
                >
                  <CopyIcon size={rw(4)} />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.availableStyle}>
            <AvailableForCalls
              title={AvailableLabel}
              ActionComponent={<CustomSwitch checked />}
            />
          </View>

          <View style={styles.arrayStyle}>
            {Array.from({ length: 50 }, (_, index) => (
              <View key={index} style={styles.ribonCircles}></View>
            ))}
          </View>
        </View>
        {showVoice &&(
          <MyText
            style={styles.waTextStyle }
          >
            {MyWATempLabel}
          </MyText>
        )}
        {( showMyWAText && <View>
            <ListCard
              icon={<WATempIcon size={15}></WATempIcon>}
              title={WATempLabel}
              // onPress={() => nav.navigate('Chat')}
               onPress={() => nav.navigate('WhatsappTemplateScreen')}
              mt={rh(0.5)}
            />
         
          </View>
        )}
        {!showVoice ? (
          <View style={{ height: rh(1) }}></View>
        ) : (
          <View>
            <ListCard
              icon={<VoiceIcon size={15}></VoiceIcon>}
              title={VoiceTempLabel}
              onPress={() => nav.navigate('VoiceTemplate')}
            />
          </View>
        )}

        {selectedDialerMode!==0 && !showVoice && (
        <View>
            <ListCard
              icon={<VoiceIcon size={15}></VoiceIcon>}
              title={'Sim Call Log'}
              onPress={() => nav.navigate('SimCallLog')}
            />
          </View>
          )}
        <MyText
          style={{
            fontSize: rf(2.2),
            marginTop: rh(0),
            marginBottom: rh(1),
            color: colors.black,
            fontWeight: `500`,
          }}
        >
          {SettingsLabel}
        </MyText>
        {!showVoice && (
         <ListCard
          title={'Select Dialer mode'}
          icon={<VoiceIcon size={15}></VoiceIcon>}
          onPress={() => setDialerSelectModal(true)}
        />
        )}
        <ListCard
          title={AboutOurAppLabel}
          icon={<AboutIcon size={15}></AboutIcon>}
          onPress={() => nav.navigate('AboutApp')}
        />
        {role === `2` && (
          <ListCard
            title={ProfileAndBilling}
            icon={<Money size={15}></Money>}
            onPress={() => nav.navigate('PaymentDetails')}
          />
        )}
        <ListCard
          title={SupportLabel}
          icon={<HelpIcon size={15}></HelpIcon>}
          onPress={() => {
            nav.navigate('SupportScreen');
          }}
          mt={rh(0.5)}
        />
        <ListCard
          title={LegalLabel}
          icon={<LegalIcon size={15}></LegalIcon>}
          onPress={() => nav.navigate('LegalScreen')}
        />
        <ListCard
          title={RateOurAppLabel}
          icon={<RateIcon size={15}></RateIcon>}
          onPress={() =>
            navigateToLink(
              `https://play.google.com/store/apps/details?id=com.callerdesk&hl=en_IN&gl=US&pli=1`,
            )
          }
        />
        <View>
          <Pressable style={styles.btn} onPress={() => setLogoutModal(true)}>
            <IconLogout color="white" />
            <Text style={styles.btnText}>{LogoutText}</Text>
          </Pressable>
          <View
            style={{
              justifyContent: `center`,
              alignItems: `center`,
              marginTop: rh(1),
            }}
          >
            <MyText type={HelpLabel} bold>
              {Version} {versionName}
            </MyText>
          </View>
          <View style={styles.socialMedia}>
            <TouchableOpacity
              style={styles.socialMediaIcon}
              onPress={() => navigateToLink(urls.linkedin)}
            >
              <LinkedinIcon size={15}></LinkedinIcon>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.socialMediaIcon}
              onPress={() => navigateToLink(urls.twitter)}
            >
              <TwitterIcon size={15}></TwitterIcon>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.socialMediaIcon}
              onPress={() => navigateToLink(urls.instagram)}
            >
              <InstagramIcon size={15}></InstagramIcon>
            </TouchableOpacity>
          </View>
        </View>
        <ModalBottom
          open={logoutModal}
          onClose={() => setLogoutModal(false)}
          title={LogoutWarningLabel}
        >
          <Text
            style={{
              color: colors.primary,
              textAlign: `center`,
              marginTop: rh(2),
              fontSize: rf(2),
            }}
          >
            {LogoutAlertHead}
          </Text>
          <View style={{ flexDirection: `row`, marginTop: rh(2) }}>
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={() => setLogoutModal(false)}
            >
              <Text style={{ fontSize: rf(2), color: colors.primary }}>NO</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.yesStyle}
              onPress={handleLogout}
            >
              <Text style={{ fontSize: rf(2), color: colors.white }}>YES</Text>
            </TouchableOpacity>
          </View>
        </ModalBottom>
        {renderSelectDialerMode()}
      </View>
    </ScrollView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  actionStyle: { alignItems: 'flex-end', paddingRight: 4, width: '20%' },
  arrayStyle: {
    bottom: -9,
    flexDirection: 'row',
    gap: 5,
    overflow: 'hidden',
    position: 'absolute',
  },
  availableStyle: {
    backgroundColor: colors.redBorder,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: rh(1.8),
    paddingHorizontal: rw(2),
    paddingTop: rh(1),
  },
  btn: {
    alignSelf: `center`,
    backgroundColor: colors.primary,
    borderRadius: 6,
    flexDirection: `row`,
    justifyContent: `center`,
    paddingVertical: rh(1),
    width: rw(90),
  },
  btnText: { color: colors.white, marginLeft: rw(2), textAlign: `center` },
  callCard: {
    borderBottomWidth: 0,
    borderColor: colors.lightGreyNew,
    borderRadius: 6,
    borderWidth: 0.6,
    overflow: 'hidden',
    position: 'relative',
  },
  container: {
    backgroundColor: colors.white,
    flex: 1,
  },
  content: {
    paddingHorizontal: rw(4.5),
    paddingTop: rh(1),
  },
  flexRow: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: rh(1.5),
  },
  flexRow1: { marginBottom: 0 },
  iconEdit: { alignItems: 'center', width: '15%' },
  iconRight: {
    alignItems: 'flex-end',
    paddingRight: rw(1.4),
    width: '15%',
  },
  iconView: { alignItems: `center`, flexDirection: `row`, width: '85%' },
  logoutButton: {
    alignItems: `center`,
    borderColor: colors.primary,
    borderRadius: 5,
    borderWidth: 1,
    flex: 1,
    paddingVertical: rh(0.7),
  },
  profileStyle: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 16,
    justifyContent: 'space-between',
    paddingTop: rh(1),
    width: rw(90),
  },
  ribonCircles: {
    backgroundColor: colors.white,
    borderRadius: rw(3.5),
    height: rw(3.8),
    width: rw(3.5),
  },
  socialMedia: {
    alignItems: `center`,
    alignSelf: `center`,
    flexDirection: `row`,
    justifyContent: `space-between`,
    marginTop: rh(0.5),
    width: rw(40),
  },
  socialMediaIcon: {
    paddingHorizontal: rw(4),
    paddingVertical: rh(1.75),
    // backgroundColor:`red`
  },
  titleStyle: { width: '80%' },
  userAvatar: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    width: '85%',
  },
  yesStyle: {
    alignItems: `center`,
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    borderRadius: 5,
    borderWidth: 1,
    flex: 1,
    marginLeft: rw(5),
    paddingVertical: rh(0.7),
  },
  waTextStyle:{
    fontSize: rf(2.2),
    marginTop: rh(1),
    marginBottom: rh(1),
    color: colors.black,
    fontWeight: `500`,
  },
  radioStyle: {
    paddingVertical: rh(0.5),
    alignItems: 'center'
  }
});
