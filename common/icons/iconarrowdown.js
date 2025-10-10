import React from 'react';
import { SvgXml } from 'react-native-svg';
import PropTypes from 'prop-types';

export const IconArrowDown = ({ size = 21, color = '#333' }) => {
  return (
    <SvgXml
      xml={`<?xml version="1.0" ?><svg width="${size}" height="${size * 0.523}" viewBox="0 0 21 11" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1.4585 0.966797L10.5514 9.29874L19.4585 0.966797" 
    stroke="${color}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>    
    `}
    />
  );
};
IconArrowDown.propTypes = {
  size: PropTypes.number,
  color: PropTypes.string,
};
