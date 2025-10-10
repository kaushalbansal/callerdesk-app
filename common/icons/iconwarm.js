import React from 'react';
import { SvgXml } from 'react-native-svg';
import PropTypes from 'prop-types';

export const IconWarm = ({ size = 16, color = '#56585B' }) => {
  return (
    <SvgXml
      xml={`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 23 22" fill="none">
    <path d="M7.02778 1.27778L3.06667 7.66667L7.02778 14.3111L2.81111 21.7222L0.511111 20.5722L3.96111 14.3111L0 7.66667L4.72778 0.127778L7.02778 1.27778ZM14.95 1.15L10.9889 7.66667L14.95 14.0556L10.7333 21.4667L8.43333 20.3167L11.8833 14.0556L7.92222 7.66667L12.65 0L14.95 1.15ZM23 1.15L19.0389 7.66667L23 14.0556L18.7833 21.4667L16.4833 20.3167L19.9333 14.0556L15.9722 7.66667L20.7 0L23 1.15Z" 
    fill="${color}"/>
  </svg>`}
    />
  );
};
IconWarm.propTypes = {
  size: PropTypes.number,
  color: PropTypes.string,
};
