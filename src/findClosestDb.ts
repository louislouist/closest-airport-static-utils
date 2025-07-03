import { Airport, Frequency, Region } from "./haversineDistance";
import { getDb } from "./db/db";


export function findClosestAirportsFromDb(
	lat: number,
	lon: number,
	count: number,
	allowedTypes: string[] = ['large_airport', 'medium_airport']
): Airport[] {
	const db = getDb();

	const placeholders = allowedTypes.map(() => '?').join(',');

	// Step 1: Closest airports with regionCode
	const airportQuery = `
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
			a.iso_region AS regionCode,
			haversine(a.latitude_deg, a.longitude_deg, ?, ?) AS distance
		FROM airports a
		WHERE a.type IN (${placeholders})
		ORDER BY distance ASC
		LIMIT ?
	`;

	const airportRows = db.prepare(airportQuery).all(lat, lon, ...allowedTypes, count) as AirportRow[];

	// Step 2: Get ICAOs for frequencies
	const icaos = airportRows.map(a => a.icao).filter((v): v is string => !!v);
	const regionCodes = airportRows.map(a => a.regionCode).filter((v): v is string => !!v);

	let freqMap = new Map<string, Frequency[]>();
	if (icaos.length > 0) {
		const freqQuery = `
			SELECT airport_ident, type, description, frequency_mhz AS mhz
			FROM airport_frequencies
			WHERE airport_ident IN (${icaos.map(() => '?').join(',')})
		`;
		const freqRows = db.prepare(freqQuery).all(...icaos) as FrequencyRow[];

		for (const f of freqRows) {
			if (!freqMap.has(f.airport_ident)) freqMap.set(f.airport_ident, []);
			freqMap.get(f.airport_ident)!.push({
				type: f.type,
				description: f.description ?? '',
				mhz: f.mhz,
			});
		}
	}

	// Step 3: Get Region Info
	let regionMap = new Map<string, Region>();
	if (regionCodes.length > 0) {
		const regionQuery = `
			SELECT *
			FROM regions
			WHERE code IN (${regionCodes.map(() => '?').join(',')})
		`;
		const regionRows = db.prepare(regionQuery).all(...regionCodes) as Region[];

		for (const region of regionRows) {
			regionMap.set(region.code, region);
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
		distance: row.distance,
		wikipedia: row.wikipedia,
		home_link: row.home_link,
		regionCode: row.regionCode,
		regionName: regionMap.get(row.regionCode ?? '')?.name,
		regionInfo: regionMap.get(row.regionCode ?? '') ?? undefined,
		frequencies: freqMap.get(row.icao ?? '') ?? [],
	}));
}

// NOTE: Current Airport Types
// ['balloonport', 'closed', 'heliport', 'large_airport', 'medium_airport', 'seaplane_base', 'small_airport']

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
	regionName?: string;
	distance: number;
	freq_type?: string;
	freq_description?: string;
	freq_mhz?: number;
}


interface FrequencyRow {
	airport_ident: string;
	type: string;
	description: string;
	mhz: number;
}
