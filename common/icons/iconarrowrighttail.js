import React from 'react';
import { SvgXml } from 'react-native-svg';
import PropTypes from 'prop-types';

export const IconArrowRightTail = ({ size = 22, color = '#333' }) => {
  return (
    <SvgXml
      xml={`<svg width="${size}" height="${size}" fill="none" stroke="${color}" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 12h14"></path>
    <path d="m13 18 6-6"></path>
    <path d="m13 6 6 6"></path>
  </svg>`}
    />
  );
};
IconArrowRightTail.propTypes = {
  size: PropTypes.number,
  color: PropTypes.string,
};
