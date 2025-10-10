import { View, StyleSheet, Animated, useWindowDimensions } from 'react-native';
import React from 'react';
import { colors } from '../../../themes/vars';
import PropTypes from 'prop-types';
import { styles } from '../../../themes/styles';

const Paginator = ({ data, scrollX }) => {
  const { width } = useWindowDimensions();
  return (
    <View style={styles.paginators}>
      {data.map((_, i) => {
        const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
        const dotWidth = scrollX.interpolate({
          inputRange,
          outputRange: [8, 24, 8],
          extrapolate: 'clamp',
        });
        const dotbg = scrollX.interpolate({
          inputRange,
          outputRange:
            i === 0
              ? ['grey', colors.black, `grey`]
              : i === 1
                ? ['grey', colors.black, `grey`]
                : ['grey', colors.black, `grey`],
          extrapolate: 'clamp',
        });
        return (
          <Animated.View
            style={[
              paginatorstyles.dot,
              { width: dotWidth, backgroundColor: dotbg },
            ]}
            key={i.toString()}
          />
        );
      })}
    </View>
  );
};
const paginatorstyles = StyleSheet.create({
  dot: {
    borderRadius: 20,
    height: 8,
    marginHorizontal: 4,
    marginVertical: 8,
  },
});
export default Paginator;
Paginator.propTypes = {
  data: PropTypes.array,
  scrollX: PropTypes.object,
};
