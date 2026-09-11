import { useEffect } from 'react';
import { useColorScheme as useSystemColorScheme } from 'react-native';
import { colorScheme as nativewindColorScheme, useColorScheme as useNativewindColorScheme } from 'nativewind';

import { COLORS } from '@/theme/colors';

type ColorSchemeName = 'light' | 'dark' | 'system';

function useColorScheme() {
  const { colorScheme, setColorScheme: setNativeWindColorScheme } = useNativewindColorScheme();
  const systemColorScheme = useSystemColorScheme();

  function setColorScheme(scheme: ColorSchemeName) {
    setNativeWindColorScheme(scheme);
  }

  function toggleColorScheme() {
    setNativeWindColorScheme(colorScheme === 'dark' ? 'light' : 'dark');
  }

  const resolved = (colorScheme ?? systemColorScheme) === 'dark' ? 'dark' : 'light';

  return {
    colorScheme: resolved,
    isDarkColorScheme: resolved === 'dark',
    setColorScheme,
    toggleColorScheme,
    colors: COLORS[resolved],
  };
}

function useSyncSystemColorScheme() {
  useEffect(() => {
    nativewindColorScheme.set('system');
  }, []);
}

export { useColorScheme, useSyncSystemColorScheme };
