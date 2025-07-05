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

export interface LiveAtcData {
	name: string;
	url: string;
	lat: string;
	lng: string;
}
