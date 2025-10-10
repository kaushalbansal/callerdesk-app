import { Platform, Linking } from 'react-native';

export const LinkingAPI = () => {
  return {
    MakePhoneCall: DeviceCall,
  };
};

const DeviceCall = (dialNumber) => {
  dialNumber = dialNumber.replace(/\s/g, '');
  let teleUrl = '';
  if (Platform.OS === 'android') {
    teleUrl = `tel:${dialNumber}`;
  }

  if (Platform.OS === 'ios') {
    teleUrl = `telprompt:${dialNumber}`;
  }

  LinkCall(teleUrl);
};

const LinkCall = (teleUrl) => {
  Linking.openURL(teleUrl);
};
