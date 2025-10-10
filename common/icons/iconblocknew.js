import React from 'react';
import { SvgXml } from 'react-native-svg';
import PropTypes from 'prop-types';

export const IconBlockNew = ({ size = 8, color = '#000000' }) => {
  return (
    <SvgXml
      xml={`    
<svg width=${size} height=${size} viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M7.91667 0.583008C3.54667 0.583008 0 4.12967 0 8.49967C0 12.8697 3.54667 16.4163 7.91667 16.4163C12.2867 16.4163 15.8333 12.8697 15.8333 8.49967C15.8333 4.12967 12.2867 0.583008 7.91667 0.583008ZM1.58333 8.49967C1.58333 5.00051 4.4175 2.16634 7.91667 2.16634C9.38125 2.16634 10.7271 2.66509 11.7958 3.50426L2.92125 12.3788C2.05182 11.273 1.58047 9.90638 1.58333 8.49967ZM7.91667 14.833C6.45208 14.833 5.10625 14.3343 4.0375 13.4951L12.9121 4.62051C13.7815 5.72636 14.2529 7.09297 14.25 8.49967C14.25 11.9988 11.4158 14.833 7.91667 14.833Z" fill=${color}/>
</svg> 
    `}
    />
  );
};
IconBlockNew.propTypes = {
  size: PropTypes.number,
  color: PropTypes.string,
};
