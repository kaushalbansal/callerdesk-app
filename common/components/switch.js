import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../../themes/vars';
import PropTypes from 'prop-types';

const CustomSwitch = ({
  onChange = () => {},
  checked = false,
  size = 'small',
}) => {
  const sizes = {
    small: {
      container: { w: 35, h: 18 },
      circle: 14,
      translateX: 16,
    },
    large: {
      container: { w: 48, h: 23 },
      circle: 19,
      translateX: 23,
    },
    xLarge: {
      container: { w: 54, h: 29 },
      circle: 19,
      translateX: 29,
    },
  };

  const toggleSwitch = () => {
    onChange(!checked);
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={toggleSwitch}
      style={[
        styles.switchContainer,
        checked
          ? styles.switchContainerEnabled
          : styles.switchContainerDisabled,
        { width: sizes[size].container.w, height: sizes[size].container.h },
      ]}
    >
      <View
        style={[
          styles.switchCircle,
          checked
            ? { transform: [{ translateX: sizes[size].translateX }] }
            : {},
          { width: sizes[size].circle, height: sizes[size].circle },
        ]}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  switchCircle: {
    backgroundColor: colors.white,
    borderRadius: 18,
  },
  switchContainer: {
    alignItems: 'center',
    borderRadius: 15,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    padding: 2,
  },
  switchContainerDisabled: {
    backgroundColor: colors.grey,
    borderColor: colors.grey,
  },
  switchContainerEnabled: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
});

export default CustomSwitch;
CustomSwitch.propTypes = {
  size: PropTypes.string,
  checked: PropTypes.bool,
  onChange: PropTypes.func,
};
