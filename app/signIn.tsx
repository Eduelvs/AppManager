import React, { useState, type ComponentProps } from 'react';
import { Pressable, ScrollView, Text, TextInput, View, useWindowDimensions } from 'react-native';
import { Canvas, Rect, RadialGradient, vec } from '@shopify/react-native-skia';
import { BlurView } from 'expo-blur';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';
import { cssInterop } from 'nativewind';

cssInterop(Canvas, { className: 'style' });
cssInterop(BlurView, { className: 'style' });
cssInterop(SafeAreaView, { className: 'style' });

type AntIconName = ComponentProps<typeof AntDesign>['name'];

function Background() {
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

function SocialButton({
  icon,
  label,
  onPress,
}: {
  icon: AntIconName;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable className="flex-1" onPress={onPress}>
      {({ pressed }) => (
        <BlurView
          intensity={pressed ? 40 : 22}
          tint="dark"
          blurMethod="dimezisBlurView"
          className={`flex-row items-center justify-center gap-2.5 overflow-hidden rounded-xl border py-3.5 ${
            pressed ? 'border-[#d1a0f2]' : 'border-[rgba(227,227,227,0.5)]'
          }`}>
          <AntDesign name={icon} size={20} color="#fff" />
          <Text className="text-base font-medium text-white">{label}</Text>
        </BlurView>
      )}
    </Pressable>
  );
}

function GlassField({
  label,
  placeholder,
  secure,
  keyboardType,
}: {
  label: string;
  placeholder: string;
  secure?: boolean;
  keyboardType?: 'email-address' | 'default';
}) {
  const [focused, setFocused] = useState(false);
  const [value, setValue] = useState('');

  return (
    <View className="mb-5">
      <Text className="mb-2 text-[15px] text-[#e6e6e6]">{label}</Text>
      <BlurView
        intensity={focused ? 45 : 22}
        tint="dark"
        blurMethod="dimezisBlurView"
        className={`h-[52px] justify-center overflow-hidden rounded-xl border ${
          focused ? 'border-[#d1a0f2]' : 'border-[rgba(255,255,255,0.14)]'
        }`}>
        <TextInput
          value={value}
          onChangeText={setValue}
          placeholder={placeholder}
          placeholderTextColor="rgba(255,255,255,0.5)"
          secureTextEntry={secure}
          keyboardType={keyboardType}
          autoCapitalize="none"
          autoCorrect={false}
          cursorColor="#d1a0f2"
          selectionColor="#d1a0f2"
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="flex-1 px-4 text-[15px] text-white"
        />
      </BlurView>
    </View>
  );
}

export default function SignIn() {
  const router = useRouter();
  const enterApp = () => router.replace('/dashboard');

  return (
    <View className="flex-1 bg-black">
      <StatusBar style="light" />
      <Background />

      <SafeAreaView className="flex-1">
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerClassName="px-6 pt-24 pb-12">
          <View className="mb-9 items-center">
            <Text className="mb-3 text-3xl font-bold text-white">Sign Up</Text>
            <Text className="text-center text-[15px] text-[#e6e6e6]">
              Let&apos;s kick things off by creating your account.
            </Text>
          </View>

          <View className="flex-row justify-center gap-4">
            <SocialButton icon="google" label="Google" onPress={enterApp} />
            <SocialButton icon="github" label="Github" onPress={enterApp} />
          </View>

          <View className="my-8 flex-row items-center gap-4">
            <View className="h-px flex-1 bg-[rgba(227,227,227,0.4)]" />
            <Text className="text-sm text-[#e3e3e3]">OR</Text>
            <View className="h-px flex-1 bg-[rgba(227,227,227,0.4)]" />
          </View>

          <GlassField
            label="Email"
            placeholder="eg.reacticxislove@gmail.com"
            keyboardType="email-address"
          />
          <GlassField label="Password" placeholder="Enter your password" secure />
          <GlassField label="Confirm Password" placeholder="Enter your password again" secure />

          <Pressable className="mt-3 overflow-hidden rounded-[14px]" onPress={enterApp}>
            {({ pressed }) => (
              <View
                className={`items-center justify-center bg-white py-4 ${pressed ? 'opacity-80' : ''}`}>
                <Text className="text-base font-bold text-black">Sign Up</Text>
              </View>
            )}
          </Pressable>

          <Text className="mt-6 text-center text-sm text-[#e6e6e6]">
            Already have an account?{' '}
            <Text className="font-semibold text-white" onPress={enterApp}>
              Login
            </Text>
          </Text>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
