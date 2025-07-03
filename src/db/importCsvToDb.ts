import { getDb } from "./db";
import fs from "fs";
import path from "path";
import { parse } from "csv-parse/sync";

const DATA_DIR = path.resolve(__dirname, "../../data");
const db = getDb();

function setupSchema() {
	//
	// Clean up data before adding to an existing db
	db.exec(`
		DROP TABLE IF EXISTS airports;
		DROP TABLE IF EXISTS airport_frequencies; 
		DROP TABLE IF EXISTS regions;
	`);

	db.exec(`
		CREATE TABLE IF NOT EXISTS airports (
			id INTEGER PRIMARY KEY,
			ident TEXT,
			type TEXT,
			name TEXT,
			latitude_deg REAL,
			longitude_deg REAL,
			elevation_ft INTEGER,
			continent TEXT,
			iso_country TEXT,
			iso_region TEXT,
			municipality TEXT,
			scheduled_service TEXT,
			icao_code TEXT,
			iata_code TEXT,
			gps_code TEXT,
			local_code TEXT,
			home_link TEXT,
			wikipedia_link TEXT,
			keywords TEXT
		);

		CREATE TABLE IF NOT EXISTS airport_frequencies (
			id INTEGER PRIMARY KEY,
			airport_ref INTEGER,
			airport_ident TEXT,
			type TEXT,
			description TEXT,
			frequency_mhz REAL
		);

		CREATE TABLE IF NOT EXISTS regions (
			id INTEGER PRIMARY KEY,
			code TEXT,
			local_code TEXT,
			name TEXT,
			continent TEXT,
			iso_country TEXT,
			wikipedia_link TEXT,
			keywords TEXT
		);
	`);
}

function importCSV(filePath: string) {
	const csvContent = fs.readFileSync(filePath);
	return parse(csvContent, {
		columns: true,
		skip_empty_lines: true,
		trim: true,
	});
}

function importAirports() {
	const rows = importCSV(path.join(DATA_DIR, "airports.csv"));
	const stmt = db.prepare(`
		INSERT INTO airports (
			id, ident, type, name, latitude_deg, longitude_deg, elevation_ft,
			continent, iso_country, iso_region, municipality, scheduled_service,
			icao_code, iata_code, gps_code, local_code, home_link, wikipedia_link, keywords
		) VALUES (
			@id, @ident, @type, @name, @latitude_deg, @longitude_deg, @elevation_ft,
			@continent, @iso_country, @iso_region, @municipality, @scheduled_service,
			@icao_code, @iata_code, @gps_code, @local_code, @home_link, @wikipedia_link, @keywords
		)
	`);
	const insertMany = db.transaction((rows: any[]) => {
		for (const row of rows) stmt.run(row);
	});
	insertMany(rows);
}

function importFrequencies() {
	const rows = importCSV(path.join(DATA_DIR, "airport-frequencies.csv"));
	const stmt = db.prepare(`
		INSERT INTO airport_frequencies (
			id, airport_ref, airport_ident, type, description, frequency_mhz
		) VALUES (
			@id, @airport_ref, @airport_ident, @type, @description, @frequency_mhz
		)
	`);
	const insertMany = db.transaction((rows: any[]) => {
		for (const row of rows) stmt.run(row);
	});
	insertMany(rows);
}

function importRegions() {
	const rows = importCSV(path.join(DATA_DIR, "regions.csv"));
	const stmt = db.prepare(`
		INSERT INTO regions (
			id, code, local_code, name, continent, iso_country, wikipedia_link, keywords
		) VALUES (
			@id, @code, @local_code, @name, @continent, @iso_country, @wikipedia_link, @keywords
		)
	`);
	const insertMany = db.transaction((rows: any[]) => {
		for (const row of rows) stmt.run(row);
	});
	insertMany(rows);
}

export async function runImportCsvToDb() {
	console.log("Setting up schema...");
	setupSchema();

	console.log("Importing airports...");
	importAirports();

	console.log("Importing frequencies...");
	importFrequencies();

	console.log("Importing regions...");
	importRegions();

	console.log("✅ Import complete.");
}
