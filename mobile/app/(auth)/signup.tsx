import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, Alert
} from 'react-native';
import { Link } from 'expo-router';
import { supabase } from '~/lib/supabase';

export default function SignupScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSignup() {
    if (!email || !password) return;
    if (password.length < 8) {
      Alert.alert('Error', 'La contraseña debe tener al menos 8 caracteres');
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert('¡Listo!', 'Revisa tu correo para confirmar tu cuenta.');
    }
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
            Crea tu cuenta gratis
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
                placeholder="Mínimo 8 caracteres"
                placeholderTextColor="#6b7280"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            <TouchableOpacity
              className="bg-green-500 rounded-xl py-4 mt-2"
              onPress={handleSignup}
              disabled={loading}
            >
              {loading
                ? <ActivityIndicator color="white" />
                : <Text className="text-white text-center font-semibold text-base">Crear cuenta</Text>
              }
            </TouchableOpacity>
          </View>

          <View className="flex-row justify-center mt-6 gap-1">
            <Text className="text-gray-400">¿Ya tienes cuenta?</Text>
            <Link href="/(auth)/login">
              <Text className="text-green-400 font-semibold"> Inicia sesión</Text>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
