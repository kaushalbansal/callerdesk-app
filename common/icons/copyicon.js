import React from 'react';
import { SvgXml } from 'react-native-svg';
import PropTypes from 'prop-types';

export const CopyIcon = ({ size = 16, color = '#EE0940' }) => {
  return (
    <SvgXml
      xml={`<?xml version="1.0" ?><svg width="${size}" height="${size}" viewBox="0 0 16 16" 
    fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3.62109 7.25C3.62109 5.129 3.62109 4.06775 4.26118 3.40925C4.90054 2.75 5.93094 2.75 7.99028 2.75H10.1749C12.2342 2.75 13.2646 2.75 13.904 3.40925C14.5441 4.06775 14.5441 5.129 14.5441 7.25V11C14.5441 13.121 14.5441 14.1823 13.904 14.8408C13.2646 15.5 12.2342 15.5 10.1749 15.5H7.99028C5.93094 15.5 4.90054 15.5 4.26118 14.8408C3.62109 14.1823 3.62109 13.121 3.62109 11V7.25Z" 
    stroke="${color}"/>
    <path d="M3.62112 13.25C3.04173 13.25 2.48607 13.0129 2.07638 12.591C1.66669 12.169 1.43652 11.5967 1.43652 11V6.5C1.43652 3.67175 1.43652 2.25725 2.28997 1.379C3.14269 0.5 4.51607 0.5 7.26211 0.5H10.1749C10.7543 0.5 11.3099 0.737053 11.7196 1.15901C12.1293 1.58097 12.3595 2.15326 12.3595 2.75" 
    stroke="${color}"/>
    </svg>            
    `}
    />
  );
};
CopyIcon.propTypes = {
  size: PropTypes.number,
  color: PropTypes.string,
};
