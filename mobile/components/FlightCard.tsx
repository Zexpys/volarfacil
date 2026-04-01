import { View, Text, TouchableOpacity, Linking } from 'react-native';
import { Flight } from '~/lib/mockData';

interface Props {
  flight: Flight;
}

export default function FlightCard({ flight }: Props) {
  function book() {
    if (!flight.available) return;
    void Linking.openURL('https://www.volaris.com/pase-anual');
  }

  return (
    <View className={`mb-3 rounded-2xl bg-gray-900 p-4 ${!flight.available ? 'opacity-50' : ''}`}>
      <View className="mb-3 flex-row items-center justify-between">
        <Text className="text-xs text-gray-400">Volaris {'\u00b7'} {flight.flightNumber}</Text>
        <Text className="text-xs text-gray-400">{flight.stops === 0 ? 'Directo' : `${flight.stops} escala`}</Text>
      </View>

      <View className="flex-row items-center justify-between">
        <View className="items-center">
          <Text className="text-2xl font-bold text-white">{flight.departure}</Text>
        </View>
        <View className="flex-1 items-center px-3">
          <Text className="mb-1 text-xs text-gray-500">{flight.duration}</Text>
          <View className="w-full flex-row items-center">
            <View className="h-px flex-1 bg-gray-600" />
            <Text className="mx-1 text-gray-500">{'\u2708'}</Text>
            <View className="h-px flex-1 bg-gray-600" />
          </View>
        </View>
        <View className="items-center">
          <Text className="text-2xl font-bold text-white">{flight.arrival}</Text>
        </View>
      </View>

      <View className="mt-3 flex-row items-center justify-between">
        <View>
          {flight.available ? (
            <View className="flex-row items-center gap-1">
              <View className="h-2 w-2 rounded-full bg-green-400" />
              <Text className="text-xs text-green-400">
                {flight.seatsLeft > 0 ? `${flight.seatsLeft} asientos` : 'Disponible'}
              </Text>
            </View>
          ) : (
            <View className="flex-row items-center gap-1">
              <View className="h-2 w-2 rounded-full bg-red-400" />
              <Text className="text-xs text-red-400">Sin disponibilidad</Text>
            </View>
          )}
          {flight.price > 0 && (
            <Text className="mt-0.5 text-xs text-gray-400">{flight.price} {flight.currency}</Text>
          )}
        </View>

        <TouchableOpacity
          onPress={book}
          disabled={!flight.available}
          className={`rounded-xl px-4 py-2 ${flight.available ? 'bg-green-500' : 'bg-gray-700'}`}
        >
          <Text className={`text-sm font-semibold ${flight.available ? 'text-white' : 'text-gray-500'}`}>
            {flight.available ? 'Reservar' : 'Sin lugares'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
