export interface Airport {
	id: string;
	name: string;
	city: string;
	country: string;
	iata: string;
	icao: string;
	lat: number;
	lon: number;
	type: string;
	distance?: number;
	wikipedia?: string;
	home_link?: string;
	regionCode?: string;
	regionName?: string;
	regionInfo?: Region;
	frequencies?: Frequency[];
}

export interface Frequency {
	type: string;
	description: string;
	mhz: number;
}

export interface Region {
	id: number;
	code: string;
	local_code: string;
	name: string;
	continent: string;
	iso_country: string;
	wikipedia_link?: string;
	keywords?: string;
}

export function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
	const R = 6371; // Earth radius in kilometers
	const toRad = (deg: number) => deg * Math.PI / 180;

	const dLat = toRad(lat2 - lat1);
	const dLon = toRad(lon2 - lon1);

	const a = Math.sin(dLat / 2) ** 2 +
		Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
		Math.sin(dLon / 2) ** 2;

	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	return R * c;
}
