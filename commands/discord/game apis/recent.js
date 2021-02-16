
// Imports a function that gets an osu user.
import { get_osu } from '../../../func/discord/f.js';

export default {

  // Function executed
  async f (m, { embed, content }) {

    // Gets username and recent play data from given info
    const { user, data: recents } = await get_osu(this, m, { embed, content }, this.apis.osu.user.recent);

    // If there are none, just say so
    if(!recents.length)
      return m.channel.send(embed.t("No plays in the last 24h for profile " + user).d("play more smh"));

    console.log(recents)
  }

  //
}
