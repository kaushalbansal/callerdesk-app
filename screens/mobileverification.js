import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View, Text } from 'react-native';
import { colors } from '../themes/vars';
import { rh, rw } from '../common/helpers/dimentions';
import {
  ConfirmOtpText,
  enterSentOtpText,
  hiThereText,
} from '../common/Constants';
import OtpInput from '../common/components/OtpInput';
import PropTypes from 'prop-types';

const MobileVerificationScreen = ({ mobile, submitOtp }) => {
  const [otp, setOTP] = useState();
  return (
    <>
      <ScrollView style={styles.container}>
        <Text style={styles.sticky}>
          <Text style={{ fontWeight: `600`, color: `#656565` }}>
            {hiThereText.toUpperCase()}
          </Text>
        </Text>
        <View style={{ flexDirection: `row` }}>
          <Text style={{ fontWeight: `400`, color: `#656565` }}>
            {enterSentOtpText}
          </Text>
          <Text style={{ fontWeight: `600`, color: colors.black }}>
            {' '}
            {mobile}
          </Text>
        </View>
        <View style={{ marginTop: rh(1), marginLeft: rw(-0.5) }}>
          <OtpInput
            length={4}
            onChange={(val) => {
              setOTP(val);
            }}
          />
        </View>
        <Pressable
          style={styles.btn}
          onPress={() => {
            submitOtp(otp);
          }}
        >
          <Text style={styles.btnText}>{ConfirmOtpText.toUpperCase()}</Text>
        </Pressable>
      </ScrollView>
    </>
  );
};

export default MobileVerificationScreen;

const styles = StyleSheet.create({
  btn: {
    alignSelf: `center`,
    backgroundColor: colors.primary,
    borderRadius: 6,
    marginTop: rh(2),
    paddingVertical: rh(1.2),
    width: rw(85),
  },
  btnText: { color: colors.white, fontWeight: `700`, textAlign: `center` },
  container: {
    alignSelf: `center`,
    backgroundColor: colors.white,
  },
  sticky: {
    color: colors.black,
    fontSize: rh(1.7),
    fontWeight: `400`,
    marginLeft: rw(0),
    marginVertical: rh(1),
  },
});
MobileVerificationScreen.propTypes = {
  mobile: PropTypes.string,
  submitOtp: PropTypes.func,
};
