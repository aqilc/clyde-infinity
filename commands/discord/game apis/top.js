

// Gets the osu username from a message
import { get_osu } from '../../../func/discord/f.js';

// Gets mods from bitfield string
import { osuv1 } from '../../../func/osu.js';

// Letter ranking emojis
const rank = {
  A: "<:A_:810801234260918352>",
  B: "<:B_:810801234244141066>",
  C: "<:C_:810801234083577877>",
  D: "<:D_:810801234227101696>",
  SH: "<:SH:810801234352406548>",
  S: "<:S_:810801234238898186>",
  XH: "<:XH:810801234189221939>",
  X: "<:X_:810801233974919200>"
};

const arrows = "▶⇒⇢⇛▢▶️◖◗◉◎◯↪️↣↠⋙⊗⊚⨀⩥⪫⫺⫸▸";
const arrowchar = "\\▶"; // "📁"

// Export the command.
export default {

  /**
   * Command function
   * @param {object} param0 Command parameters.
   * @param {import("discord.js").Message} param0.m The message that triggered the command.
   * @param {string} param0.content The arguments that were passed to the command.
   * @param {import("../../../func/discord/embed.js").Embed} param0.embed The premade embed to use for sending the message.
   */
  async f ({ embed, content, send, m: mess }) {

    // User data fetch, with account checking and all the other crap
    const res = await get_osu({ redis: this.apis.redis, prefix: this.prefix, embed, content, send, m: mess });

    // If the user is not found, return.
    if (!res.user) return;

    // Gets the user's top scores
    let { user: username, mode: m } = res, user = this.apis.osu.user(username),
      top = await user.best({ m }), data = (await user.info({ m }))[0];

    // Top beatmap infos
    let maps = await Promise.all(top.map(async map => (await this.apis.osu.map.info({ b: map.beatmap_id, m }))[0]));

    send(embed.t(username + '\'s top scores').url("https://osu.ppy.sh/u/${user}").d("_\n_" + maps.map((v, i) => rank[top[i].rank] + " **" + v.artist + " - " + v.title + " [" + v.version + "]**" + (+ top[i].enabled_mods ? " +" + osuv1.calcmods(top[i].enabled_mods) : "") + "\n⠀⠀ " + (+top[i].count100 + top[i].countkatu) + " \\🟢 " + top[i].count50 + " \\🟡 ").join("\n\n")).f(data.pp_raw + "pp (#" + data.pp_rank + ")", "http://s.ppy.sh/a/" + data.user_id));
  },

  // Two second cooldown.
  cd: 2000
}
