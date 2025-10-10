import React, { useEffect } from 'react';
import { View, StatusBar } from 'react-native';
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../themes/vars';
import { loginSuccess } from '../common/redux/actions/common';
import {
  BreakApiCall,
  EntryApiCall,
  loadMemberListApi,
} from '../common/redux/actions/callLog';
import { useNavigation } from '@react-navigation/native';
import { checkAuth } from '../common/helpers/utils';
import PropTypes from 'prop-types';
import {
  BreakMsg,
  BreakMsg1,
  BreakOffTitle,
  BreakOnTitle,
  CheckInOutMsg,
  CheckInOutMsg1,
  CheckInTitle,
  CheckOutTitle,
} from '../common/Constants';
import { IconUserGirl } from '../common/icons/iconusergirl';
import { IconUserBoy } from '../common/icons/iconuserboy';
import { hydrateWhatsappUser } from '../common/redux/actions/whatsappEmbedSignup';

export const Auth = ({ navigation }) => {
  const dispatch = useDispatch();
  const nav = useNavigation();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await AsyncStorage.getItem('user_data');
        const storedWhatsappUser=await AsyncStorage.getItem('whatsappUser')
        console.log(storedWhatsappUser, 'storedWhatsappUser');
        const entry = await AsyncStorage.getItem('Entry');
        const breakStatus = await AsyncStorage.getItem('Break');
        if (result != null) {
          const userData = JSON.parse(result);
          dispatch(loginSuccess(userData));
          if(storedWhatsappUser){
            const parsed=JSON.parse(storedWhatsappUser)
            dispatch(hydrateWhatsappUser(parsed))
          }
          const logDataRes = await loadMemberListApi(userData.authcode);
          const isAuthValid = checkAuth(logDataRes.data.message);
          if (isAuthValid) {
            if (entry === `0`) {
              navigation.navigate(`UserStatus`, {
                title: CheckInOutMsg,
                title1: CheckInOutMsg1,
                subHead1: CheckInTitle,
                subHead2: CheckOutTitle,
                type: `exit`,
                func: () =>
                  EntryApiCall({ authcode: userData?.authcode, status: `1` }),
                icon: <IconUserGirl />,
              });
            } else if (breakStatus === `0`) {
              navigation.navigate(`UserStatus`, {
                title: BreakMsg,
                title1: BreakMsg1,
                subHead1: BreakOffTitle,
                type: `break`,
                subHead2: BreakOnTitle,
                icon: <IconUserBoy />,
                func: () =>
                  BreakApiCall({
                    authcode: userData?.authcode,
                    status: `1`,
                    name: userData?.fname ? userData?.fname : null,
                    num: userData?.mobile_no.slice(-10)
                      ? userData?.mobile_no.slice(-10)
                      : null,
                    dir: `IVR`,
                  }),
              });
            } else {
              navigation.navigate('HomeTab');
            }
          } else {
            navigation.navigate('LoginWithEmail');
          }
        } else {
          const onboardingResult = await AsyncStorage.getItem('Onboarding');
          if (onboardingResult == null) {
            navigation.navigate('Onboarding');
          } else {
            navigation.navigate('LoginWithEmail');
          }
        }
      } catch (error) {
        console.error('Error fetching data', error);
      }
    };

    fetchData();
  }, [dispatch, nav, navigation]);

  return (
    <View>
      {/* <StatusBar backgroundColor={colors.secondary} barStyle="default" /> */}
    </View>
  );
};

Auth.propTypes = {
  navigation: PropTypes.object,
};
