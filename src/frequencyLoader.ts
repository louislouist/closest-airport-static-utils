import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import { Frequency } from './haversineDistance';

export function loadFrequencies(csvPath: string = path.join(__dirname, '..', 'data', 'airport-frequencies.csv')): Record<string, Frequency[]> {
	const fileContent = fs.readFileSync(csvPath, 'utf-8');
	const records = parse(fileContent, { columns: true, skip_empty_lines: true });

	const freqMap: Record<string, Frequency[]> = {};

	for (const row of records) {
		const ident = row.airport_ident;
		if (!freqMap[ident]) freqMap[ident] = [];

		freqMap[ident].push({
			type: row.type,
			description: row.description,
			mhz: parseFloat(row.frequency_mhz),
		});
	}

	return freqMap;
}
