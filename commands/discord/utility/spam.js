export default {

  async f(m, { content }) {
    for(let i = 0; i < Number(content) || 0; i ++)
      await m.channel.send("spam");
  },

  perms: "BOT_ADMIN", hide: true

}
