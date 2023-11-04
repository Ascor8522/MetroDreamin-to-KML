import { udocument } from "xml/utils/types.ts";
import { Line, MetroDreamin, Mode, Station } from "./metrodreamin.ts";

const icon = {
	"Icon": {
		// Need to use a white pushpin because the default pushpin is yellow and it messes with the color.
		"href": "http://maps.google.com/mapfiles/kml/pushpin/wht-pushpin.png",
	},
};

export function metrodreaminToKML(metroDreamin: MetroDreamin): udocument {
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

	return {
		"xml": {
			"@version": "1.0",
			"@encoding": "UTF-8",
		},
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
					{
						"@id": "lines-folder",
						"name": "Lines",
						"Placemark": linesKML,
					},
					{
						"@id": "stations-folder",
						"name": "Stations",
						"Folder": stationsKML,
					},
				],
			},
		},
	};
}

export function lineToKML({ name, color, stationIds, mode }: Line, stations: Record<`${number}`, Station>) {
	return {
		"@id": `line-${name}-placemark`,
		"name": name,
		"Style": {
			"@id": `line-${name}-style`,
			"LineStyle": {
				"@id": `line-${name}-linestyle`,
				"color": colorToKML(color, true),
				"colorMode": "normal",
				"width":
					mode === Mode.Bus ? 3 :
					mode === Mode.Tram ? 4 :
					5,
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
	};
}

export function stationToKML({ name, lat, lng }: Station, { color }: Line) {
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
			...icon,
		},
		"Point": {
			"@id": `station-${name}-point`,
			"altitudeMode": "clampToGround",
			"coordinates": `${lng},${lat}`,
		},
	};
}

export function colorToKML(rgb: string, alpha = false) {
	const [_, r, g, b] = rgb.match(/#(..)(..)(..)/)!;
	return `${alpha ? "ff" : ""}${b}${g}${r}`;
};
