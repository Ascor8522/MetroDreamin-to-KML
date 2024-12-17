import { DOMParser } from "jsr:@b-fuze/deno-dom";

export const urlRegex = /^https:\/\/metrodreamin\.com\/(?:view|edit)\/((?:[a-zA-Z0-9=]|%3D){40,})$/;

export function isValidURL(url: string): boolean {
	return urlRegex.test(url);
}

export function extractMapId(url: string): string {
	const match = url.match(urlRegex);
	if(!match) throw new Error(`Invalid URL: ${url}`);
	return match[1];
}

export function getData(mapId: string): Promise<MetroDreamin> {
	return fetch(`https://metrodreamin.com/view/${mapId}`)
		.then(res => {
			if(!res.ok) throw new Error(`Invalid response: ${res.status} ${res.statusText}`);
			return res.text();
		})
		.then(html => new DOMParser()
			.parseFromString(html, "text/html")!
			.querySelector("#__NEXT_DATA__")!
			.innerHTML)
		.then(json => JSON.parse(json) as MetroDreamin);
}

export interface MetroDreamin {
	appGip: boolean;
	buildId: string;
	gssp: boolean;
	isFallback: boolean;
	page: string;
	props: Props;
	query: Query;
	scriptLoader: unknown[];
}

export interface Props {
	__N_SSP: boolean;
	pageProps: PageProps;
}

export interface PageProps {
	fullSystem: FullSystem;
	ownerDocData: OwnerDocData;
	systemDocData: SystemDocData;
	thumbnail: string;
}

export interface FullSystem {
	map: Map;
	meta: Meta;
}

export interface Map {
	caption: string;
	interchanges: Record<number, Interchange>;
	lines?: Record<number, Line>;
	stations?: Record<number, Station>;
	title: string;
}

export interface Interchange {
	id: `${number}`;
	stationIds: Station["id"][];
}

export interface Line {
	color: string;
	id: `${number}`;
	name: string;
	stationIds: Station["id"][];
	mode?: Mode;
	waypointOverrides?: string[];
}

export enum Mode {
	Bus = "BUS",
	Tram = "TRAM",
}

export interface Station {
	id: `${number}`;
	info?: Info;
	lat: number;
	lng: number;
	name?: string;
	isWaypoint?: boolean;
}

export interface Info {
	areaByUsage: AreaByUsage;
	buildingArea: number;
	densityScore: number;
	numNearbyBuildings: number;
	weightedLevel?: number;
}

export interface AreaByUsage {
	civic: number;
	commercial: number;
	hotel: number;
	industrial: number;
	"other/unknown": number;
	park: number;
	residential: number;
}

export interface Meta {
	nextInterchangeId: Interchange["id"];
	nextLineId: Line["id"];
	nextStationId: Station["id"];
	systemNumStr: string;
}

export interface OwnerDocData {
	creationDate: number;
	displayName: string;
	email: string;
	lastLogin: number;
	lightMode: boolean;
	lowPerformance: boolean;
	systemsCreated: number;
	userId: string;
}

export interface SystemDocData {
	ancestors: unknown[];
	avgDist: number;
	avgSpacing: number;
	caption: string;
	centroid: Centroid;
	creationDate: number;
	descendantsCount: number;
	directDescendantsCount: number;
	geohash: string;
	isPrivate: boolean;
	keywords: string[];
	lastUpdated: number;
	level: string;
	maxDist: number;
	meta: Meta;
	numInterchanges: number;
	numLines: number;
	numStations: number;
	numWaypoints: number;
	stars: number;
	systemId: string;
	systemNumStr: string;
	title: string;
	trackLength: number;
	userId: string;
}

export interface Centroid {
	lat: number;
	lng: number;
}

export interface Query {
	systemId: string;
}
