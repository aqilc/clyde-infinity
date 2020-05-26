# Redis Databases

**Format:**

```md

## Classification of data and keys

(Description)

[Table containing key formats, their values and descriptions]
```

## Discord Users

- `discord.users[<user id>]:messages`:`Hash`
  - Hash format:
    - Field: `<bot name>`
    - Value: `<message number>`
- `discord.users[<user id>]:blacklist`:`List` Bots the user is blacklisted in
  - List value format: `<bot name>` or `global` for all bots
- `discord.users[<user id>]:commands.blacklist`:`Hash` Commands the user is blacklisted from using
  - Hash format:
    - Field: `<bot name>` or `global` for all bots
    - Value: `<command name(not aliases)>`
- `discord.users[<user id>]:commands.remaps`:`Hash` Remapping command names(like custom aliases)
- `discord.users[<user id>]:prefixes`:`Hash` User custom prefixes for certain bots
  - Hash format:
    - Field: `<bot name>` or `global` for all bots
    - Value: `<String(22)>`
- `discord.users[<user id>]:osu.username`:`<String>` osu! username for osu commands
- `discord.users[<user id>]:osu.mode`:`<String('fruits' || 'osu' || 'mania' || 'taiko')>` osu! user default game mode
- `discord.users[<user id>]:osu.command.defaultfunc`:`String('r' || 'p')`

## RPG



# SQL Databases

**Format:**

```md
## Database Name

### Table Name

[Table containing table attributes]

### Table 2 Name

...
```

## Settings

### GuildSettings

| Attribute   |                   Content                    |                                            Description |
| :---------- | :------------------------------------------: | -----------------------------------------------------: |
| `id`        |                 `String(18)`                 |                        Guild ID for row identification |
| `blacklist` |              `(Bot Name) | ...`              |      Disables the use of specified bots in that server |
| `prefix`    | `(Bot Name) - String(Min: 1, Max: 22) | ...` |                                           Guild prefix |
| `mod`       |                 `String(18)`                 |                              Guild's Moderator role ID |
| `admin`     |                 `String(18)`                 |                          Guild's Administrator role ID |
| `logid`     |                 `String(18)`                 |              ID of Channel where Clyde logs everything |
| `logtype`   |    `everything` or `minimal` or `medium`     | Stores how much information to log in said log channel |

### ChannelSettings

| Attribute   |      Content       |                          Description |
| :---------- | :----------------: | -----------------------------------: |
| `id`        |    `String(18)`    |    Channel ID for row identification |
| `blacklist` | `(Bot Name) | ...` | Disables use of bots in this channel |