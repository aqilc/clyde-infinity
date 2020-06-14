import { spawn } from "child_process";
import { openSync } from "fs";
import { project } from "../../../config.js";

export default {

	f() {
		
		// Logs directory
		const log_dir = project.logs["child-processes"];

		// Logs action
		console.log("Restarting... Logs at: " + log_dir);

		// Spawns a new, detached process with the same arguments as this one
		spawn(process.argv[0], [...process.execArgv, ...process.argv.slice(1)], {
			detached: true,
			stdio: ["ignore", openSync(log_dir.append("\\out"), "a"), openSync(log_dir.append("\\err", "a"))]
		}).unref()

		// Exits current process
		process.exit()
	},
	
	perms: "BOT_ADMIN",

	// Only developers and mods should have access to this so we hide the command and delete the message invoking it
	h: true,	del: true,
}