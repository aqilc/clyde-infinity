
// Text graphics API :D
import ASCII from "../../../func/ascii.js";

// Exports command
export default {

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
				
			
			},

			// Your enemies
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

			// Text canvas
			canvas = new ASCII(50, 5),

			// Message containing the acc information and stuff
			msg = await m.channel.send(embed.a(`${player.name} vs ${enemies[0].name}`, m.author.avatarURL()).d(`\`\`\`\n${canvas}\`\`\``)),

			// Your actions
			actions = {
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
		
		const done = () => frame > 20;

		// Reaction function
		async function react(action) {

			// React on the attack message
			await msg.react(action.emoji);

			// Wait for reactions
			let r = (await msg.awaitReactions((reaction, user) => user.id === m.author.id && reaction.emoji.name === action.emoji, { time: 1.2e5, max: 1 })).first()
			
			// If no reactions were gotten, exit loop
			if(!r) return;

			// Remove emojis other wise
			await r.remove();

			// Go back to beginning(the loop part) in a specific amount of time if we aren't done with combat
			if(!done())
				setTimeout(async () => await react(action), action.cooldown);
		}

		// Loop through action reactions and do above function for all of them
		for(let i in actions)
			react(actions[i]);

		let frame = 0, drawing = canvas.draw(" 😔\n | 🗡️\n/ \\", 10, 2),
		int = setInterval(() => {
			frame === 20 && clearInterval(int);
			++ frame%2 && drawing.x ++ || drawing.x --;
			msg.edit(embed.d(`\`\`\`\n${canvas}\`\`\``));
		}, 1500);
	},

	// Aliases (Array<String>)
	a: [],

	// Description
	desc: "This command does things",

	// Examples (String`example1,example2`)
	ex: "cmdname,cmdname hello",

	// How to use the command
	use: "commandname [username]",

	// Hidden from a regular user (Optional)
	hid: false,

	// Delete (Optional)
	del: false,

	// Default version of the command (Optional)
	dver: "basic"
};