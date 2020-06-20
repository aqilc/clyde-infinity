
// Brings in some process handling APIs
import cluster, { isMaster } from "cluster";

// Imports bot configs and gets project directories
import { c, a, m, project, apis } from "./config.js";

// Cool console output coloring module
await import("colors");

// Stuff the master process needs to do
if (isMaster) {

	// Starts the app :D
	const app = new (await import("koa")).default();

	// Sends a 404 every time a request is sent as the website isn't out yet
	app.use(ctx => ctx.status = 404);

	// Makes a separate process for each bot
	for(let bot in c)
		cluster.fork({ bot });
	
	// Logs worker id when a new worker is made.
	cluster.on("fork", worker => console.log(" New Worker Process made".bgWhite.bold.black + ` with a process id of ${worker.id} `.bgRed.bold))

	// listen for requests :)
	app.listen(process.env.PORT);
}


// The worker script itself
else {

	// All events that the process will respond to
	const events = {},

				// function to get all commands
				{ get } = await import("./func/commands.js"),

				// The config of the bot this is assigned to
				config = c[process.env.bot],

				// Gets all bot commands
				commands = await get(config.bt, config.c.concat("bot management")),

				// Gets redis up and running
				redis = new (await import("ioredis")).default(),

				// osu!
				osu = new (await import("./func/osu.js")).default(apis.osu);

	(await import(project.dir.append("/clients/" + (config.bt || "discord") + ".js").url)).default.call({ worker: cluster.worker }, Object.assign(config, { name: process.env.bot, a, m, apis }), commands, { redis, osu }).login();
	

	// Listens for messages from the main process
	process.on("message", async ([event, ...data]) => (console.log("event happened", event), await events[event](...data)));
}

// Handles ~~unhandled~~ Promise rejections
process.on('unhandledRejection', error => {
	console.error(' UNHANDLED PROMISE REJECTION '.bgRed.bold, error);
});