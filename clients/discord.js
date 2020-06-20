/** Discord Bot Client
 * 
 * 
 */

// Colorful logs :3
await import("colors");

import { performance } from "perf_hooks"

// Discord API stuff
import msg from "../func/discord/message.js";
import embed from "../func/discord/embed.js";

// Permissions Class
import Perms from "../func/perms.js";
      
// Custom functions to make some tasks easier
import * as f from "../func/f.js";
const { codify, similarity, fetch } = f;

// Imports Discord :D
import Discord, { Client, Permissions } from "discord.js";

// Exports the bot client
export default function (c, cmds, { redis, osu }) {

  // Sets up Client
  let client = new Client();

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
    c.a.includes(m.author.id) && perms.push("BOT_ADMIN");
    c.m.includes(m.author.id) && perms.push("BOT_MODERATOR");

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
    }

    // Checks if the message is issuing a command
    if(c.p && m.content.startsWith(c.p)) {

      // Variable for storing a command match
      let command;

      // If the command exists, proceed
      if(command = cmds.find(com => m.content.slice(c.p.length).startsWith(com.name))) {
        
        // If command specifies to delete the message, delete it before executing command
        if(command.del)
          await m.delete();
        
        // Command permissions stuff
        if(command.perms) {

          // Stuff predefined for permissions(messages sent then)
          let permsg = {

            // If the user doesn't have a specific permission
            user: perm => new embed().t(`You don't have the permission to do this!`).d(`You need the permission ${perm} to do command \`${command.name}\``),

            // If the bot doesn't have a specific permission
            bot: perm => new embed().t(`I don't have the permission to do this!`).d(`I need the permission ${perm} to do command \`${command.name}\``)
          },
              // Function for checking who doesn't have the permissions
              check = perm => !perms.has(perm) ? "user" : !botperms.has(perm) ? "bot" : false;

          // If command.perms is an string, check bot and client perms directly with the string
          if(typeof command.perms === "string") {

            // Get who doesn't have perms
            let noperms = check(command.perms);

            // If someone doesn't have perms, send corresponding message
            if(noperms)
              return m.channel.send(permsg[noperms](command.perms));
          }
          
          // else if its an array, loop through and check
          else if(Array.isArray(command.perms)) {

            // predefine 'noperms'
            let noperms;

            // Loop through the permissions
            for(let i = 0; i < command.perms.length; i ++)

              // Check if anyone is missing permissions, while setting noperms to the result
              if(noperms = check(command.perms[i]))

                // Send message if someone is, message determined by 'noperms'
                return m.channel.send(permsg[noperms](command.perms[i]))
          }
          
          // or if it's an object
          else if(typeof command.perms === "object" && (command.perms.bot || command.perms.user)) {

            // Bot permission requirements
            if (command.perms.bot)

              // If the current permission is only a string, check the bot perms for it directly
              if (typeof command.perms.bot === "string" && !botperms.has(command.perms.bot))

                // Sends default message if bot doesn't have a permission
                return m.channel.send(permsg.bot(command.perms.bot));

              else if (typeof command.perms.bot === "object") {

                // Creates variable for storing the missing permission
                let noperms;

                // if the bot commands are listen as an Array, check if the user has every permission and send a disapproval message if they don't
                if(Array.isArray(command.perms.bot) && (noperms = command.perms.bot.find(perm => !botperms.has(perm))))

                  // Rejection message for your invalid command doing attempt
                  return m.channel.send(permsg.bot(noperms));

                // If it isn't an array or null, its an object so get the values and do the crap
                else if(noperms = Object.keys(command.perms.bot).find(perm => !botperms.has(perm)))

                  // Sends custom message
                  return m.channel.send(command.perms.bot[noperms]);
              } else console.warn(` Required bot permissions listed for ${command.name} are of unknown type. `.bgYellow.bold)

            // Same thing as bot, except for user
            if (command.perms.user)

              // If the current permission is only a string, check the user perms for it directly
              if (typeof command.perms.user === "string" && !perms.has(command.perms.user))

                // Sends default message if user doesn't have a permission
                return m.channel.send(permsg.bot(command.perms.user));

              else if (typeof command.perms.user === "object") {

                // Creates variable for storing the missing permission
                let noperms;

                // If the user commands are listed as an Array, check if the user has every permission and send a disapproval message if they don't
                if(Array.isArray(command.perms.user) && (noperms = command.perms.user.find(perm => !perms.has(perm))))

                  // Rejection message for your invalid command doing attempt
                  return m.channel.send(permsg.bot(noperms));

                // If it isn't an array or null, its an object so get the values and do the crap
                else if(noperms = Object.keys(command.perms.user).find(perm => !perms.has(perm)))

                  // Sends custom message
                  return m.channel.send(command.perms.user[noperms]);
              } else console.warn(` Required bot permissions listed for ${command.name} are of unknown type. `.bgYellow.bold)
          } else console.warn(` command permissions for ${command.name} is an object but doesn't have properties specific to bot or user(needed for permission checking) `.bgYellow.bold);
        }

        // Executing command with all necessary APIs and customizations
        return command.f.call({ config: c, client, m, Discord, redis, commands: cmds, bots: this.bots, osu, prefix: c.p }, m, { embed: new embed().c(c.dc), content: m.content.slice((c.p + command.name).length).trim(), perms, botperms });
      }
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