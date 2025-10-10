import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from '@ui-kitten/components';
import PropTypes from 'prop-types';

import { colors } from '../../themes/vars';

export const MyLink = ({
  linkText = '',
  bold = false,
  fs = 14,
  color = colors.link,
  onPress = () => {},
}) => {
  return (
    <>
      <TouchableOpacity activeOpacity={0.7} onPress={onPress}>
        <Text
          style={[
            styles.link,
            // eslint-disable-next-line react-native/no-inline-styles
            {
              fontSize: fs,
              fontWeight: bold ? 'bold' : 'normal',
              color,
            },
          ]}
        >
          {linkText}
        </Text>
      </TouchableOpacity>
    </>
  );
};

export default MyLink;

const styles = StyleSheet.create({
  link: {
    color: colors.link,
  },
});

MyLink.propTypes = {
  bold: PropTypes.bool,
  linkText: PropTypes.string,
  fs: PropTypes.number,
  color: PropTypes.string,
  onPress: PropTypes.func,
};
