import { View, StyleSheet, Alert } from 'react-native';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button } from '@ui-kitten/components';
import { colors } from '../themes/vars';
import { rh, rw } from '../common/helpers/dimentions';
import {
  GetProfileAndBalance,
  SubmitLogin,
} from '../common/redux/actions/global';
import { loadVoiceTemplateList } from '../common/redux/actions/voiceTemplate';
import {
  EmailBizText,
  ForgotPasswordLabel,
  NoEmailPassword,
} from '../common/Constants';
import { IconMail } from '../common/icons/Contactdetailsicons/mail';
import TextInputWithIcon from '../common/components/textinputwithicon';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomHeader from '../common/components/CustomHeader';
import PropTypes from 'prop-types';

export const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [pwd, setPassword] = useState('');

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
          dispatch(loadVoiceTemplateList(res.authcode));
          navigation.navigate('HomeTab');
          setEmail('');
          setPassword('');
        }),
      );
    } else {
      Alert.alert(NoEmailPassword);
    }
  };

  return (
    <View style={ForgotPasswordStyle.container}>
      <CustomHeader title="Forgot Password" />
      <View
        style={ForgotPasswordStyle.content}
        contentContainerStyle={{ marginTop: rh(7) }}
      >
        <TextInputWithIcon
          placeholder={EmailBizText}
          inputMode="email-address"
          value={email}
          onChangeText={(val) => setEmail(val)}
          icon={<IconMail size={20} color={colors.greyNew} />}
        />
        <Button onPress={onSubmit} style={{ marginTop: rh(2) }}>
          {ForgotPasswordLabel.toUpperCase()}
        </Button>
        <View style={{ height: rh(2) }}></View>
      </View>
    </View>
  );
};

const ForgotPasswordStyle = StyleSheet.create({
  container: { backgroundColor: colors.white, flex: 1 },
  content: {
    paddingHorizontal: rw(3.5),
    paddingVertical: rh(1),
  },
});
ForgotPasswordScreen.propTypes = {
  navigation: PropTypes.object,
};
