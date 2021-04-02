import { byte } from '../../../func/f.js'

export default {

  // Function executed
  f ({ embed, send }) {

    // Makes the embed
    embed.a('Bot info', this.client.user.avatarURL())
      .af('Memory Usage', byte(process.memoryUsage().rss))
      .d('Hello xP');

    let use = process.cpuUsage();

    // Measures cpu usage for 200ms
    setTimeout(() => {
      let result = process.cpuUsage(use);
      send(embed.af('CPU Usage', (100 * (result.user + result.system) / 200000).toFixed(2) + "%")
        .af("CPU Time", `**user**: \`${((use.user + result.user) / 1000).toFixed(2)}ms\`\n**system**: \`${((use.system + result.system) / 1000).toFixed(2)}ms\``));
    }, 200)
  },

  // Aliases (Array<String>)
  alt: [],

  // Description
  desc: 'This command does things',

  // Examples (String`example1,example2`)
  ex: 'cmdname,cmdname hello',

  // All permission things
  perms: 'BOT_ADMIN',

  // How to use the command
  use: 'commandname [username]',

  // Hidden from a regular user (Optional)
  hide: true
}
