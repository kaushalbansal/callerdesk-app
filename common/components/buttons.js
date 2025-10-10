import { View, Text } from 'react-native';
import React from 'react';
import { styles } from '../../themes/styles';
import { DialIcon } from '../icons/dialicon';
import PropTypes from 'prop-types';

const Skipscrnbtn = ({ color }) => {
  return (
    <View style={styles.skipscrnbtn}>
      <View
        style={[
          styles.ctaskip,
          // eslint-disable-next-line react-native/no-inline-styles
          { flexDirection: 'row', backgroundColor: color },
        ]}
      >
        <View style={{}}>
          <DialIcon />
        </View>
        <View style={styles.getBizView}>
          <Text style={styles.getBizText}>GET BUSINESS NUMBER</Text>
        </View>
      </View>
    </View>
  );
};

export default Skipscrnbtn;
Skipscrnbtn.propTypes = {
  color: PropTypes.string,
};
