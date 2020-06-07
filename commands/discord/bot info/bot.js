import { byte } from "../../../func/f.js";

export default {

    // Function executed
    f(m, { embed }) {

        embed.a("Bot info", this.client.user.avatarURL())
            .af("Memory Usage", byte(process.memoryUsage().rss))
            .d("Hello xP")

        return m.channel.send(embed)
    },

    // Aliases (Array<String>)
    a: [],
  
    // Description
    d: "This command does things",
  
    // Examples (String`example1,example2`)
    e: "cmdname,cmdname hello",
  
    // All permission things
    p: "BOT_ADMIN",
  
    // How to use the command
    u: "commandname [username]",
  
    // Hidden from a regular user (Optional)
    h: true,
}