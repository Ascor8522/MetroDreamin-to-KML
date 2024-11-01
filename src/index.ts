import { stringify } from "jsr:@libs/xml";
import { format } from "jsr:@std/datetime";
import { brightBlue, red, underline } from "jsr:@std/fmt/colors";
import sanitize from "npm:sanitize-filename";
import { metrodreaminToKML } from "./kml.ts";
import { getData } from "./metrodreamin.ts";

function main() {
	const { args } = Deno;

	const { onlyLines, onlyStations, urls } = args.reduce(({ onlyLines, onlyStations, urls }, arg) => {
		const urlRegex = new RegExp("https://metrodreamin.com/view/[a-zA-Z0-9]{40,40}", "g");
		switch(true) {
			case arg === "--only-lines": onlyLines = true; break;
			case arg === "--only-stations": onlyStations = true; break;
			case urlRegex.test(arg): urls.push(arg); break;
			default: console.warn(`Invalid argument: "${arg}". Skipping...`);
		}
		return { onlyLines, onlyStations, urls };
	}, { onlyLines: false, onlyStations: false, urls: [] as string[] });

	if(!urls.length) exitError("No url provided.");
	if(onlyLines && onlyStations) exitError("Cannot use both --only-lines and --only-stations.");

	const promises = urls
		.map(async (url, i) => {
			const metrodreaminObj = await getData(url);

			const metrodreaminKML = metrodreaminToKML(metrodreaminObj, { onlyLines, onlyStations });

			const xml = stringify(metrodreaminKML, { format: { indent: "    " } });

			const { title } = metrodreaminObj.props.pageProps.systemDocData;
			const timestamp = format(new Date(), "yyyyMMddHHmmss");
			return Deno.writeTextFile(`./${sanitize(title) || "untitled"}_${timestamp}_${i}.kml`, xml, {});
		});
	return Promise.all(promises);
}

function exitError(errorMessage: string): never {
	console.error(`\
${red("[ERROR]")} ${errorMessage}
${brightBlue("[INFO]")}
${brightBlue("[INFO]")} Usage: metrodreamin [OPTION]... [URL]...
${brightBlue("[INFO]")}
${brightBlue("[INFO]")} ${underline("Additional options:")}
${brightBlue("[INFO]")}     --only-lines: Only include lines in the KML.
${brightBlue("[INFO]")}     --only-stations: Only include stations in the KML.
`);
	Deno.exit(-1);
}

main();
