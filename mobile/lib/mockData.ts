export interface Flight {
  id: string;
  airline: string;
  flightNumber: string;
  departure: string;
  arrival: string;
  duration: string;
  stops: number;
  price: number;
  currency: string;
  seatsLeft: number;
  available: boolean;
}

// Mirrors the current production web demo until a live search API exists.
function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

const MEXICO_AIRPORTS = new Set([
  'MEX', 'GDL', 'MTY', 'CUN', 'TIJ', 'MLM', 'BJX', 'MZT', 'PVR', 'SJD',
  'AGU', 'CUL', 'HMO', 'MID', 'OAX', 'SLP', 'VER', 'ZIH', 'ZCL', 'MXL',
  'TAM', 'VSA', 'LMM', 'ZLO', 'TGZ',
]);

export function getMockFlights(origin: string, destination: string, date: string): Flight[] {
  void date;

  const touchesMexico = MEXICO_AIRPORTS.has(origin) || MEXICO_AIRPORTS.has(destination);
  const seed = origin.charCodeAt(0) + destination.charCodeAt(0);

  return [
    {
      id: '1',
      airline: 'Volaris',
      flightNumber: `Y4 ${Math.floor(900 * seededRandom(seed + 1)) + 100}`,
      departure: '6:05 AM',
      arrival: touchesMexico ? '10:35 AM' : '7:40 AM',
      duration: touchesMexico ? '4h 30m' : '1h 35m',
      stops: 0,
      price: touchesMexico ? 596 : 0,
      currency: 'MXN',
      seatsLeft: 3,
      available: true,
    },
    {
      id: '2',
      airline: 'Volaris',
      flightNumber: `Y4 ${Math.floor(900 * seededRandom(seed + 2)) + 100}`,
      departure: '10:20 AM',
      arrival: touchesMexico ? '2:55 PM' : '11:55 AM',
      duration: touchesMexico ? '4h 35m' : '1h 35m',
      stops: 0,
      price: touchesMexico ? 596 : 0,
      currency: 'MXN',
      seatsLeft: 7,
      available: true,
    },
    {
      id: '3',
      airline: 'Volaris',
      flightNumber: `Y4 ${Math.floor(900 * seededRandom(seed + 3)) + 100}`,
      departure: '2:45 PM',
      arrival: touchesMexico ? '7:20 PM' : '4:20 PM',
      duration: touchesMexico ? '4h 35m' : '1h 35m',
      stops: 0,
      price: touchesMexico ? 596 : 0,
      currency: 'MXN',
      seatsLeft: 0,
      available: false,
    },
    {
      id: '4',
      airline: 'Volaris',
      flightNumber: `Y4 ${Math.floor(900 * seededRandom(seed + 4)) + 100}`,
      departure: '7:10 PM',
      arrival: touchesMexico ? '11:45 PM' : '8:45 PM',
      duration: touchesMexico ? '4h 35m' : '1h 35m',
      stops: 0,
      price: touchesMexico ? 596 : 0,
      currency: 'MXN',
      seatsLeft: 2,
      available: true,
    },
  ];
}

// Returns 0=unavailable, 1=limited, 2=available, 3=good
export function getCalendarData(origin: string, destination: string, year: number, month: number): Record<number, number> {
  const monthIndex = month - 1;
  const seed = (31 * origin.charCodeAt(0)) + destination.charCodeAt(0);
  const daysInMonth = new Date(year, month, 0).getDate();
  const result: Record<number, number> = {};
  const today = new Date();

  today.setHours(0, 0, 0, 0);

  for (let day = 1; day <= daysInMonth; day += 1) {
    const currentDate = new Date(year, monthIndex, day);

    if (currentDate < today) {
      result[day] = 0;
      continue;
    }

    const randomValue = seededRandom(seed + (366 * year) + (31 * monthIndex) + day);
    const weekday = currentDate.getDay();

    if (weekday === 0 || weekday === 6) {
      result[day] = randomValue > 0.3 ? 3 : 1;
    } else if (weekday === 5) {
      result[day] = randomValue > 0.4 ? 2 : 1;
    } else {
      result[day] = randomValue > 0.7 ? 2 : randomValue > 0.4 ? 1 : 0;
    }
  }

  return result;
}
