import { loadAirports } from './airportLoader';
import { findClosestAirports } from './findClosestAirports';
import { searchAirportByCode } from './searchAirportByCode';
import { searchAirportsByQuery } from './searchAirportsByQuery';

const args = process.argv.slice(2);
const airports = loadAirports();

function parseArgs(): {
	lat?: number;
	lon?: number;
	code?: string;
	search?: string;
	count: number;
	preferIcao: boolean;
} {
	let lat: number | undefined;
	let lon: number | undefined;
	let code: string | undefined;
	let search: string | undefined;
	let count = 3;
	let preferIcao = false;

	for (let i = 0; i < args.length; i++) {
		switch (args[i]) {
			case '--lat':
				lat = parseFloat(args[++i]);
				break;
			case '--lon':
				lon = parseFloat(args[++i]);
				break;
			case '--code':
				code = args[++i];
				break;
			case '--search':
				search = args[++i];
				break;
			case '--count':
				count = parseInt(args[++i], 10);
				break;
			case '--icao':
				preferIcao = true;
				break;
			default:
				console.log(`Unknown argument: ${args[i]}`);
				process.exit(1);
		}
	}

	return { lat, lon, code, search, count, preferIcao };
}

function printAirport(airport: any) {
	console.log(`\n🛬 ${airport.name} (${airport.iata || airport.icao})`);
	console.log(`📍 Location: ${airport.city || 'Unknown'}, ${airport.country}`);
	console.log(`🌍 Region: ${airport.regionName}`);
	if (airport.frequencies?.length) {
		console.log(`📡 Frequencies:`);
		airport.frequencies.forEach(f =>
			console.log(`  - ${f.type} (${f.description}): ${f.mhz} MHz`)
		);
	}
}

function main() {
	const { lat, lon, code, search, count, preferIcao } = parseArgs();

	if (code) {
		const airport = searchAirportByCode(code, airports, { preferIcao });
		if (!airport) {
			console.error(`❌ No airport found with code '${code}'`);
			process.exit(1);
		}
		printAirport(airport);
	} else if (search) {
		const results = searchAirportsByQuery(search, airports, count);
		if (results.length === 0) {
			console.error(`❌ No airports found matching '${search}'`);
			process.exit(1);
		}
		console.log(`\n🔍 Fuzzy match results for '${search}':`);
		results.forEach(printAirport);
	} else if (lat != null && lon != null) {
		const closest = findClosestAirports(lat, lon, airports, count);
		console.log(`\n📍 Closest ${count} airports to (${lat}, ${lon}):`);
		closest.forEach(printAirport);
	} else {
		console.error("❌ Please provide either --code, --search, or both --lat and --lon");
		process.exit(1);
	}
}

main();
