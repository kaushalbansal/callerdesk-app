import React from 'react';
import { SvgXml } from 'react-native-svg';
import PropTypes from 'prop-types';

export const IconEqualizer = ({ size = 42, color = '#EE0940' }) => {
  return (
    <SvgXml
      xml={`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 42 42" fill="none">
    <path d="M3.9585 19.173L3.97775 24.0931M7.48825 13.9405L7.38237 28.8951M11.4266 7.94061L11.4021 34.7795M15.3886 14.1636L15.3589 28.9187M19.1529 17.7249L19.2036 25.4292M22.7141 14.07L22.6161 28.8269M26.8293 17.7572L26.7846 24.6881M30.7291 14.2852L30.7116 28.5757M34.6395 17.9095L34.6159 25.1002M38.0406 19.4679L38.0844 23.3144" 
    stroke="${color}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`}
    />
  );
};
IconEqualizer.propTypes = {
  size: PropTypes.number,
  color: PropTypes.string,
};
