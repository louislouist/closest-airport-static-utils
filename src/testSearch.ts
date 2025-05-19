// Example usage.

import { loadAirports } from "./airportLoader";
import { findClosestAirports } from "./findClosestAirports";
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

main();
