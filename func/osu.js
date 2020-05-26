// Canvas graphics API
const //{ createCanvas } = require("canvas"),
      
      // HTTPS api
      get = require("./get"),
      
      // The links to the osu API
      apis = [
        {
          
          // The base URL
          base: "https://osu.ppy.sh/api/",
          
          // Everything related to maps
          maps(id/* Beatmapset ID */, key/* API Key */) {
            
            // Other APIs
            const other = {
              
              // Return the cover and thumbnail images if you input the beatmapset_id
              cover: `https://assets.ppy.sh/beatmaps/${id}/covers/cover.jpg`,
              thumbnail: `https://b.ppy.sh/thumb/${id}l.jpg`
            };
            
            // Returns url for beatmap getting endpoint in a String object with other apis
            return Object.assign(String(apis[0].base + "get_beatmaps?k=" + key), other);
          },
          
          // Everything related to users
          user(user/* User ID or Username */, key/* API Key */) {
            
            // Other APIs
            const other = {
              
              // Returns url for the user's avatar
              pfp: "http://s.ppy.sh/a/" + user,
              
              // Best user plays
              best: apis[0].base + "get_user_best?k=" + key + "&u=" + user,
              
              // The user's recent plays
              recent: apis[0].base + "get_user_recent?k=" + key + "&u=" + user
            };
            
            // Returns object containing the string and the other apis
            return Object.assign(String(apis[0].base + "get_user?k=" + key + "&u=" + user), other);
          },
          
          // Returns the url for the multi data
          multi: (id, key) => apis[0].base + "get_match?k=" + key + "&mp=" + id,
        }
      ];


// The osu! class with osu integration
module.exports = class osu {
  
  // Constructor made for setting key and version of API
  constructor(key, ver) {
    
    // API Key
    this.key = key;
    
    // Sets API Version
    if(apis[ver])
      this.ver = ver;
  }
  
  // User stats and other stuff
  get user() {
    
    // Stores 'this' so it can be used in other scopes
    const self = this;
    
    // Other functions for user info
    let others = {
      pfp: user => req(apis[0].user(user).pfp),
      best: user => req(apis[0].user(user, this.key).best),
      recent: user => req(apis[0].user(user, this.key).recent)
    };
    
    // Returns the other functions and the original combined
    return Object.assign(function (user) {
      return req(apis[0].user(user, self.key))
    }, others)
  }
  
  // Creates a custom image(signature) profile card
  /*sig(user) {
    
    // Sets up the image editing drawing board
    const canvas = createCanvas(500, 200),
          ctx = canvas.getContext("2d");
    
    
    // returns the image buffer
    return canvas.toBuffer();
  }*/
  
  // If we ever feel like we need the urls, there is an option
  static get apis() {
    
    // Returns the "apis" variable used for the rest of the urls
    return apis;
  }
}

// Creates a function that sends a get request
async function req(url) {

  // Tries to import user data, logs and rejects if import fails
  try { return await get(url + "");
  } catch (err) { throw new Error(err); }
}