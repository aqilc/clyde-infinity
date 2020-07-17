
// Imports cool console coloring module
await import("colors");

// Exports the command
export default {

	f(m) {

		// Kewl message X3
		const by = m.author.username + "#" + m.author.discriminator,
					surround =             ("!!!!!!!!!!!!!!!!!!!!!!!!!!!" + "!".repeat(by.length)).bgRed.bold;
		console.log(surround + "\n" + ` RIP, I'm being killed by ${by} `.bgRed.bold + "\n" + surround);

		// Exits current process
		this.worker.send("die")
	},
    
  // Only bot admins can do this crap
	perms: "BOT_ADMIN",

	// Only developers and mods should have access to this so we hide the command and delete the message invoking it
	h: true,	del: true,
}