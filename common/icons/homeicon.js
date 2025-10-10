import React from 'react';
import { SvgXml } from 'react-native-svg';
import PropTypes from 'prop-types';

export const IconHome = ({ size = 22, color = '#9099AE' }) => {
  return (
    <SvgXml
      xml={`<?xml version="1.0" ?><svg  width="${size}" height="${size}"  viewBox="0 0 22 21" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M21 20H1M1 9L5.063 5.75M21 9L12.874 2.5C12.3421 2.07449 11.6812 1.84267 11 1.84267C10.3188 1.84267 9.65793 2.07449 9.126 2.5L8.344 3.125M14.5 3.5V1.5C14.5 1.36739 14.5527 1.24021 14.6464 1.14645C14.7402 1.05268 14.8674 1 15 1H17.5C17.6326 1 17.7598 1.05268 17.8536 1.14645C17.9473 1.24021 18 1.36739 18 1.5V6.5M3 20V7.5M19 7.5V11.5M19 20V15.5" 
    stroke="${color}" stroke-width="1.5" stroke-linecap="round"/>
    <path d="M14 20V15C14 13.586 14 12.879 13.56 12.44C13.122 12 12.415 12 11 12C9.586 12 8.879 12 8.44 12.44M8 20V15"
     stroke="${color}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M13 7.5C13 8.03043 12.7893 8.53914 12.4142 8.91421C12.0391 9.28929 11.5304 9.5 11 9.5C10.4696 9.5 9.96086 9.28929 9.58579 8.91421C9.21071 8.53914 9 8.03043 9 7.5C9 6.96957 9.21071 6.46086 9.58579 6.08579C9.96086 5.71071 10.4696 5.5 11 5.5C11.5304 5.5 12.0391 5.71071 12.4142 6.08579C12.7893 6.46086 13 6.96957 13 7.5Z"
     stroke="${color}" stroke-width="1.5"/>
    </svg>    
    `}
    />
  );
};
IconHome.propTypes = {
  size: PropTypes.number,
  color: PropTypes.string,
};
