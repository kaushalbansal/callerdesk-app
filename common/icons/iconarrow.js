import React from 'react';
import { SvgXml } from 'react-native-svg';
import PropTypes from 'prop-types';

export const IconArrow = ({ color, colorCircle }) => {
  return (
    <SvgXml
      xml={`<?xml version="1.0" ?>
    <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="21" cy="21" r="21" fill=${colorCircle}/>
    <path d="M19.4229 16.043L24.7296 21.3497C24.8077 21.4278 24.8077 21.5545 24.7296 21.6326L19.4229 26.9393" stroke=${color} stroke-width="2" stroke-linecap="round"/>
    </svg>
    
    `}
    />
  );
};
IconArrow.propTypes = {
  size: PropTypes.number,
  color: PropTypes.string,
  colorCircle: PropTypes.string,
};
