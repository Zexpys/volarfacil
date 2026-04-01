import { View, Text, TouchableOpacity, Linking } from 'react-native';
import { Flight } from '~/lib/mockData';

interface Props { flight: Flight; }

export default function FlightCard({ flight }: Props) {
  function book() {
    if (!flight.available) return;
    Linking.openURL('https://www.volaris.com');
  }

  return (
    <View className={`bg-gray-900 rounded-2xl p-4 mb-3 ${!flight.available ? 'opacity-50' : ''}`}>
      <View className="flex-row justify-between items-center mb-3">
        <Text className="text-gray-400 text-xs">Volaris · {flight.flightNumber}</Text>
        <Text className="text-gray-400 text-xs">{flight.stops === 0 ? 'Directo' : `${flight.stops} escala`}</Text>
      </View>

      <View className="flex-row items-center justify-between">
        <View className="items-center">
          <Text className="text-white text-2xl font-bold">{flight.departure}</Text>
        </View>
        <View className="flex-1 items-center px-3">
          <Text className="text-gray-500 text-xs mb-1">{flight.duration}</Text>
          <View className="flex-row items-center w-full">
            <View className="flex-1 h-px bg-gray-600" />
            <Text className="text-gray-500 mx-1">✈</Text>
            <View className="flex-1 h-px bg-gray-600" />
          </View>
        </View>
        <View className="items-center">
          <Text className="text-white text-2xl font-bold">{flight.arrival}</Text>
        </View>
      </View>

      <View className="flex-row justify-between items-center mt-3">
        <View>
          {flight.available ? (
            <View className="flex-row items-center gap-1">
              <View className="w-2 h-2 rounded-full bg-green-400" />
              <Text className="text-green-400 text-xs">
                {flight.seatsLeft > 0 ? `${flight.seatsLeft} asientos` : 'Disponible'}
              </Text>
            </View>
          ) : (
            <View className="flex-row items-center gap-1">
              <View className="w-2 h-2 rounded-full bg-red-400" />
              <Text className="text-red-400 text-xs">Sin disponibilidad</Text>
            </View>
          )}
          {flight.price > 0 && (
            <Text className="text-gray-400 text-xs mt-0.5">{flight.price} {flight.currency}</Text>
          )}
        </View>

        <TouchableOpacity
          onPress={book}
          disabled={!flight.available}
          className={`px-4 py-2 rounded-xl ${flight.available ? 'bg-green-500' : 'bg-gray-700'}`}
        >
          <Text className={`text-sm font-semibold ${flight.available ? 'text-white' : 'text-gray-500'}`}>
            {flight.available ? 'Reservar' : 'Agotado'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
