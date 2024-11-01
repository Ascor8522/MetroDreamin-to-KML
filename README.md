![banner](./.github/banner.png)

# MetroDreamin' to KML ![Deno Badge](https://img.shields.io/badge/Uses_Deno-0B0D11?logo=deno)

A small tool to extract [MetroDreamin'](https://metrodreamin.com/) maps into KML
files.

> [!NOTE]
> See
> [OP's request](https://discord.com/channels/1120414216352960642/1169807635885850645/1169807642122792991)
> on the [r/ProgrammingRequests Discord server](https://discord.gg/h9mJmn8Vpj).

## Installation

### Requirements

- [Deno 2](https://deno.land/), a modern JavaScript/TypeScript runtime.
- An internet connection, to fetch the data from MetroDreamin'.

### Installation

To install MetroDreamin' to KML on your machine, run the following command:

```bash
deno install -g -n metrodreamin-to-kml -N -W https://raw.githubusercontent.com/Ascor8522/MetroDreamin-to-KML/master/src/index.ts
```

This will make the `metrodreamin-to-kml` command globally available on your
machine.

> [!NOTE]
> If you already have a previous version of `metrodreamin-to-kml` installed and
> wish to upgrade to the lates version, add the `--force` flag to the previous
> command.

## Usage & Command Reference

The global syntax for the command is as follows:

```bash
metrodreamin-to-kml [OPTIONS]... [URLS]...
```

### Options

You can use the following options:

- `--only-lines`: Only export the lines, not the stations.
- `--only-stations`: Only export the stations, not the lines.

If neither `--only-lines` nor `--only-stations` is provided, then both lines and
stations will be exported.

### URLs

The URL is the full URL of the corresponding MetroDreamin' page.

At least one URL is required, but multiple URLs can also be specified, separated
by spaces.

In case multiple URLs are provided, they will be treated separately, and the
data will be exported to separate files.

### Output

The files are named after the map on MetroDreamin' and will also contain a
timestamp, as well as a unique number if multiple URLs were provided.

### Examples

The following command will export only the lines from two different maps:

```bash
metrodreamin-to-kml \
	--only-lines \
	https://metrodreamin.com/view/Zm1JMWl2emt6c2VFU1ZicnhLRTJ2WEVvQ3R4MXwy \
	https://metrodreamin.com/view/aWZjOU9tTUxZU09oT3F2d2Y2cUptZVRKRHNJM3wx
```

The example command in the previous section will output

- a file called `Brussels STIB (Public Transport)_20241101170818_0.kml`, where:
  - The map is named `Brussels STIB (Public Transport)`
  - The timestamp is `20241101170818`
  - The unique number is `0`
- a file called `Future New York City Subway (METRO AREA)_20241101170818_1.kml`,
  where:
  - The map is named `Future New York City Subway (METRO AREA)`
  - The timestamp is `20241101170818`
  - The unique number is `1`
