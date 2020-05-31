module.exports = {

    // Function executed
    f(m, { embed }) {
        return m.channel.send(embed.a("Bot info", this.client.user.avatarURL()).d("Hello xP"))
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