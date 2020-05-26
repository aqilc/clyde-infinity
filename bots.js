// Gets everything needed
const fs = require("fs"),
      
      // Discord stuff
      Discord = require("discord.js"),
      
      // Graphics API
      //canvas = require("canvas"),
      
// ---------------------------- Custom APIS and local files ---------------------------- \\
      
      // Config stuff
      { apis, c, a, m } = require("./config"),
      
      // Custom Message class
      msg = require("./func/discord/message"),
      
      // Command class
      Command = require("./func/command"),
      
      // Custom embed class
      embed = require("./func/embed"),
      
      // Custom functions to make some tasks easier
      f = require("./func/f.js"),
      
      // osu API import and setup
      osu = new (require("./func/osu.js"))(apis.osu, 1),
      
      // Redis server connection setup
      redis = new (require("ioredis"))(),
      
// ------------------------------- Commands and Bot Object ------------------------------ \\
      
      // Gets all clients
      clients = fs.readdirSync(__dirname + "/clients"),
      
      // Stores all clients
      bots = {},
      
      // Fetches all command directories
      cmdirs = fs.readdirSync(__dirname + "/commands"),
      
      // Stores all commands
      cmds = {};

// Cycles through command directories and imports the commands of each
for(let dir of cmdirs) {
  
  // Holds categories
  cmds[dir] = {};
  
  // Iterates through the categories
  for(let category of fs.readdirSync(__dirname + "/commands/" + dir))
    
    // Inserts in commands to every category object
    cmds[dir][category] = (fs.readdirSync(__dirname + "/commands/" + dir + "/" + category)).map(cmd => cmd.slice(0, -3))
}

// Sets up the Discord object with custom APIs
Object.assign(Discord, { msg, embed });

// Sets up all bots
for(let i in c) {
  
  // All bots have tokens of some sort so if yours doesnt, rip
  if(!c[i].t)
    continue;
  
  // If bot command type isnt specified, specify it
  if(!c[i].ct)
    c[i].ct = "discord";
  
  // Stores bot commands
  const commands = [];
  
  // Identifies what commands are in the bot (if there are any)
  if(Array.isArray(c[i].c))
    
    // Loops through bot commands
    for (let cat of c[i].c.push("Bot Management")) {
      
      // Determines category
      let category = f.titlecase(cat.split(":")[0]);
      
      // If the category is valid
      if(Object.keys(cmds[c[i].ct]).includes(category))
        
        // If there is a command present and it is valid, make a new command based off of it and add it.
        if(cat.includes(":") && cat.split(":")[1] && cmds[c[i].ct][category].includes(cat.split(":")[1].split("@")[0]))
          try { commands.push(new Command(cat.split(":")[1], category, c[i].ct));
          } catch (err) { console.error(err); continue; }
      
        // Else, if there is only a category, use all commands from it
        else for (let cmd of cmds[c[i].ct][category])
          try { commands.push(new Command(cmd, category, c[i].ct));
          } catch (err) { console.error(err); continue; }
      else console.error(`Category "${cat.split(":")[0]}" inputted in bot "${i}" doesn't exist! Whole command: ${cat}`); }
  
  // If no commands exist, abort
  if (commands.length === 0)
    { console.error(`Bot "${i}" of type ${c[i].ct} doesn't have any commands!`); continue; } 
  
  // Bot handler (If the client is valid, add it into the bots array to be shipped out and logged into)
  bots[i] = require(__dirname + "/clients/" + c[i].ct).call({ Discord, /*canvas,*/ bots }, Object.assign(c[i], { name: i, a: a }), commands, { redis, osu, f });
  
  // Deletes bot if it doesnt exist anyways
  if (!bots[i])
    delete bots[i];
}

// Defines the login method that logs in all bots at call.
Object.defineProperty(bots, "login", {
  value() {
    
    // Loops through everything.
    for(let i in this)
      this[i].login();
  }
})

// Exports the bot object
module.exports = bots;