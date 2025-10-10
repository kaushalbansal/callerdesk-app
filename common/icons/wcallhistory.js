import { SvgXml } from 'react-native-svg';
import React from 'react';
import PropTypes from 'prop-types';

export const CallHistoryicon = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M9.46304 22.6056C8.39175 22.3626 7.36288 21.9606 6.41063 21.413M14.3863 1C16.8333 1.55888 19.0181 2.93199 20.583 4.89453C22.1478 6.85707 23 9.29276 23 11.8028C23 14.3129 22.1478 16.7485 20.583 18.7111C19.0181 20.6736 16.8333 22.0467 14.3863 22.6056M2.79083 18.0713C2.11943 17.0959 1.6095 16.0186 1.28062 14.8811M1 9.95659C1.19693 8.78732 1.57602 7.6796 2.10773 6.66418L2.31573 6.28878M5.65615 2.66898C6.80776 1.87621 8.0997 1.30981 9.46304 1" stroke="#CA82FD" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M11.9248 6.87939V11.8026L15.6172 15.4951" stroke="#CA82FD" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

`;

export const IconHistory = ({ size = 18, color = '#333333' }) => {
  return (
    <SvgXml
      xml={`
    <svg width=${size} height=${size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M6.38557 14.5923C5.70384 14.4377 5.04911 14.1818 4.44313 13.8333M9.51853 0.843262C11.0757 1.19891 12.4661 2.07271 13.4619 3.3216C14.4577 4.57049 15 6.12047 15 7.71777C15 9.31507 14.4577 10.8651 13.4619 12.1139C12.4661 13.3628 11.0757 14.2366 9.51853 14.5923M2.13962 11.7068C1.71236 11.0861 1.38786 10.4006 1.17858 9.67666M1 6.54291C1.12532 5.79883 1.36656 5.09391 1.70492 4.44774L1.83728 4.20885M3.963 1.90534C4.69585 1.40085 5.51799 1.04042 6.38557 0.843262" stroke=${color} stroke-linecap="round" stroke-linejoin="round"/>
<path d="M7.95117 4.58496V7.71793L10.3009 10.0677" stroke=${color} stroke-linecap="round" stroke-linejoin="round"/>
</svg>

    `}
    />
  );
};
IconHistory.propTypes = {
  size: PropTypes.number,
  color: PropTypes.string,
};
