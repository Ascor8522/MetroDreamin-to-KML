import { blue, bold, red, underline, yellow } from "jsr:@std/fmt/colors";
import * as log from "jsr:@std/log";

export function setupLogger() {
	log.setup({
		handlers: {
			default: new log.ConsoleHandler("DEBUG", {
				useColors: false,
				formatter: ({ levelName, msg }) => {
					switch(levelName as log.LevelName) {
						case "CRITICAL": return `[${red(levelName)}]\t${red(msg)}`;
						case "ERROR": return `[${red(levelName)}]\t${red(msg)}`;
						case "WARN": return `[${yellow(levelName)}]\t${yellow(msg)}`;
						case "INFO": return `[${blue(levelName)}]\t${msg}`;
						case "DEBUG": return `[${levelName}]\t${msg}`;
						default: return `[${levelName}]\t${msg}`;
					}
				},
			}),
		},
	});
}

export function exitError(errorMessage: string): never {
	log.error(`${errorMessage}`);
	log.info(``);
	printInfo();
	log.info(``);
	Deno.exit(-1);
}

export function printInfo() {
	log.info(`${underline(bold("MetroDreamin' to KML"))}`);
	log.info(``);
	log.info(`${bold("USAGE")}`);
	log.info(`\t<executable> [OPTIONS]... [URLs]...`);
	log.info(``);
	log.info(`${bold("OPTIONS")}`);
	log.info(`\t--only-lines`);
	log.info(`\t\tOnly include lines in the KML.`);
	log.info(`\t--only-stations`);
	log.info(`\t\tOnly include stations in the KML.`);
	log.info(``);
	log.info(`${bold("URLs")}`);
	log.info(`\tURLs to MetroDreamin' maps.`);
	log.info(`\tURLs must either starting with ${underline("https://metrodreamin.com/view/")} or ${underline("https://metrodreamin.com/edit/")}`);
	log.info(`\tAt least one URL must be provided.`);
	log.info(`\tMultiple URLs can be provided.`);
	log.info(``);
	log.info(`${underline(bold("EXAMPLE"))}`);
	log.info(`\t<executable> --only-lines https://metrodreamin.com/view/Zm1JMWl2emt6c2VFU1ZicnhLRTJ2WEVvQ3R4MXwy`);
}
