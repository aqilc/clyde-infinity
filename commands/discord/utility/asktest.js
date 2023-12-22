import { ask } from '../../../func/discord/f.js';

export default {
  hide: true,
  async f({ m, embed, send, content }) {
    console.log(await ask(m, embed.t(content || "hewwo bro"), "gey"));
    send("it worked!")
  }
};