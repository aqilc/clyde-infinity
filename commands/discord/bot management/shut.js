export default {

    f() {

        // Shuts everything down.
        this.worker.send("killall")
    },

    perms: 'BOT_ADMIN',

    // Only developers and mods should have access to this so we hide the command and delete the message invoking it
    hide: true,
    del: true
}
