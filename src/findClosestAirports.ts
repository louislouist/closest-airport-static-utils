import { Airport, haversineDistance } from "./haversineDistance";

export function findClosestAirports(
	lat: number,
	lon: number,
	airports: Airport[],
	count: number,
	allowedTypes: string[] = ['large_airport', 'medium_airport']
): Airport[] {
	return airports
		.filter(airport => allowedTypes.includes(airport.type))
		.map(airport => ({
			...airport,
			distance: haversineDistance(lat, lon, airport.lat, airport.lon)
		}))
		.sort((a, b) => a.distance - b.distance)
		.slice(0, count);
}
