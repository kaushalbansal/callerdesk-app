import React from 'react';
import { SvgXml } from 'react-native-svg';
import PropTypes from 'prop-types';
export const IconInvalid = ({ size = 18, color = '#56585B' }) => {
  return (
    <SvgXml
      xml={`<svg width="${size}" height="${size}"  fill="none" stroke="${color}" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path d="M12 2a10 10 0 1 0 0 20 10 10 0 1 0 0-20z"></path>
  <path d="M5 19 19 5"></path>
</svg>`}
    />
  );
};
IconInvalid.propTypes = {
  size: PropTypes.number,
  color: PropTypes.string,
};
