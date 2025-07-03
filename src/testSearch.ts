// Example usage.

import { loadAirports } from "./airportLoader";
import { findClosestAirports } from "./findClosestAirports";
import { liveATCExistsByICAO } from "./liveATCLocation";
import { searchAirportByCode } from "./searchAirportByCode";
import { findClosestAirportsFromDb } from "./findClosestDb";
import { searchAirportByCodeDb } from "./searchAirportByCodeDb";
import { searchAirportsByQueryDb } from "./searchAirportsByQuery";

function main() {
	const airports = loadAirports();

	const lat = 36.12;
	const lon = -115.17; // Near Las Vegas

	const closest = findClosestAirports(lat, lon, airports, 3, ['large_airport', 'medium_airport']);
	console.log(closest);

	const lax = searchAirportByCode('LAX', airports);
	console.log('Search for LAX:', lax);
}

function example() {
	const closest = findClosestAirports(36.12, -115.17, loadAirports(), 3);

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
}

function inLiveAtc() {
	const jfk = "KJFK";
	const lower = "kjfk";
	const rand = "JSJD";

	console.log(`Does ICAO "${jfk}" exist?`, liveATCExistsByICAO(jfk));
	console.log(`Does ICAO "${lower}" exist?`, liveATCExistsByICAO(lower));
	console.log(`Does ICAO "${rand}" exist?`, liveATCExistsByICAO(rand));
}


function dbSearch() {
	const closest = findClosestAirportsFromDb(36.12, -115.17, 3);

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

	const ap = searchAirportByCodeDb('LAX');
	if (ap) {
		console.log(ap);
	}


}

function queryFromDb() {
	const airports = searchAirportsByQueryDb("Las Vegas", 5);

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
}


main();

example();

inLiveAtc();

dbSearch();

queryFromDb();
