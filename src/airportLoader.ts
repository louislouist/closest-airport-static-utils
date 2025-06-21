import path from 'path';
import fs from 'fs';
import { parse } from 'csv-parse/sync';
import { loadRegionMap } from './regionLoader';
import { loadFrequencies } from './frequencyLoader';
import type { Airport } from './haversineDistance';

export function loadAirports(): Airport[] {
	const regionMap = loadRegionMap();
	const frequencyMap = loadFrequencies();
	const filePath = path.join(__dirname, '..', 'data', 'airports.csv');
	const fileContent = fs.readFileSync(filePath, 'utf-8');

	const records = parse(fileContent, { columns: true, skip_empty_lines: true });

	return records
		.filter(isValidAirport)
		.map((row: any) => {
			const regionCode = row.iso_region;
			const ident = row.ident;

			return {
				id: row.id,
				name: row.name,
				city: row.city,
				country: row.iso_country,
				iata: row.iata_code,
				icao: ident,
				lat: parseFloat(row.latitude_deg),
				lon: parseFloat(row.longitude_deg),
				type: row.type,
				home_link: row.home_link,
				wikipedia: row.wikipedia_link,
				regionCode,
				regionName: regionMap[regionCode],
				frequencies: frequencyMap[ident] || [],
			};
		})
		.filter((a: Airport) => !isNaN(a.lat) && !isNaN(a.lon));
}

function isValidAirport(row: any): boolean {
	if (!row.id || !row.name || !row.latitude_deg || !row.longitude_deg || !row.type) return false;

	const lat = parseFloat(row.latitude_deg);
	const lon = parseFloat(row.longitude_deg);

	return !isNaN(lat) && !isNaN(lon) && lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180;
}
