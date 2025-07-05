import { Airport, Frequency } from "./types/airport";
import { getDb } from "./db/db";

interface AirportRow {
	id: number;
	ident: string;
	type: string;
	name: string;
	latitude_deg: number;
	longitude_deg: number;
	municipality: string;
	iso_country: string;
	iata_code?: string;
	icao_code?: string;
	wikipedia_link?: string;
	home_link?: string;
	iso_region?: string;

	region_id?: number;
	region_code?: string;
	region_local_code?: string;
	region_name?: string;
	region_continent?: string;
	region_iso_country?: string;
	region_wikipedia_link?: string;
	region_keywords?: string;
}

export function searchAirportByCode(
	code: string,
	options: { preferIcao?: boolean } = {}
): Airport | null {
	const db = getDb();
	const codeUpper = code.toUpperCase();

	const query = `
		SELECT 
			a.*,
			r.id AS region_id,
			r.code AS region_code,
			r.local_code AS region_local_code,
			r.name AS region_name,
			r.continent AS region_continent,
			r.iso_country AS region_iso_country,
			r.wikipedia_link AS region_wikipedia_link,
			r.keywords AS region_keywords
		FROM airports a
		LEFT JOIN regions r ON a.iso_region = r.code
		WHERE UPPER(a.${options.preferIcao ? "icao_code" : "iata_code"}) = ?
		LIMIT 1;
	`;

	const row = db.prepare(query).get(codeUpper) as AirportRow | undefined;

	if (!row) return null;

	const airport: Airport = {
		id: row.id.toString(),
		name: row.name,
		city: row.municipality,
		country: row.iso_country,
		iata: row.iata_code ?? "",
		icao: row.icao_code ?? "",
		lat: row.latitude_deg,
		lon: row.longitude_deg,
		type: row.type,
		wikipedia: row.wikipedia_link,
		home_link: row.home_link,
		regionCode: row.iso_region,
		regionName: row.region_name,
		regionInfo: row.region_id ? {
			id: row.region_id,
			code: row.region_code!,
			local_code: row.region_local_code!,
			name: row.region_name!,
			continent: row.region_continent!,
			iso_country: row.region_iso_country!,
			wikipedia_link: row.region_wikipedia_link,
			keywords: row.region_keywords
		} : undefined
	};

	// Load frequencies
	const freqQuery = `
		SELECT type, description, frequency_mhz AS mhz
		FROM airport_frequencies
		WHERE airport_ref = ?
		ORDER BY frequency_mhz ASC;
	`;

	const frequencies = db.prepare(freqQuery).all(row.id) as Frequency[];
	airport.frequencies = frequencies;

	return airport;
}
