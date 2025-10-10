import React from 'react';
import { SvgXml } from 'react-native-svg';
import PropTypes from 'prop-types';

export const IconHistory = ({ size = 17, color = '#56585B' }) => {
  // width="16" height="17"
  return (
    <SvgXml
      xml={`
<svg width=${size} height=${size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M6.38557 14.9814C5.70384 14.8268 5.04911 14.571 4.44313 14.2225M9.51853 1.23242C11.0757 1.58807 12.4661 2.46187 13.4619 3.71076C14.4577 4.95965 15 6.50963 15 8.10693C15 9.70424 14.4577 11.2542 13.4619 12.5031C12.4661 13.752 11.0757 14.6258 9.51853 14.9814M2.13962 12.096C1.71236 11.4752 1.38786 10.7897 1.17858 10.0658M1 6.93207C1.12532 6.18799 1.36656 5.48307 1.70492 4.8369L1.83728 4.59801M3.963 2.2945C4.69585 1.79001 5.51799 1.42958 6.38557 1.23242" stroke=${color} stroke-linecap="round" stroke-linejoin="round"/>
<path d="M7.95117 4.97412V8.10709L10.3009 10.4568" stroke=${color} stroke-linecap="round" stroke-linejoin="round"/>
</svg>    
    `}
    />
  );
};
IconHistory.propTypes = {
  size: PropTypes.number,
  color: PropTypes.string,
};
