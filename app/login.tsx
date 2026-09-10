import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { Canvas } from '@shopify/react-native-skia';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { cssInterop } from 'nativewind';

import { GlassField } from '@/components/glass';
import { Background } from '@/components/Background';

cssInterop(Canvas, { className: 'style' });
cssInterop(SafeAreaView, { className: 'style' });


export default function Login() {
  const router = useRouter();
  const enterApp = () => router.replace('/dashboard');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View className="flex-1 bg-black">
      <StatusBar style="light" />
      <Background />

      <SafeAreaView className="flex-1">
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerClassName="grow justify-center px-6 py-12">
          <View className="mb-9 items-center">
            <Text className="mb-3 text-3xl font-bold text-white">Login</Text>
            <Text className="text-center text-[15px] text-[#e6e6e6]">
              Bem-vindo de volta. Faça login para continuar.
            </Text>
          </View>

          <GlassField
            label="Email"
            placeholder="Digite seu email"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          <GlassField
            label="Senha"
            placeholder="Digite sua senha"
            secure
            value={password}
            onChangeText={setPassword}
          />

          <Pressable className="mt-3 overflow-hidden rounded-[14px]" onPress={enterApp}>
            {({ pressed }) => (
              <View
                className={`items-center justify-center bg-white py-4 ${pressed ? 'opacity-80' : ''}`}>
                <Text className="text-base font-bold text-black">Entrar</Text>
              </View>
            )}
          </Pressable>

          <Text className="mt-6 text-center text-sm text-[#e6e6e6]">
            Não tem uma conta?{' '}
            <Text className="font-semibold text-white" onPress={() => router.push('/signIn')}>
              Criar Conta
            </Text>
          </Text>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
