import React from 'react';
import { SvgXml } from 'react-native-svg';
import PropTypes from 'prop-types';

export const IconScan = ({ size = 87, color = '#1D1C1C' }) => {
  return (
    <SvgXml
      xml={`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 87 87" fill="none">
    <circle cx="43.5" cy="43.5" r="43.5" fill="#EE0940"/>
    <circle cx="43.5" cy="43.5" r="41" stroke="white" stroke-opacity="0.8" stroke-width="5"/>
    <path d="M29 34.5151V32.6768C29 31.7016 29.3874 30.7664 30.0769 30.0769C30.7664 29.3874 31.7016 29 32.6768 29H36.3535" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M29 52.9048V54.7432C29 55.7183 29.3874 56.6535 30.0769 57.343C30.7664 58.0326 31.7016 58.4199 32.6768 58.4199H36.3535" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M51.0662 29H54.7429C55.7181 29 56.6533 29.3874 57.3428 30.0769C58.0323 30.7664 58.4197 31.7016 58.4197 32.6768V34.5151" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M51.0662 58.4199H54.7429C55.7181 58.4199 56.6533 58.0326 57.3428 57.343C58.0323 56.6535 58.4197 55.7183 58.4197 54.7432V52.9048" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M30.8384 43.7129H56.5757" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`}
    />
  );
};
IconScan.propTypes = {
  size: PropTypes.number,
  color: PropTypes.string,
};
