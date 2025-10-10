import React from 'react';
import { SvgXml } from 'react-native-svg';
import PropTypes from 'prop-types';
export const IconTickMark = ({ size = 22, color = '#333333' }) => {
  return (
    <SvgXml
      xml={`<svg width="${size}" height="${size}" fill=${color} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="m10.585 13.415-2.828-2.829L6.343 12l4.242 4.243 7.071-7.071-1.414-1.414-5.657 5.657Z"></path>
  </svg>`}
    />
  );
};
IconTickMark.propTypes = {
  size: PropTypes.number,
  color: PropTypes.string,
};
