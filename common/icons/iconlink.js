import React from 'react';
import { SvgXml } from 'react-native-svg';
import PropTypes from 'prop-types';

export const IconLink = ({ size = 22, color = '#000000' }) => {
  return (
    <SvgXml
      xml={`<svg width="${size}" height="${size}" fill="none" stroke="${color}" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 13.996a3.5 3.5 0 0 0 5 0l4-4a3.536 3.536 0 0 0-5-5l-.5.5"></path>
    <path d="M14 10.004a3.502 3.502 0 0 0-5 0l-4 4a3.536 3.536 0 0 0 5 5l.5-.5"></path>
  </svg>`}
    />
  );
};
IconLink.propTypes = {
  size: PropTypes.number,
  color: PropTypes.string,
};
