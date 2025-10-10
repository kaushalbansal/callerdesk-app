import React, { useState } from 'react';
import { View, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { useDispatch } from 'react-redux';
import { Button, Text } from '@ui-kitten/components';
import { IconApp } from '../common/icons/callicon';
import { colors } from '../themes/vars';
import { rh, rf, rw } from '../common/helpers/dimentions';
import {
  GetProfileAndBalance,
  SubmitLogin,
} from '../common/redux/actions/global';
import {
  And,
  ByContinue,
  CreateAccount,
  EmailBizText,
  LoginText,
  NoEmailPassword,
  PasswordText,
  PrivacyPolicy,
  TnC,
  ToOur,
  WelcomeText,
} from '../common/Constants';
import { useNavigation } from '@react-navigation/native';
import { IconPassword } from '../common/icons/iconpassword';

import { IconShowPassword } from '../common/icons/iconshowpassword';
import { IconMail } from '../common/icons/Contactdetailsicons/mail';
import TextInputWithIcon from '../common/components/textinputwithicon';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PropTypes from 'prop-types';

export const LoginWithEmail = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [pwd, setPassword] = useState('');
  const nav = useNavigation();
  const [showConfirmPwd, setShowConfirmPassword] = useState(false);

  const dispatch = useDispatch();
  const saveUserRole = async (res) => {
    try {
      await AsyncStorage.setItem('user_role', res.user_role);
      await AsyncStorage.setItem('role', res.role);
    } catch (error) {
      console.error('Failed to save user role:', error);
    }
  };
  const onSubmit = () => {
    if (email && pwd) {
      dispatch(
        SubmitLogin({ email, pwd }, (res) => {
          saveUserRole(res);
          dispatch(GetProfileAndBalance(res.authcode));
          navigation.navigate('HomeTab');
        }),
      );
    } else {
      Alert.alert(NoEmailPassword);
    }
  };

  return (
    <View style={LoginStyles.head}>
      {/* <CustomHeader title="Login" /> */}
      <View
        style={LoginStyles.content}
        contentContainerStyle={{ marginTop: rh(7) }}
      >
        <View style={LoginStyles.iconApp}>
          <IconApp />
        </View>
        <View style={LoginStyles.welcomeHead}>
          <Text style={LoginStyles.welcomeBody}>{WelcomeText}</Text>
        </View>
        <View style={LoginStyles.oneNumber}>
          {/* <Text
            style={{
              color: colors.secondary,
              fontSize: rf(1.8),
              fontWeight: '400',
            }}
          >
            {OneNumberText}
          </Text> */}
        </View>
        <TextInputWithIcon
          placeholder={EmailBizText}
          inputMode="email-address"
          value={email}
          onChangeText={(val) => setEmail(val)}
          icon={<IconMail size={20} color={colors.greyNew} />}
        />
        <TextInputWithIcon
          placeholder={PasswordText}
          inputMode="default"
          value={pwd}
          onChangeText={(val) => setPassword(val)}
          secure={!showConfirmPwd}
          icon={
            showConfirmPwd ? (
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPwd)}
              >
                <IconPassword size={23} color={colors.greyNew} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPwd)}
              >
                <IconShowPassword size={23} color={colors.greyNew} />
              </TouchableOpacity>
            )
          }
        />
        {/* <Text
              style={[LoginStyles.linktext,{marginTop:rh(1),width:rw(25),textAlign:`center`,alignSelf:`flex-end`}]}
              onPress={() => nav.navigate('ForgotPasswordScreen')}
            >
              {ForgotPasswordLabel}
            </Text> */}
        <Button onPress={onSubmit} style={{ marginTop: rh(2) }}>
          {LoginText}
        </Button>
        <View style={{ height: rh(2) }}></View>
        {/* <View style={[LoginStyles.footer, LoginStyles.footerText]}>
          <Text style={LoginStyles.textStyle}>
            {CreateAccount}
            <Text
              style={LoginStyles.linktext}
              onPress={() => nav.navigate(`SignUp`)}
            >
              {` `}Sign Up
            </Text>
          </Text>
        </View> */}
        <View style={LoginStyles.footer}>
          <Text style={LoginStyles.textStyle}>{ByContinue}</Text>
          <Text style={LoginStyles.textStyle}>
            {ToOur}
            <Text
              style={LoginStyles.linktextNew}
              //   onPress={() => handleLinkPress(urls.termsOfUse)}
              onPress={() => nav.navigate('TNC')}
            >
              {' '}
              {TnC}
            </Text>{' '}
            {And}{' '}
            <Text
              style={LoginStyles.linktextNew}
              //   onPress={() => handleLinkPress(urls.privacyPolicy)}
              onPress={() => nav.navigate('Privacy')}
            >
              {PrivacyPolicy}
            </Text>
          </Text>
        </View>
      </View>
    </View>
  );
};

const LoginStyles = StyleSheet.create({
  content: {
    paddingHorizontal: rw(3.5),
    paddingVertical: rh(1),
  },
  footer: {
    alignItems: 'center',
    bottom: rh(-20),
    justifyContent: 'center',
    marginTop: rh(3),
    width: '100%',
  },
  footerText: {
    bottom: 0,
    marginTop: rh(1),
  },
  head: { backgroundColor: colors.white, flex: 1 },
  iconApp: {
    alignItems: 'center',
    marginBottom: rh(2),
    marginTop: rh(17),
  },
  linktext: {
    color: colors.primary,
    fontSize: rf(1.5),
    fontWeight: `400`,
  },
  linktextNew: {
    color: colors.link,
    fontSize: rf(1.5),
    fontWeight: `400`,
  },
  oneNumber: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: rh(5),
  },
  textStyle: { fontSize: rf(1.5), textAlign: 'center' },
  welcomeBody: {
    color: colors.secondary,
    fontSize: rf(3),
    fontWeight: '400',
  },
  welcomeHead: { alignItems: 'center' },
});

LoginWithEmail.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }),
};
