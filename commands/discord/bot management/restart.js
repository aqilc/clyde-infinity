export default {

  f () {
    // Process auto-restarts so xP
    this.worker.kill()
  },

  perms: 'BOT_ADMIN',

  // Only developers and mods should have access to this so we hide the command and delete the message invoking it
  hide: true,
  del: true
}
