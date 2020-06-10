// Imports cryptographic functions
import crypto from "crypto";

// Imports filesystem modules
import { readdirSync } from "fs";

/** Finds all mentions in a string
 * @param {string} str
 * @returns {string}
*/
export const mentions = (str) => str.replace(/\D/g, "").replace(/\s/g, " ").split(" ").filter(v => v.length === 18);

/**
 * Finds words(with optional prefixes and suffixes) in a string
 * @param {string} str 
 * @param {string} w 
 * @param {string|string[]} p 
 * @param {string|string[]} s 
 */
export const word = (str/*string*/, w/*word*/, p/*prefix*/, s/*suffix*/) => typeof str === "string" && typeof w === "string" && (Array.isArray(p) || Array.isArray(s) ? (Array.isArray(p) && p.some(pw => str.includes(` ${pw + w} `))) || (Array.isArray(s) && s.some(sw => str.includes(` ${w + sw} `))) || (Array.isArray(p) && Array.isArray(s) && p.some(pw => s.some(sw => ` ${pw + w + sw} `))) : str.includes(` ${w} `));

// Creates a hash
export const hash = str => crypto.createHash("sha256").update(str).digest();

// Returns a sentence/phrase in title case
export const titlecase = str => str.split(" ").map(s => s[0].toUpperCase() + s.slice(1)).join(" ");

/**
 * Converts an object into an array
 * @param {Object} obj 
 * @returns {Array<string, *>}
 */
export const objtoarr = obj => obj.length ? obj : Object.keys(obj).map(k => [k, obj[k]]);

// Reads the directories and classifies files and folders
export const readdir = dir => {

  // Reads the directory
  dir = readdirSync(dir.startsWith("file:///") ? new URL(dir) : dir, { withFileTypes: true });

  // Gets folders
  let folders = dir.filter(v => v.isDirectory()).map(f => f.name),

      // Gets file names and maps them into objects
      files = dir.filter(f => f.isFile()).map(({ name }) => {
        let period = name.lastIndexOf("."),
            type = period > 0 && name.slice(period + 1);
        name = period > 0 ? name.slice(0, period) : name
        return { name, type }
      });
  
  // Returns the contents of the directory
  return { folders, files }
}

/**
 * Reads EVERYTHING in a directory :D\
 * WARNING: Could take a long time depending on the directory
 * @param {string} dir
 * @returns {Object<folders: Object|files: Array>}
 */
export const readeverything = dir => {

  // Reads the directory inputted
  let directory = readdir(dir),
      folders = {};

  // Gets all the data in all folders
  for(let i of directory.folders)
    folders[i] = readeverything(dir.endsWith("/") || dir.endsWith("\\") ? dir + i : dir + "/" + i)

  // Sets the original directory's folders to the folders we just got
  directory.folders = folders;

  // Returns the resulting object
  return directory;
}

// Converts a number into a human-readable byte system number
export const byte = num => {

  // Levels of byte divisions
  let levels = ["bits", "kb", "mb", "gb", "tb", "pb"], level = 0;

  // Loops through divisions of the numbers while also determining level
  while (num >= 1024)
    num /= 1024, level ++;

  // Returns the rounded number + the level of byte division
  return num.toFixed(2) + " " + levels[level];
}

// Turns an array into a proper, human-readable list
export const list = arr => {
  
  // returns if the input isn't an array
  if(!Array.isArray(arr) || arr.length < 1) return "";
  
  // Gets the last element of the array and takes it out of the main array
  let last = arr.splice(-1, 1);
  
  // Inserts an "and (last element)" and returns the result
  return (arr.length > 1 ? arr.join(", ") + " and " : "") + last;
};

// Cleans up text for code for evalling. Returns an object
export function codify(str) {
  str = str.trim();
  
  // Object for returning
  let v = {
    code: "",
    type: "js"
  };
  
  // Takes out code block stuff
  if(str.search(/```[\w]*/) === 0 && str.endsWith("```"))
    v.type = str.match(/```(\w)/)[1], str = str.slice(str.match(/```[\w]*/)[0].length, -3).trim();
  
  // Returns v + the code
  return v.code = str, v;
};

// Finds permissions/values based on object inputs
export function findperms(bitfield, permobj) {

  // Converts the permobj into an iterable array and sorts based on values
  permobj = objtoarr(permobj).sort((a, b) => b[1] - a[1]);

  // Stores the permissions
  let perms = [];

  for(let i of permobj)
    if(bitfield - i[1] > 0)
      bitfield -= i[1], perms.push(i[0]);

  // Return the permissions
  return perms;
}

// Suite of functions for fetching stuff from the discord api
export const fetch = {
  
  // Fetches a bunch of messages, almost to Infinity, until it encounters some undeletable ones(Input: MessageManager ie. m.channel.messages, Amount)
  async messages(manager, amount) {
    
    if(typeof amount !== "number")
      throw new TypeError("\"amount\" not of correct type")
    
    // Stores messages
    let m = manager.cache.array();
    
    // Slices off the size we already have cached.
    amount -= m.length;
    
    // Fetches all messages and caches them :D
    while (m.length < amount) {
      
      // Sets up the options for getting messages
      let opts = {
        
        // How many messages should be gotten
        limit: Math.min(amount - m.length, 100)
      };
      
      // If *any* messages are cached, find the oldest one and add it into the options
      if(m.length)
        opts.before = m.reduce((a, b) => Math.min(a.createdTimestamp, b.createdTimestamp)).id;
      
      // Fetches as many messages as needed before the last message we currently have :D
      (await manager.fetch(opts)).each(v => m.push(v));
      
      // If undeletable messages are encountered, filter them out of the cache and exit the loop
      if(m.find(mes => !mes.deletable))
        { let mess; console.log("filtered", mess = (m = m.filter(mes => mes.deletable)).map(v => v.content), mess.length); break; }
    }
    
    // Returns the cache
    return m;
  }
};

// A suite of array functions that can be put into the Array constructor or used externally to do handy stuff
export const arr = {
  
  // Shuffles the array
  shuffle(array) {

    // If this function was applied to the Array prototype object already, switch around values accordingly
    if(Array.isArray(this))
      array = this;
    
    // Loop through the array, end to beginning
    for (let i = array.length - 1; i > 0; i--) {
      
      // Find a random value before the current one
      let j = Math.floor(Math.random() * (i + 1));
      
      // Switch out the current value with the random one.
      [array[i], array[j]] = [array[j], array[i]];
    }
    
    return array;
  },
  
  // Finds a minimum value in an array and returns it.
  min(array, fn) {

    // If this function was applied to the Array prototype object already, switch around values accordingly
    if(Array.isArray(this))
      array = this, fn = array;
    
    // If fn was a function, apply the function to the values
    if(typeof fn === "function")
      return array.reduce((a, b) => Math.min(fn(a), fn(b)))
    
    // else, just do it normally
    else return array.reduce((a, b) => Math.min(a, b))
  }
};

// Creates a random string of letters
export const rand = {

  // Generates a random string
  str(len, { special, numsonly }) {

    // The returned string
    let str = "",

    // Determines letters
    letters = (numsonly && "1234567890") || "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890" + (special && "!@#$%^&*()_+-=\\/?[]{}<>'\";:.,`~" || "");

    // Gets a random letter and adds it
    for (let i = 0; i < len; i ++)
      str += letters[Math.floor(Math.random() * letters.length)];
    
    // Returns constructed string
    return str;
  }
};

// Calculates similarity between strings/an array of strings (https://glench.github.io/fuzzyset.js/)
export const similarity = {
  
  // Levenshtein Algorithm: Computes the steps it takes to get from string a to string b and then returns a percentage based on that. Stolen from js-levenshtein
  l: (function() {
    function _min(d0, d1, d2, bx, ay) {

      // Custom comparison algorithm for efficient parsing
      return d0 < d1 || d2 < d1
          ? d0 > d2
              ? d2 + 1
              : d0 + 1
          : bx === ay
              ? d1
              : d1 + 1;
    }
    
    // Returns custom levelshtein algorithm function
    return function(a, b) {
      if (a === b) {
        return 0;
      }

      if (a.length > b.length) {
        let tmp = a;
        a = b;
        b = tmp;
      }

      let la = a.length;
      let lb = b.length;

      while (la > 0 && (a.charCodeAt(la - 1) === b.charCodeAt(lb - 1))) {
        la--;
        lb--;
      }

      let offset = 0;

      while (offset < la && (a.charCodeAt(offset) === b.charCodeAt(offset))) {
        offset++;
      }

      la -= offset;
      lb -= offset;

      if (la === 0 || lb < 3) {
        return lb;
      }

      let x = 0;
      let y;
      let d0;
      let d1;
      let d2;
      let d3;
      let dd;
      let dy;
      let ay;
      let bx0;
      let bx1;
      let bx2;
      let bx3;

      let vector = [];

      for (y = 0; y < la; y++) {
        vector.push(y + 1);
        vector.push(a.charCodeAt(offset + y));
      }

      let len = vector.length - 1;

      for (; x < lb - 3;) {
        bx0 = b.charCodeAt(offset + (d0 = x));
        bx1 = b.charCodeAt(offset + (d1 = x + 1));
        bx2 = b.charCodeAt(offset + (d2 = x + 2));
        bx3 = b.charCodeAt(offset + (d3 = x + 3));
        dd = (x += 4);
        for (y = 0; y < len; y += 2) {
          dy = vector[y];
          ay = vector[y + 1];
          d0 = _min(dy, d0, d1, bx0, ay);
          d1 = _min(d0, d1, d2, bx1, ay);
          d2 = _min(d1, d2, d3, bx2, ay);
          dd = _min(d2, d3, dd, bx3, ay);
          vector[y] = dd;
          d3 = d2;
          d2 = d1;
          d1 = d0;
          d0 = dy;
        }
      }

      for (; x < lb;) {
        bx0 = b.charCodeAt(offset + (d0 = x));
        dd = ++x;
        for (y = 0; y < len; y += 2) {
          dy = vector[y];
          vector[y] = dd = _min(dy, d0, dd, bx0, vector[y + 1]);
          d0 = dy;
        }
      }

      return dd;
    };
  })()
};
