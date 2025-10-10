import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

const CustomBar = ({ label, value }) => {
  return (
    <View style={styles.barContainer}>
      <Text style={styles.barLabel}>{label}</Text>
      <View style={[styles.bar, { height: value }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  barContainer: {
    alignItems: 'center',
    marginHorizontal: 8,
  },
});

export default CustomBar;
CustomBar.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
};
