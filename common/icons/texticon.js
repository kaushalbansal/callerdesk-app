import React from 'react';
import { SvgXml } from 'react-native-svg';
import PropTypes from 'prop-types';

export const TextIcon = ({ size = 18, color = '#08B632' }) => {
  return (
    <SvgXml
      xml={`
    <svg width="13" height="15" viewBox="0 0 13 15" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2.83333 10.7778H5.88889M2.83333 8.33333H10.1667M2.83333 5.88889H8.94444M1 3.44444H12M12 10.7778H8.33333V14.4444M1 1V14.4444H8.94444L12 11.3889V1H1Z" stroke="#887E7E" stroke-width="0.7"/>
    </svg>
      
    `}
    />
  );
};
TextIcon.propTypes = {
  size: PropTypes.number,
  color: PropTypes.string,
};
