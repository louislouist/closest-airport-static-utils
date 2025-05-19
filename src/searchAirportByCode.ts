import { Airport } from "./haversineDistance";

export function searchAirportByCode(code: string, airports: Airport[]): Airport | null {
	const codeUpper = code.toUpperCase();

	return (
		airports.find(a => a.iata?.toUpperCase() === codeUpper || a.icao?.toUpperCase() === codeUpper) || null
	);
}
