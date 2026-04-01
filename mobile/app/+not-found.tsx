import { View, Text } from 'react-native';
import { Link } from 'expo-router';

export default function NotFound() {
  return (
    <View className="flex-1 bg-gray-950 items-center justify-center">
      <Text className="text-white text-xl mb-4">Pantalla no encontrada</Text>
      <Link href="/(tabs)">
        <Text className="text-green-400">Ir al inicio</Text>
      </Link>
    </View>
  );
}
