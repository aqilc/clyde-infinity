// Sets up the app
import Koa from "koa";

// Imports bots
import bots from "./bots.js";

// Cool console output coloring module
import colors from "colors";

// Builds the app
let app = new Koa();

// Sends a 404 every time a request is sent as the website isn't out yet
app.use(ctx => ctx = { status: 404 });

// listen for requests :)
app.listen(process.env.PORT);

// Logs every bot in.
bots.login();

// Handles ~~unhandled~~ Promise rejections
process.on('unhandledRejection', error => {
	console.error('Unhandled Promise Rejection:'.bgRed, error);
});