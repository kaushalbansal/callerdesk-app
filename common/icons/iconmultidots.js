import React from 'react';
import { SvgXml } from 'react-native-svg';
import PropTypes from 'prop-types';

export const IconMultiDots = ({ size = 10, color = `red` }) => {
  return (
    <SvgXml
      xml={`<?xml version="1.0" ?>

        <svg width="27" height="24" viewBox="0 0 27 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10.7295 3H12.8989V5H10.7295V3ZM15.0683 3H17.2376V5H15.0683V3ZM10.7295 7H12.8989V9H10.7295V7ZM15.0683 7H17.2376V9H15.0683V7ZM10.7295 11H12.8989V13H10.7295V11ZM15.0683 11H17.2376V13H15.0683V11ZM10.7295 15H12.8989V17H10.7295V15ZM15.0683 15H17.2376V17H15.0683V15ZM10.7295 19H12.8989V21H10.7295V19ZM15.0683 19H17.2376V21H15.0683V19Z" fill="#656565"/>
        </svg>
        
      `}
    />
  );
};
IconMultiDots.propTypes = {
  size: PropTypes.number,
  color: PropTypes.string,
};
