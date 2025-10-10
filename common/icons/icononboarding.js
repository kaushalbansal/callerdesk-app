import React from 'react';
import { SvgXml } from 'react-native-svg';
import PropTypes from 'prop-types';

export const IconOnboarding = ({ size = 14, color = 'white' }) => {
  return (
    <SvgXml
      xml={`
<svg width="24" height="8" viewBox="0 0 24 8" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="24" height="8" rx="4" fill=${color}/>
</svg>
    `}
    />
  );
};
IconOnboarding.propTypes = {
  size: PropTypes.number,
  color: PropTypes.string,
};
