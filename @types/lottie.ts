import LottieView from 'lottie-react-native';
import { cssInterop } from 'nativewind';
import React from 'react';

cssInterop(LottieView, { className: 'style' });

type LottieViewProps = React.ComponentProps<typeof LottieView> & {
  className?: string;
};

export const StyledLottieView = LottieView as React.ComponentType<LottieViewProps>;
