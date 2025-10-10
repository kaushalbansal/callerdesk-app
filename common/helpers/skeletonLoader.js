import React, { useRef, useEffect } from 'react';
import { Animated, View, StyleSheet } from 'react-native';
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder';
import  LinearGradient  from 'react-native-linear-gradient';
import { rh, rw } from './dimentions';
import { colors } from '../../themes/vars';

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

const ShimmerView = () => {
  const avatarRef = useRef(null);
  const avatarRef1 = useRef(null);
  const firstLineRef = useRef(null);
  const secondLineRef = useRef(null);

  useEffect(() => {
    const startAnimation = () => {
      const animate = Animated.stagger(10, [
        avatarRef.current.getAnimated(),
        avatarRef1.current.getAnimated(),
        Animated.parallel([
          firstLineRef.current.getAnimated(),
          secondLineRef.current.getAnimated(),
        ]),
      ]);

      const animationLoop = Animated.loop(animate);
      animationLoop.start();

      return () => {
        animationLoop.stop();
      };
    };

    startAnimation();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <ShimmerPlaceholder ref={avatarRef} stopAutoRun style={styles.avatar} />
        <View style={styles.column}>
          <ShimmerPlaceholder
            ref={avatarRef1}
            stopAutoRun
            style={styles.lineShort}
          />
          <ShimmerPlaceholder
            ref={firstLineRef}
            stopAutoRun
            style={styles.lineLong}
          />
        </View>
      </View>
      <ShimmerPlaceholder
        ref={secondLineRef}
        stopAutoRun
        style={styles.lineFull}
      />
    </View>
  );
};

export const SkeletonLoaderComponent = () => <ShimmerView />;

const styles = StyleSheet.create({
  avatar: {
    borderRadius: 100,
    height: rh(4.4),
    marginHorizontal: rw(5),
    marginVertical: rh(2),
    width: rw(10),
  },
  column: {
    flexDirection: 'column',
  },
  container: {
    alignSelf: 'center',
    borderColor: colors.lightGreyNew,
    borderRadius: 10,
    borderWidth: 0.6,
    marginVertical: rh(0.5),
    paddingBottom: rh(2),
    width: rw(96),
  },
  lineFull: {
    marginLeft: rw(5),
    marginTop: rh(2),
    width: rw(88),
  },
  lineLong: {
    marginLeft: rw(1),
    marginTop: rh(2),
    width: rw(50),
  },
  lineShort: {
    marginLeft: rw(1),
    marginTop: rh(2),
    width: rw(30),
  },
  row: {
    flexDirection: 'row',
  },
});
