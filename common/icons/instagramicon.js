import React from 'react';
import { SvgXml } from 'react-native-svg';
import PropTypes from 'prop-types';

export const InstagramIcon = ({ size = 14, color = 'white' }) => {
  return (
    <SvgXml
      xml={`
      <svg width=${size} height=${size} viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1.05957 9C1.05957 5.229 1.05957 3.343 2.23157 2.172C3.40257 1 5.28857 1 9.05957 1H11.0596C14.8306 1 16.7166 1 17.8876 2.172C19.0596 3.343 19.0596 5.229 19.0596 9V11C19.0596 14.771 19.0596 16.657 17.8876 17.828C16.7166 19 14.8306 19 11.0596 19H9.05957C5.28857 19 3.40257 19 2.23157 17.828C1.05957 16.657 1.05957 14.771 1.05957 11V9Z" stroke="#F3821C" stroke-width="2"/>
      <path d="M14.5596 7C15.388 7 16.0596 6.32843 16.0596 5.5C16.0596 4.67157 15.388 4 14.5596 4C13.7311 4 13.0596 4.67157 13.0596 5.5C13.0596 6.32843 13.7311 7 14.5596 7Z" fill="#C13584"/>
      <path d="M10.0596 13C11.7164 13 13.0596 11.6569 13.0596 10C13.0596 8.34315 11.7164 7 10.0596 7C8.40272 7 7.05957 8.34315 7.05957 10C7.05957 11.6569 8.40272 13 10.0596 13Z" stroke="#833AB4" stroke-width="2"/>
      </svg>
    `}
    />
  );
};
InstagramIcon.propTypes = {
  size: PropTypes.number,
  color: PropTypes.string,
};
