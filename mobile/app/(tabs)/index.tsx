import { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AIRPORTS, US_AIRPORTS, MX_AIRPORTS } from '~/lib/airports';
import { getMockFlights, Flight } from '~/lib/mockData';
import AirportPicker from '~/components/AirportPicker';
import DatePicker from '~/components/DatePicker';
import FlightCard from '~/components/FlightCard';

const QUICK_ROUTES = [
  { from: 'OAK', to: 'MEX' },
  { from: 'OAK', to: 'GDL' },
  { from: 'LAX', to: 'MEX' },
  { from: 'LAX', to: 'GDL' },
  { from: 'SFO', to: 'CUN' },
  { from: 'OAK', to: 'MOR' },
];

export default function SearchScreen() {
  const [origin, setOrigin] = useState('OAK');
  const [destination, setDestination] = useState('MEX');
  const [date, setDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().split('T')[0];
  });
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  function swap() {
    const allCodes = AIRPORTS.map(a => a.code);
    const originValid = allCodes.includes(destination);
    const destValid = allCodes.includes(origin);
    if (originValid && destValid) {
      setOrigin(destination);
      setDestination(origin);
    }
  }

  async function search() {
    setLoading(true);
    setSearched(true);
    await new Promise(r => setTimeout(r, 800));
    const results = getMockFlights(origin, destination, date);
    setFlights(results);
    setLoading(false);
  }

  function quickSearch(from: string, to: string) {
    setOrigin(from);
    setDestination(to);
    setSearched(false);
    setFlights([]);
  }

  const originAirport = AIRPORTS.find(a => a.code === origin);
  const destAirport = AIRPORTS.find(a => a.code === destination);

  return (
    <SafeAreaView className="flex-1 bg-gray-950">
      <ScrollView className="flex-1" keyboardShouldPersistTaps="handled">
        {/* Header */}
        <View className="px-5 pt-4 pb-2">
          <Text className="text-2xl font-bold text-white">VolarFácil ✈️</Text>
          <Text className="text-gray-400 text-sm mt-1">Encuentra vuelos del Pase Volaris</Text>
        </View>

        {/* Search form */}
        <View className="mx-4 mt-3 bg-gray-900 rounded-2xl p-4 gap-3">
          <View className="flex-row gap-2 items-center">
            <View className="flex-1">
              <Text className="text-gray-400 text-xs mb-1">Origen</Text>
              <AirportPicker
                airports={US_AIRPORTS}
                value={origin}
                onChange={setOrigin}
                placeholder="Seleccionar"
              />
            </View>
            <TouchableOpacity
              onPress={swap}
              className="w-10 h-10 bg-gray-800 rounded-full items-center justify-center mt-4"
            >
              <Text className="text-white text-lg">⇄</Text>
            </TouchableOpacity>
            <View className="flex-1">
              <Text className="text-gray-400 text-xs mb-1">Destino</Text>
              <AirportPicker
                airports={MX_AIRPORTS}
                value={destination}
                onChange={setDestination}
                placeholder="Seleccionar"
              />
            </View>
          </View>

          <View>
            <Text className="text-gray-400 text-xs mb-1">Fecha</Text>
            <DatePicker value={date} onChange={setDate} />
          </View>

          <TouchableOpacity
            className="bg-green-500 rounded-xl py-3 mt-1"
            onPress={search}
            disabled={loading}
          >
            {loading
              ? <ActivityIndicator color="white" />
              : <Text className="text-white text-center font-semibold text-base">Buscar vuelos</Text>
            }
          </TouchableOpacity>
        </View>

        {/* Quick routes */}
        {!searched && (
          <View className="mt-4 px-4">
            <Text className="text-gray-400 text-sm mb-2">Rutas populares</Text>
            <View className="flex-row flex-wrap gap-2">
              {QUICK_ROUTES.map(r => {
                const o = AIRPORTS.find(a => a.code === r.from);
                const d = AIRPORTS.find(a => a.code === r.to);
                return (
                  <TouchableOpacity
                    key={`${r.from}-${r.to}`}
                    onPress={() => quickSearch(r.from, r.to)}
                    className="bg-gray-800 rounded-xl px-3 py-2"
                  >
                    <Text className="text-white text-xs">{o?.city} → {d?.city}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* Results */}
        {searched && !loading && (
          <View className="mt-4 px-4 pb-8">
            <Text className="text-white font-semibold mb-3">
              {originAirport?.city} → {destAirport?.city} · {date}
            </Text>
            {flights.length === 0 ? (
              <Text className="text-gray-400 text-center mt-8">Sin vuelos disponibles</Text>
            ) : (
              flights.map(f => <FlightCard key={f.id} flight={f} />)
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
