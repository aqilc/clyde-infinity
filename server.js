
// Brings in some process handling APIs
import cluster, { isMaster } from "cluster";

// Imports bot configs and gets project directories
import { c, a, m, project, keys } from "./config.js";

// Cool console output coloring module
import 'colors';

// Stuff the master process needs to do
if (isMaster) {

  // Makes a separate process for each bot
  for(let bot in c) {

    // Function for setting up the bot
    let setup = work => work.on("message", ([event, ...args]) => events[event](...args))

	        // Exit(restarts bot) and Online(logs some complicated message) events
          .on("exit", () => events.restart()).on("online", () => 
          console.log("New Bot Process online".bold + "\n  " + "ID:".bgRed.bold.white + " " + worker.id + " ".repeat(3 - worker.id.toString().length) + "Bot:".bgRed.bold + " " + bot + " ".repeat(10 - bot.length) + "Type:".bgRed.bold + " " + (c[bot].type || "discord"))),

        // Spawns a new worker :D
        worker = setup(cluster.fork({ bot })),

        // Houses all worker events.
        events = {
          restart: () => (console.log(`Bot ${bot} in process ${worker.id} restarting...`), worker.kill(), worker = setup(cluster.fork({ bot }))),
          die: () => (console.log("kill has occurred for bot " + bot + "(PID#" + worker.id + ")."), worker.process.kill()), killall: () => process.exit()
        };
  }
}


// The worker script itself
else try {

  // All events that the process will respond to
  const events = {},

        // Function to get all commands
        { get } = await import("./func/commands.js"),

        // The config of the bot this is assigned to
        config = c[process.env.bot],

        // Gets all bot commands
        commands = await get(config.bt, config.c.concat("bot management")),

        // All APIs
        { apis: int = []/* Application Programming (Int)erface */} = config, apis = {};

  // Gets and loads all APIs that should be available to the bot
  if(int.length) {

    // All API setups
    const all = await import("./apis.js");

    // Loops through and loads each one with error checking
    for(const api of int)
      try { apis[api] = await all[api](keys[api]);
      } catch (err) { console.log(process.env.bot.red, err); continue; }
  }

  // Filters out commands that have incompatible API and database requirements
  for (const name in commands) {

    // Gets command info
    let { apis: a = [] } = commands[name];

    // If it doesn't exist, just skip
    if (!a.length) continue;

    // If a is a string, make it an array
    if (typeof a === "string")
      a = [a];

    // Every requested API has to be available
    if(!a.every(ap => apis[ap])) {
      console.error(new Error(`Bot ${process.env.bot} doesn't have the necessary APIs to execute command '${name}'!`)); delete commands[name]; }
  };

  // Imports and calls the client for the bot.
  (await import(project.dir.append("/clients/" + (config.bt || "discord") + ".js").url)).default
    .call({ worker: cluster.worker, apis, intents: config.intents }, Object.assign(config, { name: process.env.bot, a, m, keys }), commands).login();

  // Listens for messages from the main process
  process.on("message", async ([event, ...data]) => (console.log("event happened", event), await events[event](...data)));
} catch (err) { console.log(process.env.bot.red, err); }

// Handles ~~unhandled~~ Promise rejections
process.on('unhandledRejection', error => {
  console.error((' ' + 'UNHANDLED'.trap + ' PROMISE REJECTION ').bgRed.bold, error);
});