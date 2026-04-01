import { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { AIRPORTS } from '~/lib/airports';
import { getMockFlights, Flight } from '~/lib/mockData';
import AirportPicker from '~/components/AirportPicker';
import DatePicker from '~/components/DatePicker';
import FlightCard from '~/components/FlightCard';

const QUICK_ROUTES = [
  { from: 'OAK', to: 'MLM' },
  { from: 'LAX', to: 'GDL' },
  { from: 'OAK', to: 'MEX' },
  { from: 'SFO', to: 'MTY' },
  { from: 'LAX', to: 'CUN' },
  { from: 'SMF', to: 'MLM' },
];

export default function SearchScreen() {
  const params = useLocalSearchParams<{
    origin?: string;
    destination?: string;
    date?: string;
  }>();

  const [origin, setOrigin] = useState('OAK');
  const [destination, setDestination] = useState('MLM');
  const [date, setDate] = useState(() => {
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    return nextWeek.toISOString().split('T')[0];
  });
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  function swap() {
    setOrigin(destination);
    setDestination(origin);
  }

  async function runSearch(nextOrigin = origin, nextDestination = destination, nextDate = date) {
    setLoading(true);
    setSearched(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    setFlights(getMockFlights(nextOrigin, nextDestination, nextDate));
    setLoading(false);
  }

  useEffect(() => {
    if (typeof params.origin === 'string') setOrigin(params.origin);
    if (typeof params.destination === 'string') setDestination(params.destination);
    if (typeof params.date === 'string') setDate(params.date);

    if (
      typeof params.origin === 'string' &&
      typeof params.destination === 'string' &&
      typeof params.date === 'string'
    ) {
      void runSearch(params.origin, params.destination, params.date);
    }
  }, [params.date, params.destination, params.origin]);

  function quickSearch(from: string, to: string) {
    setOrigin(from);
    setDestination(to);
    setSearched(false);
    setFlights([]);
  }

  const originAirport = AIRPORTS.find(a => a.code === origin);
  const destinationAirport = AIRPORTS.find(a => a.code === destination);

  return (
    <SafeAreaView className="flex-1 bg-gray-950">
      <ScrollView className="flex-1" keyboardShouldPersistTaps="handled">
        <View className="px-5 pt-4 pb-2">
          <Text className="text-2xl font-bold text-white">{'VolarF\u00e1cil \u2708\uFE0F'}</Text>
          <Text className="mt-1 text-sm text-gray-400">Encuentra vuelos del Pase Volaris</Text>
        </View>

        <View className="mx-4 mt-3 gap-3 rounded-2xl bg-gray-900 p-4">
          <View className="flex-row items-center gap-2">
            <View className="flex-1">
              <Text className="mb-1 text-xs text-gray-400">Origen</Text>
              <AirportPicker
                airports={AIRPORTS}
                value={origin}
                onChange={setOrigin}
                placeholder="Seleccionar"
              />
            </View>
            <TouchableOpacity
              onPress={swap}
              className="mt-4 h-10 w-10 items-center justify-center rounded-full bg-gray-800"
            >
              <Text className="text-lg text-white">{'\u21C4'}</Text>
            </TouchableOpacity>
            <View className="flex-1">
              <Text className="mb-1 text-xs text-gray-400">Destino</Text>
              <AirportPicker
                airports={AIRPORTS}
                value={destination}
                onChange={setDestination}
                placeholder="Seleccionar"
              />
            </View>
          </View>

          <View>
            <Text className="mb-1 text-xs text-gray-400">Fecha</Text>
            <DatePicker value={date} onChange={setDate} />
          </View>

          <TouchableOpacity
            className="mt-1 rounded-xl bg-green-500 py-3"
            onPress={() => void runSearch()}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-center text-base font-semibold text-white">Buscar vuelos</Text>
            )}
          </TouchableOpacity>
        </View>

        {!searched && (
          <View className="mt-4 px-4">
            <Text className="mb-2 text-sm text-gray-400">Rutas populares</Text>
            <View className="flex-row flex-wrap gap-2">
              {QUICK_ROUTES.map(route => {
                const fromAirport = AIRPORTS.find(a => a.code === route.from);
                const toAirport = AIRPORTS.find(a => a.code === route.to);

                return (
                  <TouchableOpacity
                    key={`${route.from}-${route.to}`}
                    onPress={() => quickSearch(route.from, route.to)}
                    className="rounded-xl bg-gray-800 px-3 py-2"
                  >
                    <Text className="text-xs text-white">{fromAirport?.city} {'\u2192'} {toAirport?.city}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {searched && !loading && (
          <View className="mt-4 px-4 pb-8">
            <Text className="mb-3 font-semibold text-white">
              {originAirport?.city} {'\u2192'} {destinationAirport?.city} {'\u00B7'} {date}
            </Text>
            {flights.length === 0 ? (
              <Text className="mt-8 text-center text-gray-400">Sin vuelos disponibles</Text>
            ) : (
              flights.map(flight => <FlightCard key={flight.id} flight={flight} />)
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
