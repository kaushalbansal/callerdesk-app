import { Text, View, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { styles } from '../../../themes/styles';
import { useNavigation } from '@react-navigation/native';
import { rh, rw } from '../../helpers/dimentions';
import Skip from './Skip';
import PropTypes from 'prop-types';

const OnboardingItem = ({
  item,
  currentIndex,
  scrollX,
  scrollInterval,
  clearInterval,
  isFirstSlide,
  nextSlide,
}) => {
  const navigation = useNavigation();

  return (
    <View style={{ backgroundColor: item.color }}>
      <View
        style={{ marginVertical: rh(2), marginLeft: rw(7), marginTop: rh(6) }}
      >
        {item.title && <Text style={styles.onboardingTitle}>{item.title}</Text>}
        {item.title1 && (
          <Text style={styles.onboardingTitle1}>{item.title1}</Text>
        )}
      </View>
      <View style={{ marginLeft: rw(7) }}>
        {item.subTitle && <Text style={styles.subTitle}>{item.subTitle}</Text>}
        {item.subTitle1 && (
          <Text style={styles.subTitle1}>{item.subTitle1}</Text>
        )}
        {item.subTitle2 && (
          <Text style={styles.subTitle2}>{item.subTitle2}</Text>
        )}
      </View>
      <View
        // eslint-disable-next-line react-native/no-inline-styles
        style={{
          backgroundColor: item.color,
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Image
          source={item.image}
          style={styles.skipimgbg}
          resizeMode="contain"
        />
      </View>
      <View
        style={[
          { width: rw(100) },
          styles.skipscrnlrprt,
          { backgroundColor: item.color },
        ]}
      >
        <View style={{ backgroundColor: item.color }}>{item.iconbiz}</View>
        <View style={{ flexDirection: `row` }}>
          <Text style={styles.alreadyAccount}>Already have an account?</Text>
          <TouchableOpacity
            style={{ marginLeft: rw(1) }}
            onPress={() => navigation.navigate('LoginWithEmail')}
          >
            <Text style={styles.loginStyle}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Skip
        currentIndex={currentIndex}
        scrollX={scrollX}
        scrollInterval={scrollInterval}
        clearInterval={clearInterval}
        navigation={navigation}
        isFirstSlide={isFirstSlide}
        nextSlide={nextSlide}
        color={item.colorBtn}
      />
    </View>
  );
};

export default OnboardingItem;

OnboardingItem.propTypes = {
  item: PropTypes.object,
  currentIndex: PropTypes.number,
  scrollX: PropTypes.object,
  scrollInterval: PropTypes.number,
  clearInterval: PropTypes.func,
  isFirstSlide: PropTypes.bool,
  nextSlide: PropTypes.func,
};
