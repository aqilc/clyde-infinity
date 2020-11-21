/*
 ------ Clyde Configuration Key ------
 * project: Project directories(!!IMPORTANT!! They are accessed everywhere!)
 * apis: Object
   * (API name): "api key"
 * dbs: Configuration objects for databases
  * sqlite: string[] - SQLite database files
 * a: Admins of the bots(IDS)(Are given most priority)
  * if Array.isArray(a[i])
   * a[i][0]: Id of admin
   * a[i][0]: The bot they are admin of
 * m: Moderators (Same format as the admins)
 * c: Configs for all bots
  * [name]: Object
   * t: Token
   * u: Username(will be set to this every startup)
   * p: Prefix. Can be anything. (mentioning the bot will also work btw)
   * d: Description of the bot(will be seen when looking up bots on other bots)
   * dc: Default color for embeds.
   * c: Commands in an array of strings in a "category:name@version" format
   * e: Eval command prefix. Eval doesn't work if not set
 // * cp: Command Parameters. Changes everything globally
 */

// Imports Path class
import Path from './func/path.js'

// Imports embeds for proper message things
import embed from './func/discord/embed.js'

// Makes a new Path on project directory
const { dir } = new Path(import.meta.url)

// Project metadata
export const project = {

  // Project directories
  dir,

  // Command directories
  commands: dir.append('/commands'),

  // Log files directories
  logs: {

    // Main directory
    dir: dir.append('/logs'),

    // Child processes directory
    'child-processes': dir.append('/logs/child-processes')
  }
}

// API Keys for every available api
export const keys = {

  // osu! API Keys
  osu: '965d02dbb645026b9a3fef76a144cdd43bdcc135', // v1
  os2: '2S8PRFLbt1c0jLuFGYOAk2lahpgIZP8ekzhucUIo', // v2

  // Paper Stock Trading API keys
  stocks: {
    key: 'PKIX61BNVR9RT0B5DRUH',
    secret: '2WTRmTyLKOuvT/fOcZbqiNtq/cWE8brD84jh3Gun'
  }
}

// Holds config data for every database
export const dbs = {

  // Sqlite Database Filenames
  sqlite: ['./.db/main.db', './.db/rpg.db'],

  // MySQL servers
  mysql: [{

    // Database hostname
    host: 'clyde-infinity.cdkvmhasvlw6.us-east-2.rds.amazonaws.com',

    // Schema
    database: 'clyde',

    // Port
    port: 3306,

    // Username
    user: 'aqilcont',

    // Password
    password: 'FirF9ie4LxqJgya8P9U6'
  }]
}

// Admins
export const a = [
  '294115380916649986', // aqil#7532
  '340215110784122881', // Pikachu#8519
  '328641116884959235' // TheLuckyRobot#7381
]

// Moderators(or People in bigger servers managing bot with lower perms than Admin)
export const m = []

// Default messages across the bots
export const messages = {

  // Default messages for discord bots
  discord: {

    // Messages for permissions
    permissions: {

      // User messages
      user: perm => new embed().t(`Sorry, you can't do this command without permission \`${perm}\`.`).c('red'),

      // Bot messages
      bot: perm => new embed().t(`Sorry, I can't do this command without permission \`${perm}\`.`).c('red')
    }
  }
}

// Bot Configs
export const c = {

  // Clyde
  main: {

    // Token
    token: 'NjA2OTg2NjQ4NzcyOTM1Njkx.Xs3CLA.oqiTQyYM3eNKjvOd2dGrwnTYj14',

    // Username
    user: 'Clyde Infinity Beta',

    // Prefix
    pre: 'c@',

    // Description
    desc: 'This bot stays in AqilAcademy and is the main bot for everything',

    // Default color
    dc: 'blue',

    // Commands
    c: ['Support', 'Utility', 'Bot Info', 'Game Apis', 'RPG', 'Moderation'],

    // Special eval prefix
    eval: 'main:',

    // Bot type
    bt: 'discord',

    // APIs the bot can access
    apis: ['osu', 'redis'],

    // Modules the bot has access to
    mods: []
  },

  // Reaper's bot
  reaper: {

    // Token
    token: 'NjkzODc1ODA1Mzg1OTE2NDY3.XoDefg.NPDwUtIt3_oGOVzsPNTv5jKpjBY',

    // Username
    user: 'Under Reaper',

    // Prefix
    pre: 'p.',

    // Description
    desc: 'This bot is made specifically to moderate The Scythedom.',

    // Default color
    dc: 'red',

    // Commands
    c: ['utility', 'support', 'bot info', 'moderation'],

    // Special eval prefix
    eval: 'reaper:'
  }
}
