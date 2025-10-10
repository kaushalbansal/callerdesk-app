// src/components/TextInputField.js
import React, { forwardRef, useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { rf, rh, rw } from '../helpers/dimentions';
import { colors } from '../../themes/vars';

const TemplateWizardInput = forwardRef((props, ref) => {
   const  {
     label,
     value,
     onChangeText,
     placeholder,
     error,
     maxLength,
     multiline = false,
     containerStyle = {},
     inputContainerStyle={},
     inputStyle = {},
     inputEnabled=true,
     keyBoardType="default",
     autoCapitalize,
     onSelectionChange,
     selection
   }=props

  const [currentLength, setCurrentLength] = useState((value || '').length);

  useEffect(() => {
    setCurrentLength((value || '').length);
  }, [value]);

  const handleChange = (text) => {
    if (maxLength == null || text.length <= maxLength) {
      onChangeText(text);
    }
  };

  return (
    <View style={[styles.parentContianer, containerStyle]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
    <View style={[styles.container,  multiline ? styles.multiLineContainer: styles.singleLineContianer, !inputEnabled && styles.disabledInputStyle,inputContainerStyle, error && styles.errorBorder]}>
      

      <TextInput
        ref={ref}
        style={[
          styles.input,
          multiline ? styles.multiline : null,
          inputStyle,
        ]}
        value={value}
        onChangeText={handleChange}
         {...(selection ? { selection } : {})}
        // selection={selection}
        onSelectionChange={onSelectionChange}
        placeholder={placeholder}
        multiline={multiline}
        textAlignVertical={multiline ? 'top' : 'center'}
        placeholderTextColor={colors.WhatsappTemplateInputBorderColor}
        editable={inputEnabled}
        keyboardType={keyBoardType}
        maxLength={maxLength}
        autoCapitalize={autoCapitalize}
      />

      {maxLength ? (
        <Text style={[
          styles.counter,
          currentLength > maxLength ? styles.errorText : null,
        ]}>
          {`${currentLength}/${maxLength}`}
        </Text>
      ) : null}

      
    </View>
    {error ? <Text style={styles.errorMessage}>{error}</Text> : null}
    </View>
  );
})

TemplateWizardInput.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  onChangeText: PropTypes.func,
  onSelectionChange: PropTypes.func,
  placeholder: PropTypes.string,
  error: PropTypes.string,
  maxLength: PropTypes.number,
  multiline: PropTypes.bool,
  containerStyle: PropTypes.object,
  inputContainerStyle: PropTypes.object,
  inputStyle: PropTypes.object,
  inputEnabled: PropTypes.bool,
  keyBoardType: PropTypes.string,
  autoCapitalize: PropTypes.string,
    selection: PropTypes.shape({
    start: PropTypes.number.isRequired,
    end: PropTypes.number.isRequired,
  }),
};

TemplateWizardInput.defaultProps = {
  label: '',
  value: '',
  placeholder: '',
  error: '',
  maxLength: null,
  multiline: false,
  containerStyle: {},
  inputContainerStyle: {},
  inputStyle: {},
  inputEnabled: true,
  keyBoardType: 'default',
  onSelectionChange: null,
   selection: null,
};


const styles = StyleSheet.create({
  parentContianer:{
       marginTop: rh(1),
  },
  container: {
 
    // marginBottom: rw(4),
    borderWidth: 1,
    paddingHorizontal: rw(3),
    // paddingBottom: rw(1),
    // paddingVertical: rw(2.5),
    borderRadius: rw(1),
    borderColor: colors.WhatsappTemplateInputBorderColor
  },
  multiLineContainer:{
    minHeight: rw(25),
    flexDirection: 'column',
    paddingBottom: rw(1.5),
  },
  singleLineContianer:{
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
 
  },
  label: {
    fontSize: rf(1.8),
    marginBottom: rw(1.2),
    // marginTop: rh(1),
    color: colors.black,
    fontWeight: '500'
  },
  input: {
    // borderWidth: 1,
    // paddingHorizontal: rw(3),
    paddingVertical: rw(2),
    fontSize: rf(1.8),
    color: colors.WhatsappTemplateTextgreyColor,
    fontWeight: '400',
    flex: 1,
    // height: rw(10)
  },
  disabledInputStyle:{
    backgroundColor: "#F2F4F7"
  },
  multiline: {
    // minHeight: rw(12),
    // paddingTop: rw(2),
  },
  counter: {
    textAlign: 'right',
    fontSize: rf(1.6),
    color: colors.WhatsappTemplateTextgreyColor,
    // marginTop: rw(1),
    marginLeft: rw(1.2),
    fontWeight: '400'
  },
  multilineConter:{
    // alignSelf: 
  },
  errorBorder: {
    borderColor: colors.error,
  },
  errorText: {
    color: colors.error,
  },
  errorMessage: {
    // marginTop: rw(0.5),
    fontSize: rf(1.6),
    color: colors.error,
  },
});


export default TemplateWizardInput
