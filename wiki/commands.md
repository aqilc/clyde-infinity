# File Structure

```fs
commands/
  (API name/bot client name)/
    (category)/
      (commandname).js
```

# Making Commands

Here is some starter code

```js
module.exports = {
  
  // Command versions(optional)
  versions: {
    
    // Command name: Properties to update
    basic: {
      
      // Version function (Required)
      f(m, s) {}
    }
  },

  // Function executed
  f(m, s) {},

  // Aliases (Array<String>)
  a: [],

  // Description
  d: "This command does things",

  // Examples (String`example1,example2`)
  e: "cmdname,cmdname hello",

  // Permissions needed *for bot* (same as parameter `p`)
  bp: ["MANAGE_MESSAGES"],

  // Permissions needed *for user* (Object || Array<String>)
  p: ["BOT_OWNER"],

  // How to use the command
  u: "cmdname [username]",

  // Hidden from a regular user (Optional)
  h: false,

  // Delete (Optional)
  del: false,

  // Default version of the command (Optional)
  dver: "basic"
};
```

### Command Parameters and what they mean

- `a`:`Array<String>` Aliases/alternate names for the command.
  - **Example:** For command `help`: `["h", "commands"]`
- `c`:`String` Channel the command works in
  - "a": All
  - "d": DMs
  - "t": TextChannels(servers)
- `cd`:`Number` Command cooldown(how long you need to wait before reusing a command)
- `d`:`String||Object` Description of the command.
  - `Object` Properties
    - `d`:`String` Text description.
    - `img`:`String` Image url, can be placed anywhere in the string and will be taken out after parsing.
- `e`:`String` Example showing how to use the command.
- `p`:`Object || Array<String>` Permissions required for the command.
  - `Object` Format
    - Key `(permission)`: The permission needed by the user for the activation of the command
    - Value `(description)`: The returned message for people who can't access the command because they don't have this permission.
- `bp`:`Object || Array<String>` Permissions needed by the bot to execute this command
  - `Object` Format
    - Key `(permission)`: The permission needed by the bot to execute the command.
    - Value `(description)`: The returned message for the user when the bot is denied permissions to use the command.
- `f`:`Function(m, s)` The function that happens when the command is called.
  - Inherited Objects
    - `Discord`: The discord.js API
    - `client`: Bot client
    - `commands`: All bot commands (in `Command` classes)
    - `m`: The message, same as the `m` parameter
    - `embed`: Embed class, different from whats in the `s` parameter
    - `bots`: All bots that could be properly processed
  - `m`:`Message` Parameter: The message calling the command
  - `s`:`Object` Parameter: Handy, already processed info
    - Properties:
      - `embed`: An already created embed.
      - `content`: Message content without the command in it.
- `u`:`String` How to call the command.
  - `" ()"` means required
  - `" []"` means optional
  - `" {}"` means a list(can add items indefinitely)
- `h`:`Boolean` Hidden from help
- `del`:`Boolean` Auto-delete the original message
- `dver`:`String` Default Version
- `versions`:`Object<name:CommandObject>` Holds versions of that command

# Command functions

### `this` Object

- Will contain these objects:
  - `this.config`: The original configuration of the bot, without the token
  - ``
  - `this.commands`: All commands for the bot using the command
