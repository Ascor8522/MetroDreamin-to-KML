# MetroDreamin to KML

Small tool to extract MetroDreamin maps into KML files.

[r/ProgrammingRequests](https://discord.gg/h9mJmn8Vpj)
[OP's request](https://discord.com/channels/1120414216352960642/1169807635885850645/1169807642122792991)

## Requirements

- [Deno](https://deno.land/), a modern JavaScript/TypeScript runtime.

## Installation

To install the tool, run the following command:

```bash
deno install --allow-net --allow-write src/index.ts --name metrodreamin
```

This will make the `metrodreamin` command globally available in your terminal.

## Usage

To export the data to a file, run the following command:

```bash
metrodreamin [OPTION]... [URL]...
```

The URL is the full URL of the corresponding MetroDreamin page.

At least one URL is required, but multiple URLs can also be specified, separated
by spaces.

In case multiple URLs are provided, they will be treated separately, and the
data will be exported to separate files.

E.g. the following command will export only the lines from two different maps

```bash
metrodreamin \
	--only-lines \
	https://metrodreamin.com/view/Zm1JMWl2emt6c2VFU1ZicnhLRTJ2WEVvQ3R4MXwy \
	https://metrodreamin.com/view/aWZjOU9tTUxZU09oT3F2d2Y2cUptZVRKRHNJM3wx
```

### Options

- `--only-lines`: Only export the lines, not the stations.
- `--only-stations`: Only export the stations, not the lines.

### Output

The files are named after the map on MetroDreamin and will also contain a
timestamp, as well as a unique number if multiple URLs were provided.

E.g. `Brussels STIB (Public Transport)_20231107183223_0.kml`, where:

- the map is named `Brussels STIB (Public Transport)`,
- the timestamp is `20231107183223`,
- and the unique number is `0`.
