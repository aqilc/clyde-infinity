
// Gets database files and names
let { dbfiles } = require("../config"),
    
    // Stores database files and names
    dbs = {};

// Loops through and sets the name of the database the file name and then sets that value to the file path
for(let i of dbfiles)
  dbs[i.slice(i.lastIndexOf("/"), i.lastIndexOf("."))] = i;

// Loads all databases
module.exports = async function() {
  
  // Contains all the databases
  let db = [];
  
  // Loops through the databases and opens them
  for (let i in dbs)
    db[i] = require("sqlite"), await db[i].open(dbs[i]);
  
  // returns all databases
  return db;
};

// Loads separate databases
for (let i in dbs)
  module.exports[i] = async function() {
    
    // Imports sqlite
    let s = require("sqlite");
    
    // Opens database
    await s.open(dbs[i]);
    
    // Return the open database
    return s;
  }