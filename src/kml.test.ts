import { stringify } from "jsr:@libs/xml";
import { assertEquals } from "jsr:@std/assert@^1.0.7";
import { describe, it } from "jsr:@std/testing/bdd";
import { iconToKML, lineToKML, stationToKML } from "./kml.ts";
import { Line, Station } from "./metrodreamin.ts";

describe("#lineToKML", () => {

	it("should work", () => {
		const stationIds = [1, 2, 3];
		const line = aLine(1, stationIds);
		const stations = Object.fromEntries(stationIds.map(aStation).map(s => [s.id, s]));

		const actual = stringify({
			"~name": "~xml",
			"Line": lineToKML(line, stations),
		});

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

		assertEquals(actual, expected);
	});

});

describe("#stationToKML", () => {

	it("should work", () => {
		const station = aStation(1);
		const line = aLine(1, [1]);

		const actual = stringify({
			"~name": "~xml",
			"Station": stationToKML(station, line),
		});

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

		assertEquals(actual, expected);
	});
});

describe("#iconToKML", () => {

	it("should work", () => {
		const actual = stringify({
			"~name": "~xml",
			"Root": iconToKML(),
		});

		const expected = `\
<Root>
  <Icon>
    <href>http://maps.google.com/mapfiles/kml/pushpin/wht-pushpin.png</href>
  </Icon>
</Root>`;

		assertEquals(actual, expected);
	});
});

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
