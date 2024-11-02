import { stringify } from "jsr:@libs/xml";
import { parseArgs } from "jsr:@std/cli";
import { format } from "jsr:@std/datetime";
import * as log from "jsr:@std/log";
import { basename } from "jsr:@std/path";
import sanitize from "npm:sanitize-filename";

import { metrodreaminToKML } from "./kml.ts";
import { exitError, setupLogger } from "./log.ts";
import { extractMapId, getData, isValidURL } from "./metrodreamin.ts";

function main() {
	const { onlyLines, onlyStations, _, ...rest } = parseArgs(Deno.args);

	Object
		.keys(rest)
		.forEach((arg: unknown) => log.warn(`Invalid option: "${arg}". Skipping...`));
	const urls = _
		.map(url => url.toString())
		.filter(url => {
			const isValid = isValidURL(url);
			if(!isValid) log.warn(`Invalid URL: "${url}". Skipping...`);
			return isValid;
		})
		.map(extractMapId);
	if(!urls.length) exitError("No valid url provided.");
	if(onlyLines && onlyStations) exitError("Cannot use both --only-lines and --only-stations options at the same time.");

	const promises = urls.map(async (url, i) => {
		const metrodreaminObj = await getData(url);
		const metrodreaminKML = metrodreaminToKML(metrodreaminObj, { onlyLines, onlyStations });
		const xml = stringify(metrodreaminKML, { format: { indent: "    " } });
		const { title } = metrodreaminObj.props.pageProps.systemDocData;
		const timestamp = format(new Date(), "yyyyMMddHHmmss");
		const filename = `./${sanitize(title) || "untitled"}_${timestamp}_${i}.kml`;
		return Deno.writeTextFile(basename(filename), xml);
	});

	return Promise
		.all(promises)
		.catch((err: Error) => exitError(err.message));
}

setupLogger();
main();
