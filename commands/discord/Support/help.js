module.exports = {
  
  // Version list
  versions: {
    
    // Version name
    basic: {
      
      // Function for help
      f(m, { embed, content } = {}) {
        
        // If the user just calls for basic help, use this embed
        if (!content)
          embed.a("Bot Commands", this.client.user.avatarURL)
            .d(this.f.list(this.commands.map(c => `**\`${this.prefix + c.name}\`**`)));
        else this.commands.find()
        m.channel.send(embed);
      }
    }
  },
  
  // Description
  d: "Displays basic commands and help",
  
  // How to utilize
  u: " [command_name]",
  
  // Example
  e: "help,help purge",
  
  // Channels it works in(a for all, d for dms, and t for guild channels) 
  c: "a",
  
  // Delete triggering message?
  del: false,
  
  // Default version(version it defaults when no specific version is requested)
  dver: "basic",
}