# Database Plans

## Redis Databases

**Format:**

```md

### Classification of data and keys

(Description)

[Table containing key formats, their values and descriptions]
```

### Discord Users

- **User Data**
  - `d:<user id>.messages`:`Hash`
    - Hash format:
      - Field: `<bot name>`
      - Value: `<message number>`
  - `d:<user id>.blacklist`:`List` Bots the user is blacklisted in
    - List value format: `<bot name>` or `global` for all bots
  - `d:<user id>.commands.blacklist`:`Hash` Commands the user is blacklisted from using
    - Hash format:
      - Field: `<bot name>` or `global` for all bots
      - Value: `<command name(not aliases)>`
  - `d:<user id>.commands.remaps`:`Hash` Remapping command names(like custom aliases)
  - `d:<user id>.prefixes`:`Hash` User custom prefixes for certain bots
    - Hash format:
      - Field: `<bot name>` or `global` for all bots
      - Value: `<string>`
- **Guild Data**
  - `d:<user id>.g:<server id>.bans` How many times the user has been banned on that server
- **osu!**
  - `d:<user id>.osu.username`:`<String>` osu! username for osu commands
  - `d:<user id>.osu.mode`:`<'fruits' | 'osu' | 'mania' | 'taiko'>` osu! user default game mode
  - `d:<user id>.osu.replays.skin`

### RPG

- `rpg[<username>]:password` A SHA-512 hashed password with config random password appended.

## SQL Databases

**Format:**

```md
### Database Name

#### Table Name

[Table containing table attributes]

#### Table 2 Name

...
```

### Settings

#### GuildSettings

| Attribute   |                   Content                    |                                            Description |
| :---------- | :------------------------------------------: | -----------------------------------------------------: |
| `id`        |                 `String(18)`                 |                        Guild ID for row identification |
| `blacklist` |              `(Bot Name) | ...`              |      Disables the use of specified bots in that server |
| `prefix`    | `(Bot Name) - String(Min: 1, Max: 22) | ...` |                                           Guild prefix |
| `mod`       |                 `String(18)`                 |                              Guild's Moderator role ID |
| `admin`     |                 `String(18)`                 |                          Guild's Administrator role ID |
| `logid`     |                 `String(18)`                 |              ID of Channel where Clyde logs everything |
| `logtype`   |    `everything` or `minimal` or `medium`     | Stores how much information to log in said log channel |

#### ChannelSettings

| Attribute   |      Content       |                          Description |
| :---------- | :----------------: | -----------------------------------: |
| `id`        |    `String(18)`    |    Channel ID for row identification |
| `blacklist` | `(Bot Name) | ...` | Disables use of bots in this channel |
