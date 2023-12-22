
// osu! API
import { V1 } from "@aqilcont/osu-api-extended"

// Enables redis database connections
import ioredis from 'ioredis'

// Exports osu api :D
export const osu = key => new V1(key)

// Makes and exports a new redis connection
export const redis = () => new ioredis()
