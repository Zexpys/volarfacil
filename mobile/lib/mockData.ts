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

function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export function getMockFlights(origin: string, destination: string, date: string): Flight[] {
  const isMX = destination.match(/MEX|GDL|MTY|CUN|PVR|SJD|MOR|BJX|ZIH|MZT|TIJ|AGU|CUL|HMO|OAX|MID/);
  const seed = (origin + destination + date).split('').reduce((a, c) => a + c.charCodeAt(0), 0);

  const times = ['06:00', '09:30', '13:15', '18:45'];
  const durations = isMX ? ['4h 30m', '5h 00m', '5h 30m', '4h 45m'] : ['1h 30m', '2h 00m', '1h 45m', '2h 15m'];

  return times.map((dep, i) => {
    const r = seededRandom(seed + i);
    const seats = Math.floor(r * 8);
    const available = r > 0.25;
    const [h, m] = dep.split(':').map(Number);
    const durH = parseInt(durations[i]);
    const arrH = (h + durH) % 24;
    const arrival = `${String(arrH).padStart(2, '0')}:${String(m).padStart(2, '0')}`;

    return {
      id: `${origin}-${destination}-${date}-${i}`,
      airline: 'Volaris',
      flightNumber: `Y4 ${100 + i + (seed % 100)}`,
      departure: dep,
      arrival,
      duration: durations[i],
      stops: 0,
      price: available ? (isMX ? 596 : 0) : 0,
      currency: 'MXN',
      seatsLeft: seats,
      available,
    };
  });
}

// Returns 0=unavailable, 1=limited, 2=available, 3=good
export function getCalendarData(origin: string, destination: string, year: number, month: number): Record<number, number> {
  const seed = (origin + destination + year + month).split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const daysInMonth = new Date(year, month, 0).getDate();
  const result: Record<number, number> = {};

  for (let day = 1; day <= daysInMonth; day++) {
    const r = seededRandom(seed + day);
    if (r < 0.2) result[day] = 0;
    else if (r < 0.45) result[day] = 1;
    else if (r < 0.75) result[day] = 2;
    else result[day] = 3;
  }
  return result;
}
