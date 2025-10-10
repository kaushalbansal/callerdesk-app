/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import {
  TouchableOpacity,
  StatusBar,
  Platform,
  Text,
  View,
} from 'react-native';
import { LoginWithEmail } from './loginwithemail';
import { Auth } from './Auth';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { Home } from './private/HomeTab';
import Chat from './private/WhatsappTemplate/Chat';
import ContactList from './private/ContactList/ContactList';
import ContactDetail from './private/ContactList/ContactDetail';
import Onboarding from '../common/components/Onbording/Onboarding';
import Profile from './private/Profile/Profile';
import CallLogList from './private/CallLog/Logs';
import CallHistory from './private/CallHistory/CallHistory';
import CallRouting from './private/CallRouting/CallRouting';
import BillingSection from './private/Profile/Billing/BillingSection';
import CallFlowJourney from './private/Profile/CallFlow/CallFlowJourney';
import VoiceTemplate from './private/Profile/VoiceTemplate/VoiceTemplate';
import { rh, rw, rf } from './../common/helpers/dimentions';

import BottomTabs from './BottomTabs';
import { IconGoBack } from '../common/icons/goback';
import CreateContact from './private/ContactList/CreateContact';
import ProfileImg from '../common/components/ProfileImg';
import AddTeam from './private/ManageTeam/AddTeam';
import ManageOrder from './private/ManageTeam/ManageOrder';
import SelectPlan from './private/Profile/Billing/SelectPlan';
import PaymentDetails from './private/Profile/Billing/PaymentDetails';
import BlockList from './private/BlockUser/BlockList';
import { colors } from '../themes/vars';
import FlexView, { MyView } from '../common/components/MyView';
import MyText from '../common/components/MyText';
import GroupList from './private/Group/grouplist';
import UniformStaff from './private/ManageTeam/UniformStaff';
import PaymentSuccess from './private/Profile/Billing/PaymentSuccess';
import Faq from './private/Profile/Faq';
import CallAnalytics from './private/Graph/CallAnalytics';
import CallGroupSetting from './private/Group/CallGroupSetting';
import AddMember from './private/Group/AddMember';
import UpdateStrategy from './private/Group/UpdateStrategy';
import UpdateSticky from './private/Group/UpdateSticky';
import UpdateMultiSticky from './private/Group/UpdateMultiSticky';
import TimeSchedule from './private/Group/TimeSchedule';

import SupportScreen from './private/SupportScreen';
import AboutApp from './private/AboutApp';
import TNCApp from './private/TNC';
import PrivacyApp from './private/Privacy';
import RateApp from './private/RateApp';
import VisitUs from './private/VisitUs';
import LegalScreen from './private/LegalScreen';
import { SignUp } from './signup';
import TeamDetails from './private/ManageTeam/TeamDetails';
import { IconApp } from '../common/icons/callicon';
import { ForgotPasswordScreen } from './forgotpasswordscreen';
import { styles } from '../themes/styles';
import PropTypes from 'prop-types';
import { HomeNew } from './private/HomeTabNew';
import { IconAppNew } from '../common/icons/calliconnewhome';
import { IconBreak } from '../common/icons/iconbreak';
import { IconEntry } from '../common/icons/iconentry';
import UserStatus from './userstatus';
import { IconUserGirl } from '../common/icons/iconusergirl';
import ModalBottom from '../common/components/ModalBottom';
import { IconBreakModal } from '../common/icons/iconbreakmodal';
import {
  BreakHead,
  BreakHead1,
  BreakMsg,
  BreakMsg1,
  BreakOffTitle,
  BreakOnTitle,
  BreakTitle,
  CheckInHead,
  CheckInHead1,
  CheckInOutMsg,
  CheckInOutMsg1,
  CheckInTitle,
  CheckOutTitle,
} from '../common/Constants';
import { IconEntryModal } from '../common/icons/iconentrymodal';
import { useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BreakApiCall, EntryApiCall } from '../common/redux/actions/global';
import { IconUserBoy } from '../common/icons/iconuserboy';
import { navigationRef } from '../common/helpers/navigationservice';
import CheckoutScreen from './private/CheckoutScreen';
import { HomeTabGroupOwner } from './private/HomeTabGroupOwner';
import { AnalyticsScreen } from './private/AnalyticsScreen';
import { SafeAreaView } from 'react-native-safe-area-context';
import CallAnalytics1 from './private/Graph/CallAnalytics1';
import Graph from './private/Graph/GraphHome';
import MapRegion from './private/Graph/MapRegion';
import TemplateWizardScreen from './private/WhatsappTemplate/TemplateWizardScreen';
import TemplatePreviewScreen from './private/WhatsappTemplate/TemplatePreviewScreen';
import WhatsappTemplateScreen from './private/WhatsappTemplate/WhatsappTemplateScreen';
import WhatsAppSignupAdmin from './private/WhatsappTemplate/WhatsappSignupAdmin';
import { WATempIcon } from '../common/icons/waicontemp';
import WhatsAppSignupAgent from './private/WhatsappTemplate/WhatsappSignupAgent';
import SuccessCheckIcon from '../common/icons/successCheckIcon';
import { toastShow } from '../common/helpers/utils';
import SimCallLog from './private/Profile/SimCallLog';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const ios = Platform.OS === 'ios';

const NavHeaderNew = (props) => {
  const canGoBack = props.navigation.canGoBack();
  const [breakShow, setBreakShow] = useState(false);
  const [entryShow, setEntryShow] = useState(false);
  const { user } = useSelector((state) => state?.global);
  const {whatsappAccessToken, whatsappIntegration}=useSelector((state)=>state?.whatsappEmbedSingnup)
  const isWhatsappRegister=whatsappAccessToken && whatsappIntegration

  const handleWhatsappIconPress=()=>{
    isWhatsappRegister ? toastShow('Your WhatsApp signin is already done') : props.navigation.navigate("WhatsappSignupAgent")
  }

  const statusApiCall = async ({ status }) => {
    try {
      const result = await EntryApiCall({ authcode: user?.authcode, status });
      result.type === `success`
        ? props.navigation.navigate(`UserStatus`, {
            title: CheckInOutMsg,
            title1: CheckInOutMsg1,
            subHead1: CheckInTitle,
            subHead2: CheckOutTitle,
            type: `exit`,
            func: () => EntryApiCall({ authcode: user?.authcode, status: `1` }),
            icon: <IconUserGirl />,
          })
        : props.navigation.navigate(`HomeTab`);
    } catch (error) {
      props.navigation.navigate(`HomeTab`);
      console.log('Failed to change user status:', error);
    }
  };
  const breakApiCall = async ({ status }) => {
    try {
      const result = await BreakApiCall({
        authcode: user?.authcode,
        status,
        name: user?.fname ? user?.fname : null,
        num: user?.mobile_no.slice(-10) ? user?.mobile_no.slice(-10) : null,
        dir: `IVR`,
      });
      result.type === `success`
        ? props.navigation.navigate(`UserStatus`, {
            title: BreakMsg,
            title1: BreakMsg1,
            subHead1: BreakOffTitle,
            type: `break`,
            subHead2: BreakOnTitle,
            func: () =>
              BreakApiCall({
                authcode: user?.authcode,
                status: `1`,
                name: user?.fname ? user?.fname : null,
                num: user?.mobile_no.slice(-10)
                  ? user?.mobile_no.slice(-10)
                  : null,
                dir: `IVR`,
              }),
            icon: <IconUserBoy />,
          })
        : props.navigation.navigate(`HomeTab`);
    } catch (error) {
      props.navigation.navigate(`HomeTab`);
      console.log('Failed to change user status:', error);
    }
  };
  // const breakApiCall = async ({ status }) => {
  //   console.log(status, `breakApiCall`);
  //   try {
  //     await BreakApiCall({
  //       authcode: user?.authcode,
  //       status,
  //       name: user?.fname ? user?.fname : null,
  //       num: user?.mobile_no.slice(-10) ? user?.mobile_no.slice(-10) : null,
  //       dir: `IVR`,
  //     });
  //     props.navigation.navigate(`UserStatus`, {
  //       title: BreakMsg,
  //       subHead1: BreakOffTitle,
  //       subHead2: BreakOnTitle,
  //       icon: <IconUserBoy />,
  //       func: () => breakApiCall({ status: '1' }),
  //     });
  //   } catch (error) {
  //     console.log('Failed to change user status:', error);
  //   }
  // };
  return (
    <>
      <FlexView
        bg={colors.primary}
        mt={ios ? rh(5) : 0}
        pt={rh(1.5)}
        pb={rh(1.5)}
        pl={canGoBack ? rw(1) : rw(3)}
        pr={rh(0.5)}
        style={styles.routeHead}
      >
        <View style={styles.title}>
          <TouchableOpacity
            style={styles.title1}
            onPress={() => setBreakShow(true)}
          >
            <Text
              style={{
                fontWeight: `600`,
                color: colors.black,
                marginLeft: rw(1),
                paddingRight: rw(1),
                fontSize: rf(1.8),
              }}
            >
              {`Break`}
            </Text>
            <IconBreak size={26} />
          </TouchableOpacity>
        </View>
        <View style={styles.icon}>
          <IconAppNew size={35} />
        </View>
        <View style={styles.titleRight}>
          <TouchableOpacity
            style={styles.titleRight1}
            onPress={() => setEntryShow(true)}
          >
            <Text
              style={{
                fontWeight: `600`,
                color: colors.black,
                marginLeft: rw(1),
                fontSize: rf(1.9),
              }}
            >
              {`Exit`}
            </Text>
            <IconEntry size={26} />
          </TouchableOpacity>
        </View>
        {/* <View style={{backgroundColor: '#30D158', marginLeft: rw(2), padding: rh(0.8), borderRadius: rh(2.5)}}>
          <TouchableOpacity 
              onPress={handleWhatsappIconPress}
              >
              {isWhatsappRegister ? <SuccessCheckIcon width={rw(6)} height={rw(6)}/>:
               <WATempIcon size={rw(6)} color={colors.white}/>}  
                
              </TouchableOpacity>
          
        </View> */}
      </FlexView>
      <ModalBottom
        title={BreakTitle}
        open={breakShow}
        onClose={() => setBreakShow(false)}
      >
        <View style={{ justifyContent: `center`, alignItems: `center` }}>
          <IconBreakModal />
          <Text style={styles.label}>{BreakHead}</Text>
          <Text style={styles.label1}>{BreakHead1}</Text>
          <View style={{ flexDirection: `row`, marginTop: rh(2) }}>
            <TouchableOpacity
              style={styles.noStyle}
              onPress={() => setBreakShow(false)}
            >
              <Text style={{ fontSize: rf(2), color: colors.primary }}>NO</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.yesStyle}
              onPress={async () => {
                setBreakShow(false);
                await breakApiCall({ status: '0' });
              }}
            >
              <Text style={{ fontSize: rf(2), color: colors.white }}>YES</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ModalBottom>
      <ModalBottom
        title={CheckInTitle}
        open={entryShow}
        onClose={() => setEntryShow(false)}
      >
        <View style={{ justifyContent: `center`, alignItems: `center` }}>
          <IconEntryModal />
          <Text style={styles.label}>{CheckInHead}</Text>
          <Text style={styles.label2}>{CheckInHead1}</Text>
          <View style={{ flexDirection: `row`, marginTop: rh(2) }}>
            <TouchableOpacity
              style={styles.noStyle}
              onPress={() => setEntryShow(false)}
            >
              <Text style={{ fontSize: rf(2), color: colors.primary }}>NO</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.yesStyle}
              onPress={async () => {
                setEntryShow(false);
                await statusApiCall({ status: '0' });
              }}
            >
              <Text style={{ fontSize: rf(2), color: colors.white }}>YES</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ModalBottom>
    </>
  );
};
const NavHeader = (props) => {
  const canGoBack = props.navigation.canGoBack();
  const {whatsappAccessToken, whatsappIntegration}=useSelector((state)=>state?.whatsappEmbedSingnup)
  const isWhatsappRegister=whatsappAccessToken && whatsappIntegration

  const handleWhatsappIconPress=()=>{
    isWhatsappRegister ? toastShow('Your Whatsapp signup is already done') : props.navigation.navigate('WhatsappSignupAdmin')
  }
  return (
    <>
      <FlexView
        bg={colors.white}
        mt={ios ? rh(5) : 0}
        pt={rh(1.5)}
        pb={rh(1.5)}
        pl={canGoBack ? rw(1) : rw(3)}
        pr={rh(0.5)}
        style={styles.routeHead}
      >
        <View style={styles.title}>
          <Text
            style={{
              fontWeight: `700`,
              color: colors.black,
              marginLeft: rw(1),
              fontSize: rf(2.1),
            }}
          >
            {props.options.title}
          </Text>
        </View>
        <View style={styles.icon}>
          <IconApp size={35} />
        </View>
        <View style={styles.profile}>
          <ProfileImg size={32}/>
          {/* <TouchableOpacity 
              onPress={handleWhatsappIconPress}
              >
                {isWhatsappRegister ? <SuccessCheckIcon width={rw(6)} height={rw(6)} color={colors.green}/>:
               <WATempIcon size={rw(6)} color={colors.green}/>}  
              </TouchableOpacity> */}
        </View>
      </FlexView>
    </>
  );
};
const NavHeaderProfile = (props) => {
  const canGoBack = props.navigation.canGoBack();
  return (
    <>
      <FlexView
        bg={colors.white}
        mt={ios ? rh(5) : 0}
        pt={rh(1)}
        pb={rh(1)}
        pl={canGoBack ? rw(1) : rw(3)}
        pr={rh(0.5)}
      >
        <FlexView w="75%" pl={canGoBack ? rw(1) : rw(1.5)} type="left">
          {canGoBack && (
            <MyView w={rw(8)} pt={rh(0.8)} pb={rh(0.8)}>
              <TouchableOpacity
                style={styles.back}
                onPress={() => {
                  try {
                    props.navigation.goBack();
                  } catch (error) {}
                }}
              >
                <IconGoBack />
              </TouchableOpacity>
            </MyView>
          )}
          <MyText bold responsiveSize={2}>
            {props.options.title}
          </MyText>
        </FlexView>

        <FlexView pr={rw(3)} w="25%" type="right" gap={rw(1)}>
          {/* <ProfileImg size={32} /> */}
        </FlexView>
      </FlexView>
    </>
  );
};

const ProfileStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="ProfileHome"
      screenOptions={{
        header: NavHeaderProfile,
        headerStyle: {
          elevation: 0,
          shadowOpacity: 0,
        },
      }}
    >
      <Tab.Screen
        name="ProfileHome"
        options={{ title: 'Setting & Profile', headerShown: true }}
        component={Profile}
      />
      <Tab.Screen
        name="CallFlowJourney"
        options={{ title: 'Call Flow Journey', headerShown: false }}
        component={CallFlowJourney}
      />
      <Tab.Screen
        name="Chat"
        options={{ headerShown: false }}
        component={Chat}
      />
       {/* <Tab.Screen
        name="WhatsappTemplateScreen"
        options={{ headerShown: false }}
        component={WhatsappTemplateScreen}
      /> */}
      {/* <Tab.Screen name="WhatsappTemplate" options={{ title: 'Whatsapp Template', headerShown: true }} component={WhatsappTemplate} /> */}
      <Tab.Screen
        name="VoiceTemplate"
        options={{ title: 'Voice Template', headerShown: false }}
        component={VoiceTemplate}
      />
      <Tab.Screen
        name="BillingSection"
        options={{ title: 'Plan & Invoice', headerShown: true }}
        component={BillingSection}
      />
      <Tab.Screen
        name="SelectPlan"
        options={{ title: 'Select Plan', headerShown: false }}
        component={SelectPlan}
      />
      <Tab.Screen
        name="PaymentDetails"
        options={{ title: 'Payment Details', headerShown: false }}
        component={PaymentDetails}
      />
      <Tab.Screen
        name="PaymentSuccess"
        options={{ title: 'Payment Success', headerShown: false }}
        component={PaymentSuccess}
      />
      <Tab.Screen
        name="CheckoutScreen"
        options={{ title: 'Payment Success', headerShown: false }}
        component={CheckoutScreen}
      />
      <Tab.Screen
        name="SupportScreen"
        options={{ title: 'Contact List', headerShown: false }}
        component={SupportScreen}
      />
      <Tab.Screen
        name="VisitUs"
        options={{ title: 'Contact List', headerShown: false }}
        component={VisitUs}
      />
      <Tab.Screen
        name="Faq"
        options={{ title: 'FAQ', headerShown: false }}
        component={Faq}
      />
      <Tab.Screen
        name="LegalScreen"
        options={{ title: 'Contact List', headerShown: false }}
        component={LegalScreen}
      />
      <Tab.Screen
        name="AboutApp"
        options={{ title: 'Contact List', headerShown: false }}
        component={AboutApp}
      />
      <Tab.Screen
        name="TNC"
        options={{ title: 'Contact List', headerShown: false }}
        component={TNCApp}
      />
      <Tab.Screen
        name="Privacy"
        options={{ title: 'Contact List', headerShown: false }}
        component={PrivacyApp}
      />
      <Tab.Screen
        name="RateApp"
        options={{ title: 'Contact List', headerShown: false }}
        component={RateApp}
      />
       <Tab.Screen
        name="SimCallLog"
        options={{ title: 'Sim Call Log', headerShown: false }}
        component={SimCallLog}
      />
    </Stack.Navigator>
  );
};

const AnalyticsStack=()=>{
  return(
    <Stack.Navigator initialRouteName='Graph'>
       <Stack.Screen
        name="Graph"
        options={{  headerShown: false }}
        component={Graph}
      />
      <Stack.Screen
        name="CallAnalytics"
        options={{  headerShown: false }}
        component={CallAnalytics}
      />
      <Stack.Screen
        name="CallAnalytics1"
        options={{  headerShown: false }}
        component={CallAnalytics1}
      />
       <Stack.Screen
        name="AnalyticsScreen"
        options={{ headerShown: false, unmountOnBlur: true }}
        component={AnalyticsScreen}
      />
      <Stack.Screen
        name="MapRegion"
        options={{ headerShown: false }}
        component={MapRegion}
      />
    </Stack.Navigator>
  )
}

const HomeStack = () => {
  const [userRole, setUserRole] = useState();
  const [role, setRole] = useState();
  const { user } = useSelector((state) => state?.global);
  useEffect(() => {
    const fetchData = async () => {
      if (user?.authcode) {
        const ans = await AsyncStorage.getItem('user_role');
        const ansRole = await AsyncStorage.getItem('role');
        setUserRole(ans);
        setRole(ansRole);
      }
    };
    fetchData();
  }, [user]);
  return (
    <Stack.Navigator
      initialRouteName="UserHome"
      screenOptions={{
        header: (props) =>
          role === '3' ? (
            userRole === '3' && userRole === '3' ? (
              <NavHeaderNew {...props} />
            ) : userRole === '3' || userRole === '2' ? (
              <NavHeaderNew {...props} />
            ) : (
              <NavHeader {...props} />
            )
          ) : (
            <NavHeader {...props} />
          ),
        headerStyle: {
          elevation: 0,
          shadowOpacity: 0,
        },
      }}
    >
      <Tab.Screen
        name="VoiceTemplate"
        options={{ title: 'Voice Template', headerShown: false }}
        component={VoiceTemplate}
      />
      <Tab.Screen
        name="UserHome"
        options={{ title: 'Home', headerShown: true }}
        component={
          role === '3'
            ? userRole === '3' && userRole === '3'
              ? HomeTabGroupOwner
              : userRole === '3' || userRole === '2'
                ? HomeNew
                : Home
            : Home
        }
      />
      <Tab.Screen
        name="CallLogList"
        options={{ title: 'Call log', headerShown: false }}
        component={CallLogList}
      />
      <Tab.Screen
        name="CallHistory"
        options={{ title: 'Call History', headerShown: false }}
        component={CallHistory}
      />
      <Tab.Screen
        name="CallRouting"
        options={{ title: 'Call Routing', headerShown: false }}
        component={CallRouting}
      />
      <Tab.Screen
        name="AddTeam"
        options={{ title: 'Add Team Members', headerShown: false }}
        component={AddTeam}
      />
      <Tab.Screen
        name="TeamDetails"
        options={{ title: 'Team Details', headerShown: false }}
        component={TeamDetails}
      />
      <Tab.Screen
        name="AddGroup"
        options={{ title: 'Add Group', headerShown: false }}
        component={GroupList}
      />
      <Tab.Screen
        name="CallGroupSetting"
        options={{ title: 'Call Group Setting', headerShown: false }}
        component={CallGroupSetting}
      />
      <Tab.Screen
        name="UpdateStrategy"
        options={{ title: 'Update Strategy', headerShown: false }}
        component={UpdateStrategy}
      />
      <Tab.Screen
        name="TimeSchedule"
        options={{ title: 'Time Schedule', headerShown: false }}
        component={TimeSchedule}
      />
      <Tab.Screen
        name="AddMember"
        options={{ title: 'Add Member', headerShown: false }}
        component={AddMember}
      />
      <Tab.Screen
        name="UpdateSticky"
        options={{ title: 'Update Sticky', headerShown: false }}
        component={UpdateSticky}
      />
      <Tab.Screen
        name="UpdateMultiSticky"
        options={{ title: 'Update Multi Sticky', headerShown: false }}
        component={UpdateMultiSticky}
      />
      <Tab.Screen
        name="OrderTeam"
        options={{ title: 'Ring Order', headerShown: false }}
        component={ManageOrder}
      />
      <Tab.Screen
        name="UniformStaff"
        options={{ title: 'Ring Order', headerShown: false }}
        component={UniformStaff}
      />
      <Tab.Screen
        name="BlockList"
        options={{ title: 'Blocked users', headerShown: false }}
        component={BlockList}
      />
      <Tab.Screen
        name="Faq"
        options={{ title: 'FAQ', headerShown: false }}
        component={Faq}
      />
      <Tab.Screen
        name="VisitUs"
        options={{ title: 'Contact List', headerShown: false }}
        component={VisitUs}
      />
      <Tab.Screen
        name="CallFlowJourney"
        options={{ title: 'Call Flow Journey', headerShown: false }}
        component={CallFlowJourney}
      ></Tab.Screen>
    </Stack.Navigator>
  );
};

const ContactStack = () => {
  // role === `3` ? userRole === `3` || userRole === `2` : false
  return (
    <Stack.Navigator
      initialRouteName="ContactList"
      screenOptions={{
        header: NavHeader,
        headerStyle: {
          elevation: 0,
          shadowOpacity: 0,
        },
      }}
    >
      <Tab.Screen
        name="ContactListTab"
        options={{ title: 'Contact List', headerShown: false }}
        component={ContactList}
      />
      <Tab.Screen
        name="AddContact"
        options={{ title: 'Add New Contact', headerShown: false }}
        component={CreateContact}
      />
      <Tab.Screen
        name="ContactDetail"
        options={{ headerShown: false }}
        component={ContactDetail}
      />
      <Tab.Screen
        name="ContactCallHistory"
        options={{ title: 'Call History', headerShown: false }}
        component={CallHistory}
      />
    </Stack.Navigator>
  );
};

const HomeTabs = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      tabBar={(props) => <BottomTabs {...props} />}
      screenOptions={({ route }) => ({})}
    >
      <Tab.Screen
        name="Home"
        options={{
          headerShown: false,
          // unmountOnBlur: true,
        }}
        component={HomeStack}
      />
      <Tab.Screen
        name="ContactDetail"
        options={{ headerShown: false }}
        component={ContactDetail}
      />
      {/* <Tab.Screen
        name="Chat"
        options={{ headerShown: false }}
        component={Chat}
      /> */}
      <Tab.Screen
        name="CallLogTab"
        options={{ title: 'Call log', headerShown: false }}
        component={CallLogList}
        initialParams={{ from: 'total', type: '' }}
      />
      {/* {"from": "total", "type": ""} */}
      <Tab.Screen
        name="CallHistory"
        options={{ title: 'Call History', headerShown: false }}
        component={CallHistory}
      />
      <Tab.Screen
        name="Contact"
        options={{ headerShown: false, unmountOnBlur: true }}
        component={ContactStack}
      />
      <Tab.Screen
        name="Profile"
        options={{ headerShown: false, unmountOnBlur: true }}
        component={ProfileStack}
      />
      <Tab.Screen
        name="AnalyticsScreen"
        options={{ headerShown: false, unmountOnBlur: true }}
        component={AnalyticsScreen}
      />
    </Tab.Navigator>
  );
};

const TabStack = () => {
  return (
    <Stack.Navigator initialRouteName="Auth">
      <Stack.Screen
        name="HomeTab"
        options={{ headerShown: false }}
        component={HomeTabs}
      />
      <Stack.Screen
        name="Auth"
        options={{ headerShown: false }}
        component={Auth}
      />
      <Stack.Screen
        name="Onboarding"
        options={{ headerShown: false }}
        component={Onboarding}
      />
      <Stack.Screen
        name="LoginWithEmail"
        options={{ headerShown: false }}
        component={LoginWithEmail}
      />
      <Stack.Screen
        name="ForgotPasswordScreen"
        options={{ title: 'Contact List', headerShown: false }}
        component={ForgotPasswordScreen}
      />
      <Stack.Screen
        name="SignUp"
        options={{ headerShown: false }}
        component={SignUp}
      />
      {/* <Stack.Screen
        name="CallAnalytics"
        options={{ title: 'Call Result Analysis', headerShown: false }}
        component={CallAnalytics}
      /> */}
      <Stack.Screen
        name="ContactList"
        options={{ title: 'Contact List', headerShown: false }}
        component={ContactStack}
      />
      <Stack.Screen
        name="Chat"
        options={{ headerShown: false }}
        component={Chat}
      />
      <Stack.Screen
        name="TNC"
        options={{ headerShown: false }}
        component={TNCApp}
      />
      <Stack.Screen
        name="Privacy"
        options={{ headerShown: false }}
        component={PrivacyApp}
      />
      <Stack.Screen
        name="UserStatus"
        options={{ headerShown: false }}
        component={UserStatus}
      />
       <Stack.Screen
        name="Analytics"
        options={{ title: 'Analytics', headerShown: false }}
        component={AnalyticsStack}
      />
      <Stack.Screen
      name="WhatsappTemplateWizard"
      options={{headerShown: false}}
      component={TemplateWizardScreen}
      />
      <Stack.Screen
      name="Preview"
      options={{headerShown: false}}
      component={TemplatePreviewScreen}
      />
      <Stack.Screen
        name="WhatsappSignupAdmin"
        options={{title: "WhatsappSignupAdmin", headerShown: false}}
        component={WhatsAppSignupAdmin}
      />
      <Stack.Screen
      name="WhatsappSignupAgent"
      options={{title: "WhatsappSignupAgent", headerShown: false}}
      component={WhatsAppSignupAgent}
      />
      <Stack.Screen
      name="WhatsappTemplateScreen"
      options={{headerShown: false}}
      component={WhatsappTemplateScreen}
      />
     {/* <Stack.Screen
        name="SimCallLog"
        options={{ title: 'Sim Call Log', headerShown: false }}
        component={SimCallLog}
      /> */}
    </Stack.Navigator>
  );
};

export default function Routes() {
  return (
    <NavigationContainer ref={navigationRef}>
      <SafeAreaView style={{flex: 1}}>
      <StatusBar
        hidden={false}
        barStyle="dark-content"
        backgroundColor={"transparent"}
        translucent
      />
      <TabStack />
      </SafeAreaView>
      {/* {loggedIn ? <TabStack /> : <LoginWithEmailStack />} */}
      {/* {loggedIn ? <TabStack /> : <AppStack />} */}
    </NavigationContainer>
  );
}
NavHeaderProfile.propTypes = {
  navigation: PropTypes.object,
  props: PropTypes.shape({
    navigation: PropTypes.shape({
      navigate: PropTypes.func,
    }),
  }),
  options: PropTypes.shape({
    title: PropTypes.string,
  }),
};
NavHeader.propTypes = {
  navigation: PropTypes.object,
  props: PropTypes.object,
  options: PropTypes.shape({
    title: PropTypes.string,
  }),
};
