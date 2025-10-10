import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { rf, rh, rw } from '../helpers/dimentions';
import { colors } from '../../themes/vars';

function PeriodSwitch({ selected, onChange, options }) {
  const keys = options.map(opt => (typeof opt === 'string' ? opt : opt.key));
  const labels = options.map(opt => (typeof opt === 'string' ? opt : opt.label));

  return (
    <View style={styles.container}>
      {keys.map((key, i) => (
        <TouchableOpacity
          key={key}
          style={[
            styles.segment,
            { width: rw(70) / keys.length },
            selected === key && styles.segmentActive
          ]}
          activeOpacity={0.7}
          onPress={() => onChange(key)}
        >
          <Text style={[styles.label, selected === key && styles.labelActive]}>
            {labels[i]}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

PeriodSwitch.propTypes = {
  selected: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({ key: PropTypes.string, label: PropTypes.string })
    ])
  ).isRequired,
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 8,
    backgroundColor: '#ECECEC',
    overflow: 'hidden',
    alignSelf: 'center',
    marginVertical: rh(1),
  },
  segment: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: rh(1),
    backgroundColor: '#ECECEC',
  },
  segmentActive: {
    backgroundColor: colors.primary,
  },
  label: {
    fontSize: rf(1.5),
    color: '#333',
  },
  labelActive: {
    color: '#FFF',
    fontWeight: '600',
  },
});

export default PeriodSwitch;
