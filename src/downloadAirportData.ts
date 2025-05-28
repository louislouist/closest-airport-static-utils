// removes TSL cert check.
// process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
//

import fs from 'fs';
import path from 'path';
import axios from 'axios';

// Setup paths
const DATA_DIR = path.join(__dirname, '..', 'data');
// const CERT_PATH = path.join(__dirname, '..', 'certs', 'godaddy-g2.crt.pem');

// Files to download
// original locations updated to github
// https://davidmegginson.github.io/ourairports-data/
//
const files = [
	{ name: 'airports.csv', url: 'https://davidmegginson.github.io/ourairports-data/airports.csv' },
	{ name: 'regions.csv', url: 'https://davidmegginson.github.io/ourairports-data/regions.csv' },
	{ name: 'airport-frequencies.csv', url: 'https://davidmegginson.github.io/ourairports-data/airport-frequencies.csv' },
];

async function downloadFile(url: string, outputPath: string): Promise<void> {
	const response = await axios.get(url, { responseType: 'stream' });

	const writer = fs.createWriteStream(outputPath);
	response.data.pipe(writer);

	return new Promise((resolve, reject) => {
		writer.on('finish', resolve);
		writer.on('error', reject);
	});
}

export async function downloadAirportData() {
	// Ensure data directory exists
	if (!fs.existsSync(DATA_DIR)) {
		fs.mkdirSync(DATA_DIR, { recursive: true });
	}

	console.log('📥 Downloading data from OurAirports.com...');
	for (const file of files) {
		const outputPath = path.join(DATA_DIR, file.name);
		try {
			await downloadFile(file.url, outputPath);
			console.log(`✅ ${file.name} downloaded.`);
		} catch (err) {
			const message = err instanceof Error ? err.message : String(err);
			console.error(`❌ ${file.name}: Failed to download ${file.url}: ${message}`);
		}
	}
	console.log('All ourairports.com files downloaded.');
}
