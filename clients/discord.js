/** Discord Bot Client
 * 
 * 
 */

// Colorful logs :3
await import("colors");

// For benchmarks :D
import { performance } from "perf_hooks";

// Discord API stuff
import msg from "../func/discord/message.js";
import embed from "../func/discord/embed.js";

// Permissions Class
import Perms from "../func/perms.js";
      
// Custom functions to make some tasks easier
import * as f from "../func/f.js";
const { codify, fetch } = f;

// Imports Discord :D
import Discord, { Client, Permissions } from "discord.js";

// Imports this for the 'find' function thats so op
import Command from "../func/command.js";
const { find: cfind } = Command;

// Exports the bot client with basic functionality
export default function (c, cmds) {

  // Sets up Client
  let client = new Client(),

      // Gets all native objects
      { apis, worker } = this;

  // Stores eval attributes
  let aval = {}; // Attributes: (p: Prefix, o: Output, i: Input)

  // If the bot has the 'eval' function enabled
  if(c.eval)

    // If there is an object
    if(typeof c.eval === "object")

      // Set eval properties based on bot config
      aval = {
        p: c.eval.p,
        o: c.eval.o,
        i: c.eval.i
      }

    // If there is only a prefix provided
    else aval.p = c.eval,
      aval.o = aval.i = true;

  // Sets it to no eval if no information is provided
  else aval = false;

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
    let perms = new Perms(), botperms = new Perms("BOT_ADMIN", "BOT_MODERATOR");

    // Adds permissions based on user privileges in the bot
    c.a.includes(m.author.id) && perms.add("BOT_ADMIN");
    c.m.includes(m.author.id) && perms.add("BOT_MODERATOR");

    // Determines member and bot permissions
    if(m.member) {

      // Member Perms
      perms.add(Perms.find(m.member.permissions.bitfield, Permissions.FLAGS));

      // Bot perms
      botperms.add(Perms.find(m.guild.me.permissions.bitfield, Permissions.FLAGS))
    }

    // Eval command
    if(aval && m.content.startsWith(aval.p) && c.a.includes(m.author.id)) {
      let evalled, e = new embed(), d = "", start = performance.now(), time,
          { code, type } = codify(m.content.slice(aval.p.length));
      
      // Runs the evalled code inside of a try..catch just in case
      try {
        evalled = eval(code);
      } catch(err) { console.error(err); }

      // Logs that this happened
      console.log(` 'default eval' used on bot '${c.name}' (took ${time = performance.now() - start} ms). `.bgYellow.bold + "\n" + " Code ".bgGreen.bold + " " + code + "\n"  + " Output ".bgRed.bold + " " + evalled);

      // Adds information to the embed based on the options
      if(aval.i)
        aval.o = true, d = `**Input:**\`\`\`${type}\n${code}\`\`\`\n`;
      if(aval.o)
        d += `**Output:**\`\`\`${type}\n${evalled}\`\`\``;

      // Sends embed after adding a footer
      if(d !== "")
        m.channel.send(e.d(d).f(`Input Length: ${code.length} | Time Taken: ${time}`));

      // heh im not risking something weird happening
      return;
    }

    // Checks if the message is issuing a command
    let { content } = m, pre = "<@" + client.user.id + ">";
    if((c.pre && content.startsWith(c.pre) && (content = content.slice(c.pre))) || (content.startsWith(pre) && (content = content.slice(pre)))) {

      // Variable for storing a command match
      const { command, flags, args } = cfind(cmds, content, c.pre);

      // If the command exists, proceed
      if(command) {

        // You need to be in a valid channel to use this command
        if (command.chnl && command.chnl !== "all" && command.chnl !== m.channel.type)
          return m.channel.send(new embed("This command can't be used in this channel!").c("red").f(`Only allowed in ${{ text: "servers", dm: "DMs" }[command.chnl]}.`));
        
        // If command specifies to delete the message, delete it before executing command
        if (command.del)
          await m.delete();
        
        // Command permissions stuff
        if (command.perms) {

          // Gets the permissions and stores them
          const { user, bot } = command.perms;

          // Checks through bot permissions
          for(let i in bot)
            if(!botperms.has(i))
              return m.channel.send(bot[i]);

          // Checks through user permissions
          for(let i in user)
            if(!perms.has(i))
              return m.channel.send(user[i]);
        }

        // Executing command with all necessary APIs and customizations
        return command.f.call({ worker, config: c, client, m, Discord, commands: cmds, apis, prefix: c.pre }, m, {
          embed: new embed().c(c.dc),
          content: content.slice(command.name.length).trim(),
          perms, botperms, args, flags
        });
      }
    }
  });

  // Sets up a custom login function
  const { login } = client;
  client.login = () => login.call(client, c.token);

  // Pushes the client object into the bots object to be exported.
  return client;
}