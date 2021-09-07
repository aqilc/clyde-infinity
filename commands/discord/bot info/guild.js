// Imports some functions
import { list, mentions } from '../../../func/f.js'

export default {

  // Function executed
  f ({ embed, content, m }) {
    
    // Determines user selected action
    const action = content.includes(' ') ? content.slice(0, content.indexOf(' ') + 1) : content

    // Available action an admin can do
    const actions = {

      // If someone does guilds cx
      s: () => actions.list(),

      // Lists all guilds
      list: () => m.channel.send(

        // Calls on a pre-made embed
        embed

          // Sets the author
          .a('Bot Guilds', this.client.user.avatarURL())

          // Adds in fields containing the guilds
          .af(this.client.guilds.cache.array().map((g, i) => ({
            name: `${i + 1}. ${g.name}`,
            value: `\`ID: ${g.id}\` **Emojis:** ${g.emojis.cache.size}`
          })))

          // Sets footer saying the number of guilds
          .f(this.client.user.username + ' is in ' + this.client.guilds.cache.size + ' Guilds ')),

      emojis: () => {
        // Determines guild to get emojis from
        const guild = mentions(content.slice(action.length))

        // If what they sent wasn't a guild id, abort
        if (!guild) return m.channel.send(embed.t('Please send a guild id to get the emojis from!'))
      }
    }

    // If an action is present, execute it
    if (action) {
      return (new Proxy(actions, {
        get (t, p) {
        // If action is not available, return this message
          if (!t[p]) return m.channel.send(embed.t(`Action '${p}' not available!`).f(`Available actions: ${list(Object.keys(t))}`))

          // Does the action :D
          return t[p]()
        }
      }))[action]
    }

    // If action is not available, just give them a list :D
    return actions.list()
  },

  // Description
  desc: 'This command does things',

  // Examples (String`example1,example2`)
  ex: 'cmdname,cmdname hello',

  // All permission things
  perms: 'BOT_ADMIN',

  // How to use the command
  use: 'commandname [username]',

  // Hidden from a regular user (Optional)
  hide: true
}
