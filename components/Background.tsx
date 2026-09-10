import { Canvas, RadialGradient, Rect, vec } from '@shopify/react-native-skia';
import { cssInterop } from 'nativewind';
import { useWindowDimensions } from 'react-native';

cssInterop(Canvas, { className: 'style' });

export function Background() {
  const { width, height } = useWindowDimensions();
  return (
    <Canvas className="absolute inset-0">
      <Rect x={0} y={0} width={width} height={height}>
        <RadialGradient
          c={vec(width / 2, -height * 0.19)}
          r={height * 0.55}
          colors={['#ffffff', '#f3e8ff', '#a855f7', '#7e22ce', '#4c1d95', '#000000', '#000000']}
          positions={[0.1, 0.2, 0.5, 0.6, 0.7, 0.959, 1]}
        />
      </Rect>
    </Canvas>
  );
}
