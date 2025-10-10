import React, { useRef, useState } from 'react';
import { Button } from '@ui-kitten/components';
import { IconApp } from '../common/icons/callicon';
import { styles } from '../themes/styles';
import { colors } from '../themes/vars';
import CustomHeader from '../common/components/CustomHeader';
import { rf, rh, rw } from '../common/helpers/dimentions';
import MyLink from '../common/components/MyLink';
import {
  And,
  ByContinueOnly,
  OTPVerificationCode,
  OtpNot,
  OtpViaCall,
  PrivacyPolicy,
  RequestOtp,
  TnC,
  ToOur,
  VerificationCodeSent,
  WrongOTPMsg,
} from '../common/Constants';
import {
  Linking,
  Text,
  View,
  StyleSheet,
  ScrollView,
  TextInput,
} from 'react-native';
import PropTypes from 'prop-types';

export const OTPverify = ({ route, navigation }) => {
  const { phoneNumber } = route.params;
  const [isFocused, setIsFocused] = useState(false);
  const [inputValues, setInputValues] = useState(['', '', '', '']);
  const inputRefs = useRef([]);
  const checkInput = ['1', '2', '3', '4'];
  const handleChange = (value, index) => {
    const newInputValues = [...inputValues];
    newInputValues[index] = value;
    setInputValues(newInputValues);

    if (value.length === 1 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
      setIsFocused(true);
    } else {
      setIsFocused(false);
    }
  };

  const checkOTP = () => {
    if (JSON.stringify(inputValues) === JSON.stringify(checkInput)) {
      navigation.navigate('BasicInfo');
      // dispatch(SubmitLogin(() => {
      //    // navigation.navigate("Tabs");
      // }));
    } else {
      alert(WrongOTPMsg);
    }
  };

  const handleLinkPress = () => {
    const url = 'https://akveo.github.io/react-native-ui-kitten/'; // Replace this with the URL you want to link to
    Linking.openURL(url);
  };

  return (
    <>
      <View style={otpStyles.container}>
        <CustomHeader title="OTP Verification" />
        <ScrollView style={[otpStyles.content, otpStyles.content1]}>
          <View style={otpStyles.icon}>
            <IconApp />
          </View>
          <View style={otpStyles.codeView1}>
            <Text style={otpStyles.code}> {OTPVerificationCode}</Text>
          </View>
          <View style={otpStyles.codeView}>
            <Text style={otpStyles.codeText}>{VerificationCodeSent}</Text>
            <Text style={otpStyles.phoneNumber}>+91-{phoneNumber}</Text>
          </View>
          <View style={otpStyles.verifyView}>
            <TextInput
              returnKeyType="done"
              ref={(ref) => (inputRefs.current[0] = ref)}
              value={inputValues[0]}
              onChangeText={(value) => handleChange(value, 0)}
              keyboardType="numeric"
              style={[styles.verifybefore, isFocused && styles.verifyafter]}
              maxLength={1}
            />
            <TextInput
              returnKeyType="done"
              ref={(ref) => (inputRefs.current[1] = ref)}
              value={inputValues[1]}
              onChangeText={(value) => handleChange(value, 1)}
              keyboardType="numeric"
              style={[styles.verifybefore, isFocused && styles.verifyafter]}
              maxLength={1}
            />
            <TextInput
              returnKeyType="done"
              ref={(ref) => (inputRefs.current[2] = ref)}
              value={inputValues[2]}
              onChangeText={(value) => handleChange(value, 2)}
              keyboardType="numeric"
              style={[styles.verifybefore, isFocused && styles.verifyafter]}
              maxLength={1}
            />
            <TextInput
              returnKeyType="done"
              ref={(ref) => (inputRefs.current[3] = ref)}
              value={inputValues[3]}
              onChangeText={(value) => handleChange(value, 3)}
              keyboardType="numeric"
              style={[styles.verifybefore, isFocused && styles.verifyafter]}
              maxLength={1}
              onEndEditing={checkOTP}
            />
          </View>
          <Button onPress={checkOTP} style={otpStyles.otpRequest}>
            {RequestOtp}
          </Button>
          <View style={otpStyles.otpNot}>
            <Text style={otpStyles.otpNotText}>{OtpNot}</Text>
            <MyLink fs={rf(1.8)} linkText={OtpViaCall}></MyLink>
          </View>
          <View style={{ height: rh(2) }}></View>
        </ScrollView>
        <View style={otpStyles.footer}>
          <Text style={otpStyles.continue}>
            {ByContinueOnly}
            {ToOur}{' '}
            <Text style={styles.linktext} onPress={handleLinkPress}>
              {TnC}
            </Text>{' '}
            {And}{' '}
            <Text style={styles.linktext} onPress={handleLinkPress}>
              {PrivacyPolicy}
            </Text>
          </Text>
        </View>
      </View>
    </>
  );
};

const otpStyles = StyleSheet.create({
  code: {
    color: colors.secondary,
    fontSize: rf(3),
    fontWeight: '700',
  },
  codeText: {
    color: colors.secondary,
    fontSize: rf(2),
    fontWeight: '400',
  },
  codeView: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  codeView1: { alignItems: 'center' },
  container: { backgroundColor: colors.white, flex: 1 },
  content: {
    paddingHorizontal: rw(3.5),
    paddingVertical: rh(1),
  },
  content1: { flex: 1 },
  continue: { textAlign: 'center' },
  footer: {
    alignItems: 'center',
    bottom: rh(1.5),
    justifyContent: 'center',
    marginTop: rh(3),
    width: '100%',
  },
  icon: { alignItems: 'center', marginVertical: rh(5) },
  otpNot: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
    justifyContent: 'center',
    marginTop: 8,
    width: '100%',
  },
  otpNotText: { fontSize: rf(1.6), fontWeight: '500' },
  otpRequest: { marginTop: rh(5), width: '100%' },
  phoneNumber: {
    color: colors.primary,
    fontSize: rf(2),
    fontWeight: '400',
  },
  verifyView: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingBottom: 8,
    paddingHorizontal: 16,
    width: '100%',
  },
});
OTPverify.propTypes = {
  route: PropTypes.object,
  navigation: PropTypes.object,
};
