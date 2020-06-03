
// Fetches the command module so we can make new commands
import Command from "../../../func/command.js";

// Exports the command function
export default {
	async f(m, { content, embed }) {

		// Finds command based on content
		let command = this.commands.findIndex(c => c.name === content),
				cmd = new Object(this.commands[command]);

		// If it can't find the command, tell the user it can't
		if(command < 0)
			return (await m.channel.send("Command not found.")).delete({ timeout: 5000 });

		// Deletes the cache in require so we can do a full refresh later
		delete require.cache[require.resolve(cmd.path)];

		// For catching errors
		try {

			// Gets and makes a new command :D
			this.commands[command] = await (new Command(cmd.name, cmd.category)).load();

			// Logs that it was successful
			console.log(`Refreshed command: ${cmd.name}`);

			// Sends a message confirming that the command was done.
			return (await m.channel.send(embed.a("Command refresh successful!", m.author.avatarURL()))).delete({ timeout: 5000 });

		// If there was an error
		} catch(err) {

			// Sends a message containing the error
			m.channel.send(embed.t("Error").d(`\`\`\`\n${err}\`\`\``));
		}
	},

	// Permissions required(obv bot admin)
	p: ["BOT_ADMIN"],

	// Only developers and mods should have access to this so we hide the command and delete the message invoking it
	h: true,	del: true,
};