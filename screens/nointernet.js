// NoInternetScreen.js
import React from 'react';
import { Image, View, Text, StyleSheet } from 'react-native';
import { rf, rh, rw } from '../common/helpers/dimentions';
import { NoInternetLabel } from '../common/Constants';
import { colors } from '../themes/vars';

const NoInternetScreen = () => {
  return (
    <View style={styles.container}>
      <View style={{ marginTop: rh(-10) }}>
        <Image
          source={require('../assets/nointernet.png')}
          style={styles.image}
          resizeMode="contain"
        />
      </View>
      <Text style={styles.text}>No Internet Connection</Text>
      <Text style={styles.textBody}>{NoInternetLabel}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: colors.white,
    flex: 1,
    justifyContent: 'center',
  },
  image: {
    height: rh(30),
    width: rw(110),
  },
  text: {
    fontSize: rf(2.5),
    fontWeight: `500`,
  },
  textBody: {
    fontSize: rf(1.6),
    marginTop: rh(1),
    width: rw(90),
  },
});

export default NoInternetScreen;
