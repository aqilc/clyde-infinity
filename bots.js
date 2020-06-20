// Gets everything needed
import { readdirSync } from "fs";

// Needed for getting dirname bc es7 dumb :D
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Evaluates __dirname and stores
const __dirname = dirname(import.meta.url);
      
// ---------------------------- Custom APIS and local files ---------------------------- \\
      
// Config stuff
import { apis, c, a, m, dbs } from "./config.js";
      
// Command class
import Command from "./func/command.js";
      
// osu API import and setup
import OSU from "./func/osu.js";
const osu = new OSU(apis.osu, 0)

// -------------------------- Databases and other storage APIs -------------------------- \\

// Redis server connection setup
import Redis from "ioredis";
const redis = new Redis();
      
// MySQL Connection
import mysql from "mysql2-promise";//.createConnection(dbs.mysql[0]),

// ------------------------------- Commands and Bot Object ------------------------------ \\
      
// Gets all clients
const clients = readdirSync(fileURLToPath(__dirname + "/clients")).map(v => v.slice(0, -3)),
      
      // Stores all clients
      bots = [],
      
      // Fetches all command directories
      cmdirs = readdirSync(fileURLToPath(__dirname + "/commands")),
      
      // Stores all commands
      cmds = {};

// Cycles through command directories and imports the commands of each
for(let dir of cmdirs) {
  
  // Holds categories
  cmds[dir] = {};
  
  // Iterates through the categories
  for(let category of readdirSync(fileURLToPath(__dirname + "/commands/" + dir)))
    
    // Inserts in commands to every category object
    cmds[dir][category] = (readdirSync(fileURLToPath(__dirname + "/commands/" + dir + "/" + category))).map(cmd => cmd.slice(0, -3))
}

// Sets up all bots
for(let i in c) {
  
  // All bots have tokens of some sort so if yours doesn't, rip
  if(!c[i].t)
    continue;
  
  // If bot command type isn't specified, specify it
  if(!clients.includes(c[i].ct))
    c[i].ct = "discord";
  
  // Stores bot commands
  const commands = [];
  
  // Identifies what commands are in the bot (if there are any)
  if(Array.isArray(c[i].c))
    
    // Loops through bot commands
    for (let cat of c[i].c.concat(["Bot Management"])) {
      
      // Determines category
      let category = cat.split(":")[0].toLowerCase();
      
      // If the category is valid
      if(Object.keys(cmds[c[i].ct]).includes(category))
        
        // If there is a command present and it is valid, make a new command based off of it and add it.
        if(cat.includes(":") && cat.split(":")[1] && cmds[c[i].ct][category].includes(cat.split(":")[1].split("@")[0]))
          try { commands.push(await (new Command(cat.split(":")[1], category, c[i].ct)).load());
          } catch (err) { console.error(err); continue; }
      
        // Else, if there is only a category, use all commands from it
        else for (let cmd of cmds[c[i].ct][category])
          try { commands.push(await (new Command(cmd, category, c[i].ct)).load());
          } catch (err) { console.error(err); continue; }
      else console.error(`Category "${cat.split(":")[0]}" inputted in bot "${i}" doesn't exist! Whole command: ${cat}`); }
  
  // If no commands exist, abort
  if (commands.length === 0)
    { console.error(`Bot "${i}" of type ${c[i].ct} doesn't have any commands!`); continue; }
  
  // Bot handler function
  const bot = async worker => (await import(__dirname + "/clients/" + c[i].ct + ".js")).default.call({ bots, worker }, Object.assign(c[i], { name: i, a, m, apis }), commands, { mysql, redis, osu });
  
  // Push the bot function into the main bots object to export
  bots.push({ bot, commands, name: i });
}

// Exports the bot object
export default bots;