import React from 'react';
import { View, TextInput } from 'react-native';
import { colors } from '../../themes/vars';
import { rh, rw } from '../helpers/dimentions';
import PropTypes from 'prop-types';

const TextInputWithIcon = ({
  accessible = true,
  addteam = false,
  defaultValue,
  style,
  from,
  lines,
  placeholder,
  value,
  onChangeText,
  icon,
  iconLeft,
  inputMode = `default`,
  secure = false,
  maxLength,
}) => {
  return (
    <View
      style={[
        // eslint-disable-next-line react-native/no-inline-styles
        {
          borderWidth: 1,
          borderColor: from === `contact` ? `#e9edf4` : colors.greyNew,
          marginVertical: rh(0.7),
          alignSelf: `center`,
        },
        // eslint-disable-next-line react-native/no-inline-styles
        {
          alignItems: 'center',
          backgroundColor: from === `contact` ? `#f6f8fb` : colors.white,
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: rw(3),
          paddingVertical: rh(1),
          borderRadius: 5,
        },
        style,
      ]}
    >
      {iconLeft}
      <TextInput
        defaultValue={defaultValue}
        // eslint-disable-next-line react-native/no-inline-styles
        style={{
          flex: 1,
          flexWrap: `wrap`,
          letterSpacing: from === `visit` ? 2 : 0,
        }}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        keyboardType={inputMode}
        secureTextEntry={secure}
        numberOfLines={lines}
        editable={accessible}
        maxLength={maxLength}
      />
      {icon}
    </View>
  );
};

export default TextInputWithIcon;
TextInputWithIcon.propTypes = {
  style: PropTypes.object,
  onChangeText: PropTypes.func,
  accessible: PropTypes.bool,
  addteam: PropTypes.bool,
  secure: PropTypes.bool,
  defaultValue: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  from: PropTypes.string,
  inputMode: PropTypes.string,
  lines: PropTypes.number,
  maxLength: PropTypes.number,
  icon: PropTypes.node,
  iconLeft: PropTypes.node,
};
