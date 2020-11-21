export default {

  // Function executed
  f(m, { embed }) {


        // Gets user based on message mentions
        const mention = mentions(content)[0]
        if (mention) content = (await this.apis.redis.get(`discord.users[${mention}]:osu.username`)) || ''

        // Returns for now since there is no db currently
        if (!content) { content = (await this.apis.redis.get(`discord.users[${m.author.id}]:osu.username`)) || '' }

        // If you don't even have a default username setup, just return a message saying you should
        if (!content) { return m.channel.send(embed.a('Please set up a default username!', m.author.avatarURL()).d(`You can set one up easily with \`${this.prefix}osu se\`, or get quick stats with \`${this.prefix}osu [player name]\`.`)) }

        // Gets the user stats
        const user = (await this.apis.osu.user(content))[0]

        // If user doesn't exist, return with a message.reply
        if (!user) { return m.channel.send(embed.t("User doesn't exist!")) }

  }

  //
}
