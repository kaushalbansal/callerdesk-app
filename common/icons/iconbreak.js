import React from 'react';
import PropTypes from 'prop-types';
import { SvgXml } from 'react-native-svg';

export const IconBreak = ({
  size = 22,
  color = `#F13260`,
  colorLine = `white`,
}) => {
  return (
    <SvgXml
      xml={`<?xml version="1.0" ?>
      <svg width=${size} height=${size} viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="9.4032" cy="9.3158" rx="8.92469" ry="8.92469" fill=${color}/>
      <path d="M13.78 8.46191H14.611C15.7182 8.46191 16.047 8.62034 16.0201 9.40888C15.9764 10.7139 15.3876 12.2306 13.0327 12.6467" stroke=${colorLine} stroke-width="0.6" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M6.4242 14.5088C4.40712 12.9574 4.11 10.7574 4.06576 8.46177C4.04723 7.46997 4.33479 7.26611 5.65479 7.26611H12.0408C13.3608 7.26611 13.649 7.46997 13.6298 8.46177C13.5856 10.7574 13.2891 12.9574 11.2714 14.5088C10.6975 14.95 10.2132 15.0379 9.39721 15.0379H8.2984C7.48296 15.0379 6.99871 14.9506 6.4242 14.5088Z" stroke=${colorLine} stroke-width="0.6" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M8.24954 7.565V10.5542M9.0321 3.97803C8.70509 4.18069 8.24954 4.87477 8.24954 5.77152M6.77888 4.87477C6.77888 4.87477 6.45605 5.17369 6.45605 5.77152M10.6415 4.87477C10.4783 4.9764 10.3419 5.4726 10.3419 5.77152M7.35519 12.2263L7.52976 11.1191C7.58117 10.7951 7.88726 10.5542 8.24894 10.5542C8.61003 10.5542 8.91672 10.7951 8.96754 11.1191L9.1421 12.2263C9.23656 12.8223 7.27269 12.75 7.35519 12.2263Z" stroke=${colorLine} stroke-width="0.6" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>  
    `}
    />
  );
};
IconBreak.propTypes = {
  size: PropTypes.number,
  color: PropTypes.string,
  colorLine: PropTypes.string,
};
