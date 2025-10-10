import React from 'react';
import { SvgXml } from 'react-native-svg';
import PropTypes from 'prop-types';

export const TwitterIcon = ({ size = 14, color = 'white' }) => {
  return (
    <SvgXml
      xml={`
      <svg width=${size} height=${size} viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M11.0267 7.314L16.9281 0H14.2941L9.78986 5.586L5.79386 0H0.0595703L6.75043 9.35143L0.462427 17.1429H3.09728L7.98728 11.0829L12.3253 17.1429H18.0596L11.0267 7.314ZM8.98671 9.84257L7.74814 8.112L2.93957 1.39457H4.91957L8.80071 6.80914L10.0376 8.54057L15.1959 15.7483H13.2159L8.98671 9.84257Z" fill="black"/>
      </svg>
    `}
    />
  );
};
TwitterIcon.propTypes = {
  size: PropTypes.number,
  color: PropTypes.string,
};
