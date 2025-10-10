import React from 'react';
import { SvgXml } from 'react-native-svg';
import PropTypes from 'prop-types';

export const IconBlockUser = ({ size = 18, color = '#EE0940' }) => {
  return (
    <SvgXml
      xml={`
<svg width=${size} height=${size} viewBox="0 0 13 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M5.8125 6.5C7.33128 6.5 8.5625 5.26878 8.5625 3.75C8.5625 2.23122 7.33128 1 5.8125 1C4.29372 1 3.0625 2.23122 3.0625 3.75C3.0625 5.26878 4.29372 6.5 5.8125 6.5Z" stroke=${color} stroke-width="1.2"/>
<path d="M8.21875 8.93031C7.51063 8.69656 6.68906 8.5625 5.8125 8.5625C3.15463 8.5625 1 9.79312 1 11.3125C1 11.5497 1 11.78 1.01856 12M6.5 14.0536C6.28275 14.0597 6.05313 14.0625 5.8125 14.0625C4.62863 14.0625 3.73625 13.9882 3.0625 13.8528M11.2781 11.3469L8.59688 14.0281" stroke="#EE0940" stroke-width="1.2" stroke-linecap="round"/>
<path d="M9.9375 14.75C11.0766 14.75 12 13.8266 12 12.6875C12 11.5484 11.0766 10.625 9.9375 10.625C8.79841 10.625 7.875 11.5484 7.875 12.6875C7.875 13.8266 8.79841 14.75 9.9375 14.75Z" stroke=${color} stroke-width="1.2"/>
</svg>
    `}
    />
  );
};
IconBlockUser.propTypes = {
  size: PropTypes.number,
  color: PropTypes.string,
};
