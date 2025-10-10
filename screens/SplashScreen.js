import React, {useEffect, useRef, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import LottieView from 'lottie-react-native';

export default function SplashScreen({onFinish}) {
  const animationRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    // Optional: start playback explicitly or rely on autoPlay prop
  }, []);

  return (
    <View style={styles.container}>
      <LottieView
        ref={animationRef}
        source={require('./private/assets/splashAnimation.json')}
        autoPlay
        loop={false}
        onAnimationFinish={() => {
          setIsPlaying(false);
          if (onFinish) onFinish();
        }}
        style={styles.animation}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff', justifyContent: 'center', alignItems: 'center' },
  animation: { width: '100%', height: '100%' }
});
