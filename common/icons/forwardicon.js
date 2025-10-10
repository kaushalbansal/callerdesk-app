import React from 'react';
import { SvgXml } from 'react-native-svg';
import PropTypes from 'prop-types';

export const ForwardIcon = ({ size = 22, color = '#333' }) => {
  return (
    <SvgXml
      xml={`<?xml version="1.0" ?><svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="15" cy="15" r="15" fill="#EA7E31"/>
      <path d="M16.5 9L18.2175 10.7175L16.0575 12.8775L17.1225 13.9425L19.2825 11.7825L21 13.5V9M13.5 9H9V13.5L10.7175 11.7825L14.25 15.3075V21H15.75V14.6925L11.7825 10.7175" fill="white"/>
      </svg>
      
      `}
    />
  );
};
ForwardIcon.propTypes = {
  size: PropTypes.number,
  color: PropTypes.string,
};
