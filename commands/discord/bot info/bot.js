import { byte } from "../../../func/f.js";

export default {

    // Function executed
    f(m, { embed }) {

        // Makes the embed
        embed.a("Bot info", this.client.user.avatarURL())
            .af("Memory Usage", byte(process.memoryUsage().rss))
            .d("Hello xP")

        // Sends the message
        return m.channel.send(embed)
    },

    // Aliases (Array<String>)
    alt: [],
  
    // Description
    desc: "This command does things",
  
    // Examples (String`example1,example2`)
    ex: "cmdname,cmdname hello",
  
    // All permission things
    perms: "BOT_ADMIN",
  
    // How to use the command
    use: "commandname [username]",
  
    // Hidden from a regular user (Optional)
    hide: true,
}