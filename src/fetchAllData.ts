import { downloadAirportData } from "./downloadAirportData";
import { fetchAndSaveATCMarkers } from "./fetchAndSaveLiveATCMarkers";

// removes TSL cert check.
// process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

async function main() {
	await downloadAirportData();
	await fetchAndSaveATCMarkers();

}

main().catch(err => console.error(err));
