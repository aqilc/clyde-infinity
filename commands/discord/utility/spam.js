export default {

  async f ({ send, content }) {
    for (let i = 0; i < Number(content) || 0; i++) { await send('spam') }
  },

  perms: 'BOT_ADMIN',
  hide: true

}
