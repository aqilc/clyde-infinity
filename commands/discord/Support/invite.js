export default {
  
    f: (m, { embed }) => m.channel.send(embed.a("Invite me!", m.author.avatarURL(), "https://discord.com/oauth2/authorize?client_id=606986648772935691&scope=bot").f("(click on the \"Invite me!\" thing")),
    
    // Description
    d: "Lets you invite Clyde to your server!",
    
    // How to utilize
    u: " [command_name]",
    
    // Example
    e: "invite",
    
    // Channels it works in(a for all, d for dms, and t for guild channels) 
    c: "a",
  }