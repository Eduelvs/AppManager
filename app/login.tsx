import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { Canvas } from '@shopify/react-native-skia';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { cssInterop } from 'nativewind';

import { GlassField } from '@/components/glass';
import { Background } from '@/components/Background';
import { useAuth } from '@/lib/auth';
import { ApiError } from '@/lib/api/client';
import { useColorScheme } from '@/lib/useColorScheme';

cssInterop(Canvas, { className: 'style' });
cssInterop(SafeAreaView, { className: 'style' });

export default function Login() {
  const router = useRouter();
  const { login } = useAuth();
  const { isDarkColorScheme, colors } = useColorScheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);

  const canSubmit = email.trim().includes('@') && password.length > 0 && !pending;

  const handleLogin = async () => {
    if (!canSubmit) return;
    setError('');
    setPending(true);
    try {
      await login(email, password);
      router.replace('/dashboard');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Não foi possível entrar. Tente novamente.');
    } finally {
      setPending(false);
    }
  };

  return (
    <View className="flex-1 bg-background">
      <StatusBar style={isDarkColorScheme ? 'light' : 'dark'} />
      <Background />

      <SafeAreaView className="flex-1">
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerClassName="grow justify-center px-6 py-12">
          <View className="mb-9 items-center">
            <Text className="mb-3 text-3xl font-bold text-foreground">Login</Text>
            <Text className="text-center text-[15px] text-muted">
              Bem-vindo de volta. Faça login para continuar.
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

          {error ? (
            <Text className="mb-3 text-center text-sm text-[#ff453a]">{error}</Text>
          ) : null}

          <Pressable
            className="mt-3 overflow-hidden rounded-[14px]"
            disabled={!canSubmit}
            onPress={() => void handleLogin()}>
            {({ pressed }) => (
              <View
                className={`items-center justify-center bg-foreground py-4 ${
                  pressed || !canSubmit ? 'opacity-80' : ''
                } ${!canSubmit ? 'opacity-50' : ''}`}>
                {pending ? (
                  <ActivityIndicator color={colors.background} />
                ) : (
                  <Text className="text-base font-bold text-background">Entrar</Text>
                )}
              </View>
            )}
          </Pressable>

          <Text className="mt-6 text-center text-sm text-muted">
            Não tem uma conta?{' '}
            <Text className="font-semibold text-foreground" onPress={() => router.push('/signIn')}>
              Criar Conta
            </Text>
          </Text>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
