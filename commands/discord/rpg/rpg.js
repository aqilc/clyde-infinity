module.exports = {

	// Function executed
	async f(m, { content, embed }) {

		// Deny if you don't know how to use
		if(!content)
			return m.channel.send("WIP xP");

		// Stores start of combat
		let start = Date.now(),

			// You
			player = {
				name: m.author.username,
				strength: 34000,
				defence: 50000,
				health: 750000,
				speed: 20000,
				items: {
					"item id": {
						fusions: {
							"item id": {
								quantity: 20,
							}
						},
					}
				},
				
				// Your enemies
			},
			enemies = [
				{
					name: "Bob the Builder",
					health: 1000000,
					defence: 30000,
					strength: 10000,
					speed: 5000,
					items: {
						"item id": {
							fusions: {
								"item id": {
									quantity: 20,
								}
							},
						}
					},
					drops: {
						"item id": {
							quantity: 1,
							chance: 0.01,

						}
					}
				}
			
			],

			// Message containing the acc information and stuff
			msg = await m.channel.send(embed.a(`${player.name} vs ${enemies[0].name}`, m.author.avatarURL()).d(`\`\`\`\n${(" ".repeat(30) + "\n").repeat(3)}\`\`\``)),

			// Your actions
			actions = {
				get done() {
					return Date.now() - start > 1000000
				},
				rush: {
					emoji: "🗡",
					action() {},
					cooldown: 5000
				},
				shield: {
					emoji: "🛡",
					cooldown: 5000
				},
				heal: {
					emoji: "❤",
					cooldown: 5000
				},
			};
		
		// Reaction function
		async function react(action) {

			// React on the attack message
			await msg.react(action.emoji);

			// Wait for reactions
			let r = (await msg.awaitReactions((reaction, user) => user.id === m.author.id && reaction.emoji.name === action.emoji, { time: 1.2e5, max: 1 })).first()
			
			// If no reactions were gotten, exit loop
			if(!r) return;

			// Remove emojis other wise
			r.remove();

			// Go back to beginning(the loop part) in a specific amount of time if we aren't done with combat
			if(!actions.done)
				setTimeout(() => react(action), action.cooldown);
		}

		// Loop through action reactions and do above function for all of them
		for(let i in actions)
			react(actions[i]);
	},

	// Aliases (Array<String>)
	a: [],

	// Description
	d: "This command does things",

	// Examples (String`example1,example2`)
	e: "cmdname,cmdname hello",

	// How to use the command
	u: "commandname [username]",

	// Hidden from a regular user (Optional)
	h: false,

	// Delete (Optional)
	del: false,

	// Default version of the command (Optional)
	dver: "basic"
};