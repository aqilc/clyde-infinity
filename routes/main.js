
// Router thing xd
import Router from "koa-router";

// Imports the paper and bot website routes
import { bots } from "./bots.js";

// Makes and exports a new Router
export const routes = new Router();


// Paper trading bot commands
routes.use("/bots", bots.routes());

// Main thing
routes.get("/", ctx => ctx.redirect("/bots"));
