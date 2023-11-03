# MetroDreamin to KML

Small tool to extract MetroDreamin maps into KML files.

## Requirements

- [Deno](https://deno.land/)

## Usage

To export the data to a file, run the following command:

```bash
deno run --allow-net --allow-write ./src/index.ts [...url]
```

The URL is the full URL of the corresponding MetroDreamin page.
E.g `https://metrodreamin.com/view/Zm1JMWl2emt6c2VFU1ZicnhLRTJ2WEVvQ3R4MXwy`

At least one URL is required, tho multiple URLs can be specified, separated by a space.

In case multiple URLs are provided, they will be treated separately, and the data will be exported to separate files.

The files are named after the map on MetroDreamin.
E.g. `Brussels STIB (Public Transport).kml`.
