
// osu! API
import OSU from "./func/osu.js";

// Enables redis database connections
import ioredis from "ioredis";

// Exports osu api :D
export const osu = key => new OSU(key);

// Makes and exports a new redis connection
export const redis = () => new ioredis();