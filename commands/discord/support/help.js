
// Imports handy functions
import { list } from '../../../func/f.js'

// Exports main command function
export default {

  // Version list
  versions: {

    // Version name
    basic: {

      // Function for help
      f ({ embed, content, send } = {}) {
        
        // If the user just calls for basic help, use this embed
        if (!content) {
          return send(embed.a('Bot Commands', this.client.user.avatarURL)
            .d(list(Object.keys(this.commands).map(c => `**\`${this.prefix + c}\`**`))));
        } else {

          // Find the command
          let cmd = Object.keys(this.commands).find(c => c.name.startsWith(content))[0];
          
          // If no command was found, just exit with that message.
          if(!cmd)
            return send(embed.a("No bot command that starts with " + content + " found."));
        }
      }
    }
  },

  // Description
  desc: 'Displays basic commands and help',

  // How to utilize
  use: ' [command_name]',

  // Example
  ex: 'help,help purge',

  // Default version(version it defaults when no specific version is requested)
  dver: 'basic'
}
