import React from 'react';
import { SvgXml } from 'react-native-svg';
import PropTypes from 'prop-types';

export const IconDelete2 = ({ size = 16, color = '#333' }) => {
  return (
    <SvgXml
      xml={`<?xml version="1.0" ?>

   
<svg width=${size} height=${size} viewBox="0 0 38 36" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M0.5 0.5H32C35.0376 0.5 37.5 2.96243 37.5 6V30C37.5 33.0376 35.0376 35.5 32 35.5H0.5V0.5Z" fill="#EE0940" stroke="#C4C4C4"/>
<path d="M20.25 16.625V21.875M16.75 16.625V21.875M13.25 13.125V23.625C13.25 24.0891 13.4344 24.5342 13.7626 24.8624C14.0908 25.1906 14.5359 25.375 15 25.375H22C22.4641 25.375 22.9092 25.1906 23.2374 24.8624C23.5656 24.5342 23.75 24.0891 23.75 23.625V13.125M11.5 13.125H25.5M14.125 13.125L15.875 9.625H21.125L22.875 13.125" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

    
    `}
    />
  );
};
IconDelete2.propTypes = {
  size: PropTypes.number,
  color: PropTypes.string,
};
