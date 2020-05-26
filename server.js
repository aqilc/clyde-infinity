// Sets up the app
const app = new (require("koa"))();

// Imports bots
const bots = require("./bots.js");

// Sends a 404 every time a request is sent as the website isn't out yet
app.use(ctx => ctx = { status: 404 });

// listen for requests :)
app.listen(process.env.PORT);

// Logs every bot in.
bots.login();