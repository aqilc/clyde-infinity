
// Colorful logs :3
import "colors";

// For benchmarks :D
import { performance } from "perf_hooks";

// Discord API stuff
import { Embed as embed } from "../func/discord/embed.js";

// Permissions Class
import Perms, { discord as dperms } from "../func/perms.js";

// Ratelimits
import { ratelimit } from "../func/f.js";
const rates = ratelimit();

// Custom functions to make some tasks easier
import { codify } from "../func/discord/f.js";

// Imports Discord :D
import Discord, { Client } from "eris";

// Imports this for the 'find' function thats so op
import Command from "../func/command.js";
const { find: cfind } = Command;

// Exports the bot client with basic functionality
export default function (c, cmds) {

  // Sets up Client
  let client = new Client(c.token, { compress: true, intents: this.intents, partials: ['MESSAGE', 'CHANNEL', 'REACTION'], }),

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
    if(client.user.username !== c.user) await client.editSelf({ username: c.user });

    // Logs what bot is logged in and when with all available commands loaded onto the bot
    console.log(`Bot "${c.name}" (${client.user.username + "#" + client.user.discriminator}) Online (${new Date().toLocaleString()})\ncmds available for "${c.name}": (${Object.keys(cmds).length}) ${Object.keys(cmds).join(", ")}`);
  });

  // Client Invalidation handler
  client.on("invalidated", () => { console.error(("(ID: " + worker.id + ") INVALIDATED".zalgo + "FOR SOME REASON").bgRed); worker.send("die"); });

  // Client Error handler
  client.on("error", err => { console.error(`An error occurred on bot "${c.name}": ${err}\n\n\tKilling...`); worker.send("die"); })

  // Messages
  client.on("messageCreate", async m => {

    console.log('this did happen right')

    // Deletes token for safety
    delete c.token;

    // Stores command if it is called in the message, Custom permissions based on bot
    let perms = new Perms(), botperms = new Perms("BOT_ADMIN", "BOT_MODERATOR");

    // Adds permissions based on user privileges in the bot
    c.a.includes(m.author.id) && perms.add("BOT_ADMIN");
    c.m.includes(m.author.id) && perms.add("BOT_MODERATOR");

    // Determines member and bot permissions
    if(m.member) {

      // Member Perms
      perms.add(Perms.find(m.member.permissions.allow, dperms));

      // Bot perms
      botperms.add(Perms.find(m.channel.guild.members.filter(v => v.id === client.user.id).permissions.allow, dperms))
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
        m.channel.send(e.d(d).f(`Input Length: ${code.length}  |  Time Taken: ${time.toFixed(4)}ms`));

      // heh im not risking something weird happening
      return;
    }

    // Checks if the message is issuing a command
    let { content } = m, pre = new RegExp("^(<@!?" + client.user.id + ">).*");
    if(c.pre && content.startsWith(c.pre) ? (content = content.slice(c.pre.length)) : (pre.test(content) && (content = content.slice(content.match(pre)[0].length)))) {

      // Variable for storing a command match
      const { command, flags, args, name } = cfind(cmds, content);

      // If the command exists, proceed
      if (command) {

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

        // Cooldown stuff
        if (command.cd)
          if(!rates[name])
            rates(name, command.cd)(m.author.id);
          else if(!rates[name](m.author.id))
            return (await m.channel.send(new embed("Please wait " + command.cd/1000 + " seconds before using it again.").c("red"))).delete({ timeout: 2000 });

        // Executing command with all necessary APIs and customizations
        return command.f.call({ worker, config: c, client, Discord, commands: cmds, prefix: c.pre }, {
          embed: new embed().c(c.dc), send: m.channel.send.bind(m.channel), m,
          content: content.slice(name.length).trim(),
          perms, botperms, args, flags, apis
        });
      }
    }
  });

  // Sets up a custom login function
  client.login = () => client.connect();

  // Pushes the client object into the bots object to be exported.
  return client;
}