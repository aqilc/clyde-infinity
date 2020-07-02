
// Enables redis database connections
import ioredis from "ioredis";

// Makes and exports a new redis connection
export const redis = () => new ioredis();