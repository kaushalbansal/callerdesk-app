import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '@ui-kitten/components';
import CustomIcon from './CustomIcon';
import { colors } from '../../themes/vars';
import { rf, rh, rw } from '../helpers/dimentions';
import PropTypes from 'prop-types';

const RowNew = ({ title, subHead, icon, title1 }) => {
  return (
    <>
      <View style={styles.container}>
        <View style={styles.icon}>
          <CustomIcon svgData={icon} />
        </View>
        <View style={styles.title}>
          <Text style={styles.titleText}>{title} </Text>
          {title1 && <Text style={styles.titleText}> {title1}</Text>}
        </View>
        <View style={styles.subHead}>
          <Text>{subHead}</Text>
        </View>
      </View>
    </>
  );
};

export default RowNew;

const styles = StyleSheet.create({
  container: {
    alignItems: `center`,
    alignSelf: `center`,
    borderBottomColor: colors.borderColor1,
    borderBottomWidth: 1,
    flexDirection: `row`,
    paddingVertical: rh(1.1),
    width: rw(89),
    // backgroundColor:`red`
  },
  icon: { flex: 0.25 },
  subHead: { alignItems: `flex-end`, flex: 0.9 },
  title: {
    alignItems: `flex-start`,
    flex: 0.9,
    flexDirection: `row`,
  },
  titleText: { color: colors.black, fontSize: rf(1.9) },
});
RowNew.propTypes = {
  title: PropTypes.string,
  title1: PropTypes.string,
  icon: PropTypes.node,
  subHead: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
