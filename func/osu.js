// Canvas graphics API
//import Canvas from "canvas";

// HTTPS api
import get from "./request.js";

// Stringifies querystring objs for me
import { stringify as query } from "querystring";

// The links to the osu API
//const { createCanvas } = Canvas

// The osu! class with osu integration
export class osuv1 {

  // Constructor made for setting key and version of API
  constructor(key) {

    // API Key
    this.key = key;

    // Sets up map stuff
    this.map = {

      // Return the cover and thumbnail images if you input the beatmapset_id
      cover: id => `https://assets.ppy.sh/beatmaps/${id}/covers/cover.jpg`,
      thumbnail: id => `https://b.ppy.sh/thumb/${id}l.jpg`,

      // Information stuffs
      info: ({ since, b, u, m, limit, mods, s } = {}) => get(osuv1.base + "get_beatmaps?k=" + key + "&" + query(JSON.parse(JSON.stringify({ since, b, s, u, m, limit, mods }))))
    };

    // Sets up user related things
    this.user = user => ({

      // Returns url for the user's avatar
      pfp: () => get("http://s.ppy.sh/a/" + user),

      // Best user plays
      best: ({ m, limit = 10 } = {}) => get(osuv1.base + "get_user_best?k=" + key + "&u=" + user + (m ? "&m=" + m : "") + "&limit=" + limit),

      // The user's recent plays
      recent: ({ m } = {}) => get(osuv1.base + "get_user_recent?k=" + key + "&u=" + user + (m ? "&m=" + m : "")),

      // User info
      info: ({ m } = {}) => get(osuv1.base + "get_user?k=" + key + "&u=" + user + (m ? "&m=" + m : ""))
    });

    this.multi = id => get(osuv1.base + "get_match?k=" + key + "&mp=" + id);
  }

  // The base URL
  static base = "https://osu.ppy.sh/api/"

  // Mods
  static mods = ["NF", "EZ", "TD", "HD", "HR", "SD", "DT", "RX", "HT", "NC", "FL", "AT", "SO", "AP", "PF", "K4", "K5", "K6", "K7", "K8", "FI", "RD", "CN", "TG", "K9", "KC", "K1", "K2", "K3", "SV2", "MR"];

  /**
   * Converts a mod bitfield to a string of mods
   * @param {number} bits The bitfield containing the mods
   * @returns {string} The mods in a string
   */
  static calcmods(bits) {
    let mod = "";

    // Makes sure bits is a number
    bits = +bits;

    // Goes through the array backwards, computing the bits the mods should have and adding the mod to the string
    for (let i = osuv1.mods.length - 1; i >= 0; i--) {
      let m = bits - 2 ** i;
      if (m >= 0) mod += osuv1.mods[i], bits = m;
      if(bits === 0) break;
    }

    return mod;
  }

  // Map things
  maps;

  // osu! user information and links
  user;

  // Returns the url for the multi data
  multi;

  // Creates a custom image(signature) profile card
  /*sig(user) {

    // Sets up the image editing drawing board
    const canvas = createCanvas(500, 200),
          ctx = canvas.getContext("2d");


    // returns the image buffer
    return canvas.toBuffer();
  }*/
}