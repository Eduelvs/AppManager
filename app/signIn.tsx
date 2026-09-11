import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { Canvas } from '@shopify/react-native-skia';
import { BlurView } from 'expo-blur';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { cssInterop } from 'nativewind';

import { Background } from '@/components/Background';
import { GlassField } from '@/components/glass';
import { ApiError } from '@/lib/api/client';
import { useAuth } from '@/lib/auth';

cssInterop(Canvas, { className: 'style' });
cssInterop(BlurView, { className: 'style' });
cssInterop(SafeAreaView, { className: 'style' });

export default function SignIn() {
  const router = useRouter();
  const { register } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);

  const canSubmit =
    email.trim().includes('@') &&
    password.length >= 6 &&
    password === confirmPassword &&
    !pending;

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }
    if (password.length < 6) {
      setError('A senha precisa ter pelo menos 6 caracteres.');
      return;
    }
    if (!email.trim().includes('@')) {
      setError('Informe um email válido.');
      return;
    }
    setError('');
    setPending(true);
    try {
      await register(email, password);
      router.replace('/dashboard');
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'Não foi possível criar a conta. Tente novamente.',
      );
    } finally {
      setPending(false);
    }
  };

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
            <Text className="mb-3 text-3xl font-bold text-white">Criar Conta</Text>
            <Text className="text-center text-[15px] text-[#e6e6e6]">
              Vamos começar criando sua conta.
            </Text>
          </View>

          <GlassField
            label="Email"
            placeholder="Digite seu email"
            keyboardType="email-address"
            value={email}
            onChangeText={(value) => {
              setEmail(value);
              setError('');
            }}
          />
          <GlassField
            label="Senha"
            placeholder="Digite sua senha"
            secure
            value={password}
            onChangeText={(value) => {
              setPassword(value);
              setError('');
            }}
          />
          <GlassField
            label="Confirmar Senha"
            placeholder="Digite sua senha novamente"
            secure
            value={confirmPassword}
            onChangeText={(value) => {
              setConfirmPassword(value);
              setError('');
            }}
          />

          {error ? (
            <Text className="mb-3 text-center text-sm text-[#ff453a]">{error}</Text>
          ) : null}

          <Pressable
            className="mt-3 overflow-hidden rounded-[14px]"
            disabled={!canSubmit}
            onPress={() => void handleRegister()}>
            {({ pressed }) => (
              <View
                className={`items-center justify-center bg-white py-4 ${
                  pressed || !canSubmit ? 'opacity-80' : ''
                } ${!canSubmit ? 'opacity-50' : ''}`}>
                {pending ? (
                  <ActivityIndicator color="#000" />
                ) : (
                  <Text className="text-base font-bold text-black">Criar Conta</Text>
                )}
              </View>
            )}
          </Pressable>

          <Text className="mt-6 text-center text-sm text-[#e6e6e6]">
            Já tem uma conta?{' '}
            <Text className="font-semibold text-white" onPress={() => router.push('/login')}>
              Fazer Login
            </Text>
          </Text>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
