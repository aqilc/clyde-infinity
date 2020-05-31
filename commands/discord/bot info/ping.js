module.exports = {
  
  // Main function for command
  async f(m, { embed }) {
        
    // Figures out what the current time is at the start of the command
    const time = Date.now();
  
    // Makes an embed
    embed.a("Pong!", m.author.avatarURL())

    // Sends the message
    const message = await m.channel.send(embed);
    
    // After successfully sending the message, edit the message to include the time it took for the bot to send the message
    message.edit(embed.f(`Took ${Date.now() - time} ms`));
  },
  
  // Description
  d: "Displays latency for the normal commands of the bot.",
  
  // Example
  e: "ping",
  
  // Channels it works in(a for all, d for dms, and t for guild channels) 
  c: "a",
  
  // Delete triggering message?
  del: false,
  
  // Default version(version it defaults when no specific version is requested)
  dver: "basic",
}