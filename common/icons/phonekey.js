import React from 'react';
import { SvgXml } from 'react-native-svg';
import PropTypes from 'prop-types';

export const PhonekeyIcon = ({ size = 67 }) => {
  return (
    <SvgXml
      xml={`<?xml version="1.0" ?><svg width="${size}" height="${size}" viewBox="0 0 67 67" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="66.74" height="66.74" rx="33.37" fill="#30D158"/>
    <path d="M25.7339 30.1994C26.7314 34.6761 29.1469 38.7417 32.585 41.7873L36.4535 39.5002C36.9283 39.2195 37.5202 39.2373 37.9667 39.531C39.4007 40.4512 41.0216 41.1658 42.7564 41.6115C43.5258 41.8091 43.9937 42.6004 43.796 43.3699L42.5417 48.2525C42.344 49.0219 41.5527 49.4898 40.7833 49.2921C27.6465 45.9173 19.735 32.5358 23.1097 19.399C23.3074 18.6296 24.0987 18.1617 24.8681 18.3594L29.7647 19.6173C30.5342 19.815 31.002 20.6062 30.8043 21.3757C30.3551 23.1245 30.2036 24.8752 30.3187 26.5751C30.3468 27.1042 30.0947 27.6211 29.6024 27.9122L25.7339 30.1994Z" fill="white"/>
    </svg>         
    `}
    />
  );
};
PhonekeyIcon.propTypes = {
  size: PropTypes.number,
  color: PropTypes.string,
};
