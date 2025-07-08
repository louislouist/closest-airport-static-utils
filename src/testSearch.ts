// Example usage.

import { loadAirportsFromCsv } from "./airportLoader";
import { findClosestAirports } from "./findClosestAirports";
import { liveATCExistsByICAO } from "./liveATCLocation";
import { searchAirportByCode } from "./searchAirportsByCode";
import { searchAirportsByQuery } from "./searchAirportsByQuery";

function main() {
	const airports = loadAirportsFromCsv();

	const lat = 36.12;
	const lon = -115.17; // Near Las Vegas

	const closest = findClosestAirports(lat, lon, 3, ['large_airport', 'medium_airport']);
	console.log(closest);

	const lax = searchAirportByCode('LAX');
	console.log('Search for LAX:', lax);

	const loadTestName = airports[2].name;
	console.log('loadAirports() name:', loadTestName);
	console.log('\n\n');
}

function example() {
	const closest = findClosestAirports(36.12, -115.17, 3);

	closest.forEach(airport => {
		console.log(`${airport.name} (${airport.iata || airport.icao})`);
		console.log(`Region: ${airport.regionName}`);
		console.log(`Country: ${airport.country}`);
		console.log(`Wikipedia: ${airport.wikipedia}`);
		console.log(`Frequencies:`);
		airport.frequencies?.forEach(f => {
			console.log(`  ${f.type} (${f.description}): ${f.mhz} MHz`);
		});
	});

	console.log('\n\n');
}

function inLiveAtcData() {
	const jfk = "KJFK";
	const lower = "kjfk";
	const rand = "JSJD";
	const las = "JFK";
	const lowLas = "jfk";

	console.log(`Does ICAO "${jfk}" exist on LiveATC?`, liveATCExistsByICAO(jfk));
	console.log(`Does ICAO "${lower}" exist on LiveATC?`, liveATCExistsByICAO(lower));
	console.log(`Does ICAO "${rand}" exist on LiveATC?`, liveATCExistsByICAO(rand));
	console.log(`Does IATA "${las}" exist? on LiveATC?`, liveATCExistsByICAO(las));
	console.log(`Does IATA "${lowLas}" exist on LiveATC?`, liveATCExistsByICAO(lowLas));

	console.log('\n\n');
}


function dbSearch() {
	const closest = findClosestAirports(36.12, -115.17, 3);

	console.log("dbSearch()");
	console.log(`Found ${closest.length} airports`)


	closest.forEach(airport => {
		console.log(`${airport.name} (${airport.iata || airport.icao})`);
		console.log(`Region: ${airport.regionName}`);
		console.log(`Country: ${airport.country}`);
		console.log(`Wikipedia: ${airport.wikipedia}`);
		console.log(`Frequencies:`);
		console.table(airport.frequencies);
		if (airport.regionInfo) {
			console.table(airport.regionInfo);
		}
		console.log('\n')
	});

	const ap = searchAirportByCode('LAX');
	if (ap) {
		console.log(ap);
	}
	console.log('\n\n');
}

function queryFromDb() {
	const airports = searchAirportsByQuery("Las Vegas", 5);

	console.log("queryFromDb()")

	airports.forEach(a => {
		console.log(`${a.name} (${a.iata || a.icao})`);
		console.log(`  ${a.regionInfo?.name}, ${a.country}`);
		console.table(a.regionInfo);
		console.log(`  Frequencies:`);
		a.frequencies?.forEach(f => {
			console.log(`    ${f.type}: ${f.mhz} MHz (${f.description})`);
		});
	});
	console.log('\n\n');
}

function closeAPEmptyArray() {
	// test for all airport types

	// alcovam wy
	const lat = 42.335;
	const lon = -106.4235;

	const closeAirport = findClosestAirports(
		lat,
		lon,
		1,
		['balloonport', 'closed', 'heliport', 'large_airport', 'medium_airport', 'seaplane_base', 'small_airport']
	);
	const closerAirport = findClosestAirports(lat, lon, 1, []);


	console.log(closeAirport[0].name);
	console.log(closerAirport[0].name);
}


main();

example();

inLiveAtcData();

dbSearch();

queryFromDb();

closeAPEmptyArray();
