import colors from "colors";
import { writeFileSync } from "fs";
import { project } from "../../../config.js";

export default {
	async f(m, { embed }) {

		// child processes logs directory
		const log_dir = project.logs['child-processes']

    // Clears logs of bot restarts
		writeFileSync(log_dir.append("/out").path, "");
		writeFileSync(log_dir.append("/err").path, "");

		// Logs success(oh god)
		console.log(" Cleared logs! ".bgYellow.bold);

		// Sends a message saying it was successful
		(await m.channel.send(embed.t("Successful"))).delete({ timeout: 10000 })
	},
    
    // Only bot admins can do this crap
	perms: "BOT_ADMIN",

	// Only developers and mods should have access to this so we hide the command and delete the message invoking it
	h: true,	del: true,
}