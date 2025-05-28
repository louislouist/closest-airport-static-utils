// Example usage.

import { loadAirports } from "./airportLoader";
import { findClosestAirports } from "./findClosestAirports";
import { liveATCExistsByICAO } from "./liveATCLocation";
import { searchAirportByCode } from "./searchAirportByCode";


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



main();

example();

inLiveAtc();

