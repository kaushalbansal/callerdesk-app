import React from 'react';
import { SvgXml } from 'react-native-svg';
import PropTypes from 'prop-types';

export const IconFilter = ({
  color = `#1B227A`,
  colorLine = `white`,
  size = 58,
}) => {
  return (
    <SvgXml
      xml={`<svg width=${size} height=${size} viewBox="0 0 58 58" fill="none" xmlns="http://www.w3.org/2000/svg">
<g id="Group 506">
<g id="Ellipse 90" filter="url(#filter0_d_633_2876)">
<circle cx="29" cy="25" r="25" fill=${color}/>
</g>
<path id="Vector" d="M31.2142 33.879C31.0317 33.8781 30.8527 33.828 30.6962 33.734L27.3622 31.734C26.9872 31.5077 26.6767 31.1886 26.4608 30.8075C26.2448 30.4264 26.1306 29.9961 26.1292 29.558V25.033C26.1302 24.7136 26.0308 24.402 25.8452 24.142L21.1902 17.6C21.0815 17.449 21.0167 17.2709 21.0028 17.0853C20.9889 16.8998 21.0266 16.714 21.1116 16.5485C21.1967 16.383 21.3258 16.2442 21.4847 16.1474C21.6436 16.0506 21.8262 15.9996 22.0122 16H36.3422C36.5285 15.9992 36.7113 16.05 36.8704 16.1467C37.0296 16.2434 37.1588 16.3823 37.2439 16.5479C37.329 16.7136 37.3666 16.8995 37.3526 17.0852C37.3385 17.2709 37.2733 17.4491 37.1642 17.6L32.5092 24.142C32.3234 24.4019 32.2237 24.7135 32.2242 25.033V32.867C32.224 33.135 32.1176 33.3919 31.9283 33.5816C31.739 33.7713 31.4822 33.8782 31.2142 33.879ZM22.0122 17.005L26.6592 23.562C26.9663 23.9909 27.1307 24.5055 27.1292 25.033V29.557C27.1299 29.8224 27.199 30.0831 27.3299 30.314C27.4607 30.5449 27.6489 30.7381 27.8762 30.875L31.2102 32.875L31.2242 25.032C31.2231 24.5044 31.3879 23.9898 31.6952 23.561L36.3492 17.019L22.0122 17.005Z" fill=${colorLine}/>
</g>
<defs>
<filter id="filter0_d_633_2876" x="0" y="0" width=${size} height=${size} filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="4"/>
<feGaussianBlur stdDeviation="2"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_633_2876"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_633_2876" result="shape"/>
</filter>
</defs>
</svg>
    `}
    />
  );
};
IconFilter.propTypes = {
  size: PropTypes.number,
  color: PropTypes.string,
  colorLine: PropTypes.string,
};
