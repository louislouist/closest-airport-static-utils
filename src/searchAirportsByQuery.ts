import { Airport } from "./haversineDistance";

export function searchAirportsByQuery(
	query: string,
	airports: Airport[],
	count = 5
): Airport[] {
	const q = query.toLowerCase();

	const matches = airports.filter(a => {
		return (
			a.name?.toLowerCase().includes(q) ||
			a.city?.toLowerCase().includes(q) ||
			a.iata?.toLowerCase() === q ||
			a.icao?.toLowerCase() === q
		);
	});

	return matches.slice(0, count);
}
