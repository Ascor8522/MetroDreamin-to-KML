export function safeFilename(title: string): string {
	return title
		.replace(/[<>:"/\\|?*\u0000-\u001f]/g, "_")
		.replace(/[. ]+$/g, "")
		.slice(0, 120);
}
