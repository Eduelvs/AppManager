import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { cssInterop } from 'nativewind';
import React, { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';

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
  return (
    <BlurView
      intensity={intensity}
      tint="dark"
      blurMethod="dimezisBlurView"
      className={`overflow-hidden rounded-2xl border border-[rgba(255,255,255,0.12)] ${className}`}>
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

  return (
    <View className="mb-4">
      <Text className="mb-2 text-[13px] font-medium text-[#c9c9cf]">{label}</Text>
      <BlurView
        intensity={focused ? 45 : 22}
        tint="dark"
        blurMethod="dimezisBlurView"
        className={`h-[52px] flex-row items-center overflow-hidden rounded-xl border px-4 ${
          focused ? 'border-[#d1a0f2]' : 'border-[rgba(255,255,255,0.14)]'
        }`}>
        {prefix ? <Text className="mr-1 text-[15px] text-[#a1a1aa]">{prefix}</Text> : null}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="rgba(255,255,255,0.4)"
          keyboardType={keyboardType}
          secureTextEntry={secure}
          autoCapitalize="none"
          autoCorrect={false}
          cursorColor="#d1a0f2"
          selectionColor="#d1a0f2"
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="flex-1 text-[15px] text-white"
        />
        {suffix ? <Text className="ml-1 text-[15px] text-[#a1a1aa]">{suffix}</Text> : null}
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
        <View className={`items-center justify-center bg-white py-4 ${pressed ? 'opacity-80' : ''}`}>
          <Text className="text-base font-bold text-black">{label}</Text>
        </View>
      )}
    </Pressable>
  );
}
