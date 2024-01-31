import { buildCookbook } from "./build";
import { startServer } from "./serve";
import watch from "node-watch";
import path from "path";

buildCookbook();

const watchPath = path.join(import.meta.dir, "src");

function handleFileChange(_, file) {
	console.log(`${file} changed!`);
	buildCookbook();
}

const watcher = watch(watchPath, { recursive: true }).on(
	"change",
	handleFileChange,
);

console.log(`Watching ${watchPath} for changes...`);

const server = startServer();

process.on("SIGINT", () => {
	watcher.close();
	server.stop();
	process.exit(0);
});
