import {
  Text,
  View,
  Linking,
  Keyboard,
  StyleSheet,
  ScrollView,
} from 'react-native';
import React, { useState } from 'react';
import { Button } from '@ui-kitten/components';
import { IconApp } from '../common/icons/callicon';
import { styles } from '../themes/styles';
import CustomHeader from '../common/components/CustomHeader';
import { rh, rw } from '../common/helpers/dimentions';
import {
  And,
  ByContinue,
  EmailText,
  PrivacyPolicy,
  RequestOtp,
  TnC,
  ToOur,
  WelcomeText,
} from '../common/Constants';
import TextInputWithIcon from '../common/components/textinputwithicon';
import PropTypes from 'prop-types';

export const Login = ({ navigation }) => {
  const [phoneNumber, setphoneNumber] = useState('');
  const handleLinkPress = () => {
    const url = 'https://akveo.github.io/react-native-ui-kitten/'; // Replace this with the URL you want to link to
    Linking.openURL(url);
  };
  return (
    <>
      <View style={styles.container1}>
        <CustomHeader title="Login" />
        <ScrollView style={LoginStyles.content}>
          <View style={styles.iconApp}>
            <IconApp />
          </View>
          <View style={styles.welcomeView}>
            <Text style={styles.welcomeText}>{WelcomeText}</Text>
          </View>
          <View style={styles.oneNumber}>
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
          <View style={styles.phoneNumber}>
            <TextInputWithIcon
              placeholder={EmailText}
              inputMode="numeric"
              value={phoneNumber}
              onChangeText={(val) => setphoneNumber(val)}
            />
          </View>
          {/* <View style={{ width: "100%", marginBottom: rh(3.5), paddingHorizontal: rw(0.5) }}>
                            <Input 
                            style={[LoginStyles.inputShadow, { backgroundColor: colors.white }]} 
                            size='large' placeholder='Enter your email.' value={phoneNumber} onChangeText={(val) => setphoneNumber(val)} />
                        </View> */}
          <Button
            onPress={() => {
              navigation.navigate('OTPverify', { phoneNumber });
              Keyboard.dismiss();
            }}
          >
            {RequestOtp}
          </Button>
          <View style={{ height: rh(2) }}></View>
        </ScrollView>
        <View style={LoginStyles.footer}>
          <Text style={styles.continue}>
            {ByContinue}
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

const LoginStyles = StyleSheet.create({
  content: {
    paddingHorizontal: rw(3.5),
    paddingVertical: rh(1),
  },
  footer: {
    alignItems: 'center',
    bottom: rh(1.5),
    justifyContent: 'center',
    marginTop: rh(3),
    width: '100%',
  },
});
Login.propTypes = {
  navigation: PropTypes.object,
};
