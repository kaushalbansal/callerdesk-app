import React from 'react';
import { SvgXml } from 'react-native-svg';
import PropTypes from 'prop-types';

export const RateIcon = ({ size = 21, color = '#EE0940' }) => {
  return (
    <SvgXml
      xml={`
<svg width=${size} height=${size} viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M8.5 0.357422L10.7483 5.76293L16.584 6.23078L12.1378 10.0394L13.4962 15.7341L8.5 12.6824L3.50383 15.7341L4.86221 10.0394L0.416019 6.23078L6.25172 5.76293L8.5 0.357422Z" fill=${color}/>
</svg>
`}
    />
  );
};
RateIcon.propTypes = {
  size: PropTypes.number,
  color: PropTypes.string,
};
