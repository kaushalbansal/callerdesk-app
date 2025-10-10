import React from 'react';
import { SvgXml } from 'react-native-svg';
import PropTypes from 'prop-types';

export const EditContactIcon = ({ size = 22, color = '#333' }) => {
  return (
    <SvgXml
      xml={`<?xml version="1.0" ?>
<svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<rect width="25" height="25" fill="url(#pattern0_40_6)"/>
<defs>
<pattern id="pattern0_40_6" patternContentUnits="objectBoundingBox" width="1" height="1">
<use xlink:href="#image0_40_6" transform="scale(0.02)"/>
</pattern>
<image id="image0_40_6" width="50" height="50" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAADHUlEQVR4nO2ZW4hNURjHf0dyi1wSgzwoUmNcI2o8SKMUkkkplGmoyZtyLSFNTTHEo5ryoMalXHN7MLwMI8IoNCR3NXgYmhHjMnO09O36Wp19ztmXc/Y+0/nVqtPe6/uv7ztr7W99a28oUqRIkSJ9kMHAZGnmd0ExGzgKvAGSVjPXjgCziDHjgZNAb4oA7NYDNALjiBnzgI8uTv+WluqesZlLTJgOdFoO3gU2yCw5TACqgHtWX2NbRsSMsJ6Fn+JsIo2NubcR6FZ2r4DhRMgBawkt9mBbYS25OiJiDPBDObLNh8YuZW+0RhMBm5QT74CBPjQGAR+UTjURcF45UB9A57DSOUsEtCoHVgbQWaV0HhEB7cqB+QF0FiiddiJAr20v2cpmifWs5Z3byoGaADqblU4zEVCvHLgSQOea0jlIRPWVLgJn+qyUe5TOHCLilnLivsczh+n7QNk3ESFlVs10GRiahd0w4KpVo5USMdVWNdsGLEvTfwXwXPXvlUo5Fphq9pcV0FugAdgrrUHSq+7TLdVyrKgA/mRxOnTaX2ApMWIUsA/47CEIp32VlGsq6UwMAbYDd4AXwAXZTENhTZoAvgHPgJvAdTk1drj07ZBNNeEyTgnw2MW2NkgApvw+lUL0KbAHmJHGdgqwVYK07S9KRrODaMsws5V+l1KzJfQaWAv086CTkKr5paX1RC21VEEcEruH6lqLn5losYSP+zxUac1jlmYrMDVFEFtcKgtzuvREo5X/zRIJC+Nkr5XV3IIwrFP3vngZSBsmZW8Im50uz4AdxEKgS90/ke0AI4FPyvBMhlc+fimRbOclCJPxJmU7QK2V+80DHzapHuxMQXTJtawYYM3GjvBjYKyk7qRqZplpyq03mt+BRV4GWa2MO3PweSDnM+GgU+NpCnAmHPS/ZTa9gpsJQ38rt5eG+PI7b0E4/5oeLKw35pX5Wk4OE4Eb0szbjrCoU06ar1w5m4lc0+SypMrDnolckpBN1XG2Ss74uwtpJpCqNt3ZIhn3mXBY3xeCQL7B286/B87JF6xp/3sVAJckA+4HlkuKD8w/Ur+5dLj3ItcAAAAASUVORK5CYII="/>
</defs>
</svg> 
      `}
    />
  );
};
EditContactIcon.propTypes = {
  size: PropTypes.number,
  color: PropTypes.string,
};
