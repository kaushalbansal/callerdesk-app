import React from 'react';
import { SvgXml } from 'react-native-svg';
import PropTypes from 'prop-types';

export const IconArrowRight = ({ color = `#4B4B4B` }) => {
  return (
    <SvgXml
      xml={`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M8.58984 16.59L13.1698 12L8.58984 7.41L9.99984 6L15.9998 12L9.99984 18L8.58984 16.59Z" fill="${color}"/>
  </svg>`}
    />
  );
};
IconArrowRight.propTypes = {
  size: PropTypes.number,
  color: PropTypes.string,
};
