import { assert, assertFalse, assertThrows } from "jsr:@std/assert";
import { describe, it } from "jsr:@std/testing/bdd";
import { extractMapId, isValidURL } from "./metrodreamin.ts";

describe("#isValidURL", () => {

	it("should accept valid \"view\" URLs", () => {
		assert(isValidURL("https://metrodreamin.com/view/Zm1JMWl2emt6c2VFU1ZicnhLRTJ2WEVvQ3R4MXwy"));
	});

	it("should accept valid \"edit\" URLs", () => {
		assert(isValidURL("https://metrodreamin.com/edit/Zm1JMWl2emt6c2VFU1ZicnhLRTJ2WEVvQ3R4MXwy"));
	});

	it("should reject invalid URLs", () => {
		assertFalse(isValidURL("https://metrodreamin.com/"));
	});

});

describe("#extractMapId", () => {

	it("should extract the map ID from a valid URL", () => {
		assert("Zm1JMWl2emt6c2VFU1ZicnhLRTJ2WEVvQ3R4MXwy" === extractMapId("https://metrodreamin.com/view/Zm1JMWl2emt6c2VFU1ZicnhLRTJ2WEVvQ3R4MXwy"));
	});

	it("should throw an error for an invalid URL", () => {
		assertThrows(() => extractMapId("https://metrodreamin.com/"));
	});

});
