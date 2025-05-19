import { Airport } from "./haversineDistance";

export function searchAirportByCode(
	code: string,
	airports: Airport[],
	options: { preferIcao?: boolean } = {}
): Airport | null {
	const codeUpper = code.toUpperCase();

	if (options.preferIcao) {
		// Search ICAO first, then fallback to IATA
		return (
			airports.find(a => a.icao?.toUpperCase() === codeUpper) ||
			airports.find(a => a.iata?.toUpperCase() === codeUpper) ||
			null
		);
	} else {
		// Default: Search IATA first, then fallback to ICAO
		return (
			airports.find(a => a.iata?.toUpperCase() === codeUpper) ||
			airports.find(a => a.icao?.toUpperCase() === codeUpper) ||
			null
		);
	}
}
