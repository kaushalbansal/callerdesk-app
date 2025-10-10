import React from 'react';
import { Image } from 'react-native';
import { rh, rw } from '../helpers/dimentions';
import PropTypes from 'prop-types';

export const IconPlusCircle = ({ size = 10, color = `red` }) => {
  return (
    <Image
      source={require(`../../assets/addbtn.png`)}
      resizeMode="contain"
      style={{ width: rw(18), height: rh(10) }}
    ></Image>
  );
};
IconPlusCircle.propTypes = {
  size: PropTypes.number,
  color: PropTypes.string,
};
