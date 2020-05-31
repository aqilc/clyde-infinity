module.exports = {

	// Function executed
	async f(m, { content, embed }) {
		if(!content)
		m.channel.send("WIP xP");

		let player = {
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
		},  enemies = [
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
		],  msg = await m.channel.send(embed.a(`${player.name} vs ${enemies[0].name}`, m.author.avatarURL()).d(`\`\`\`\n${(" ".repeat(30) + "\n").repeat(3)}\`\`\``)),
			actions = {
				rush: {
					emoji: "🗡",
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
		
		for(let i in actions)
			actions[i].reaction = await msg.react(actions[i].emoji);
		let emojis = Object.values(actions);
		const collector =  msg.createReactionCollector((reaction, user) => user.id === m.author.id && emojis.map(a => a.emoji).includes(reaction.emoji.name), { time: 1.2e5, errors: ["time"] })
		collector.on("collect", async r => {
			await r.remove();
			setTimeout(() => msg.react(r.emoji), emojis.find(a => a.emoji === r.emoji.name).cooldown)
		})
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