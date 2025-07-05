import { readFileSync } from 'fs';
import path from 'path';
import { LiveAtcData } from './types/airport';

// Read from the data directory
const DATA_FILE = path.join(__dirname, '..', 'data', 'liveATCLocations.json');

export function liveATCExistsByICAO(icaoCode?: string): boolean {
	if (!icaoCode) return false;

	try {
		const data = readFileSync(DATA_FILE, 'utf8');
		const locations: LiveAtcData[] = JSON.parse(data);

		return locations.some(
			(loc) => loc.name.toUpperCase() === icaoCode.toUpperCase()
		);
	} catch (error) {
		console.error('Error reading or parsing JSON file:', error);
		return false;
	}
}
