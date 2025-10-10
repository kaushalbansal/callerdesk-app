import React, { useEffect, useState } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { colors } from '../../themes/vars';

const random = (min, max) => Math.floor(Math.random() * (max - min)) + min;
const getBarColor = () => {
  const array = [colors.primary, colors.black];
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
};

const EqualizerAnimation = () => {
  const numberOfBars = 54;
  const barHeightRange = [4, 14]; // Range for bar heights

  const [barHeights] = useState(
    Array.from({ length: numberOfBars }, () => new Animated.Value(0)),
  );

  const animateBarsRandomly = () => {
    const animations = barHeights.map((barHeight, index) => {
      const randomHeight =
        Math.random() * (barHeightRange[1] - barHeightRange[0]) +
        barHeightRange[0];

      const delayDuration = Math.random() * 2000; // Randomize delay for each bar
      const shrinkDuration = 300; // Adjust the animation duration for shrinking

      const delayAnimation = Animated.timing(barHeight, {
        toValue: random(2, 5), // 0, // Delay at minimum height
        duration: delayDuration,
        useNativeDriver: false,
      });

      const shrinkAnimation = Animated.timing(barHeight, {
        toValue: randomHeight, // Shrink to a random height
        duration: shrinkDuration,
        useNativeDriver: false,
      });

      // Use sequence to add delay and then shrink the bar
      return Animated.sequence([delayAnimation, shrinkAnimation]);
    });

    // Use parallel to start all animations simultaneously
    Animated.parallel(animations).start(() => {
      // When all animations are complete, restart the animation loop
      animateBarsRandomly();
    });
  };

  useEffect(() => {
    animateBarsRandomly();
  }, []);

  return (
    <View style={styles.container}>
      {barHeights.map((barHeight, index) => (
        <Animated.View
          key={index}
          style={[
            styles.bar,
            {
              height: barHeight,
              backgroundColor: getBarColor(),
            },
          ]}
        />
      ))}
    </View>
  );
};

export const EqualizerStatic = () => {
  return (
    <>
      <View style={styles.equalizerStaticStyle}>
        {Array.from({ length: 55 }, (_, index) => (
          <View
            key={index}
            // eslint-disable-next-line react-native/no-inline-styles
            style={{
              borderLeftColor: colors.black,
              borderWidth: 1,
              height: random(2, 15),
            }}
          ></View>
        ))}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  bar: {
    marginHorizontal: 1, // Adjust the horizontal spacing between bars if needed
    width: 1.5, // Adjust the width of the bars as needed
  },
  container: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  equalizerStaticStyle: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 1.5,
    marginHorizontal: 24,
    overflow: 'hidden',
  },
});

export default EqualizerAnimation;


// // EqualizerAnimation.js
// import React, { useEffect, useMemo, useRef } from 'react';
// import { View, Animated, StyleSheet } from 'react-native';
// import { colors } from '../../themes/vars';

// const random = (min, max) => Math.floor(Math.random() * (max - min)) + min;
// const randomFloat = (min, max) => Math.random() * (max - min) + min;

// const getBarColor = () => {
//   const array = [colors.primary, colors.black];
//   return array[Math.floor(Math.random() * array.length)];
// };

// /**
//  * Props:
//  *  - playing: boolean (start/stop animation)
//  *  - bars: number (how many bars) default 30
//  *  - minH, maxH: pixel base height range (rendered with scale)
//  */
// const EqualizerAnimation = ({
//   playing = true,
//   bars = 30,
//   minH = 4,
//   maxH = 14,
// }) => {
//   // We'll animate scaleY from 1 -> (maxH/minH)
//   const maxScale = maxH / Math.max(1, minH);

//   // create Animated.Value(1) for each bar only once
//   const barValues = useMemo(
//     () => Array.from({ length: bars }, () => new Animated.Value(1)),
//     [bars],
//   );

//   // Keep refs to animations so we can stop them
//   const animationsRef = useRef([]);

//   // start animations
//   const start = () => {
//     // stop any existing first
//     stop();

//     animationsRef.current = barValues.map((val, idx) => {
//       // each bar gets slightly different random timing/scale
//       const growTo = randomFloat(1, maxScale);
//       const growDur = random(150, 450);
//       const shrinkDur = random(150, 450);
//       const initialDelay = random(0, 400);

//       const seq = Animated.sequence([
//         Animated.delay(initialDelay),
//         Animated.timing(val, {
//           toValue: growTo,
//           duration: growDur,
//           useNativeDriver: true,
//         }),
//         Animated.timing(val, {
//           toValue: 1,
//           duration: shrinkDur,
//           useNativeDriver: true,
//         }),
//       ]);

//       // loop the sequence indefinitely
//       const looped = Animated.loop(seq);
//       looped.start();
//       return looped;
//     });
//   };

//   // stop all animations and reset bar scales to 1 (or small random static)
//   const stop = (setStatic = true) => {
//     const anims = animationsRef.current || [];
//     anims.forEach((a) => {
//       try {
//         a && a.stop && a.stop();
//       } catch (e) {
//         // ignore
//       }
//     });
//     animationsRef.current = [];
//     if (setStatic) {
//       barValues.forEach((v) => {
//         // set each bar to a small random static scale so it looks "idle"
//         v.setValue(randomFloat(0.6, 1.05));
//       });
//     }
//   };

//   // respond to playing state changes
//   useEffect(() => {
//     if (playing) {
//       start();
//     } else {
//       stop(true);
//     }
//     // cleanup on unmount
//     return () => {
//       stop(false);
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [playing]);

//   return (
//     <View style={styles.container}>
//       {barValues.map((val, i) => (
//         <Animated.View
//           key={i}
//           style={[
//             styles.bar,
//             {
//               // base height is minH, use scaleY to expand to random heights
//               height: minH,
//               transform: [{ scaleY: val }],
//               backgroundColor: getBarColor(),
//             },
//           ]}
//         />
//       ))}
//     </View>
//   );
// };

// export const EqualizerStatic = ({ bars = 30, minH = 4, maxH = 14 }) => {
//   return (
//     <View style={styles.container}>
//       {Array.from({ length: bars }).map((_, i) => (
//         <View
//           key={i}
//           style={{
//             width: 2,
//             marginHorizontal: 1,
//             height: random(minH, maxH),
//             backgroundColor: colors.black,
//           }}
//         />
//       ))}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   bar: {
//     marginHorizontal: 1,
//     width: 2,
//     borderRadius: 1,
//   },
//   container: {
//     alignItems: 'center',
//     flexDirection: 'row',
//     justifyContent: 'center',
//     // optional trimming if you need it compact
//     overflow: 'hidden',
//   },
// });

// export default EqualizerAnimation;

