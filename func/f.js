const fs = require('fs'),
      f = {
  
  // Cleans up text for code for evalling. Returns an object
  codify(str) {
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
  },
  
  // Finds all mentions in a string
  mentions: (str) => str.replace(/\D/g, "").replace(/\s/g, " ").split(" ").filter(v => v.length === 18),
  
  // Finds a word with a an optional prefix and suffix in a string
  word: (str/*string*/, w/*word*/, p/*prefix*/, s/*suffix*/) => typeof str === "string" && typeof w === "string" && (typeof p === "object" || typeof s === "object" ? (Array.isArray(p) && p.some(pw => str.includes(` ${pw + w} `))) || (Array.isArray(s) && s.some(sw => str.includes(` ${w + sw} `))) || (Array.isArray(p) && Array.isArray(s) && p.some(pw => s.some(sw => ` ${pw + w + sw} `))) : str.includes(` ${w} `)),
  
  // Turns an array into a proper, human-readable list
  list: (arr) => {
    
    // returns if the input isn't an array
    if(!Array.isArray(arr) || arr.length < 1) return "";
    
    // Gets the last element of the array and takes it out of the main array
    let last = arr.splice(-1, 1);
    
    // Inserts an "and (last element)" and returns the result
    return (arr.length > 1 ? arr.join(", ") + " and " : "") + last;
  },
  
  // Calculates similarity between strings/an array of strings (https://glench.github.io/fuzzyset.js/)
  similarity: {
    
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
  },
  
  // Returns a sentence/phrase in title case
  titlecase: (str) => str.split(" ").map(s => s[0].toUpperCase() + s.slice(1)).join(" "),
  
  // Suite of functions for fetching stuff from the discord api
  fetch: {
    
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
  },
  
  // A suite of array functions that can be put into the Array constructor or used externally to do handy stuff
  arr: {
    
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
  },

  // Creates a random string of letters
  randstr: len => "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890"
}

// Exports everything :D
module.exports = f;