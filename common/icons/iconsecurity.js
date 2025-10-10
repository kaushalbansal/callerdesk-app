import React from 'react';
import { SvgXml } from 'react-native-svg';
import PropTypes from 'prop-types';

export const IconSecurity = ({ size = 36, color = '#56585B' }) => {
  return (
    <SvgXml
      xml={`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 36 36" fill="none">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M17.9776 33.708C21.9103 32.0226 29.2137 27.5283 29.2137 18.5395V6.17982C29.2137 6.17982 21.3484 6.17982 17.9776 2.24731C14.6068 6.17982 6.7417 6.17982 6.7417 6.17982V18.5395C6.7417 27.5283 14.0451 32.0226 17.9776 33.708Z" fill="url(#paint0_linear_942_3324)"/>
      <path fill-rule="evenodd" clip-rule="evenodd" d="M17.9774 10.6741C15.8056 10.6741 14.0449 12.4347 14.0449 14.6066C14.0449 15.8008 14.0449 16.8538 14.0449 16.8538C14.0449 17.1641 14.2964 17.4157 14.6066 17.4157H21.3482C21.6586 17.4157 21.9101 17.1641 21.9101 16.8538C21.9101 16.8538 21.9101 15.8008 21.9101 14.6066C21.9101 12.4347 20.1494 10.6741 17.9774 10.6741ZM20.7865 16.292H15.1685V14.6066C15.1685 13.0552 16.4261 11.7976 17.9774 11.7976C19.5288 11.7976 20.7865 13.0552 20.7865 14.6066V16.292Z" fill="url(#paint1_linear_942_3324)"/>
      <path fill-rule="evenodd" clip-rule="evenodd" d="M23.0337 16.8538C23.0337 16.7048 22.9745 16.5619 22.8692 16.4566C22.7639 16.3512 22.621 16.292 22.472 16.292C20.7018 16.292 15.2533 16.292 13.4832 16.292C13.3342 16.292 13.1913 16.3512 13.086 16.4566C12.9806 16.5619 12.9214 16.7048 12.9214 16.8538C12.9214 17.8065 12.9214 19.7878 12.9214 21.3481C12.9214 22.2422 13.2765 23.0996 13.9088 23.7317C14.5408 24.3638 15.3982 24.7189 16.2922 24.7189C17.3769 24.7189 18.5784 24.7189 19.6629 24.7189C20.557 24.7189 21.4144 24.3638 22.0465 23.7317C22.6786 23.0996 23.0337 22.2422 23.0337 21.3481C23.0337 19.7878 23.0337 17.8065 23.0337 16.8538Z" fill="url(#paint2_linear_942_3324)"/>
      <path fill-rule="evenodd" clip-rule="evenodd" d="M17.416 20.2247V21.3482C17.416 21.6583 17.6677 21.9101 17.9777 21.9101C18.2878 21.9101 18.5396 21.6583 18.5396 21.3482V20.2247C18.5396 19.9146 18.2878 19.6628 17.9777 19.6628C17.6677 19.6628 17.416 19.9146 17.416 20.2247Z" fill="url(#paint3_linear_942_3324)"/>
      <defs>
        <linearGradient id="paint0_linear_942_3324" x1="10.8049" y1="4.63176" x2="25.1298" y2="29.0499" gradientUnits="userSpaceOnUse">
          <stop stop-color="#3DD2C0"/>
          <stop offset="1" stop-color="#0CAFA0"/>
        </linearGradient>
        <linearGradient id="paint1_linear_942_3324" x1="17.979" y1="10.6744" x2="18.2317" y2="16.8721" gradientUnits="userSpaceOnUse">
          <stop stop-color="#477294"/>
          <stop offset="1" stop-color="#1C3D57"/>
        </linearGradient>
        <linearGradient id="paint2_linear_942_3324" x1="12.9214" y1="20.7864" x2="23.0337" y2="20.7864" gradientUnits="userSpaceOnUse">
          <stop stop-color="#FFD367"/>
          <stop offset="1" stop-color="#F69D18"/>
        </linearGradient>
        <linearGradient id="paint3_linear_942_3324" x1="17.2456" y1="19.4648" x2="17.9778" y2="21.6073" gradientUnits="userSpaceOnUse">
          <stop stop-color="#477294"/>
          <stop offset="1" stop-color="#1C3D57"/>
        </linearGradient>
      </defs>
    </svg>`}
    />
  );
};
IconSecurity.propTypes = {
  size: PropTypes.number,
  color: PropTypes.string,
};
