import React from 'react';
import { TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { UserAvatar } from '../icons/useravatar';
import PropTypes from 'prop-types';

const ProfileImg = ({ size = 32 }) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
      <UserAvatar size={size} />
    </TouchableOpacity>
  );
};
export default ProfileImg;
ProfileImg.propTypes = {
  size: PropTypes.number,
};
