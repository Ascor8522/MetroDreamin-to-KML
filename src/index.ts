import sanitize from "sanitize_filename";
import { stringify } from "xml";
import { metrodreaminToKML } from "./kml.ts";
import { getData } from "./metrodreamin.ts";

function main() {
	const { args } = Deno;

	if(!args.length) {
		console.error("[ERROR] No arguments provided.");
		console.error("[ERROR] Usage: deno run --allow-net --allow-write src/index.ts [...url]");
		Deno.exit(-1);
	}

	const promises = args
		.filter(arg => {
			const urlRegex = new RegExp("https://metrodreamin.com/view/[a-zA-Z0-9]{40,40}", "g");
			if(urlRegex.test(arg)) return true;
			console.warn(`Invalid URL: "${arg}". Skipping...`);
		})
		.map(async url => {
			const metrodreaminObj = await getData(url);

			const metrodreaminKML = metrodreaminToKML(metrodreaminObj);

			const xml = stringify(metrodreaminKML, { indentSize: 4 });

			const { title } = metrodreaminObj.props.pageProps.systemDocData;
			return Deno.writeTextFile(`./${sanitize(title) || "untitled"}.kml`, xml);
		});
	return Promise.all(promises);
}

main();
