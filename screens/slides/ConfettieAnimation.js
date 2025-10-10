import React from 'react';
import { StyleSheet, View } from 'react-native';
import LottieView from 'lottie-react-native';
import { rw, rh } from '../../common/helpers/dimentions';
import PropTypes from 'prop-types';

const ConfettiAnimation = ({ showConfetti }) => {
  if (!showConfetti) return null; // Return nothing if showConfetti is false

  return (
    <View style={styles.confettiView}>
      <LottieView
        source={require('../private/assets/confetti.json')}
        autoPlay
        loop
        style={styles.confettiLottie}
        resizeMode="cover"
      />
    </View>
  );
};

export default ConfettiAnimation;
ConfettiAnimation.propTypes = {
  showConfetti: PropTypes.bool,
};
const styles = StyleSheet.create({
  confettiLottie: {
    height: rh(100),
    position: 'absolute',
    width: rw(100),
    zIndex: 999,
  },
  confettiView: {
    position: 'absolute',
    zIndex: 999,
  },
});
