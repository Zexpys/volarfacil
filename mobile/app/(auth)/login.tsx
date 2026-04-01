import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, Alert
} from 'react-native';
import { Link } from 'expo-router';
import { supabase } from '~/lib/supabase';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!email || !password) return;
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) Alert.alert('Error', 'Correo o contraseña incorrectos');
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-gray-950"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View className="flex-1 justify-center px-6 py-12">
          <Text className="text-3xl font-bold text-white text-center mb-2">
            VolarFácil ✈️
          </Text>
          <Text className="text-gray-400 text-center mb-10">
            Encuentra vuelos del Pase Volaris
          </Text>

          <View className="gap-4">
            <View>
              <Text className="text-gray-400 text-sm mb-1">Correo electrónico</Text>
              <TextInput
                className="bg-gray-800 text-white rounded-xl px-4 py-3 text-base"
                placeholder="tu@email.com"
                placeholderTextColor="#6b7280"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>
            <View>
              <Text className="text-gray-400 text-sm mb-1">Contraseña</Text>
              <TextInput
                className="bg-gray-800 text-white rounded-xl px-4 py-3 text-base"
                placeholder="••••••••"
                placeholderTextColor="#6b7280"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            <TouchableOpacity
              className="bg-green-500 rounded-xl py-4 mt-2"
              onPress={handleLogin}
              disabled={loading}
            >
              {loading
                ? <ActivityIndicator color="white" />
                : <Text className="text-white text-center font-semibold text-base">Iniciar sesión</Text>
              }
            </TouchableOpacity>
          </View>

          <View className="flex-row justify-center mt-6 gap-1">
            <Text className="text-gray-400">¿No tienes cuenta?</Text>
            <Link href="/(auth)/signup">
              <Text className="text-green-400 font-semibold"> Regístrate</Text>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
