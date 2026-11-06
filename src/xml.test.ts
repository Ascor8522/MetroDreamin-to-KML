import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { escapeXML, renderElement, stringifyXML } from "./xml.ts";

describe("stringifyXML", () => {
	it("adds the default XML declaration", () => {
		assert.equal(
			stringifyXML({ root: "content" }),
			`<?xml version="1.0" encoding="UTF-8"?>
<root>content</root>`,
		);
	});

	it("uses declaration metadata and omits document directives", () => {
		assert.equal(
			stringifyXML({
				"@version": "1.1",
				"@encoding": "ISO-8859-1",
				"@standalone": "no",
				"@ignored": "not an element",
				"~name": "~xml",
				"#text": "not an element",
				root: "content",
			}),
			`<?xml version="1.1" encoding="ISO-8859-1" standalone="no"?>
<root>content</root>`,
		);
	});

	it("serializes multiple roots and repeated array elements", () => {
		assert.equal(
			stringifyXML({
				first: "one",
				item: ["two", "three"],
			}),
			`<?xml version="1.0" encoding="UTF-8"?>
<first>one</first>
<item>two</item>
<item>three</item>`,
		);
	});
});

describe("renderElement", () => {
	it("renders scalar values, including null", () => {
		assert.deepEqual(
			renderElement("value", [null, true, 42], 1),
			[
				"    <value></value>",
				"    <value>true</value>",
				"    <value>42</value>",
			],
		);
	});

	it("renders attributes, text, and nested children with indentation", () => {
		assert.deepEqual(
			renderElement("node", {
				"@id": "a&b",
				"#text": "some text",
				child: "value",
			}, 0),
			[
				`<node id="a&amp;b">\n    some text\n    <child>value</child>\n</node>`,
			],
		);
	});

	it("self-closes empty objects and nodes with empty text", () => {
		assert.deepEqual(renderElement("empty", {}, 2), ["        <empty/>"]);
		assert.deepEqual(renderElement("empty", { "@id": "x", "#text": "" }, 0), ["<empty id=\"x\"/>"]);
	});

	it("renders arrays of nodes as repeated sibling elements", () => {
		assert.deepEqual(
			renderElement("entry", [{ "@id": "one" }, { "@id": "two" }], 0),
			[`<entry id="one"/>`, `<entry id="two"/>`],
		);
	});

	it("ignores internal directives while retaining text content", () => {
		assert.deepEqual(
			renderElement("node", { "~name": "ignored", "#text": "kept", child: "also kept" }, 0),
			[`<node>\n    kept\n    <child>also kept</child>\n</node>`],
		);
	});
});

describe("escapeXML", () => {
	it("escapes all five XML special characters", () => {
		assert.equal(escapeXML(`&<>"'`), "&amp;&lt;&gt;&quot;&apos;");
	});

	it("converts non-string values to strings", () => {
		assert.equal(escapeXML(123), "123");
	});
});
