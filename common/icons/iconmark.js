import React from 'react';
import { SvgXml } from 'react-native-svg';
import PropTypes from 'prop-types';

export const IconMark = ({ size = 17, color = '#56585B' }) => {
  return (
    <SvgXml
      xml={`
<svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M12.5292 4.29456V15.0003C12.5292 15.1085 12.5078 15.2156 12.4664 15.3155C12.425 15.4154 12.3644 15.5062 12.2879 15.5827C12.2114 15.6592 12.1205 15.7198 12.0206 15.7612C11.9207 15.8025 11.8135 15.8238 11.7054 15.8237H5.94101L1 10.8827V4.29456C1 4.07619 1.08675 3.86676 1.24116 3.71235C1.39557 3.55794 1.605 3.47119 1.82337 3.47119H11.7054" stroke="#87898C" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M1 10.8813L5.94101 15.8224V10.8813H1Z" stroke="#87898C" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M12.192 3.80807L10.0591 5.94101M15.0001 2.64713C15.0001 2.21029 14.8266 1.79133 14.5177 1.48243C14.2088 1.17354 13.7898 1 13.353 1C12.9161 1 12.4972 1.17354 12.1883 1.48243C11.8794 1.79133 11.7058 2.21029 11.7058 2.64713C11.7058 3.08398 11.8794 3.50294 12.1883 3.81184C12.4972 4.12073 12.9161 4.29427 13.353 4.29427C13.7898 4.29427 14.2088 4.12073 14.5177 3.81184C14.8266 3.50294 15.0001 3.08398 15.0001 2.64713Z" stroke="#344054" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>  
    `}
    />
  );
};
IconMark.propTypes = {
  size: PropTypes.number,
  color: PropTypes.string,
};
