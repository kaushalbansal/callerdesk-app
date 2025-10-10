import { View, FlatList, Animated } from 'react-native';
import React, { useRef, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Slides from '../../../screens/slides/Slides';
import OnboardingItem from './OnboardingItems';
import { styles } from '../../../themes/styles';
import PropTypes from 'prop-types';

const Onboarding = ({ navigation }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  let scrollInterval;
  useEffect(() => {
    // Automatically scroll to the next slide every 3 seconds
    scrollInterval = setInterval(() => {
      if (currentIndex < Slides.length - 1) {
        slideRef.current.scrollToIndex({ index: currentIndex + 1 });
      } else {
        scrollInterval && clearInterval(scrollInterval);
        AsyncStorage.setItem('Onboarding', 'true');
        navigation.navigate('LoginWithEmail');
      }
    }, 5000); // Change 3000 to the desired interval time in milliseconds (e.g., 3000ms = 3 seconds)

    // Clean up the interval when the component unmounts
    return () => clearInterval(scrollInterval);
  }, [currentIndex]);

  const ViewableItemsChanged = useRef(({ viewableItems }) => {
    setCurrentIndex(viewableItems[0].index);
  }).current;

  const slideRef = useRef(null);
  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;
  const isFirstSlide = currentIndex === 0;

  const nextSlide = () => {
    if (currentIndex < Slides.length - 1) {
      slideRef.current.scrollToIndex({ index: currentIndex + 1 });
    } else {
      scrollInterval && clearInterval(scrollInterval);
      AsyncStorage.setItem('Onboarding', 'true');
      navigation.navigate('LoginWithEmail');
    }
  };

  return (
    <View style={styles.onboarding}>
      <FlatList
        data={Slides}
        renderItem={({ item }) => (
          <OnboardingItem
            item={item}
            currentIndex={currentIndex}
            scrollX={scrollX}
            scrollInterval={scrollInterval}
            clearInterval={clearInterval}
            navigation={navigation}
            isFirstSlide={isFirstSlide}
            nextSlide={nextSlide}
          />
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        bounces={false}
        keyExtractor={(item) => item.id}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          {
            useNativeDriver: false,
          },
        )}
        onViewableItemsChanged={ViewableItemsChanged}
        viewabilityConfig={viewConfig}
        scrollEventThrottle={32}
        ref={slideRef}
      />
    </View>
  );
};

export default Onboarding;
Onboarding.propTypes = {
  navigation: PropTypes.object,
};
