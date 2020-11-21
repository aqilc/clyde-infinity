import { mentions } from '../../../func/f.js'

export default {

  async f (m, { embed, args }) {
    // You need to provide *something*!
    if (!args[0]) { return m.channel.send(embed.t('You need to specify who to ban!')) }

    // Gets user id
    const user = mentions(args.splice(0, 1))[0]

    // If it couldn't find a user, abort
    if (!user) { return m.channel.send(embed.t('Please provide a valid user!')) }

    // Get ban options
    const days = Number(args[0]) || 0
    const reason = (days ? args.slice(1) : args).join(' ') || 'None'

    // For error handling
    try {
      // Try to ban the user
      const banned = await m.guild.members.ban(user, { reason, days })

      // Alert if successful
      return m.channel.send(embed.t(`User ${banned.username} (ID: ${banned.id}) is successfully banned.`).d('Reason provided: ' + reason).f(days + ' days of messages deleted.'))

      // and also alert if *not* successful
    } catch (err) { return m.channel.send(embed.t('An error occurred:', '```\n' + err + '\n```').c('red')) }
  },

  // Command args
  args: [

    // Shows list of bans
    {
      async f (m) {
        // Gets the guild's bans
        const bans = await m.guild.fetchBans()

        console.log(bans)
      },

      // For 'bans' ~~or 'bams'~~
      name: 's',

      // Smol description
      desc: 'Allows you to see all banned members in your guild.'
    }
  ],

  // Only to be used in servers
  chnl: 'text',

  // You should be able to ban people normally too
  perms: 'BAN_MEMBERS',

  // For fun ;)
  alt: ['bam']
}
