import React from 'react';
import PropTypes from 'prop-types';
import { SvgXml } from 'react-native-svg';

export const AboutIcon = ({ size = 21, color = '#EE0940' }) => {
  //  width="21" height="24"
  return (
    <SvgXml
      xml={`

<svg width=${size} height=${size} viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M1 14.3633V13.6133C1 11.128 3.01472 9.11328 5.5 9.11328H8.5C10.9853 9.11328 13 11.128 13 13.6133V14.3633" stroke="#E5386D" stroke-width="1.5" stroke-linecap="round"/>
<path d="M7 6.86328C5.34314 6.86328 4 5.52014 4 3.86328C4 2.20643 5.34314 0.863281 7 0.863281C8.65683 0.863281 10 2.20643 10 3.86328C10 5.52014 8.65683 6.86328 7 6.86328Z" stroke=${color} stroke-width="1.5" stroke-linecap="round"/>
</svg>

`}
    />
  );
};
AboutIcon.propTypes = {
  size: PropTypes.number,
  color: PropTypes.string,
};
