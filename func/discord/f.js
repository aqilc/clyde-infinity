import { mentions } from "../f.js"
import { Embed as embed } from "./embed.js";

/**
 * Gets an osu user
 * @param stuff {Object} Precomputed things.
 * @param stuff.embed {embed} The embed in which to send the message.
 * @param stuff.content {string} The content of the message.
 * @param nouser {string} Message to send when there wasn't a user found in the db.
 */
export async function get_osu ({ redis, prefix, embed, content, send, m }, nouser) {

	// Gets user based on message mentions
	const mention = mentions(content)[0]
	if (mention) content = (await redis.get(`d:${mention}.osu.username`));

	// Returns for now since there is no db currently
	if (!content)
	content = (await redis.get(`d:${m.author.id}.osu.username`));

	// If you don't even have a default username setup, just return a message saying you should
	if (!content)
	return send(embed.a('Please set up a default username!', m.author.avatarURL()).d(nouser || `You can set one up easily with \`${prefix}osu se\`, or get quick stats with \`${prefix}osu [player name]\`.`));

	// Get gamemode
	let mode = await redis.get(`d:${content}.osu.mode`);
	
	// returns the things
	return { user: content, mode };
}

// Suite of functions for fetching a lot of stuff from the discord api
export const fetch = {

	// Fetches a bunch of messages, almost to Infinity, until it encounters some undeletable ones(Input: MessageManager ie. m.channel.messages, Amount)
	async messages(manager, amount, skip) {

		// Stores messages
		let m = manager.cache.array().filter(msg => !msg.deleted)

		// Skips messages
		if (skip) { skip -= m.length - (m = m.slice(-skip)).length }

		// Return messagecount if it's already cached
		if (m.length >= amount) { return m.slice(-amount) }

		// Slices off the size we already have cached.
		amount -= m.length

		// Fetches all messages and caches them :D
		while (m.length < amount) {

			// Sets up the options for getting messages
			const opts = {

				// How many messages should be gotten
				limit: Math.min(amount + skip, 100)
			}

			// If *any* messages are cached, find the oldest one and add it into the options
			if (m.length) { opts.before = m.reduce((a, b) => Math.min(a.createdTimestamp, b.createdTimestamp)).id }

			// Fetches as many messages as needed before the last message we currently have :D
			m = m.concat(Array.from((await manager.fetch(opts)).values()))

			// If undeletable messages are encountered, filter them out of the cache and exit the loop
			if (m.find(mes => !mes.deletable)) { console.log('filtered', m.filter(mes => !mes.deletable).map(m => m.content), m.length); m = m.filter(mes => mes.deletable); break }
		}

		// Skips some leftover messages if skip was specified
		if (skip) { return m.slice(-skip) }

		// else just returns the leftover cache
		return m
	}
}

// Cleans up text for code for evalling. Returns an object
export function codify(str) {

	str = str.trim()

	// Object for returning
	const v = {
	code: '',
	type: 'js'
	}

	// Takes out code block stuff
	if (str.search(/```[\w]*/) === 0 && str.endsWith('```')) { v.type = str.match(/```(\w)/)[1]; str = str.slice(str.match(/```[\w]*/)[0].length, -3).trim() }

	// Returns v + the code
	return v.code = str, v
};

/**
 * @param {import("discord.js").Message} msg - The message that referenced the command
 * @param {string | import("./embed.js").Embed} content - The question to ask for agreement with
 * @param {string | string[]} react - The message filter / reaction used to filter messages / react to the message
 * @returns {Promise<(import("discord.js").Message | import("discord.js").MessageReaction)[]>} - The user that answered.
 */
export async function ask(msg, content, react = "👍", { r, id, time = 300000, errfn, max = 1, maxProcessed = 49, maxUsers = 1, idle = 300000 } = {}) {

	// true = react, false = message filter
	let type = typeof r === "boolean" ? r : r || react.length === 1;

	// Basically, if we are collecting messages, normalize what they can respond to something easier to use
	if(!type) {

		// Easy conversion values so I don't have to type them out later
		let pre = {
			yes: ["ye", "yes", "y"],
			no: ["n", "no"]
		};

		// does the thing
		if (pre[react]) react = pre[react];
		else if(Array.isArray(react)) react.map(s => s.toLowerCase());
		else react = [react.toLowerCase()];

	// and if not, just turn all normal string reactions into string arrays
	} else if(typeof react === "string") react = [...react];

	// Determines the filter for the message/react collector
	const filter = type ? 
		
		// Reaction filter
		(id ? ((r, u) => react.includes(r._emoji.name) && u.id === id) : (r => react.includes(r._emoji.name)))

		// Message filter
		: (id ? ((m, u) => react.includes(m.content.toLowerCase()) && u.id === id) : (m => react.includes(m.content.toLowerCase()))),

		// Defines filter options
		opts = { time, errors: ["time"], max, maxProcessed, maxUsers, idle }, mess = await msg.channel.send(content);

	// Just so if it fails
	try {

		// Creates the message or reaction collector
		return (type ? (await Promise.all(react.map(r => mess.react(r))), await mess.awaitReactions(filter, opts)) : await mess.channel.awaitMessages(filter, opts)).array();

		// Sends error message
	} catch (err) { if(errfn) errfn(mess, react, err); else console.log(react, err); return []; }
}

/**
 * @param {function(import("./embed.js").Embed): Promise<Message>} send - the message which's channel we send it to
 * @param {Error} err - The error
 * @returns {Promise<Message>}
 */
export const errorm = (send, err) => send(new embed("ERROR!!").c(0xd93025).d("```" + err + "```"));