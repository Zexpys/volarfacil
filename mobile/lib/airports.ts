export interface Airport {
  code: string;
  city: string;
  country: 'US' | 'MX';
}

export const AIRPORTS: Airport[] = [
  // USA
  { code: 'OAK', city: 'Oakland', country: 'US' },
  { code: 'SFO', city: 'San Francisco', country: 'US' },
  { code: 'SMF', city: 'Sacramento', country: 'US' },
  { code: 'SJC', city: 'San Jose', country: 'US' },
  { code: 'LAX', city: 'Los Angeles', country: 'US' },
  { code: 'LAS', city: 'Las Vegas', country: 'US' },
  { code: 'JFK', city: 'New York', country: 'US' },
  { code: 'ORD', city: 'Chicago', country: 'US' },
  { code: 'DFW', city: 'Dallas', country: 'US' },
  { code: 'IAH', city: 'Houston', country: 'US' },
  { code: 'PHX', city: 'Phoenix', country: 'US' },
  { code: 'SAN', city: 'San Diego', country: 'US' },
  { code: 'ONT', city: 'Ontario', country: 'US' },
  { code: 'DEN', city: 'Denver', country: 'US' },
  // Mexico
  { code: 'MEX', city: 'Mexico City', country: 'MX' },
  { code: 'GDL', city: 'Guadalajara', country: 'MX' },
  { code: 'MTY', city: 'Monterrey', country: 'MX' },
  { code: 'CUN', city: 'Cancún', country: 'MX' },
  { code: 'PVR', city: 'Puerto Vallarta', country: 'MX' },
  { code: 'SJD', city: 'Los Cabos', country: 'MX' },
  { code: 'MOR', city: 'Morelia', country: 'MX' },
  { code: 'BJX', city: 'León/Guanajuato', country: 'MX' },
  { code: 'ZIH', city: 'Zihuatanejo', country: 'MX' },
  { code: 'MZT', city: 'Mazatlán', country: 'MX' },
  { code: 'TIJ', city: 'Tijuana', country: 'MX' },
  { code: 'AGU', city: 'Aguascalientes', country: 'MX' },
  { code: 'CUL', city: 'Culiacán', country: 'MX' },
  { code: 'HMO', city: 'Hermosillo', country: 'MX' },
  { code: 'OAX', city: 'Oaxaca', country: 'MX' },
  { code: 'MID', city: 'Mérida', country: 'MX' },
  { code: 'TAM', city: 'Tampico', country: 'MX' },
  { code: 'VER', city: 'Veracruz', country: 'MX' },
  { code: 'TRC', city: 'Torreón', country: 'MX' },
  { code: 'CJS', city: 'Ciudad Juárez', country: 'MX' },
];

export const US_AIRPORTS = AIRPORTS.filter(a => a.country === 'US');
export const MX_AIRPORTS = AIRPORTS.filter(a => a.country === 'MX');
