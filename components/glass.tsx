import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { cssInterop } from 'nativewind';
import React, { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';

import { useColorScheme } from '@/lib/useColorScheme';

cssInterop(BlurView, { className: 'style' });

export function GlassCard({
  children,
  className = '',
  intensity = 22,
}: {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
}) {
  const { isDarkColorScheme } = useColorScheme();

  return (
    <BlurView
      intensity={isDarkColorScheme ? intensity : Math.max(intensity, 40)}
      tint={isDarkColorScheme ? 'dark' : 'light'}
      blurMethod="dimezisBlurView"
      className={`overflow-hidden rounded-2xl border border-black/10 dark:border-white/12 ${className}`}>
      {children}
    </BlurView>
  );
}

export function GlassField({
  label,
  placeholder,
  value,
  onChangeText,
  keyboardType = 'default',
  prefix,
  suffix,
  secure,
}: {
  label: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  keyboardType?: 'default' | 'numeric' | 'decimal-pad' | 'email-address';
  prefix?: string;
  suffix?: string;
  secure?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  const { isDarkColorScheme } = useColorScheme();

  return (
    <View className="mb-4">
      <Text className="mb-2 text-[13px] font-medium text-muted">{label}</Text>
      <BlurView
        intensity={focused ? 45 : 22}
        tint={isDarkColorScheme ? 'dark' : 'light'}
        blurMethod="dimezisBlurView"
        className={`h-[52px] flex-row items-center overflow-hidden rounded-xl border px-4 ${
          focused ? 'border-[#d1a0f2]' : 'border-black/10 dark:border-white/14'
        }`}>
        {prefix ? <Text className="mr-1 text-[15px] text-muted">{prefix}</Text> : null}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={isDarkColorScheme ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.35)'}
          keyboardType={keyboardType}
          secureTextEntry={secure}
          autoCapitalize="none"
          autoCorrect={false}
          cursorColor="#d1a0f2"
          selectionColor="#d1a0f2"
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="flex-1 text-[15px] text-foreground"
        />
        {suffix ? <Text className="ml-1 text-[15px] text-muted">{suffix}</Text> : null}
      </BlurView>
    </View>
  );
}

export function AddCard({
  onPress,
  className = '',
}: {
  onPress: () => void;
  className?: string;
}) {
  return (
    <Pressable onPress={onPress}>
      {({ pressed }) => (
        <GlassCard
          className={`min-h-[76px] items-center justify-center p-5 ${pressed ? 'opacity-80' : ''} ${className}`}>
          <Ionicons name="add" size={28} color="#c084fc" />
        </GlassCard>
      )}
    </Pressable>
  );
}

export function PrimaryButton({
  label,
  onPress,
  className = '',
}: {
  label: string;
  onPress: () => void;
  className?: string;
}) {
  return (
    <Pressable className={`overflow-hidden rounded-[14px] ${className}`} onPress={onPress}>
      {({ pressed }) => (
        <View className={`items-center justify-center bg-foreground py-4 ${pressed ? 'opacity-80' : ''}`}>
          <Text className="text-base font-bold text-background">{label}</Text>
        </View>
      )}
    </Pressable>
  );
}
