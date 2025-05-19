import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

export function loadRegionMap(csvPath: string = path.join(__dirname, '..', 'data', 'regions.csv')): Record<string, string> {
	const fileContent = fs.readFileSync(csvPath, 'utf-8');
	const records = parse(fileContent, { columns: true, skip_empty_lines: true });

	const map: Record<string, string> = {};
	for (const region of records) {
		map[region.code] = region.name;
	}

	return map;
}
