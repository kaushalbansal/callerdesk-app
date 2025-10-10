import React from 'react';
import { SvgXml } from 'react-native-svg';
import PropTypes from 'prop-types';

export const IconArrowPointedRight = ({ size = 13, color = '#2368F1' }) => {
  return (
    <SvgXml
      xml={`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size * 0.77}" viewBox="0 0 13 10" fill="none">
    <path d="M1.562 5.20704L11.5083 5.20704L1.562 5.20704ZM11.5083 5.20704L7.77844 8.93691L11.5083 5.20704ZM11.5083 5.20704L7.77845 1.47718L11.5083 5.20704Z" 
    fill="${color}"/>
    <path d="M1.562 5.20704L11.5083 5.20704M11.5083 5.20704L7.77844 8.93691M11.5083 5.20704L7.77845 1.47718" 
    stroke="${color}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`}
    />
  );
};
IconArrowPointedRight.propTypes = {
  size: PropTypes.number,
  color: PropTypes.string,
};
