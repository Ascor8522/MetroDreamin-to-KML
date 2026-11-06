import { safeFilename } from "./fs";
import { metrodreaminToKML } from "./kml";
import { extractMapId, getData, isValidURL } from "./metrodreamin";
import { stringifyXML } from "./xml";

export default {
	async fetch(request: Request, _env: Env): Promise<Response> {
		const url = new URL(request.url);
		switch(true) {
			case url.pathname === "/convert":
				switch(request.method) {
					case "POST": return foo(request);
					default: return new Response("Method Not Allowed", { status: 405, headers: { Allow: "POST" } });
				}
			default: return new Response("Not Found", { status: 404 });
		}
	},
} satisfies ExportedHandler<Env>;

async function foo(request: Request) {
	let form: FormData;
	try {
		form = await request.formData();
	} catch {
		return errorResponse("Submit the form using valid form data.", 400);
	}

	const mapUrl = form.get("url");
	if(typeof mapUrl !== "string" || !isValidURL(mapUrl)) {
		return errorResponse("Enter a valid MetroDreamin' map URL.", 400);
	}
	const elements = form.get("elements");
	if(elements !== "both" && elements !== "only-lines" && elements !== "only-stations") {
		return errorResponse("Choose which map elements to export.", 400);
	}

	try {
		const metroDreamin = await getData(extractMapId(mapUrl));
		const kml = metrodreaminToKML(metroDreamin, {
			onlyLines: elements === "only-lines",
			onlyStations: elements === "only-stations",
		});
		const title = metroDreamin.props.pageProps.systemDocData.title;
		const filename = `${safeFilename(title) || "untitled"}.kml`;
		return new Response(stringifyXML(kml), {
			headers: {
				"Content-Type": "application/vnd.google-earth.kml+xml; charset=utf-8",
				"Content-Disposition": `attachment; filename="${filename}"; filename*=UTF-8''${encodeURIComponent(filename)}`,
				"Cache-Control": "no-store",
			},
		});
	} catch(error) {
		console.error("KML conversion failed", error);
		return errorResponse("Unable to convert this MetroDreamin' map. Check the URL and try again.", 502);
	}
}

function errorResponse(message: string, status: number): Response {
	return new Response(message, {
		status,
		headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" },
	});
}
