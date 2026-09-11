import { Canvas, RadialGradient, Rect, vec } from '@shopify/react-native-skia';
import { cssInterop } from 'nativewind';
import { useWindowDimensions } from 'react-native';

import { useColorScheme } from '@/lib/useColorScheme';

cssInterop(Canvas, { className: 'style' });

const DARK_GRADIENT = ['#ffffff', '#f3e8ff', '#a855f7', '#7e22ce', '#4c1d95', '#000000', '#000000'];
const LIGHT_GRADIENT = ['#ffffff', '#f3e8ff', '#a55af7eb', '#a65af7ba', '#a65af799', '#f5f3ff', '#ffffff'];
const DARK_POSITIONS = [0.1, 0.2, 0.5, 0.6, 0.7, 0.959, 1];
const LIGHT_POSITIONS = [0.08, 0.22, 0.4, 0.55, 0.7, 0.88, 1];

export function Background() {
  const { width, height } = useWindowDimensions();
  const { isDarkColorScheme } = useColorScheme();

  return (
    <Canvas className="absolute inset-0">
      <Rect x={0} y={0} width={width} height={height}>
        <RadialGradient
          c={vec(width / 2, -height * 0.19)}
          r={height * 0.55}
          colors={isDarkColorScheme ? DARK_GRADIENT : LIGHT_GRADIENT}
          positions={isDarkColorScheme ? DARK_POSITIONS : LIGHT_POSITIONS}
        />
      </Rect>
    </Canvas>
  );
}
