/// <reference path="../../../func/typedef.js" />

// Imports a function that gets an osu user.
import { get_osu } from '../../../func/discord/f.js';

export default {

  // Function executed
  
  /**
   * @param {CommandArgs} args
   */
  async f ({ embed, content, send, m, apis: { redis, osu } }) {

    // Gets username and recent play data from given info
    const { user, mode } = await get_osu({ redis, prefix: this.prefix, embed, content, send, m });

    // For dealing with returned sent messages/promises
    if(!user.length) return;

    // Gets the actual recents
    const recents = await osu.recent({ u: user, m: mode });

    // If there are none, just say so
    if(!recents.length)
      return send(embed.t("No plays in the last 24h for profile " + user).f("play more smh"));

    /** @type {V1BeatmapObject[]} */
    let beatmaps = [];
    for(let i = 0, len = Math.min(5, recents.length); i < len; i ++)
      beatmaps.push(await osu.beatmap({ id: recents[i].beatmap }));


    
    console.log(recents, beatmaps);
  }

  //
}
