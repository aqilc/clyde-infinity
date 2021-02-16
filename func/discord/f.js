import { mentions } from "../f.js"

/**
 * Gets an osu user
 * @param m {Message} The message
 * @param stuff {Object} Precomputed things.
 * @param stuff.embed {embed} The embed in which to send the message.
 * @param stuff.content {string} The content of the message.
 * @param api {string} The method of the osu API to use.
 */
export async function get_osu (ctx, m, { embed, content }, api, { nouser, dbvalue } = {}) {

  // Gets user based on message mentions
  const mention = mentions(content)[0]
  if (mention) content = (await ctx.apis.redis.get(dbvalue && dbvalue(mention) || `d:${mention}.osu.username`)) || ''

  // Returns for now since there is no db currently
  if (!content) { content = (await ctx.apis.redis.get(dbvalue && dbvalue(m.author.id) || `d:${m.author.id}.osu.username`)) || '' }

  // If you don't even have a default username setup, just return a message saying you should
  if (!content) { return m.channel.send(embed.a('Please set up a default username!', m.author.avatarURL()).d(nouser || `You can set one up easily with \`${ctx.prefix}osu se\`, or get quick stats with \`${ctx.prefix}osu [player name]\`.`)) }

  // Gets the user stats
  const data = await api(content)

  // If user doesn't exist, return with a message.reply
  if (!data) { return m.channel.send(embed.t("User doesn't exist!")) }

  // Return the gotten info
  return { user: content, data };
}
