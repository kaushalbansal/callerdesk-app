import React from 'react';
import { SvgXml } from 'react-native-svg';
import PropTypes from 'prop-types';

const CustomIcon = ({ svgData }) => {
  return <SvgXml xml={svgData} />;
};

export default CustomIcon;
CustomIcon.propTypes = {
  svgData: PropTypes.string,
};
