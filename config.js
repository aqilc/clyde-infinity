/* Clyde Configuration Key
 * dbs: File paths for databases
 * a: Admins of the bots(IDS)(Are given most priority)
 *  if(a[i] === "object")
 *   a[i][0]: Id of admin
 *   a[i][0]: The bot they are admin of
 * m: Moderators (Same format as the admins)
 * c: Configs for all bots
 *  [name]: Object
 *   t: Token
 *   u: Username(will be set to this every startup)
 *   p: Prefix. Can be anything. (mentioning the bot will also work btw)
 *   d: Description of the bot(will be seen when looking up bots on other bots)
 *   dc: Default color for embeds.
 *   c: Commands in an array of strings in a "category:name@version" format
 *   e: Eval command prefix. Eval doesn't work if not set
 * cp: Command Parameters. Changes everything globally
 */

  
// API Keys for every available api
export const apis = {
  
  // osu! API Keys
  osu: "965d02dbb645026b9a3fef76a144cdd43bdcc135", // v1
  os2: "2S8PRFLbt1c0jLuFGYOAk2lahpgIZP8ekzhucUIo", // v2
};

// Holds config data for every database
export const dbs = {

  // Sqlite Database Filenames
  sqlite: ["./.db/main.db", "./.db/rpg.db"],

  // MySQL servers
  mysql: [{

    // Database hostname
    host: "rpg.cdkvmhasvlw6.us-east-2.rds.amazonaws.com",

    // Schema
    database: "rpg",

    // Port
    port: 3306,

    // Username
    user: "aqilcont",

    // Password
    password: "A5kxL49qvMbG8rwo0c5K"
  }]
};

// Admins
export const a = [
  "294115380916649986", // aqil#0001
  "340215110784122881", // Pikachu#8519
];

// Moderators(or People in bigger servers managing bot with lower perms than Admin)
export const m = [];

// Bot Configs
export const c = {
  
  // Clyde
  main: {
    // Token
    t: "NjA2OTg2NjQ4NzcyOTM1Njkx.Xs3CLA.oqiTQyYM3eNKjvOd2dGrwnTYj14",
    
    // Username
    u: "Clyde Infinity Beta",
    
    // Prefix
    p: "c@",
    
    // Description
    d: "This bot stays in AqilAcademy and is the main bot for everything",
    
    // Default color
    dc: "blue",
    
    // Commands
    c: ["Support", "Utility", "Bot Info", "Game Apis", "RPG"],
    
    // Special eval prefix
    e: "main:",
    
    // Command directory/type
    ct: "discord",

    // Clyde Admins
    admin: [],

    // Clyde Moderators
    mod: []
  },
  
  // Reaper's bot
  reaper: {
    // Token
    t: "NjkzODc1ODA1Mzg1OTE2NDY3.XoDefg.NPDwUtIt3_oGOVzsPNTv5jKpjBY",
    
    // Username
    u: "Under Reaper",
    
    // Prefix
    p: "p.",
    
    // Description
    d: "This bot is made specifically to moderate The Scythedom.",
    
    // Default color
    dc: "red",
    
    // Commands
    c: ["utility", "support", "bot info"],
    
    // Special eval prefix
    e: "reaper:"
  }
};

// Command Parameters
/*cp: {
  u: {
    d: "Usage",
    type: "string"
  };
  a: {
    d: "Aliases",
    type: "object"
  };
  d: {
    d: "Description",
    type: "string"
  };
  p: {
    d: "Permissions",
    type: "string||object"
  };
  e: {
    d: "Example",
    type: "string||object"
  };
  h: {
    d: "Hidden",
    type: "boolean"
  };
  del: {
    d: "Delete User's Message",
    type: "boolean"
  };
  spre: {
    d: "Special Prefix",
    type: "string||object"
  };
  func: {
    d: "Function",
    type: "function"
  }
}*/
