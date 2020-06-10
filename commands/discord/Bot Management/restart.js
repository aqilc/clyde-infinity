import { spawn } from "child_process";
import { openSync } from "fs";
import { dirname } from "path";
import { fileURLToPath } from "url";

export default {

	f() {
		
		const log_dir = fileURLToPath(dirname(dirname(dirname(dirname(import.meta.url)))) + "/child-logs");

		// Spawns a new, detached process with the same arguments as this one
		spawn(process.argv[0], process.execArgv.concat(process.argv.slice(1)), {
			detached: true,
			stdio: ["ignore", openSync(log_dir + "\\out"), openSync(log_dir + "\\err")]
		}).unref()

		// Exits current process
		process.exit()
	},
	
	p: "BOT_ADMIN",

	// Only developers and mods should have access to this so we hide the command and delete the message invoking it
	h: true,	del: true,
}