import React, { useState } from 'react';
import { TextInput } from 'react-native';
import { rh, rw } from '../helpers/dimentions';
import { colors } from '../../themes/vars';
import PropTypes from 'prop-types';

const TextArea = ({
  from,
  value,
  rows = 4,
  placeholder = '',
  style,
  error = false,
  onChange = () => {},
}) => {
  const [, setFocus] = useState(false);

  return (
    <>
      <TextInput
        multiline
        numberOfLines={rows}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        placeholder={placeholder}
        onChangeText={onChange}
        value={value}
        style={[
          // eslint-disable-next-line react-native/no-inline-styles
          {
            backgroundColor: from === `contact` ? `#f6f8fb` : colors.white,
            borderColor: from === `contact` ? `#e9edf4` : colors.greyNew,
            borderWidth: 1,
            paddingHorizontal: 16,
            paddingVertical: 12,
            borderRadius: 5,
            textAlignVertical: 'top',
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

            borderWidth: 1,
            borderColor: from === `contact` ? `#e9edf4` : colors.greyNew,
            marginVertical: rh(0.7),
            alignSelf: `center`,
          },
          style,
        ]}
      />
    </>
  );
};

export default TextArea;
TextArea.propTypes = {
  from: PropTypes.string,
  value: PropTypes.string,
  placeholder: PropTypes.string,
  rows: PropTypes.number,
  style: PropTypes.object,
  error: PropTypes.bool,
  onChange: PropTypes.func,
};
