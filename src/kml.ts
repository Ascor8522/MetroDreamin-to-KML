import { xml_document, xml_node } from "jsr:@libs/xml";
import { Line, MetroDreamin, Mode, Station } from "./metrodreamin.ts";

interface ToKMLOptions {
	onlyLines: boolean;
	onlyStations: boolean;
}

export function metrodreaminToKML(metroDreamin: MetroDreamin, { onlyLines, onlyStations }: ToKMLOptions): xml_document {
	const longitude = metroDreamin.props.pageProps.systemDocData.centroid.lng;
	const latitude = metroDreamin.props.pageProps.systemDocData.centroid.lat;

	const lines = metroDreamin.props.pageProps.fullSystem.map.lines;
	const linesArray = Object.values(lines);
	const stations = metroDreamin.props.pageProps.fullSystem.map.stations;
	const _stationsArray = Object.values(stations);

	const linesKML = linesArray
		.map(line => lineToKML(line, stations));
	const stationsKML = linesArray
		.map(line => ({
			"@id": `line-station-${line.name}-folder`,
			"name": line.name,
			"Placemark": [
				...line
					.stationIds
					.map(id => stations[id])
					.filter(({ isWaypoint }) => !isWaypoint)
					.map(station => stationToKML(station, line)),
			],
		}));

	const doLines = !onlyStations;
	const doStations = !onlyLines;

	return {
		"@version": "1.0",
		"@encoding": "UTF-8",
		"@standalone": "yes",

		"~name": "~xml",
		"~children": [],
		"#text": "",

		"kml": {
			"@xmlns": "http://www.opengis.net/kml/2.2",
			"@xmlns:gx": "http://www.google.com/kml/ext/2.2",
			"@xmlns:kml": "http://www.opengis.net/kml/2.2",
			"@xmlns:atom": "http://www.w3.org/2005/Atom",
			"Document": {
				"@id": "document",
				"LookAt": {
					"@id": "lookat",
					"longitude": longitude,
					"latitude": latitude,
					"range": 20000,
				},
				"Folder": [
					...(doLines ? [{
						"@id": "lines-folder",
						"name": "Lines",
						"Placemark": linesKML,
					}] : []),
					...(doStations ? [{
						"@id": "stations-folder",
						"name": "Stations",
						"Folder": stationsKML,
					}] : []),
				],
			},
		},
	};
}

export function lineToKML({ name, color, stationIds, mode }: Line, stations: Record<`${number}`, Station>): xml_node {
	const modeWidths = {
		[Mode.Bus]: 3,
		[Mode.Tram]: 4,
	};

	return {
		"@id": `line-${name}-placemark`,
		"name": name,
		"Style": {
			"@id": `line-${name}-style`,
			"LineStyle": {
				"@id": `line-${name}-linestyle`,
				"color": colorToKML(color, true),
				"colorMode": "normal",
				"width": mode ? modeWidths[mode] ?? 5 : 5,
			},
		},
		"LineString": {
			"@id": `line-${name}-linestring`,
			"tessellate": 1,
			"altitudeMode": "clampToGround",
			"coordinates": stationIds
				.map(id => stations[id])
				.map(({ lat, lng }) => `${lng},${lat}`)
				.join(" "),
		},
	} as unknown as xml_node;
}

export function stationToKML({ name, lat, lng }: Station, { color }: Line): xml_node {
	return {
		"@id": `station-${name}-placemark`,
		"name": name,
		"Style": {
			"@id": `station-${name}-style`,
			"IconStyle": {
				"@id": `station-${name}-icon-style`,
				"color": colorToKML(color, true),
				"colorMode": "normal",
			},
			...iconToKML(),
		},
		"Point": {
			"@id": `station-${name}-point`,
			"altitudeMode": "clampToGround",
			"coordinates": `${lng},${lat}`,
		},
	} as unknown as xml_node;
}

export function iconToKML(): xml_node {
	return {
		"Icon": {
			// Need to use a white pushpin because the default pushpin is yellow and it messes with the color.
			"href": "http://maps.google.com/mapfiles/kml/pushpin/wht-pushpin.png",
		},
	} as unknown as xml_node;
};

export function colorToKML(rgb: string, alpha = false) {
	const [_, r, g, b] = rgb.match(/#(..)(..)(..)/)!;
	return `${alpha ? "ff" : ""}${b}${g}${r}`;
};
