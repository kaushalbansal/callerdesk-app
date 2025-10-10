import React from 'react';
import { SvgXml } from 'react-native-svg';
import PropTypes from 'prop-types';

export const Circle = ({ size = 4, color = '#7569FA' }) => {
  return (
    <SvgXml
      xml={`<?xml version="1.0" ?><svg width="20" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="6.5" cy="6.5" r="${size}" fill="${color}"/>
      </svg>
      
      
      `}
    />
  );
};
Circle.propTypes = {
  size: PropTypes.number,
  color: PropTypes.string,
};
