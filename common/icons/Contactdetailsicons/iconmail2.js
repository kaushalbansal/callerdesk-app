import React from 'react';
import { SvgXml } from 'react-native-svg';
import PropTypes from 'prop-types';

export const IconMail2 = ({ size = 22, color = '#56585B', stroke = 2 }) => {
  return (
    <SvgXml
      xml={`
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="20" cy="20" r="19" fill="white" stroke="#1F90DB" stroke-width="2"/>
    <path d="M10.5391 12.2011C11.091 11.4726 11.9684 11 12.9533 11H29.06C30.045 11 30.9224 11.4726 31.4743 12.2011L21.0067 19.7635L10.5391 12.2011Z" fill="#1F90DB"/>
    <path d="M9.93335 14.2365V26C9.93335 27.6523 11.29 29 12.9533 29H29.06C30.7233 29 32.08 27.6523 32.08 26V14.2365L22.1909 21.381C21.4849 21.891 20.5285 21.891 19.8225 21.381L9.93335 14.2365Z" fill="#1F90DB"/>
    </svg>
    `}
    />
  );
};
IconMail2.propTypes = {
  size: PropTypes.number,
  stroke: PropTypes.number,
  color: PropTypes.string,
};
