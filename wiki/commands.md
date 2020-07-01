# Everything to do with commands

## File Structure

```path
commands/
  (API name/bot client name)/
    (category)/
      (commandname).js
```

## Making Commands

Here is some starter code

```js
export default {
  
  // Command versions(optional)
  versions: {

    // Command name: Properties to update
    basic: {

      // Version function
      f(m, s) {}
    }
  },

  // Function executed(optional if arguments provided)
  f(m, s) {},

  // Hard-programmed command arguments(optional but required if no main function)
  args: [
    {
      // Function executed (required)
      f() {},

      // The argument (string|Array<string>)(required)
      name: ["settings"],

      // Whether the main function is executed or not
      main: false
    }
  ],

  // Aliases (Array<string>)
  a: [],

  // Description
  d: "This command does things",

  // Examples (string`example1:desc,example2:desc`)
  e: "cmdname,cmdname hello",

  // Contains all permission-related stuff
  perms: "MANAGE_MESSAGES" | ["KICK_MEMBERS", "MANAGE_MESSAGES"] | {

    // Permissions needed *for bot* (Object || Array<string>)
    bot: ["MANAGE_MESSAGES"] | { MANAGE_MESSAGES: "I cant even manage messages so how do you expect me to do this?" },

    // Permissions needed *for user* (Object || Array<string>)
    user: ["BOT_ADMIN"] | { BOT_ADMIN: "xP you aren't the bot admin so why should you be executing this?" }
  },

  // How to use the command
  u: "commandname [username]",

  // Hidden from a regular user (Optional)
  h: false,

  // Delete (Optional)
  del: false,

  // Default version of the command (Optional)
  dver: "basic",

  // APIs required
  apis: ["osu", "redis"],

  // Modules required
  modules: ["bad-word-filter"]
};
```

### Command Parameters and what they mean

- `a`:`Array<string>` Aliases/alternate names for the command.
  - **Example:** For command `help`: `["h", "commands"]`
- `args`:`Array<Object>`
  - `Object` Properties
    - `name`:`string | string[]` Name(s) of the command
    - `f`:`function` Function executed for this argument
    - `main`:`boolean` Whether we should still execute the main command function or not.
    - `ParentProperties`:`any` You can also redefine anything from the parent command during runtime.
- `c`:`string` Channel the command works in
  - "a": All
  - "d": DMs
  - "t": TextChannels(servers)
- `cd`:`Number` Command cooldown(how long you need to wait before reusing a command)(milliseconds)
- `d`:`string||Object` Description of the command.
  - `Object` Properties
    - `d`:`string` Text description.
    - `img`:`string` Image url, can be placed anywhere in the string and will be taken out after parsing.
- `e`:`string` Example showing how to use the command.
- `p`:`string<Permission> || Object || Array<string<Permission>>` Permissions required for the command.
  - `Object` Format
    - `bot`:`Object || Array<string<Permission>> || string<Permission>` Bot permissions
      - `Object` Format
        - Key `(permission)`: The permission needed by the user for the activation of the command.
        - Value `(message)`: The returned message for people who can't access the command because they don't have this permission.
    - `user`:`Object || Array<string<Permission>> || string<Permission>` User permissions
      - `Object` Format
        - Key `(permission)`: The permission needed by the bot to execute the command.
        - Value `(message)`: The message stating that the bot doesn't have the proper permissions.
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
      - `args`: Command arguments, if you don't have your `args` defined for handling this.
- `u`:`string` How to call the command.
  - `" ()"` means required
  - `" []"` means optional
  - `" {}"` means a list(can add items indefinitely)
- `h`:`Boolean` Hidden from help
- `del`:`Boolean` Auto-delete the original message
- `dver`:`string` Default Version
- `versions`:`Object<name:CommandObject>` Holds versions of that command
- `apis`:`string | string[]` APIs the command depends on.
- `dbs`:`string | string[]` Database connections the command depends on.

## Command functions

### `this` Object

- Will contain these objects:
  - `this.config`: The original configuration of the bot, without the token.
  - `this.apis`: APIs available to the command.
  - `this.dbs`: Database connections available to the command.
  - `this.prefix`: Bot prefix.
  - `this.commands`: All commands for the bot using the command.
  - `this.worker`: **!!!DANGEROUS TO MESS AROUND WITH!!!** The bot worker running this command.

## Command list

### Discord

| Name | Usage | Description | Arguments |
| :- | :-: | :-: | -: |
| help | `help [command name]` | Shows a helpful message for navigating the bot | `command name` |
