import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '~/lib/supabase';
import { User } from '@supabase/supabase-js';

export default function AccountScreen() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  async function handleSignOut() {
    Alert.alert('Cerrar sesión', '¿Estás seguro?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Salir', style: 'destructive',
        onPress: () => supabase.auth.signOut()
      }
    ]);
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-950">
      <ScrollView className="flex-1">
        <View className="px-5 pt-4 pb-2">
          <Text className="text-2xl font-bold text-white">Cuenta 👤</Text>
        </View>

        {/* Profile */}
        <View className="mx-4 mt-4 bg-gray-900 rounded-2xl p-5">
          <View className="w-16 h-16 bg-green-500 rounded-full items-center justify-center mb-3">
            <Text className="text-white text-2xl font-bold">
              {user?.email?.[0]?.toUpperCase() ?? '?'}
            </Text>
          </View>
          <Text className="text-white font-semibold text-base">{user?.email}</Text>
          <View className="mt-2 bg-gray-800 self-start px-3 py-1 rounded-full">
            <Text className="text-gray-300 text-xs">Plan Gratis · 5 búsquedas/día</Text>
          </View>
        </View>

        {/* Upgrade */}
        <View className="mx-4 mt-4 bg-gradient-to-r from-green-900 to-green-800 rounded-2xl p-5 border border-green-700">
          <Text className="text-white font-bold text-base mb-1">✨ Actualiza a Pro</Text>
          <Text className="text-green-200 text-sm mb-3">
            Búsquedas ilimitadas + alertas de precios + calendario completo
          </Text>
          <TouchableOpacity className="bg-green-500 rounded-xl py-3">
            <Text className="text-white text-center font-semibold">Ver planes</Text>
          </TouchableOpacity>
        </View>

        {/* Settings rows */}
        <View className="mx-4 mt-4 bg-gray-900 rounded-2xl overflow-hidden">
          {[
            { label: '🔔 Notificaciones', sub: 'Gestionar alertas de vuelos' },
            { label: '🔒 Cambiar contraseña', sub: '' },
            { label: '📋 Términos y privacidad', sub: '' },
          ].map((item, i, arr) => (
            <TouchableOpacity
              key={item.label}
              className={`px-5 py-4 flex-row justify-between items-center ${i < arr.length - 1 ? 'border-b border-gray-800' : ''}`}
            >
              <View>
                <Text className="text-white">{item.label}</Text>
                {item.sub ? <Text className="text-gray-400 text-xs mt-0.5">{item.sub}</Text> : null}
              </View>
              <Text className="text-gray-500">›</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View className="mx-4 mt-4 mb-8">
          <TouchableOpacity
            onPress={handleSignOut}
            className="bg-red-900/50 border border-red-700 rounded-2xl py-4"
          >
            <Text className="text-red-400 text-center font-semibold">Cerrar sesión</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
