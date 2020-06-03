
// Gets database files and names
import { dbfiles } from "../config";
    
// Stores database files and names
const dbs = {};

// Loops through and sets the name of the database the file name and then sets that value to the file path
for(let i of dbfiles)
  dbs[i.slice(i.lastIndexOf("/"), i.lastIndexOf("."))] = i;

// Loads all databases
async function db() {
  
  // Contains all the databases
  let db = [];
  
  // Loops through the databases and opens them
  for (let i in dbs)
    db[i] = await import("sqlite"), await db[i].open(dbs[i]);
  
  // returns all databases
  return db;
};

// Loads separate databases
for (let i in dbs)
  dbs[i] = function() {
    
    // Imports sqlite
    let s = import("sqlite");
    
    // Opens database
    await s.open(dbs[i]);
    
    // Return the open database
    return s;
  }

// Exports everything
export default dbs;