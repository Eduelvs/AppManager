import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import LottieView from 'lottie-react-native';
import React, { useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { Background } from '@/components/Background';

const cardAnimation = require('../../../lottieFiles/card lq.json');

export default function Intro() {
  const router = useRouter();
  const didLeave = useRef(false);
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const goToSignIn = () => {
    if (didLeave.current) return;
    didLeave.current = true;
    router.replace('/signIn');
  };

  useEffect(() => {
    // Lottie toca (~1s); no zoom some a opacidade para não estourar o bege.
    scale.value = withSequence(
      withTiming(1, { duration: 1000 }),
      withTiming(14, { duration: 700, easing: Easing.in(Easing.cubic) }, (finished) => {
        if (finished) runOnJS(goToSignIn)();
      })
    );
    opacity.value = withSequence(
      withTiming(1, { duration: 1000 }),
      withTiming(0, { duration: 700, easing: Easing.in(Easing.quad) })
    );
  }, [scale, opacity]);

  const zoomStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <Background />
      <Animated.View style={zoomStyle}>
        <LottieView
          source={cardAnimation}
          autoPlay
          loop={false}
          resizeMode="contain"
          style={styles.animation}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: '#000000',
  },
  animation: {
    width: 320,
    height: 360,
  },
});
