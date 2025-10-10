// src/components/VariableInputField.js
import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet
} from 'react-native';
import PropTypes from 'prop-types';
import { rw, rf,} from '../helpers/dimentions';
import { colors } from '../../themes/vars';

function TemplateWIzardVariableInputField({
  parameter,
  value,
  onChangeText,
  placeholder,
  error,
  wholeContainerStyle,
  containerStyle,
  inputStyle,
  parameterStyle,
  errorStyle,
  ...textInputProps
}) {
  return (
    <View style={wholeContainerStyle}>
    <View style={[styles.wrapper, containerStyle]}>
      <View style={[styles.paramBox, parameterStyle]}>
        <Text style={styles.paramText}>{`{{${parameter}}}`}</Text>
      </View>
      <TextInput
        style={[styles.input, inputStyle]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.WhatsappTemplateTextgreyColor}
        {...textInputProps}
      />
    
    </View>
    {error ? (
        <Text style={[styles.error, errorStyle]} numberOfLines={2}>
          {error}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    // width: '100%',
    marginTop: rw(1),
    marginBottom: rw(1.5),
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: colors.WhatsappTemplateInputBorderColor,
    borderRadius: rw(1),
    // alignItems: 'center'
  },
  paramBox: {
    borderRightWidth: 1,
    borderColor: colors.WhatsappTemplateInputBorderColor,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: rw(2),  
  },
  paramText: {
    fontSize: rf(1.6),
    color: colors.WhatsappTemplateTextgreyColor,
    fontWeight: '400',
  },
  input: {
    paddingHorizontal: rw(2),        // leave space for paramBox
    height: rw(12),
    fontSize: rf(1.6),
    color: colors.WhatsappTemplateTextgreyColor,
    flex: 1,
    fontWeight: '400',
  },
  error: {
    fontSize: rf(1.4),
    color: colors.error,
    fontWeight: '400'
  },
});

TemplateWIzardVariableInputField.propTypes = {
  /** The variable key (without braces) to display on the left */
  parameter:   PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  /** The input’s text value */
  value:       PropTypes.string.isRequired,
  /** Called when text changes */
  onChangeText:PropTypes.func.isRequired,
  /** Placeholder text for the input */
  placeholder: PropTypes.string,
  /** Error message (if any) to display below */
  error:       PropTypes.string,
  wholeContainerStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  containerStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  inputStyle:     PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  parameterStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  errorStyle:     PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

TemplateWIzardVariableInputField.defaultProps = {
  placeholder: '',
  error:       '',
  wholeContainerStyle: {},
  containerStyle: {},
  inputStyle:     {},
  parameterStyle: {},
  errorStyle:     {},
};

export default React.memo(TemplateWIzardVariableInputField);
