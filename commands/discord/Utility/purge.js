// Fetches message fetcher
const { fetch } = require("../../../func/f.js"),

      // Stores filters for messages
      filters = {
        
        // If you only specify a number
        "(\\d+)": (i, m) => fetch.messages(m.channel.messages, Number(i)),

        // If you specify you want to delete bot messages too
        "bot (\\d+)": (i, m) => m.channel.messages.cache.filter(msg => msg.bot)
      };

// Exports the command object
module.exports = {
  async f(m, { embed, content }) {
    
    // If the message amount wasn't specified, return an autodeleted message saying they should specify it
    if (!content)
      return await (await m.channel.send(embed.a("Purge: Error", m.author.avatarURL()).d(`\`\`\`diff\n- Error: Amount of messages to delete not specified or of not proper type (do ${this.prefix}help purge to learn more about this command)\`\`\``))).delete({ timeout: 10000 });
    console.log(m.channel.lastMessage)
    // Checks for deletable messages
    if ((m.channel.lastMessage || await m.channel.messages.fetch({ limit: 1}, true)) && m.channel.lastMessage.createdTimestamp + 1.2096e9 < Date.now() || !m.channel.lastMessage.deletable)
      return await (await m.channel.send(embed.a("Purge: Error", m.author.avatarURL()).d(`\`\`\`diff\n- Error: No deletable messages in this channel.\`\`\``))).delete({ timeout: 10000 });
    
    // Determines filter
    let filter = Object.keys(filters).find(f => (new RegExp(f)).test(content));
    
    // If the message filter didn't get filtered out(lol), return an error
    if (!filter)
      return await (await m.channel.send(embed.a("Purge: Error", m.author.avatarURL()).d(`\`\`\`diff\n- Error: Couldn't find the filter for the messages you were looking for.\nTry doing ${this.prefix}help purge to know what kind of filters exist.\`\`\``))).delete({ timeout: 10000 });
    
    // Stores deleted messages
    let deleted = [],
        
        // Filters the messages in the channel with given filter
        filtered = await filters[filter](content.match(new RegExp(filter))[0], m);
    
    // Loops through filtered messages and deletes them  a l l
    do Object.assign(deleted, (await m.channel.bulkDelete(filtered.splice(0, Math.min(filtered.length, 100)), true)).array());
    while (filtered.length)
    console.log(content, deleted.length)
    // Sends a message saying it was successful
    await (await m.channel.send(embed.a("Purge: Query Successful!", m.author.avatarURL()).f(`Deleted ${deleted.length} messages`))).delete({ timeout: 10000 });
  },
  
  // Usage
  u: " [number of messages]",
  
  // Example
  e: "purge 10",
  
  // Permissions
  p: "MANAGE_MESSAGES",
  
  // Deletes author's message **before executing the command**
  del: true
}