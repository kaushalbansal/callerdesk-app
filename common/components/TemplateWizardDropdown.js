// src/components/DropdownField.js
import React, { useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { rw, rh, rf } from '../helpers/dimentions';
import { colors } from '../../themes/vars';
import PropTypes from 'prop-types';

const DropdownField = React.memo(({
  label = '',
  data = [],
  value = null,
  onChange,
  placeholder = 'Select...',
  error = '',
  disabled = false,
  containerStyle = {},
  dropdownStyle = {},
  labelStyle = {},
  placeholderStyle = {},
  errorStyle = {},
  ...restProps
}) => {
  const handleChange = useCallback(
    item => onChange(item),
    [onChange]
  );

  return (
    <View style={[styles.container, containerStyle]}>
      {label ? <Text style={[styles.label, labelStyle]}>{label}</Text> : null}

      <Dropdown
        style={[
          styles.dropdown,
          error && styles.errorBorder,
          disabled && styles.disabled,
          dropdownStyle,
        ]}
        data={data}
        labelField="label"
        valueField="value"
        value={value}
        selectedTextStyle={[styles.placeholder]}
        itemTextStyle={[styles.placeholder]}
        placeholder={placeholder}
        placeholderStyle={[styles.placeholder, placeholderStyle]}
        activeColor={"#F2F4F7"}
        disable={disabled}
        onChange={handleChange}
        {...restProps}
        iconColor={"#59575790"}
      />

      {error ? <Text style={[styles.errorText, errorStyle]}>{error}</Text> : null}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginTop: rh(1)
  },
  label: {
    fontSize: rf(1.8),
    marginBottom: rw(1),
    color: colors.black,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: colors.WhatsappTemplateInputBorderColor,
    borderRadius: rw(1),
    paddingHorizontal: rw(3),
    paddingVertical: rw(3),
  },
  placeholder: {
    fontSize: rf(1.8),
    color: colors.WhatsappTemplateTextgreyColor,
    fontWeight: '400'
  },
 
  errorBorder: {
    borderColor: colors.error,
  },
  errorText: {
    marginTop: rw(1),
    fontSize: rf(1.6),
    color: colors.error,
  },
  disabled: {
    backgroundColor: colors.lightGreyNew,
    opacity: 0.5
  },
});

DropdownField.propTypes = {
  label: PropTypes.string,
  data: PropTypes.arrayOf(
    PropTypes.shape({ label: PropTypes.string, value: PropTypes.any })
  ).isRequired,
  value: PropTypes.any,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  error: PropTypes.string,
  disabled: PropTypes.bool,
  containerStyle: PropTypes.object,
  dropdownStyle: PropTypes.object,
  labelStyle: PropTypes.object,
  placeholderStyle: PropTypes.object,
  errorStyle: PropTypes.object,
};

export default DropdownField;
