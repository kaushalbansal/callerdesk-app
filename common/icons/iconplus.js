import React from 'react';
import { SvgXml } from 'react-native-svg';
import PropTypes from 'prop-types';

export const IconPlus = ({ size = 10, color = `red` }) => {
  return (
    <SvgXml
      xml={`<?xml version="1.0" ?><svg width=${size} height=${size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M12 6C11.4477 6 11 6.44772 11 7V11H7C6.44772 11 6 11.4477 6 12C6 12.5523 6.44772 13 7 13H11V17C11 17.5523 11.4477 18 12 18C12.5523 18 13 17.5523 13 17V13H17C17.5523 13 18 12.5523 18 12C18 11.4477 17.5523 11 17 11H13V7C13 6.44772 12.5523 6 12 6Z" fill=${color}/>
        </svg>
        
      `}
    />
  );
};
IconPlus.propTypes = {
  size: PropTypes.number,
  color: PropTypes.string,
};
