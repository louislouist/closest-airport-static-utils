import fs from 'fs';
import path from 'path';
import https from 'https';

const DATA_DIR = path.join(__dirname, '..', 'data');

const files = [
	{ name: 'airports.csv', url: 'https://ourairports.com/data/airports.csv' },
	{ name: 'regions.csv', url: 'https://ourairports.com/data/regions.csv' },
	{ name: 'airport-frequencies.csv', url: 'https://ourairports.com/data/airport-frequencies.csv' },
];

function downloadFile(url: string, outputPath: string): Promise<void> {
	return new Promise((resolve, reject) => {
		const file = fs.createWriteStream(outputPath);
		https.get(url, response => {
			if (response.statusCode !== 200) {
				return reject(new Error(`Failed to get '${url}' (${response.statusCode})`));
			}
			response.pipe(file);
			file.on('finish', () => {
				file.close();
				console.log(`✅ Downloaded ${path.basename(outputPath)}`);
				resolve();
			});
		}).on('error', err => {
			fs.unlinkSync(outputPath);
			reject(err);
		});
	});
}

export async function downloadAirportData() {
	// Ensure the ./data directory exists
	if (!fs.existsSync(DATA_DIR)) {
		fs.mkdirSync(DATA_DIR, { recursive: true });
	}

	console.log('📥 Downloading data from OurAirports.com...');
	for (const file of files) {
		const outputPath = path.join(DATA_DIR, file.name);
		try {
			await downloadFile(file.url, outputPath);
		} catch (err) {
			console.error(`❌ Failed to download ${file.name}:`, err);
		}
	}
	console.log('🎉 All files downloaded.');
}
