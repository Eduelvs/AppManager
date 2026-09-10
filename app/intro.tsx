import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef } from 'react';
import { View } from 'react-native';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { StyledLottieView } from '@/@types/lottie';
import { Background } from '@/components/Background';

const cardAnimation = require('../lottieFiles/card lq.json');

export default function Intro() {
  const router = useRouter();
  const didLeave = useRef(false);
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const goToSignIn = () => {
    if (didLeave.current) return;
    didLeave.current = true;
    router.replace('/login');
  };

  useEffect(() => {
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
    <View className="flex-1 items-center justify-center overflow-hidden bg-black">
      <StatusBar style="light" />
      <Background />
      <Animated.View style={zoomStyle}>
        <StyledLottieView
          source={cardAnimation}
          autoPlay
          loop={false}
          resizeMode="contain"
          className="h-[360px] w-[320px]"
        />
      </Animated.View>
    </View>
  );
}
