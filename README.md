![Deno Badge](https://img.shields.io/badge/Uses_Deno-0B0D11?logo=deno)
![GitHub last commit](https://img.shields.io/github/last-commit/Ascor8522/MetroDreamin-to-KML)

# MetroDreamin to KML

Small tool to extract [MetroDreamin](https://metrodreamin.com/) maps into KML files.

See [OP's request](https://discord.com/channels/1120414216352960642/1169807635885850645/1169807642122792991)
on the [r/ProgrammingRequests Discord server](https://discord.gg/h9mJmn8Vpj).

## 1. Requirements

- [Deno](https://deno.land/), a modern JavaScript/TypeScript runtime.

## 2. Installation

Once you have Deno installed, you can install the tool to make it globally available.

You are free to choose between two installation methods.

### Without cloning the repository

This method is preferred if you just want to use the tool and don't want to modify it.

Run the following command:

```bash
deno install --allow-net --allow-write https://raw.githubusercontent.com/Ascor8522/MetroDreamin-to-KML/master/src/index.ts --name metrodreamin
```

This will make the `metrodreamin` command globally available in your terminal.

### With cloning the repository

This method is preferred if you want to contribute to the tool and make changes to it.

Run the following command:

```bash
deno install --allow-net --allow-write src/index.ts --name metrodreamin
```

## 3. Usage

To export the data to a file, run the following command:

```bash
metrodreamin [OPTION]... [URL]...
```

- The URL is the full URL of the corresponding MetroDreamin page.
- At least one URL is required, but multiple URLs can also be specified, separated
by spaces.
- In case multiple URLs are provided, they will be treated separately, and the
data will be exported to separate files.

### Options

You can use the following options:

- `--only-lines`: Only export the lines, not the stations.
- `--only-stations`: Only export the stations, not the lines.

### Example

The following command will export only the lines from two different maps:

```bash
metrodreamin \
	--only-lines \
	https://metrodreamin.com/view/Zm1JMWl2emt6c2VFU1ZicnhLRTJ2WEVvQ3R4MXwy \
	https://metrodreamin.com/view/aWZjOU9tTUxZU09oT3F2d2Y2cUptZVRKRHNJM3wx
```

## 4. Output

The files are named after the map on MetroDreamin and will also contain a
timestamp, as well as a unique number if multiple URLs were provided.

### Example

The example command in the previous section will output a file called `Brussels STIB (Public Transport)_20231107183223_0.kml`, where:

- The map is named `Brussels STIB (Public Transport)`
- The timestamp is `20231107183223`
- The unique number is `0`
