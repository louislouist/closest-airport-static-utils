import { writeFileSync, mkdirSync, existsSync } from 'fs';
import path from 'path';
import vm from 'vm';

const MARKERS_URL = 'https://www.liveatc.net/map/markers.js';
const OUTPUT_FILE = path.join(__dirname, 'data', 'liveATCLocations.json');

export async function fetchAndSaveATCMarkers(): Promise<void> {
	try {
		const response = await fetch(MARKERS_URL);
		if (!response.ok) {
			throw new Error(`Failed to fetch file: ${response.status} ${response.statusText}`);
		}

		const jsText = await response.text();
		console.log('✅ Fetched JS text:', jsText.slice(0, 300));

		const sandbox: any = {};
		vm.createContext(sandbox);
		vm.runInContext(jsText, sandbox);

		const markers = sandbox.markers;
		if (!Array.isArray(markers)) {
			throw new Error('Extracted `markers` is not an array.');
		}

		// ✅ Ensure output directory exists
		const dir = path.dirname(OUTPUT_FILE);
		if (!existsSync(dir)) {
			mkdirSync(dir, { recursive: true });
		}

		writeFileSync(OUTPUT_FILE, JSON.stringify(markers, null, 2), 'utf8');
		console.log(`✅ Markers saved to ${OUTPUT_FILE}`);
	} catch (error) {
		console.error('❌ Error fetching or saving markers:', error);
	}
}
