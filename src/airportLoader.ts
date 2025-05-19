import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import { Airport } from './haversineDistance';

export function loadAirports(csvPath: string = path.join(__dirname, '..', 'data', 'airports.csv')): Airport[] {
	const fileContent = fs.readFileSync(csvPath, 'utf-8');

	const records = parse(fileContent, {
		columns: true,
		skip_empty_lines: true,
	});

	const airports: Airport[] = records.map((row: any) => ({
		id: row.id,
		name: row.name,
		city: row.city,
		country: row.country,
		iata: row.iata_code,
		icao: row.ident,
		lat: parseFloat(row.latitude_deg),
		lon: parseFloat(row.longitude_deg),
		type: row.type,
		wikipedia: row.wikipedia_link,
	}));

	return airports.filter(a => !isNaN(a.lat) && !isNaN(a.lon));
}
