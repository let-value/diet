import path from "path";
import { DIST_PATH } from "./build";

const headers = new Headers({
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Expose-Headers": "*",
	"Cross-Origin-Resource-Policy": "cross-origin",
	"Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
	"Timing-Allow-Origin": "*",
	Vary: "Accept-Encoding",
	"X-Cache": "MISS, MISS",
	"X-Content-Type-Options": "nosniff",
	"X-Jsd-Version": "latest",
	"X-Jsd-Version-Type": "version",
	"X-Served-By": "cache-fra-eddf8230104-FRA, cache-lga21958-LGA",
});

export function startServer() {
	const server = Bun.serve({
		port: 8080,
		async fetch(req) {
			let { pathname } = new URL(req.url);
			if (pathname.endsWith("/") || pathname.endsWith("/index.html"))
				pathname = `${path.dirname(pathname)}/index.html`;

			const filePath = path.join(DIST_PATH, pathname);
			const file = Bun.file(filePath);
			console.log(filePath, await file.exists());
			return new Response(file, { headers });
		},
		error() {
			return new Response(null, { status: 404 });
		},
	});

	console.log(`Server running at http://localhost:${server.port}/`);

	return server;
}

if (import.meta.main) {
	startServer();
}
