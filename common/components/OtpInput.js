import React, { useState, useRef } from 'react';
import { View } from 'react-native';
import { Input, Text } from '@ui-kitten/components';
import PropTypes from 'prop-types';
import { styles } from '../../themes/styles';

const OtpInput = ({ error = '', length, onChange = () => {}, containerStyle={}, otpInputStyle={} }) => {
  const [otp, setOtp] = useState('');
  const otpInputRefs = useRef([]);

  const handleOtpChange = (value, index) => {
    const updatedOtp = otp.split('');
    updatedOtp[index] = value;
    setOtp(updatedOtp.join(''));
    onChange(updatedOtp.join(''));
  };

  const handleOtpKeyPress = (event, index) => {
    if (event.nativeEvent.key === 'Backspace' && index > 0) {
      // Move focus to the previous input if Backspace is pressed
      otpInputRefs.current[index - 1]?.focus();
    } else if (
      index < length - 1 &&
      event.nativeEvent.key >= '0' &&
      event.nativeEvent.key <= '9'
    ) {
      // Move focus to the next input if a digit (0-9) is pressed
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  return (
    <>
      <View style={[styles.otpContainer, containerStyle]}>
        <>
          {Array.from({ length }, (_, index) => (
            <Input
              key={`${index}-otp`}
              ref={(ref) => (otpInputRefs.current[index] = ref)}
              value={otp[index]}
              status={error.length > 0 ? 'danger' : 'basic'}
              onChangeText={(value) => handleOtpChange(value, index)}
              onKeyPress={(event) => handleOtpKeyPress(event, index)}
              textStyle={styles.otpContainerText}
              style={[styles.otpStyle, otpInputStyle]}
              keyboardType="numeric"
              maxLength={1}
            />
          ))}
        </>
      </View>
      <View>
        <Text status="danger">{error}</Text>
      </View>
    </>
  );
};

export default OtpInput;
OtpInput.propTypes = {
  error: PropTypes.string,
  length: PropTypes.number,
  onChange: PropTypes.func,
  containerStyle: PropTypes.object,
  otpInputStyle: PropTypes.object
};
