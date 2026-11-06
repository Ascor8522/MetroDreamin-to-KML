export type XmlNode = Record<string, unknown>;

export function stringifyXML(document: XmlNode): string {
	const version = document["@version"] ?? "1.0";
	const encoding = document["@encoding"] ?? "UTF-8";
	const standalone = document["@standalone"];
	const declaration = `\
<?xml version="${escapeXML(version)}" \
encoding="${escapeXML(encoding)}"\
${standalone === undefined ? "" : ` standalone="${escapeXML(standalone)}"`}\
?>`;
	const roots = Object.entries(document)
		.filter(([key]) => !key.startsWith("~") && !key.startsWith("@") && key !== "#text")
		.flatMap(([name, value]) => renderElement(name, value, 0));
	return `${declaration}\n${roots.join("\n")}`;
}

export function renderElement(name: string, value: unknown, depth: number): string[] {
	if(Array.isArray(value)) return value.flatMap(item => renderElement(name, item, depth));
	const indent = "    ".repeat(depth);
	if(value === null || typeof value !== "object") {
		return [`${indent}<${name}>${escapeXML(value ?? "")}</${name}>`];
	}

	const node = value as XmlNode;
	const attributes = Object.entries(node)
		.filter(([key]) => key.startsWith("@"))
		.map(([key, attribute]) => ` ${key.slice(1)}="${escapeXML(attribute)}"`)
		.join("");
	const text = node["#text"];
	const children = Object.entries(node)
		.filter(([key]) => !key.startsWith("@") && !key.startsWith("~") && key !== "#text")
		.flatMap(([childName, childValue]) => renderElement(childName, childValue, depth + 1));

	if(!children.length && (text === undefined || text === "")) return [`${indent}<${name}${attributes}/>`];
	const content = [
		...(text === undefined || text === "" ? [] : [`${"    ".repeat(depth + 1)}${escapeXML(text)}`]),
		...children,
	].join("\n");
	return [`${indent}<${name}${attributes}>\n${content}\n${indent}</${name}>`];
}

export function escapeXML(value: unknown): string {
	return String(value)
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;")
		.replaceAll("'", "&apos;");
}
