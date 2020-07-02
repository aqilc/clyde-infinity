
// Exports the command function
export default {
	async f(m, { content, embed }) {

		// Finds command based on content
		let command = this.commands.find(c => c.name === content);

		// If it can't find the command, tell the user it can't
		if(!command)
			return (await m.channel.send("Command not found.")).delete({ timeout: 5000 });

		// For catching errors
		try {

			// Gets and makes a new command :D
			this.commands[command] = await command.load();

			// Logs that it was successful
			console.log(`Refreshed command: ${command.name}`);

			// Sends a message confirming that the command was done.
			return (await m.channel.send(embed.a("Command refresh successful!", m.author.avatarURL()))).delete({ timeout: 5000 });

		// If there was an error
		} catch(err) {

			// Sends a message containing the error
			m.channel.send(embed.t("Error").d(`\`\`\`\n${err}\`\`\``));
		}
	},

	// Permissions required(obv bot admin)
	perms: ["BOT_ADMIN"],

	// Only developers and mods should have access to this so we hide the command and delete the message invoking it
	hid: true,	del: true,
};