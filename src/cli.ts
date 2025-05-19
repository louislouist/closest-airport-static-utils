#!/usr/bin/env node

import { loadAirports } from './airportLoader';
import { findClosestAirports } from './findClosestAirports';
import { Frequency } from './haversineDistance';
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
	json: boolean;
} {
	let lat: number | undefined;
	let lon: number | undefined;
	let code: string | undefined;
	let search: string | undefined;
	let count = 3;
	let preferIcao = false;
	let json = false;

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
			case '--json':
				json = true;
				break;
			case '--help':
				helpInfo();
				process.exit(0);
			default:
				console.log(`Unknown argument: ${args[i]}`);
				process.exit(1);
		}
	}

	return { lat, lon, code, search, count, preferIcao, json };
}

function printAirport(airport: any) {
	console.log(`\n🛬 ${airport.name} (${airport.iata || airport.icao})`);
	console.log(`📍 Location: ${airport.city || 'Unknown'}, ${airport.country}`);
	console.log(`🌍 Region: ${airport.regionName}`);
	if (airport.frequencies?.length) {
		console.log(`📡 Frequencies:`);
		airport.frequencies.forEach((f: Frequency) =>
			console.log(`  - ${f.type} (${f.description}): ${f.mhz} MHz`)
		);
	}
}

function helpInfo() {
	console.log(`
✈️  Airport CLI - Usage Guide

Usage:
  node cli.js [options]

Options:
  --lat <number>       Latitude to search from (requires --lon)
  --lon <number>       Longitude to search from (requires --lat)
  --code <string>      IATA or ICAO airport code to look up
  --search <query>     Fuzzy search for airports by name, city, or code
  --count <number>     Number of results to return (default: 3)
  --icao               Prefer ICAO codes when printing airport codes
  --json               Output results in JSON format
  --help               Show this help message

Examples:
  node cli.js --lat 34.05 --lon -118.25
  node cli.js --code LAX
  node cli.js --search "los angeles"
  node cli.js --search "new york" --json
  node cli.js --code JFK --icao
`);
}


function main() {
	const { lat, lon, code, search, count, preferIcao, json } = parseArgs();

	if (code) {
		const airport = searchAirportByCode(code, airports, { preferIcao });
		if (!airport) {
			console.error(`❌ No airport found with code '${code}'`);
			process.exit(1);
		}
		if (json) {
			console.log(JSON.stringify(airport, null, 2));
		} else {
			printAirport(airport);
		}
	} else if (search) {
		const results = searchAirportsByQuery(search, airports, count);
		if (results.length === 0) {
			console.error(`❌ No airports found matching '${search}'`);
			process.exit(1);
		}
		if (json) {
			console.log(JSON.stringify(results, null, 2));
		} else {
			console.log(`\n🔍 Fuzzy match results for '${search}':`);
			results.forEach(printAirport);
		}
	} else if (lat != null && lon != null) {
		const closest = findClosestAirports(lat, lon, airports, count);
		if (json) {
			console.log(JSON.stringify(closest, null, 2));
		} else {
			console.log(`\n📍 Closest ${count} airports to (${lat}, ${lon}):`);
			closest.forEach(printAirport);
		}
	} else {
		console.error("❌ Please provide either --code, --search, or both --lat and --lon");
		process.exit(1);
	}
}


main();
