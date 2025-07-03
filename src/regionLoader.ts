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


export interface Region {
	id: number;
	code: string;
	local_code: string;
	name: string;
	continent: string;
	iso_country: string;
	wikipedia_link: string;
	keywords: string;
}

export function loadRegions(
	csvPath = path.join(__dirname, '..', 'data', 'regions.csv')
): Region[] {
	const csv = fs.readFileSync(csvPath, 'utf-8');
	const rows = parse(csv, { columns: true, skip_empty_lines: true });

	return rows.map((r: any) => ({
		id: parseInt(r.id),
		code: r.code,
		local_code: r.local_code,
		name: r.name,
		continent: r.continent,
		iso_country: r.iso_country,
		wikipedia_link: r.wikipedia_link || '',
		keywords: r.keywords || '',
	}));
}
