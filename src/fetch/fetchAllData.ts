import { runImportCsvToDb } from '../db/importCsvToDb';
import { downloadAirportData } from './downloadAirportData';
import { fetchATCMarkersPuppeteer } from './fetchATCMarkersPuppeteer';

// removes TSL cert check.
// process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

async function main() {
        await downloadAirportData();
        await fetchATCMarkersPuppeteer();
        await runImportCsvToDb();
}

main().catch((err) => console.error(err));
