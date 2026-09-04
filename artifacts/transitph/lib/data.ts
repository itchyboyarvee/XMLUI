export type UserRole = 'user' | 'admin';

export interface AppUser {
  id: string;
  fullName: string;
  email: string;
  passwordHash: string;
  role: UserRole;
}

export interface Terminal {
  id: string;
  name: string;
  city: string;
  province: string;
  latitude: number;
  longitude: number;
  description: string;
  routeCount: number;
}

export interface TransitRoute {
  id: string;
  terminalId: string;
  routeName: string;
  origin: string;
  destination: string;
  fare: number;
  estimatedTravelTime: string;
  walkingDistance: string;
  transfers: number;
  description: string;
}

export interface WeatherInfo {
  location: string;
  temperature: number;
  condition: string;
  rainProbability: number;
  rainfallStatus: string;
  note: string;
}

export const terminals: Terminal[] = [
  { id: 'calamba', name: 'Calamba Jeepney Terminal', city: 'Calamba', province: 'Laguna', latitude: 14.2117, longitude: 121.1653, description: 'A central commuter hub serving the Calamba city center and nearby Laguna corridors.', routeCount: 12 },
  { id: 'santarosa', name: 'Balibago Transport Hub', city: 'Santa Rosa', province: 'Laguna', latitude: 14.2842, longitude: 121.1113, description: 'A busy interchange for local jeepneys, tricycles, and connecting rides across Santa Rosa.', routeCount: 10 },
  { id: 'binan', name: 'Biñan Bayan Terminal', city: 'Biñan', province: 'Laguna', latitude: 14.3376, longitude: 121.0807, description: 'Town-center terminal with quick access to Pacita, San Pedro, and Santa Rosa.', routeCount: 8 },
  { id: 'losbanos', name: 'Los Baños Crossing', city: 'Los Baños', province: 'Laguna', latitude: 14.169, longitude: 121.2434, description: 'A practical starting point for the university belt and lakeside communities.', routeCount: 6 },
  { id: 'imus', name: 'Imus Transport Terminal', city: 'Imus', province: 'Cavite', latitude: 14.4297, longitude: 120.9367, description: 'A Cavite gateway with routes toward Bacoor, Dasmariñas, and the Manila south corridor.', routeCount: 9 },
  { id: 'dasmarinas', name: 'Dasmariñas Bayan Hub', city: 'Dasmariñas', province: 'Cavite', latitude: 14.3294, longitude: 120.9367, description: 'A town-center loading point serving Cavite interior routes.', routeCount: 7 },
  { id: 'bacoor', name: 'Bacoor Zapote Terminal', city: 'Bacoor', province: 'Cavite', latitude: 14.459, longitude: 120.9639, description: 'A strategic Cavite stop for commuters heading toward coastal towns and Manila.', routeCount: 8 },
  { id: 'lipa', name: 'Lipa City Transport Center', city: 'Lipa', province: 'Batangas', latitude: 13.9411, longitude: 121.1631, description: 'A commercial city terminal connecting Lipa to Batangas and nearby towns.', routeCount: 10 },
  { id: 'batangascity', name: 'Batangas Grand Terminal', city: 'Batangas City', province: 'Batangas', latitude: 13.7565, longitude: 121.0583, description: 'A major southern hub with routes across Batangas province.', routeCount: 11 },
  { id: 'tanauan', name: 'Tanauan Bayan Terminal', city: 'Tanauan', province: 'Batangas', latitude: 14.0863, longitude: 121.1495, description: 'A compact terminal for Tanauan, Malvar, and the north Batangas route.', routeCount: 6 },
  { id: 'antipolo', name: 'Antipolo Sumulong Hub', city: 'Antipolo', province: 'Rizal', latitude: 14.5867, longitude: 121.1753, description: 'A hillside hub with city routes toward Cainta and Taytay.', routeCount: 9 },
  { id: 'taytay', name: 'Taytay Bayan Terminal', city: 'Taytay', province: 'Rizal', latitude: 14.5588, longitude: 121.1321, description: 'A local transfer point for Rizal’s east-west commuter routes.', routeCount: 7 },
  { id: 'lucena', name: 'Lucena Grand Terminal', city: 'Lucena', province: 'Quezon', latitude: 13.9373, longitude: 121.6172, description: 'A Quezon province hub serving Lucena and nearby coastal communities.', routeCount: 9 },
  { id: 'tayabas', name: 'Tayabas City Terminal', city: 'Tayabas', province: 'Quezon', latitude: 14.0252, longitude: 121.5937, description: 'A heritage city terminal with short routes toward Lucena and Lucban.', routeCount: 5 },
  { id: 'lucban', name: 'Lucban Bayan Terminal', city: 'Lucban', province: 'Quezon', latitude: 14.1136, longitude: 121.5556, description: 'A community terminal connecting the eastern Laguna and Quezon foothills.', routeCount: 5 },
];

const routeSeeds: Array<[string, string, string, number, string, string]> = [
  ['calamba', 'Calamba – Santa Rosa', 'Santa Rosa', 30, '45 min', '500 m'],
  ['calamba', 'Calamba – Cabuyao', 'Cabuyao', 18, '25 min', '350 m'],
  ['calamba', 'Calamba – Los Baños', 'Los Baños', 20, '30 min', '420 m'],
  ['calamba', 'Calamba – Canlubang', 'Canlubang', 15, '20 min', '280 m'],
  ['calamba', 'Calamba – Nuvali', 'Nuvali', 35, '50 min', '650 m'],
  ['santarosa', 'Balibago – Santa Rosa Bayan', 'Santa Rosa Bayan', 15, '18 min', '250 m'],
  ['santarosa', 'Balibago – Tagaytay', 'Tagaytay', 45, '55 min', '700 m'],
  ['santarosa', 'Santa Rosa – Cabuyao', 'Cabuyao', 20, '25 min', '300 m'],
  ['binan', 'Biñan – Pacita', 'Pacita', 18, '22 min', '310 m'],
  ['binan', 'Biñan – Santa Rosa', 'Santa Rosa', 25, '35 min', '450 m'],
  ['binan', 'Biñan – San Pedro', 'San Pedro', 15, '20 min', '200 m'],
  ['losbanos', 'Los Baños – Calamba', 'Calamba', 20, '30 min', '420 m'],
  ['losbanos', 'Los Baños – Bay', 'Bay', 15, '22 min', '300 m'],
  ['imus', 'Imus – Bacoor', 'Bacoor', 25, '35 min', '550 m'],
  ['imus', 'Imus – Dasmariñas', 'Dasmariñas', 25, '30 min', '400 m'],
  ['imus', 'Imus – Zapote', 'Zapote', 20, '28 min', '350 m'],
  ['dasmarinas', 'Dasmariñas – Silang', 'Silang', 25, '35 min', '480 m'],
  ['dasmarinas', 'Dasmariñas – Imus', 'Imus', 25, '30 min', '390 m'],
  ['dasmarinas', 'Dasmariñas – Tagaytay', 'Tagaytay', 40, '55 min', '800 m'],
  ['bacoor', 'Bacoor – Zapote', 'Zapote', 15, '20 min', '250 m'],
  ['bacoor', 'Bacoor – Imus', 'Imus', 20, '25 min', '320 m'],
  ['lipa', 'Lipa – Batangas City', 'Batangas City', 40, '50 min', '600 m'],
  ['lipa', 'Lipa – Tanauan', 'Tanauan', 25, '35 min', '400 m'],
  ['lipa', 'Lipa – Malvar', 'Malvar', 18, '25 min', '350 m'],
  ['batangascity', 'Batangas City – Lipa', 'Lipa', 40, '50 min', '600 m'],
  ['batangascity', 'Batangas City – Bauan', 'Bauan', 25, '35 min', '420 m'],
  ['tanauan', 'Tanauan – Lipa', 'Lipa', 25, '35 min', '400 m'],
  ['antipolo', 'Antipolo – Cainta', 'Cainta', 25, '35 min', '500 m'],
  ['taytay', 'Taytay – Antipolo', 'Antipolo', 25, '40 min', '550 m'],
  ['lucena', 'Lucena – Tayabas', 'Tayabas', 25, '35 min', '450 m'],
];

export const routes: TransitRoute[] = routeSeeds.map(([terminalId, routeName, destination, fare, estimatedTravelTime, walkingDistance], index) => {
  const terminal = terminals.find((item) => item.id === terminalId);
  return {
    id: `route-${index + 1}`,
    terminalId,
    routeName,
    origin: terminal?.city ?? 'CALABARZON',
    destination,
    fare,
    estimatedTravelTime,
    walkingDistance,
    transfers: index % 5 === 0 ? 1 : 0,
    description: `Sample commuter route from ${terminal?.city ?? 'the terminal'} toward ${destination}. Confirm dispatch details with the driver before boarding.`,
  };
});

export const weatherLocations: WeatherInfo[] = [
  { location: 'Santa Rosa, Laguna', temperature: 28, condition: 'Partly cloudy', rainProbability: 65, rainfallStatus: 'Light showers possible', note: 'Rain may affect your walking route this afternoon.' },
  { location: 'Calamba, Laguna', temperature: 29, condition: 'Cloudy', rainProbability: 52, rainfallStatus: 'No active rainfall', note: 'Keep a light layer nearby for changing conditions.' },
  { location: 'Imus, Cavite', temperature: 30, condition: 'Mostly sunny', rainProbability: 32, rainfallStatus: 'Low rain chance', note: 'Good conditions for short walks between terminals.' },
  { location: 'Lipa, Batangas', temperature: 27, condition: 'Light rain', rainProbability: 74, rainfallStatus: 'Rain in the area', note: 'Allow extra time and bring rain protection for transfers.' },
  { location: 'Antipolo, Rizal', temperature: 26, condition: 'Overcast', rainProbability: 58, rainfallStatus: 'Drizzle possible', note: 'Slopes may be slippery after rain.' },
  { location: 'Lucena, Quezon', temperature: 29, condition: 'Partly cloudy', rainProbability: 48, rainfallStatus: 'Dry at the moment', note: 'Weather can shift quickly near the coast.' },
];

export const DEMO_USERS: AppUser[] = [
  { id: 'demo-admin', fullName: 'TransitPH Admin', email: 'admin@transitph.test', passwordHash: 'admin123', role: 'admin' },
  { id: 'demo-user', fullName: 'Demo Commuter', email: 'user@transitph.test', passwordHash: 'user123', role: 'user' },
];

export function hashPassword(value: string): string {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return `${hash >>> 0}`;
}