// src/components/Stepper.js
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { StepsLabel } from '../Constants';
import PropTypes from 'prop-types';
import { rf, rh, rw } from '../helpers/dimentions';
import { colors } from '../../themes/vars';

export default function Stepper({ current, total, containerStyle={}, labelTextStyle={}, barOuterContainerStyle={}, barInnerContianerStyle={} }) {
  const progress = (current / total) * 100;
  const animatedWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animate barFill width from previous value to new value
    Animated.timing(animatedWidth, {
      toValue: progress,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [progress, animatedWidth]);

  const widthInterpolate = animatedWidth.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={[styles.container, containerStyle]}>
       <Text style={[styles.label, labelTextStyle]}>{`${current} of ${total} ${StepsLabel}`}</Text>
      <View style={[styles.barBackground, barOuterContainerStyle]}>
        <Animated.View style={[styles.barFill, { width: widthInterpolate }, barInnerContianerStyle]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: rw(6),
    marginTop: rh(1.2)
  },
  barBackground: {
    height: rw(3),
    backgroundColor: '#F0EDED',
    borderRadius: rw(1.5),
    overflow: 'hidden',
    marginTop: rh(0.5),
    borderWidth: 0.6,
    borderColor: '#DFDADA'
  },
  barFill: {
    height: '100%',
    backgroundColor: colors.WhatsapptemplateRedColor,
  },
  label: {
    fontSize: rf(2),
    // fontFamily: `Lexend`,
    color: colors.WhatsappTemplateTextgreyColor,
    fontWeight: '500',
    textAlign: 'center',
  },
});

Stepper.propTypes={
    current: PropTypes.number,
    total: PropTypes.number,
    containerStyle: PropTypes.object,
    labelTextStyle: PropTypes.object,
    barOuterContainerStyle: PropTypes.object,
    barInnerContianerStyle: PropTypes.object
}