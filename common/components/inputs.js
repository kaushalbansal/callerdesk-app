import { View } from 'react-native';
import React, { useRef } from 'react';
import { Input } from '@ui-kitten/components';
import { SearchIcon } from '../icons/search';
import { colors } from '../../themes/vars';
import PropTypes from 'prop-types';

const MySearch = ({
  width,
  placeholder = '',
  mb = 0,
  mt = 0,
  onChange = () => {},
  onSubmitEditing = () => {},
  enterKeyHint,
}) => {
  const inputRef = useRef(null);

  // Ensure focus stays on the input field
  const handleChangeText = (text) => {
    inputRef.current.focus();
    onChange(text);
  };
  return (
    // eslint-disable-next-line react-native/no-inline-styles
    <View style={{ marginBottom: mb, marginTop: mt, alignSelf: 'center' }}>
      <Input
        ref={inputRef}
        // eslint-disable-next-line react-native/no-inline-styles
        style={{
          width: width || `95%`,
          borderRadius: 10,
          borderWidth: 1,
          backgroundColor: colors.inputContainer,
          borderColor: colors.inputText,
        }}
        onChangeText={handleChangeText}
        placeholder={placeholder}
        accessoryLeft={<SearchIcon />}
        onSubmitEditing={onSubmitEditing}
        enterKeyHint={enterKeyHint}
      />
    </View>
  );
};

export default MySearch;
MySearch.propTypes = {
  width: PropTypes.number,
  placeholder: PropTypes.string,
  mb: PropTypes.number,
  mt: PropTypes.number,
  onChange: PropTypes.func,
  onSubmitEditing: PropTypes.func,
  enterKeyHint: PropTypes.string,
};
