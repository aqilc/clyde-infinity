
/// <reference path="../../../func/typedef.js" />

// Gets osu api data
import { get_osu } from '../../../func/discord/f.js';

// The actual command
export default {

  // Command versions(optional)
  versions: {

    // Version name: Properties to update
    lightweight: {

      // Version function (Required)
      /**
       * @param {CommandArgs} args
       */
      async f ({ content, embed, send, m, apis: { osu } }) {

        // User data fetch, with account checking and all the other crap
        const res = await get_osu({ redis: redis, prefix: this.prefix, embed, content, send, m });

        // If this was literally a promise(what is returned if no username was found)
        if(!res.user) return;
        
        // Gets the user info
        let { user, mode } = res, data;
        
        // Try getting the data. If it fails, return
        try {
          data = await osu.user({ u: user, m: mode });
        } catch(e) { return send(embed.t("No player found named '" + content + "'")); }

        // User join date
        const join = new Date(data.join)

        // User level progress bar constructor
        const max = 9; const progress = Math.round((data.lvl - Math.floor(data.lvl)) / 1 * max)

        // Calculates total circles tapped by user
        const circles = Number(data.hits[300]) + Number(data.hits[100]) + Number(data.hits[50])

        // Sends the info
        return send(

          // Calls on already setup embed
          embed

            // Title and URL
            .t(`:flag_${data.country.toLowerCase()}: ` + data.name + "'s osu! Profile").url('https://osu.ppy.sh/u/' + encodeURIComponent(data.name))

            // Description
            .d(

              // The first parts
              (progress >= 1 ? '<:bar1:733890019382657035>' + '<:bar4:733895993631834114>'.repeat(progress - 1) : '<:bar2:733893420656885771>') +

              (progress >= 1 && max - progress > 1 ? '<:bar3:733893342491836428>' : max - progress <= 1 ? '<:bar4:733895993631834114>' : '<:pog6:714449801269477428>') +

              (max - progress > 1 ? '<:bar5:733899071076696074>'.repeat(max - progress - 2) + '<:bar6:733898929967726634>' : '<:bar7:733897821224304652>') + ` **Lvl ${Math.floor(data.level)}**`)

            // Shows PP
            .af('PP', data.pp, true).af('Accuracy', Number(data.acc).toFixed(2) + '%', true)

            // Shows your plays and playtime
            .af(Number(data.play.count).toLocaleString() + ' Plays', `in ${(Number(data.play.time) / 3600).toFixed(2)} hours`, true)

            // Shows your SS count
            .af('SS count', Number(data.ranks.ss) + Number(data.ranks.ssh) + ' SSes', true) // Trashed SSes field

            // Shows level and level progress(through a kewl custom bar)
            // .af("Level " + Math.floor(user.level), "\u200b", true)

            // Shows your rank and sets your thumbnail
            .af('Rank', `#${data.rank.global} (${data.country.short}#${data.rank.country})`, true).tn('http://s.ppy.sh/a/' + data.user_id)

            // Shows how many circles you clicked
            .af(`Clicked on ${circles.toLocaleString()} circles`, `${Number(data.hits[300]).toLocaleString()}<:hit300:714227924890288220>  ${Number(data.hits[100]).toLocaleString()}<:hit100:714227924768784384>  ${Number(data.hits[50]).toLocaleString()}<:hit50:714227924387233924>`)

            // Sets footer which shows month you joined osu
            .f(`Joined in ${['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][join.getMonth()]} ${join.getFullYear()}`))
      }
    }
  },

  // Aliases (Array<String>)
  alt: 'o',

  args: [
    {
      name: 'se',
      async f ({ content, embed, send, m, apis: { osu } }) {

        // Gets user to set your profile into
        let user = content.slice(2).trim()

        // If user is unspecified, tell the user to specify it
        if (!user) {
          // Send a message in the channel to tell the user what to do
          const start = await send(embed.t("Send a message containing your osu username, or 'c' to cancel").f('Specified username should at least be greater than 2 characters'))

          // Start a message collector
          try { user = (await m.channel.awaitMessages(msg => msg.author.id === m.author.id && (msg.content === 'c' || msg.content.length > 2), { max: 1, time: 20000, errors: ['time'] })).first().content }

          // If the author doesn't send another message, the request times out
          catch (err) { return await send(start.edit(embed.a('Timed out', m.author.avatarURL()))) }

          // If the user sent a message stating they wanted to cancel, cancel the query
          if (user === 'c') { return send(embed.a('Query Cancelled', m.author.avatarURL()).f('')) }
        }

        // Gets the user stats
        let data;
        
        // Check if the user exists by sending a request to osu
        try {
          data = await osu.user({ u: user })
        } catch(e) { return send(embed.a(`User '${user}' doesn't exist!`, m.author.avatarURL()).f('')) }

        // Sets default username in redis database
        await redis.set(`d:${m.author.id}.osu.username`, data.name)

        // Sends a message confirming save
        return send(embed.t(`Default username set to ${data.name}!`).url('https://osu.ppy.sh/u/' + data.id).f("Now you only have to do '" + this.prefix + "osu' to see your osu! profile :D"))
      }
    }
  ],

  // Description
  desc: 'View your current osu! profile page!',

  // Examples (String`example1:desc,example2:desc`)
  ex: 'osu,cmdname hello',

  // How to use the command
  use: 'osu [username]',

  // APIs required
  apis: ['osu', 'redis']
}
