
// Imports handy functions
import { list } from "../../../func/f.js";

// Exports main command function
export default {
  
  // Version list
  versions: {
    
    // Version name
    basic: {
      
      // Function for help
      f(m, { embed, content } = {}) {
        
        // If the user just calls for basic help, use this embed
        if (!content)
          embed.a("Bot Commands", this.client.user.avatarURL)
            .d(list(this.commands.map(c => `**\`${this.prefix + c.name}\`**`)));
        else this.commands.find()
        m.channel.send(embed);
      }
    }
  },
  
  // Description
  desc: "Displays basic commands and help",
  
  // How to utilize
  use: " [command_name]",
  
  // Example
  ex: "help,help purge",
  
  // Default version(version it defaults when no specific version is requested)
  dver: "basic",
}