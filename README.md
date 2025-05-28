# Closest Airport Static Utils

A TypeScript library for finding the closest airports to a given location using haversine distance calculations.

## Installation

### From GitHub (Recommended for development)

#### Install directly from GitHub
```bash
npm install git+https://github.com/louislouist/closest-airport-static-utils.git
cd node_modules/closest-airport-static-utils
npm run build
npm fetch-data
npm run test
```
Check to insure fetch-data is successful for all files. 
If any of the tests fail, you may want to re-evaluate if something went wrong with fetch-data.

#### Or with a specific branch/tag
```bash
npm install git+https://github.com/louislouist/closest-airport-static-utils.git#main
```

#### Or clone and link for development (untested)
```bash
git clone https://github.com/louislouist/closest-airport-static-utils.git
cd closest-airport-static-utils
npm install
npm run build
npm link
```

# Then in your project
npm link closest-airport-static-utils

## Usage

### Basic Example

```typescript
import { 
  findClosestAirports, 
  loadAirports, 
  searchAirportByCode,
  haversineDistance,
  liveATCExistsByICAO,
  type Airport 
} from 'closest-airport-static-utils';


async function example() {
  // Load airport data (you'll need to provide your own CSV file)
  const airports = await loadAirports('./path/to/airports.csv');
  
  // Find 5 closest airports to New York City
  const nyc = { lat: 40.7128, lon: -74.0060 };
  const closest = findClosestAirports(
    nyc.lat, 
    nyc.lon, 
    airports, 
    5,
    ['large_airport', 'medium_airport'] // optional filter
  );
  
  console.log('Closest airports to NYC:', closest);
  
  // Search for a specific airport
  const jfk = searchAirportByCode('JFK', airports);
  console.log('JFK Airport:', jfk);
  
  // Calculate distance between two points
  const distance = haversineDistance(40.7128, -74.0060, 34.0522, -118.2437);
  console.log('Distance NYC to LA:', distance, 'km');

  // Check if airport has a LiveATC feed.
	const jfk = "KJFK";
	const lower = "kjfk";
	const rand = "JSJD";

	console.log(`Does ICAO "${jfk}" exist?`, liveATCExistsByICAO(jfk));
	console.log(`Does ICAO "${lower}" exist?`, liveATCExistsByICAO(lower));
	console.log(`Does ICAO "${rand}" exist?`, liveATCExistsByICAO(rand));}

}

example();
```

### Import Options

```typescript
// Import specific functions
import { findClosestAirports } from 'closest-airport-static-utils';

// Import everything
import * as AirportUtils from 'closest-airport-static-utils';
const closest = AirportUtils.findClosestAirports(...);

// Import types
import { Airport } from 'closest-airport-static-utils';
```
