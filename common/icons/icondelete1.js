import React from 'react';
import { SvgXml } from 'react-native-svg';
import PropTypes from 'prop-types';

export const IconDelete1 = ({ size = 16, color = '#333' }) => {
  return (
    <SvgXml
      xml={`<?xml version="1.0" ?>

      <svg width=${size} height=${size} viewBox="0 0 19 21" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M11.4474 9.40788V15.4868M7.39474 9.40788V15.4868M3.34211 5.35524V17.5131C3.34211 18.0505 3.55563 18.5659 3.93565 18.9459C4.31567 19.3259 4.83105 19.5395 5.36843 19.5395H13.4737C14.0111 19.5395 14.5264 19.3259 14.9065 18.9459C15.2865 18.5659 15.5 18.0505 15.5 17.5131V5.35524M1.3158 5.35524H17.5263M4.35527 5.35524L6.38159 1.30261H12.4605L14.4868 5.35524" stroke="white" stroke-width="1.73684" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
         
    `}
    />
  );
};
IconDelete1.propTypes = {
  size: PropTypes.number,
  color: PropTypes.string,
};
