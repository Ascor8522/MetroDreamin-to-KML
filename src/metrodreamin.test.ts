import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { extractMapId, isValidURL } from "./metrodreamin.ts";

describe("#isValidURL", () => {

	it("should accept valid \"view\" URLs", () => {
		assert.ok(isValidURL("https://metrodreamin.com/view/Zm1JMWl2emt6c2VFU1ZicnhLRTJ2WEVvQ3R4MXwy"));
	});

	it("should accept valid \"edit\" URLs", () => {
		assert.ok(isValidURL("https://metrodreamin.com/edit/Zm1JMWl2emt6c2VFU1ZicnhLRTJ2WEVvQ3R4MXwy"));
	});

	it("should reject invalid URLs", () => {
		assert.equal(isValidURL("https://metrodreamin.com/"), false);
	});

});

describe("#extractMapId", () => {

	it("should extract the map ID from a valid URL", () => {
		assert.equal(extractMapId("https://metrodreamin.com/view/Zm1JMWl2emt6c2VFU1ZicnhLRTJ2WEVvQ3R4MXwy"), "Zm1JMWl2emt6c2VFU1ZicnhLRTJ2WEVvQ3R4MXwy");
	});

	it("should throw an error for an invalid URL", () => {
		assert.throws(() => extractMapId("https://metrodreamin.com/"));
	});

});
