import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, Alert,
} from 'react-native';
import { Link } from 'expo-router';
import { supabase } from '~/lib/supabase';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!email || !password) return;

    if (!supabase) {
      Alert.alert('Configuraci\u00f3n pendiente', 'Agrega tus variables de Supabase para usar la autenticaci\u00f3n.');
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);

    if (error) Alert.alert('Error', 'Correo o contrase\u00f1a incorrectos');
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-gray-950"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View className="flex-1 justify-center px-6 py-12">
          <Text className="mb-2 text-center text-3xl font-bold text-white">
            {'VolarF\u00e1cil \u2708\uFE0F'}
          </Text>
          <Text className="mb-10 text-center text-gray-400">
            Encuentra vuelos del Pase Volaris
          </Text>

          <View className="gap-4">
            <View>
              <Text className="mb-1 text-sm text-gray-400">{'Correo electr\u00f3nico'}</Text>
              <TextInput
                className="rounded-xl bg-gray-800 px-4 py-3 text-base text-white"
                placeholder="tu@email.com"
                placeholderTextColor="#6b7280"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>
            <View>
              <Text className="mb-1 text-sm text-gray-400">{'Contrase\u00f1a'}</Text>
              <TextInput
                className="rounded-xl bg-gray-800 px-4 py-3 text-base text-white"
                placeholder={'\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022'}
                placeholderTextColor="#6b7280"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            <TouchableOpacity
              className="mt-2 rounded-xl bg-green-500 py-4"
              onPress={() => void handleLogin()}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-center text-base font-semibold text-white">{'Iniciar sesi\u00f3n'}</Text>
              )}
            </TouchableOpacity>
          </View>

          <View className="mt-6 flex-row justify-center gap-1">
            <Text className="text-gray-400">{'\u00bfNo tienes cuenta?'}</Text>
            <Link href="/(auth)/signup">
              <Text className="font-semibold text-green-400">{' Reg\u00edstrate'}</Text>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
