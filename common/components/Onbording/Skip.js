import { Text, View, TouchableOpacity } from 'react-native';
import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../../../themes/vars';
import Nextbutton from './Nextbutton';
import Slides from '../../../screens/slides/Slides';
import Paginator from './Paginators';
import PropTypes from 'prop-types';
import { styles } from '../../../themes/styles';

const Skip = ({
  color,
  currentIndex,
  scrollX,
  scrollInterval,
  clearInterval,
  navigation,
  isFirstSlide,
  nextSlide,
}) => {
  return (
    <View style={styles.skipContainer}>
      <View style={styles.paginatorSkip}>
        <Paginator data={Slides} scrollX={scrollX} />
        <View style={styles.skipView}>
          <TouchableOpacity
            onPress={() => {
              scrollInterval && clearInterval(scrollInterval);
              AsyncStorage.setItem('Onboarding', 'true');
              navigation.navigate('LoginWithEmail');
            }}
          >
            <View style={styles.skipView1}>
              <Text style={{ color: colors.black }}>Skip</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.nextButtonStyle}>
        <Nextbutton
          color={color}
          isFirstSlide={isFirstSlide}
          onNext={nextSlide}
        />
      </View>
    </View>
  );
};

export default Skip;
Skip.propTypes = {
  isFirstSlide: PropTypes.bool,
  nextSlide: PropTypes.func,
  hideTitle: PropTypes.bool,
  color: PropTypes.string,
  from: PropTypes.string,
  currentIndex: PropTypes.number,
  scrollX: PropTypes.object,
  scrollInterval: PropTypes.number,
  clearInterval: PropTypes.func,
  navigation: PropTypes.object,
  onClose: PropTypes.func,
  children: PropTypes.node,
};
