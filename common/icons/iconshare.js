import React from 'react';
import PropTypes from 'prop-types';
import { SvgXml } from 'react-native-svg';

export const IconShare = ({ size = 22, color = '#000000' }) => {
  return (
    <SvgXml
      xml={`<svg width="${size}" height="${size}" fill="none" stroke="${color}" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"></path>
    <path d="M18 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"></path>
    <path d="M18 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"></path>
    <path d="m8.7 10.697 6.6-3.4"></path>
    <path d="m8.7 13.297 6.6 3.4"></path>
  </svg>`}
    />
  );
};
IconShare.propTypes = {
  size: PropTypes.number,
  color: PropTypes.string,
};
