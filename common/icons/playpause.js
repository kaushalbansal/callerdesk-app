import React from 'react';
import { SvgXml } from 'react-native-svg';
import PropTypes from 'prop-types';

export const IconPause = ({ size = 18, color = '#333333' }) => {
  return (
    <SvgXml
      xml={`<svg width="${size}" height="${size}" fill="${color}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M10.5 20.25H6.75V3.75h3.75v16.5Z"></path>
    <path d="M17.25 20.25H13.5V3.75h3.75v16.5Z"></path>
  </svg>`}
    />
  );
};
IconPause.propTypes = {
  size: PropTypes.number,
  color: PropTypes.string,
};
