import React from 'react';
import { SvgXml } from 'react-native-svg';

export const SearchIcon = () => {
  return (
    <SvgXml
      xml={`<svg width="18" height="18" fill="none" stroke="#b3b3b3" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M11 3a8 8 0 1 0 0 16 8 8 0 1 0 0-16z"></path>
    <path d="m21 21-4.35-4.35"></path>
  </svg>`}
    />
  );
};
