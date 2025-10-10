// homeLoader.js
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';
import React, { useEffect, useRef } from 'react';
import { Animated, View, StyleSheet } from 'react-native';
import { rh, rw } from './dimentions';
import PropTypes from 'prop-types';

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

/**
 * Note: removed forwardRef usage. We don't need to forward a ref to the outer
 * View because the parent only needs the child placeholder refs (avatarRefs, lineRefs).
 */
const ShimmerView = ({ refs }) => (
  <View>
    {refs.avatarRefs.map((avatarRef, index) => (
      <ShimmerPlaceholder
        key={index}
        ref={avatarRef}
        stopAutoRun
        style={{
          width: rw(40 + 30 * index),
          marginTop: rh(2),
          marginLeft: rw(5),
        }}
      />
    ))}
    <View style={styles.shimmerView}>
      {refs.lineRefs.map((lineRef, index) => (
        <ShimmerPlaceholder
          key={index}
          ref={lineRef}
          stopAutoRun
          style={styles.shimmerPlaceholder}
        />
      ))}
    </View>
  </View>
);

// preserve named display (useful for devtools)
ShimmerView.displayName = 'ShimmerView';

export const HomeLoader = () => {
  const refs1 = {
    avatarRefs: [useRef(null), useRef(null)],
    lineRefs: [useRef(null), useRef(null), useRef(null), useRef(null)],
  };
  const refs2={
    avatarRefs: [useRef(null), useRef(null)],
    lineRefs: [useRef(null), useRef(null), useRef(null), useRef(null)],
  };
  

  useEffect(() => {
    const animateSet = (refs) => {
      // defensively check refs exist before calling getAnimated
      const avatarAnims = refs.avatarRefs
        .map((ref) => ref.current && ref.current.getAnimated())
        .filter(Boolean);
      const lineAnims = refs.lineRefs
        .map((ref) => ref.current && ref.current.getAnimated())
        .filter(Boolean);

      // if any refs are missing, skip starting animations for that set to avoid runtime errors
      if (!avatarAnims.length && !lineAnims.length) return Animated.loop(Animated.delay(0));

      return Animated.stagger(400, [
        ...avatarAnims,
        Animated.parallel(lineAnims),
      ]);
    };

    // start loops, but only if animations are available
    const a1 = animateSet(refs1);
    const a2 = animateSet(refs2);

    // only start if Animated nodes returned
    if (a1) Animated.loop(a1).start();
    if (a2) Animated.loop(a2).start();

    // no cleanup required for Animated.loop here (it'll stop when component unmounts)
  }, []);

  return (
    <View>
      <ShimmerView refs={refs1} />
      <ShimmerView refs={refs2} />
    </View>
  );
};

const styles = StyleSheet.create({
  shimmerPlaceholder: {
    borderRadius: 10,
    height: rh(15),
    // marginHorizontal: rw(5),
    marginVertical: rh(2),
    width: '46%',
  },
  shimmerView: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: rw(5),
  },
});

ShimmerView.propTypes = {
  refs: PropTypes.object,
};
