/* eslint-disable react-native/no-raw-text */
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { Button, CheckBox, Text } from '@ui-kitten/components';
import { useNavigation } from '@react-navigation/native';
import { IconApp } from '../common/icons/callicon';
import { colors } from '../themes/vars';
import CustomHeader from '../common/components/CustomHeader';
import { rh, rf, rw } from '../common/helpers/dimentions';
import { toastShow } from '../common/helpers/utils';
import {
  And,
  ByContinue,
  CompanyText,
  ConfirmPasswordText,
  CreateAcText,
  CreateAccount,
  EmailBizText,
  EmailVerificationText,
  MobileText,
  MobileVerificationText,
  PasswordText,
  PleaseConfirmText,
  PrivacyPolicy,
  TnC,
  ToOur,
  VerifyText,
  WelcomeText,
} from '../common/Constants';
import MyText from '../common/components/MyText';
import { IconBuildingNew } from '../common/icons/iconbuildingnew';
import { IconMail } from '../common/icons/Contactdetailsicons/mail';
import { IconPhone } from '../common/icons/Contactdetailsicons/iconphone';
import { IconPassword } from '../common/icons/iconpassword';
import { IconShowPassword } from '../common/icons/iconshowpassword';
import ModalBottom from '../common/components/ModalBottom';
import EmailVerificationScreen from './emailverificationscreen';
import MobileVerificationScreen from './mobileverification';
import TextInputWithIcon from '../common/components/textinputwithicon';
import PropTypes from 'prop-types';
import { styles } from '../themes/styles';
export const API_BASE_URL = 'https://www.apibuild.callerdesk.io/api/';
export const EMAIL_VERIFICATION_API_END_POINT = `${API_BASE_URL}guest/email-verification`;
export const EMAIL_VERIFIED_API_END_POINT = `${API_BASE_URL}guest/email-validate`;
export const PHONE_NUMBER_VERIFICATION_API_END_POINT = `${API_BASE_URL}guest/phone-number-verification`;
export const PHONE_NUMBER_VERIFIED_API_END_POINT = `${API_BASE_URL}guest/phone-validate`;
export const SIGNUP_API_END_POINT = `https://app.callerdesk.io/api/add_demo_account_app`;

export const SignUp = ({ navigation }) => {
  const nav = useNavigation();

  const [companyName, setCompanyName] = useState();
  const [email, setEmail] = useState();
  const [phoneNumber, setPhoneNumber] = useState();
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [emailDisable, setEmailDisable] = useState(false);
  const [phoneNumberDisable, setPhoneNumberDisable] = useState(false);
  const [showPwd, setShowPassword] = useState(false);
  const [showConfirmPwd, setShowConfirmPassword] = useState(false);
  const [verifyEmail, setVerifyEmail] = useState(false);
  const [verifyMobile, setVerifyMobile] = useState(false);

  const emailVerify = () => {
    const validEmailRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (email && email.match(validEmailRegex)) {
      fetch(EMAIL_VERIFICATION_API_END_POINT, {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
        .then((response) => response.json())
        .then((responseJson) => {
          setEmailDisable(true);
          setVerifyEmail(true);
          toastShow('OTP sent on your email, kindly validate');
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      alert('Enter Valid Email');
    }
  };
  const phoneNumberVerify = () => {
    const validPhoneNumberRegext = /^\d{10}$/;
    if (phoneNumber && phoneNumber.match(validPhoneNumberRegext)) {
      fetch(PHONE_NUMBER_VERIFICATION_API_END_POINT, {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber }),
      })
        .then((response) => response.json())
        .then((responseJson) => {
          setPhoneNumberDisable(true);
          setVerifyMobile(true);
          toastShow('OTP sent on your email, kindly validate');
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      alert('Enter Valid Phone Number');
    }
  };
  const emailValidate = (otp) => {
    if (otp && otp.length === 4) {
      fetch(EMAIL_VERIFIED_API_END_POINT, {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      })
        .then((response) => response.json())
        .then((responseJson) => {
          if (responseJson.response?.statusCode === 404) {
            alert(responseJson.response?.message);
          } else {
            setVerifyEmail(false);
            toastShow('Email verified sucessfully');
          }
          // setEmailDisable(true)
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      alert('OTP not valid');
    }
  };
  const phoneValidate = (otp) => {
    if (otp && otp.length === 4) {
      fetch(PHONE_NUMBER_VERIFIED_API_END_POINT, {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber, otp }),
      })
        .then((response) => response.json())
        .then((responseJson) => {
          if (responseJson.response?.statusCode === 404) {
            alert(responseJson.response?.message);
          } else {
            setVerifyMobile(false);
            toastShow('phone number verified sucessfully');
          }
          // setEmailDisable(true)
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      alert('OTP not valid');
    }
  };
  const signupSubmit = () => {
    if (
      companyName &&
      email &&
      phoneNumber &&
      password &&
      password === confirmPassword &&
      emailDisable &&
      phoneNumberDisable
    ) {
      fetch(SIGNUP_API_END_POINT, {
        method: 'post',
        body: JSON.stringify({
          email,
          msisdn: phoneNumber,
          company_name: companyName,
          password,
          expired_on: '2024-06-03',
        }),
        headers: { 'Content-Type': 'multipart/form-data' },
      })
        .then((response) => response.json())
        .then((responseJson) => {
          setCompanyName('');
          setEmail('');
          setPhoneNumber('');
          setPassword('');
          setConfirmPassword('');
          if (responseJson.type === 'error') {
            alert(responseJson.message);
          } else {
            setCompanyName('');
            setEmail('');
            setPhoneNumber('');
            setPassword('');
            setConfirmPassword('');
            toastShow('Signup successfully');
          }
        })
        .catch((error) => {
          console.error(error);
        });
    } else if (
      (password && password.length < 8) ||
      (confirmPassword && confirmPassword.length < 8)
    ) {
      alert('Password and confirm password should at least 8 digit');
    } else if (password && password !== confirmPassword) {
      alert('Password and confirm password does not match');
    } else {
      alert('All feild are required');
    }
  };

  //   const onSubmit = () => {
  //     if (email && pwd) {
  //       dispatch(
  //         SubmitLogin({ email, pwd }, (res) => {
  //           dispatch(GetProfileAndBalance(res.authcode));
  //           dispatch(loadVoiceTemplateList(res.authcode));
  //           navigation.navigate('HomeTab');
  //           setEmail('');
  //           setPassword('');
  //         }),
  //       );
  //     } else {
  //       Alert.alert(NoEmailPassword);
  //     }
  //   };

  return (
    <>
      <View style={LoginStyles.container}>
        <CustomHeader title="Create your Account" from="signup" />
        <ScrollView
          style={LoginStyles.content}
          contentContainerStyle={{ marginTop: rh(2) }}
        >
          <View style={LoginStyles.iconAppStyle}>
            <IconApp />
          </View>
          <View style={LoginStyles.welcomeStyle}>
            <Text style={LoginStyles.welcomeTextStyle}>{WelcomeText}</Text>
          </View>
          <View style={LoginStyles.oneNumberTextStyle}>
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
            placeholder={CompanyText}
            inputMode="default"
            value={companyName}
            onChangeText={(val) => setCompanyName(val)}
            icon={<IconBuildingNew size={20} />}
          />
          <TextInputWithIcon
            placeholder={EmailBizText}
            accessible={!emailDisable}
            inputMode="email-address"
            value={email}
            onChangeText={(val) => setEmail(val)}
            icon={<IconMail size={20} color={colors.grey} />}
          />
          <View style={{ alignItems: `flex-end`, marginTop: rh(-0.5) }}>
            {emailDisable ? (
              <MyText
                style={{
                  fontWeight: `400`,
                  color: colors.green,
                  marginBottom: rh(0.7),
                  fontSize: rf(1.5),
                }}
              >
                {'Verified'}
              </MyText>
            ) : (
              <TouchableOpacity onPress={() => emailVerify()}>
                <MyText
                  style={{
                    fontWeight: `400`,
                    color: colors.grey,
                    marginBottom: rh(0.7),
                    fontSize: rf(1.5),
                  }}
                >
                  {VerifyText}
                </MyText>
              </TouchableOpacity>
            )}
          </View>
          <TextInputWithIcon
            placeholder={MobileText}
            accessible={!phoneNumberDisable}
            inputMode="number-pad"
            value={phoneNumber}
            onChangeText={(val) => setPhoneNumber(val)}
            icon={
              <View>
                <IconPhone size={17} />
              </View>
            }
            iconLeft={
              <View>
                <Text
                  style={
                    phoneNumberDisable
                      ? styles.numberDisabled
                      : styles.numberEnabled
                  }
                >
                  +91
                </Text>
              </View>
            }
          />

          <View style={{ alignItems: `flex-end` }}>
            {phoneNumberDisable ? (
              <MyText
                style={{
                  fontWeight: `400`,
                  color: colors.green,
                  marginBottom: rh(0.7),
                  fontSize: rf(1.5),
                }}
              >
                {'Verified'}
              </MyText>
            ) : (
              <TouchableOpacity onPress={() => phoneNumberVerify()}>
                <MyText
                  style={{
                    fontWeight: `400`,
                    color: colors.grey,
                    marginBottom: rh(0.7),
                    fontSize: rf(1.5),
                  }}
                >
                  {VerifyText}
                </MyText>
              </TouchableOpacity>
            )}
          </View>
          <TextInputWithIcon
            placeholder={PasswordText}
            inputMode="default"
            value={password}
            onChangeText={(val) => setPassword(val)}
            secure={!showPwd}
            icon={
              showPwd ? (
                <TouchableOpacity onPress={() => setShowPassword(!showPwd)}>
                  <IconPassword size={20} color={colors.grey} />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={() => setShowPassword(!showPwd)}>
                  <IconShowPassword size={20} color={colors.grey} />
                </TouchableOpacity>
              )
            }
          />
          <TextInputWithIcon
            placeholder={ConfirmPasswordText}
            inputMode="default"
            value={confirmPassword}
            onChangeText={(val) => setConfirmPassword(val)}
            secure={!showConfirmPwd}
            icon={
              showConfirmPwd ? (
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPwd)}
                >
                  <IconPassword size={20} color={colors.grey} />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPwd)}
                >
                  <IconShowPassword size={20} color={colors.grey} />
                </TouchableOpacity>
              )
            }
          />
          <View style={{ flexDirection: `row`, marginTop: rh(0.6) }}>
            <CheckBox style={{ marginBottom: rh(2) }} checked>
              <Text style={{ fontSize: rf(1), width: rw(120) }}>
                {PleaseConfirmText}
              </Text>
            </CheckBox>
          </View>
          <Button
            onPress={() => {
              signupSubmit();
            }}
          >
            {CreateAcText.toUpperCase()}
          </Button>
          <View style={{ height: rh(2) }}></View>
          <View style={[LoginStyles.footer, LoginStyles.footer1]}>
            <Text style={LoginStyles.createStyle}>
              {CreateAccount}
              <Text
                style={LoginStyles.linktext}
                onPress={() => navigation.navigate(`LoginWithEmail`)}
              >
                {` `}Login
              </Text>
            </Text>
          </View>
        </ScrollView>
        <View style={LoginStyles.footer}>
          <Text style={LoginStyles.createStyle}>{ByContinue}</Text>
          <Text style={LoginStyles.createStyle}>
            {ToOur}
            <Text
              style={LoginStyles.linktextNew}
              onPress={() => nav.navigate('TNC')}
            >
              {' '}
              {TnC}
            </Text>{' '}
            {And}{' '}
            <Text
              style={LoginStyles.linktextNew}
              onPress={() => nav.navigate('Privacy')}
            >
              {PrivacyPolicy}
            </Text>
          </Text>
        </View>
        <ModalBottom
          title={EmailVerificationText}
          open={verifyEmail}
          onClose={() => setVerifyEmail(false)}
        >
          <EmailVerificationScreen email={email} submitOtp={emailValidate} />
        </ModalBottom>
        <ModalBottom
          title={MobileVerificationText}
          open={verifyMobile}
          onClose={() => setVerifyMobile(false)}
        >
          <MobileVerificationScreen
            mobile={phoneNumber}
            submitOtp={phoneValidate}
          />
        </ModalBottom>
      </View>
    </>
  );
};

const LoginStyles = StyleSheet.create({
  container: { backgroundColor: colors.white, flex: 1 },
  content: {
    paddingHorizontal: rw(3.5),
  },
  createStyle: { fontSize: rf(1.5), textAlign: 'center' },
  footer: {
    alignItems: 'center',
    bottom: rh(1.5),
    justifyContent: 'center',
    marginTop: rh(3),
    width: '100%',
  },
  footer1: { bottom: 0, marginTop: rh(1) },
  iconAppStyle: { alignItems: 'center', marginBottom: rh(1) },
  linktext: {
    color: colors.blue,
    fontSize: rf(1.5),
    fontWeight: `700`,
  },
  linktextNew: {
    color: colors.link,
    fontSize: rf(1.5),
    fontWeight: `400`,
  },
  oneNumberTextStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: rh(3),
  },
  welcomeStyle: { alignItems: 'center' },
  welcomeTextStyle: {
    color: colors.secondary,
    fontSize: rf(3),
    fontWeight: '400',
  },
});
SignUp.propTypes = {
  navigation: PropTypes.object,
};
