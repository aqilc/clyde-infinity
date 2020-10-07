
// Gets the mentions in a message
import { mentions } from "../../../func/f.js";

// Contains some handy osu functions
const osu = {

  // Creates an osu embed
  embed: (m, user, embed) => {

    // User join date
    const join = new Date(user.join_date),

          // User level progress bar constructor
          max = 9, progress = Math.round((user.level - Math.floor(user.level))/1 * max),

          // Calculates total circles tapped by user
          circles = Number(user.count300) + Number(user.count100) + Number(user.count50)

    // Sends the info
    return m.channel.send(

      // Calls on already setup embed
      embed

      // Title and URL
      .t(`:flag_${user.country.toLowerCase()}: ` + user.username + "'s osu! Profile").url("https://osu.ppy.sh/u/" + encodeURIComponent(user.username))

      // Description
      .d(

        // The first parts
        (progress >= 1 ? "<:bar1:733890019382657035>" + "<:bar4:733895993631834114>".repeat(progress - 1) : "<:bar2:733893420656885771>") +

        (progress >= 1 && max - progress > 1 ? "<:bar3:733893342491836428>" : max - progress <= 1 ? "<:bar4:733895993631834114>" : "<:pog6:714449801269477428>") +

        (max - progress > 1 ? "<:bar5:733899071076696074>".repeat(max - progress - 2) + "<:bar6:733898929967726634>" : "<:bar7:733897821224304652>") + ` **Lvl ${Math.floor(user.level)}**`)

      // Shows PP
      .af("PP", user.pp_raw, true).af("Accuracy", Number(user.accuracy).toFixed(2) + "%", true)

      // Shows your plays and playtime
      .af(Number(user.playcount).toLocaleString() + " Plays", `in ${(Number(user.total_seconds_played)/3600).toFixed(2)} hours`, true)

      // Shows your SS count
      .af("SS count", Number(user.count_rank_ss) + Number(user.count_rank_ssh) + " SSes", true) // Trashed SSes field

      // Shows level and level progress(through a kewl custom bar)
      //.af("Level " + Math.floor(user.level), "\u200b", true)

      // Shows your rank and sets your thumbnail
      .af("Rank", `#${user.pp_rank} (${user.country}#${user.pp_country_rank})`, true).tn("http://s.ppy.sh/a/" + user.user_id)

      // Shows how many circles you clicked
      .af(`Clicked on ${circles.toLocaleString()} circles`, `${Number(user.count300).toLocaleString()}<:hit300:714227924890288220>  ${Number(user.count100).toLocaleString()}<:hit100:714227924768784384>  ${Number(user.count50).toLocaleString()}<:hit50:714227924387233924>`)

      // Sets footer which shows month you joined osu
      .f(`Joined in ${["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][join.getMonth()]} ${join.getFullYear()}`));
  }
}


export default {

  // Command versions(optional)
  versions: {

    // Version name: Properties to update
    lightweight: {

      // Version function (Required)
      async f(m, { content, embed }) {

        // Gets user based on message mentions
        let mention = mentions(content)[0];
        if(mention) content = (await this.apis.redis.get(`discord.users[${mention}]:osu.username`)) || "";

        // Returns for now since there is no db currently
        if(!content)
          content = (await this.apis.redis.get(`discord.users[${m.author.id}]:osu.username`)) || "";

        // If you don't even have a default username setup, just return a message saying you should
        if(!content)
          return m.channel.send(embed.a("Please set up a default username!", m.author.avatarURL()).d(`You can set one up easily with \`${this.prefix}osu su\`, or get quick stats with \`${this.prefix}osu [player name]\`.`))

        // Determines and executes command option things
        let option;
        if([1, 2].includes((option = content.slice(0, content.indexOf(" ") >= 1 ? content.indexOf(" ") : content.length)).length))

          // Options for the osu command
          return (new Proxy({

            // Set user
            se: async () => {

              // Gets user to set your profile into
              let user = content.slice(2).trim();

              // If user is unspecified, tell the user to specify it
              if(!user) {

                // Send a message in the channel to tell the user what to do
                let start = await m.channel.send(embed.t("Send a message containing your osu username, or 'c' to cancel").f("Specified username should at least be greater than 2 characters"));

                // Start a message collector
                try { user = (await m.channel.awaitMessages(msg => msg.author.id === m.author.id && (msg.content === "c" || msg.content.length > 2), { max: 1, time: 20000, errors: ["time"] })).first().content; }

                // If the author doesn't send another message, the request times out
                catch(err) { return await m.channel.send(start.edit(embed.a("Timed out", m.author.avatarURL()))); }
              }

              // If the user sent a message stating they wanted to cancel, cancel the query
              if(user === "c")
                return m.channel.send(embed.a('Query Cancelled', m.author.avatarURL()).f(""))

              // Gets the user stats
              const data = (await this.apis.osu.user(user))[0];

              // If user doesn't exist, return with a message.reply
              if(!data)
                return m.channel.send(embed.a(`User '${user}' doesn't exist!`, m.author.avatarURL()).f(''));

              // Sets default username in redis database
              await this.apis.redis.set(`discord.users[${m.author.id}]:osu.username`, data.username);

              // Sends a message confirming save
              return m.channel.send(embed.t(`Default username set to ${data.username}!`).url("https://osu.ppy.sh/u/" + data.user_id).f("Now you only have to do '" + this.prefix + "osu' to see your osu! profile :D"))
            }
          }, {
            get(t, p) {

              // If the author is able to type, do the correct thing
              if(t[p]) return t[p];

              // else tell them that they were bad bois
              return () => m.channel.send(embed.t("That osu command option doesn't exist!"));
            }
          }))[option]();

        // Gets the user stats
        const user = (await this.apis.osu.user(content))[0];

        // If user doesn't exist, return with a message.reply
        if(!user)
          return m.channel.send(embed.t("User doesn't exist!"));

        // Creates an osu user embed
        return osu.embed(m, user, embed);

      }
    }
  },

  // Aliases (Array<String>)
  alt: ["o"],

  // Description
  desc: "View your current osu! profile page!",

  // Examples (String`example1:desc,example2:desc`)
  ex: "osu,cmdname hello",

  // How to use the command
  use: "osu [username]",

  // APIs required
  apis: ["osu", "redis"]
};
