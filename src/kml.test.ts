import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { iconToKML, lineToKML, stationToKML } from "./kml.ts";
import type { Line, Station } from "./metrodreamin.ts";
import { stringifyXML } from "./xml.ts";

describe("#lineToKML", () => {

	it("should work", () => {
		const stationIds = [1, 2, 3];
		const line = aLine(1, stationIds);
		const stations = Object.fromEntries(stationIds.map(aStation).map(s => [s.id, s]));

		const actual = stringifyElement("Line", lineToKML(line, stations));

		const expected = `\
<Line id="line-Line 1-placemark">
    <name>Line 1</name>
    <Style id="line-Line 1-style">
        <LineStyle id="line-Line 1-linestyle">
            <color>ff0000FF</color>
            <colorMode>normal</colorMode>
            <width>5</width>
        </LineStyle>
    </Style>
    <LineString id="line-Line 1-linestring">
        <tessellate>1</tessellate>
        <altitudeMode>clampToGround</altitudeMode>
        <coordinates>0,0 0,0 0,0</coordinates>
    </LineString>
</Line>`;

		assert.equal(actual, expected);
	});

});

describe("#stationToKML", () => {

	it("should work", () => {
		const station = aStation(1);
		const line = aLine(1, [1]);

		const actual = stringifyElement("Station", stationToKML(station, line));

		const expected = `\
<Station id="station-Station 1-placemark">
    <name>Station 1</name>
    <Style id="station-Station 1-style">
        <IconStyle id="station-Station 1-icon-style">
            <color>ff0000FF</color>
            <colorMode>normal</colorMode>
        </IconStyle>
        <Icon>
            <href>http://maps.google.com/mapfiles/kml/pushpin/wht-pushpin.png</href>
        </Icon>
    </Style>
    <Point id="station-Station 1-point">
        <altitudeMode>clampToGround</altitudeMode>
        <coordinates>0,0</coordinates>
    </Point>
</Station>`;

		assert.equal(actual, expected);
	});
});

describe("#iconToKML", () => {

	it("should work", () => {
		const actual = stringifyElement("Root", iconToKML());

		const expected = `\
<Root>
    <Icon>
        <href>http://maps.google.com/mapfiles/kml/pushpin/wht-pushpin.png</href>
    </Icon>
</Root>`;

		assert.equal(actual, expected);
	});
});

describe("#stringifyXML", () => {

	it("should serialize KML and escape XML text", () => {
		const actual = stringifyXML({
			"@version": "1.0",
			"@encoding": "UTF-8",
			"@standalone": "yes",
			"~name": "~xml",
			"kml": {
				"@xmlns": "http://www.opengis.net/kml/2.2",
				"Document": { "name": "A & B" },
			},
		});

		assert.equal(actual, `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
    <Document>
        <name>A &amp; B</name>
    </Document>
</kml>`);
	});
});

function stringifyElement(name: string, value: Record<string, unknown>): string {
	return stringifyXML({ [name]: value }).replace(/^<\?xml[^>]*\?>\n/, "");
}

function aLine(id: number, stationIds: number[]): Line {
	return {
		id: `${id}`,
		name: `Line ${id}`,
		color: "#FF0000",
		stationIds: stationIds.map(id => `${id}` as const),
		mode: undefined,
		waypointOverrides: undefined,
	};
}

function aStation(id: number): Station {
	return {
		id: `${id}`,
		name: `Station ${id}`,
		info: undefined,
		lat: 0,
		lng: 0,
		isWaypoint: undefined,
	};
}
