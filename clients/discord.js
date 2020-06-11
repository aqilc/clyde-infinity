/** Discord Bot Client
 * 
 * 
 */

// Colorful logs :3
import colors from "colors";

// Discord API stuff
import msg from "../func/discord/message.js";
import embed from "../func/discord/embed.js";

// Permissions Class
import Perms from "../func/perms.js";
      
// Custom functions to make some tasks easier
import * as f from "../func/f.js";
const { codify, similarity, fetch, findperms } = f;

// Imports Discord :D
import Discord, { Client, Permissions } from "discord.js";

// Exports the bot client
export default function (c, cmds, { redis, osu }) {

  // Sets up Client
  let client = new Client();

  // Stores eval attributes
  let eva = {}; // Attributes: (p: Prefix, o: Output, i: Input)

  // If the bot has the 'eval' function enabled
  if(c.eval)

    // If there is an object
    if(typeof c.eval === "object")

      // Set eval properties based on bot config
      eva = {
        p: c.eval.p,
        o: c.eval.o,
        i: c.eval.i
      }

    // If there is only a prefix provided
    else eva.p = c.eval,
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

    // Makes it a better message
    m = msg(m);

    // Stores command if it is called in the message, Custom permissions based on bot
    let command, perms = new Perms(), botperms = new Perms("BOT_ADMIN", "BOT_MODERATOR");

    // Adds permissions based on user privileges in the bot
    c.a.includes(m.author.id) && perms.push("BOT_ADMIN");
    c.m.includes(m.author.id) && perms.push("BOT_MODERATOR");

    // Determines member and bot permissions
    if(m.member) {

      // Member Perms
      perms.add(findperms(m.member.permissions.bitfield, Permissions.FLAGS));

      // Bot perms
      botperms.add(findperms(m.guild.me.permissions.bitfield, Permissions.FLAGS))
    }

    // Eval command
    if(eva && m.content.startsWith(eva.p) && c.a.includes(m.author.id)) {
      let evalled, e = new embed(), d = "", start = Date.now(), time,
          { code, type } = codify(m.content.slice(eva.p.length));
      
      // Runs the evalled code inside of a try..catch just in case
      try {
        evalled = eval(code);
      } catch(err) { console.error(err); }

      // Logs that this happened
      console.log(`'default eval' used on bot '${c.name}' (took ${time = Date.now() - start} ms). Code: ${code}\nOutput: ${evalled}`);

      // Adds information to the embed based on the options
      if(eva.i)
        eva.o = true, d = `**Input:**\`\`\`${type}\n${code}\`\`\`\n`;
      if(eva.o)
        d += `**Output:**\`\`\`${type}\n${evalled}\`\`\``;

      // Sends embed after adding a footer
      if(d !== "")
        m.channel.send(e.d(d).f(`Input Length: ${code.length} | Time Taken: ${time}`));
    }

    // Checks if the message is issuing a command
    if(c.p && m.content.startsWith(c.p) && (command = cmds[cmds.findIndex(com => com.a && com.a.concat(com.name).find(comm => m.content.slice(c.p.length).startsWith(comm.name)) || m.content.slice(c.p.length).startsWith(com.name))])) {
      
      // If command specifies to delete the message, delete it before executing command
      if(command.del)
        await m.delete();
      
      // Command permissions stuff
      if(command.p) {

        // If command.p is an string,
        if(typeof command.p === "string")
          if(!perms.has(command.p))
            return m.channel.send(new embed().t(`You don't have the permission to do this!`).d(`You need the permission ${command.p} to do command \`${command.name}\``));
          else if(!botperms.has(command.p))
            return m.channel.send(new embed().t(`I don't have the permission to do this!`).d(`I need the permission ${command.p} to do command \`${command.name}\``));

      }

      // Executing command with all necessary APIs and customizations
      return command.f.call({ config: c, client, m, Discord, redis, commands: cmds, bots: this.bots, osu, prefix: c.p }, m, { embed: new embed().c(c.dc), content: m.content.slice((c.p + command.name).length).trim(), perms, botperms });
    }
    
    // Increments user messagecount if user is not issuing a command
    await redis.hincrby(`discord.users[${m.author.id}]:messages`, c.name, 1);
  });

  // Sets up a custom login function
  const { login } = client;
  client.login = () => login.call(client, c.t);

  // Pushes the client object into the bots object to be exported.
  return client;
}