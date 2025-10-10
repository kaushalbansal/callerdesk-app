import React from 'react';
import { SvgXml } from 'react-native-svg';
import PropTypes from 'prop-types';

export const IconClock = ({ size = 15, color = '#56585B' }) => {
  return (
    <SvgXml
      xml={`
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8.42771 23.6503L6.57092 27.0006" stroke="#EE0940" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M19.5718 23.6503L21.4286 27.0006" stroke="#EE0940" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M14.0013 25.1443C20.1554 25.1443 25.1444 20.1554 25.1444 14.0013C25.1444 7.84712 20.1554 2.85822 14.0013 2.85822C7.84719 2.85822 2.85828 7.84712 2.85828 14.0013C2.85828 20.1554 7.84719 25.1443 14.0013 25.1443Z" stroke="#EE0940" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M3.22996 11.0297C2.37449 10.3885 1.72157 9.51474 1.34909 8.51264C0.976612 7.51053 0.900316 6.42242 1.12931 5.37814C1.35829 4.33386 1.8829 3.37751 2.64052 2.62321C3.39814 1.86891 4.35679 1.34851 5.40206 1.12411C6.44734 0.899716 7.53511 0.980792 8.53557 1.35767C9.53603 1.73455 10.4069 2.39131 11.0444 3.24959" stroke="#EE0940" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M14 2.85716L14 1" stroke="#EE0940" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M14 8.42723V13.9987" stroke="#EE0940" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M14 14L17.9396 17.9396" stroke="#EE0940" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M24.7701 11.0297C25.6256 10.3885 26.2785 9.51474 26.651 8.51264C27.0234 7.51053 27.0997 6.42242 26.8707 5.37814C26.6418 4.33386 26.1171 3.37751 25.3595 2.62321C24.6019 1.86891 23.6433 1.34851 22.598 1.12411C21.5527 0.899716 20.4649 0.980793 19.4645 1.35767C18.464 1.73455 17.5931 2.39131 16.9557 3.24959" stroke="#EE0940" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      `}
    />
  );
};
IconClock.propTypes = {
  size: PropTypes.number,
  color: PropTypes.string,
};
