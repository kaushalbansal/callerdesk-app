import React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { rh, rw } from '../helpers/dimentions';
import PropTypes from 'prop-types';

const GlobalLoader = ({ load = false, loading = false }) => {
  return (
    <>
      {load ||
        (loading && (
          <>
            <View style={[styles.txt, styles.txt1]}>
              {/* <ActivityIndicator style={{}} color={colors.primary} /> */}
              <Image
                source={require(`../../assets/loaderimage.gif`)}
                style={{ width: rw(50), height: rh(10) }}
                resizeMode="contain"
              ></Image>
            </View>
          </>
        ))}
    </>
  );
};

export const LocalLoader = ({ loading }) => {
  const stylesLoader = StyleSheet.create({
    txt: {
      bottom: rh(40),
      elevation: 1,
      left: rw(25),
      position: 'absolute',
      shadowColor: `transparent`,
    },
    txt1: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: 8,
      justifyContent: 'center',
    },
  });
  return (
    <>
      {loading && (
        <>
          <View style={[stylesLoader.txt, stylesLoader.txt1]}>
            <Image
              source={require(`../../assets/loaderimage.gif`)}
              style={{ width: rw(50), height: rh(10) }}
              resizeMode="contain"
            ></Image>
          </View>
        </>
      )}
    </>
  );
};

export default GlobalLoader;
GlobalLoader.propTypes = {
  load: PropTypes.bool,
  loading: PropTypes.bool,
  loadingText: PropTypes.bool,
};
LocalLoader.propTypes = {
  load: PropTypes.bool,
  loading: PropTypes.bool,
  loadingText: PropTypes.bool,
  style: PropTypes.object,
};
const styles = StyleSheet.create({
  txt: {
    bottom: rh(40),
    elevation: 1,
    left: rw(25),
    position: 'absolute',
    shadowColor: `transparent`,
  },
  txt1: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    zIndex: 999,
  },
});
