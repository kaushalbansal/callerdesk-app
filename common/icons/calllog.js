import React from 'react';
import PropTypes from 'prop-types';
import { SvgXml } from 'react-native-svg';

export const CallLog = ({ size = 22, color = '#333' }) => {
  return (
    <SvgXml
      xml={`<?xml version="1.0" ?><svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="15" cy="15" r="15" fill="#8A8989"/>
      <path d="M13.6162 20.7849C13.0319 20.6523 12.4707 20.4331 11.9513 20.1343M16.3016 9C17.6363 9.30484 18.8281 10.0538 19.6816 11.1243C20.5352 12.1948 21 13.5233 21 14.8924C21 16.2616 20.5352 17.5901 19.6816 18.6606C18.8281 19.7311 17.6363 20.48 16.3016 20.7849M9.97681 18.3116C9.6106 17.7796 9.33245 17.192 9.15307 16.5715M9 13.8854C9.10742 13.2476 9.31419 12.6434 9.60421 12.0896L9.71767 11.8848M11.5397 9.91035C12.1679 9.47793 12.8726 9.16899 13.6162 9" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M14.958 12.2061V14.8915L16.9721 16.9055" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      `}
    />
  );
};
CallLog.propTypes = {
  size: PropTypes.number,
  color: PropTypes.string,
};
