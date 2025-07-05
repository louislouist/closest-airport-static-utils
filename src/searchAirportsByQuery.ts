import { Airport, Frequency, Region } from "./types/airport";
import { getDb } from "./db/db";

export function searchAirportsByQuery(
	query: string,
	count = 5,
	allowedTypes: string[] = ['large_airport', 'medium_airport', 'small_airport']
): Airport[] {
	const db = getDb();
	const q = `%${query.toLowerCase()}%`;

	const placeholders = allowedTypes.map(() => '?').join(',');

	// Step 1: Airport + region data
	const airportRows = db.prepare(`
		SELECT
			a.id,
			a.name,
			a.municipality AS city,
			a.iso_country AS country,
			a.iata_code AS iata,
			a.icao_code AS icao,
			a.latitude_deg AS lat,
			a.longitude_deg AS lon,
			a.type,
			a.wikipedia_link AS wikipedia,
			a.home_link,
			a.iso_region AS regionCode
		FROM airports a
		WHERE a.type IN (${placeholders})
			AND (
				LOWER(a.name) LIKE ?
				OR LOWER(a.municipality) LIKE ?
				OR LOWER(a.iata_code) = ?
				OR LOWER(a.icao_code) = ?
			)
		LIMIT ?
	`).all(...allowedTypes, q, q, query.toLowerCase(), query.toLowerCase(), count) as AirportRow[];

	if (airportRows.length === 0) return [];

	// Step 2: Frequencies
	const icaos = airportRows.map(a => a.icao).filter((v): v is string => !!v);
	const freqMap = new Map<string, Frequency[]>();

	if (icaos.length > 0) {
		const freqRows = db.prepare(`
			SELECT airport_ident, type, description, frequency_mhz AS mhz
			FROM airport_frequencies
			WHERE airport_ident IN (${icaos.map(() => '?').join(',')})
		`).all(...icaos) as FrequencyRow[];

		for (const f of freqRows) {
			if (!freqMap.has(f.airport_ident)) freqMap.set(f.airport_ident, []);
			freqMap.get(f.airport_ident)!.push({
				type: f.type,
				description: f.description ?? '',
				mhz: f.mhz,
			});
		}
	}

	// Step 3: Region Info
	const regionCodes = airportRows.map(r => r.regionCode).filter((v): v is string => !!v);
	const regionMap = new Map<string, Region>();

	if (regionCodes.length > 0) {
		const regionRows = db.prepare(`
			SELECT *
			FROM regions
			WHERE code IN (${regionCodes.map(() => '?').join(',')})
		`).all(...regionCodes) as Region[];

		for (const r of regionRows) {
			regionMap.set(r.code, r);
		}
	}

	// Step 4: Combine
	return airportRows.map(row => ({
		id: row.id.toString(),
		name: row.name,
		city: row.city,
		country: row.country,
		iata: row.iata ?? '',
		icao: row.icao ?? '',
		lat: row.lat,
		lon: row.lon,
		type: row.type,
		wikipedia: row.wikipedia,
		home_link: row.home_link,
		regionCode: row.regionCode,
		regionName: regionMap.get(row.regionCode ?? '')?.name ?? undefined,
		regionInfo: regionMap.get(row.regionCode ?? '') ?? undefined,
		frequencies: freqMap.get(row.icao ?? '') ?? [],
	}));
}

// Internal types
interface AirportRow {
	id: number;
	name: string;
	city: string;
	country: string;
	iata: string | null;
	icao: string | null;
	lat: number;
	lon: number;
	type: string;
	wikipedia?: string;
	home_link?: string;
	regionCode?: string;
}

interface FrequencyRow {
	airport_ident: string;
	type: string;
	description: string;
	mhz: number;
}
