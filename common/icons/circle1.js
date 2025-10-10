import React from 'react';
import { SvgXml } from 'react-native-svg';
import PropTypes from 'prop-types';

export const Circle1 = ({ size = 22, color = '#333' }) => {
  return (
    <SvgXml
      xml={`<?xml version="1.0" ?><svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="6.5" cy="6.5" r="6.5" fill="#D9D9D9"/>
      </svg>      
      `}
    />
  );
};
Circle1.propTypes = {
  size: PropTypes.number,
  color: PropTypes.string,
};
