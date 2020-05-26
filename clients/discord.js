/** Discord Bot Client
 * 
 * 
 */


module.exports = function (c, cmds, { redis, osu, f }) {
  
  // Pulls in Discord APIs (or custom Discord apis)
  const { Client, embed, msg } = this.Discord;
  
  // Pulls in custom functions
  const { codify, similarity, fetch } = f;

  // Sets up Client
  let client = new Client();

  // Stores eval attributes
  let eva = {}; // Attributes: (p: Prefix, o: Output, i: Input)

  // If the bot has the 'eval' function enabled
  if(c.e)

    // If there is an object
    if(typeof c.e === "object")

      // Set eval properties based on bot config
      eva = {
        p: c.e.p,
        o: c.e.o,
        i: c.e.i
      }

    // If there is only a prefix provided
    else eva.p = c.e,
      eva.o = eva.i = true;

  // Sets it to no eval if no information is provided
  else eva = false;

  // Client login
  client.on("ready", async () => {

    // Changes username if not set to what's specified
    client.user.username !== c.u && await client.user.setUsername(c.u);

    // Logs what bot is logged in and when with all available commands loaded onto the bot
    console.log(`Bot "${c.name}" (${client.user.tag}) Online (${new Date().toLocaleString()})\ncmds available for "${c.name}": (${cmds.length}) ${cmds.map(v => v.name).join(", ")}`);
  });

  // Messages
  client.on("message", async m => {

    // Deletes token for safety
    delete c.t;

    // Eval command
    if(eva && m.content.startsWith(eva.p) && c.a.includes(m.author.id)) {
      let evalled, e = new embed(), d = "",
          { code, type } = codify(m.content.slice(eva.p.length));

      // Runs the evalled code inside of a try..catch just in case
      try {
        evalled = eval(code);
      } catch(err) { console.error(err); }

      // Logs that this happened
      console.log(`Evalled Code: ${code}\nOutput: ${evalled}`);

      // Adds information to the embed based on the options
      if(eva.i)
        eva.o = true, d = `**Input:**\`\`\`${type}\n${code}\`\`\`\n`;
      if(eva.o)
        d += `**Output:**\`\`\`${type}\n${evalled}\`\`\``;

      // Sends embed after adding a footer
      if(d !== "")
        m.channel.send(e.d(d).f(`Input Length: ${code.length}`));
    }

    // Makes it a better message
    m = msg(m);

    // Stores command if it is called in the message
    let command;

    // Checks if the message is issuing a command
    if(c.p && m.content.startsWith(c.p) && (command = cmds[cmds.findIndex(com => com.a && com.a.concat(com.name).find(comm => m.content.slice(c.p.length).startsWith(comm.name)) || m.content.slice(c.p.length).startsWith(com.name))])) {
      
      // If command specifies to delete the message, delete it before executing command
      if(command.del)
        await m.delete();
      
      // Executing command with all necessary APIs and customizations
      return command.f.call({ config: c, client, m, Discord: this.Discord, redis, embed, commands: cmds, bots: this.bots, /*canvas: this.canvas,*/ osu, f, prefix: c.p }, m, { embed: new embed().c(c.dc), content: m.content.slice((c.p + command.name).length).trim() });
    }
    
    // Increments user messagecount if user is not issuing a command
    await redis.hincrby(`discord.users[${m.author.id}]:messages`, c.name, 1);
  });

  // Sets up a custom login function
  let login = client.login;
  client.login = () => login.call(client, c.t);

  // Pushes the client object into the bots object to be exported.
  return client;
}