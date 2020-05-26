# Designs

Detailed plans for how the game will work. Will be based off of Post Knight a bit.

## Accounts

Anyone can create any number of accounts as they want(with a ratelimit, of course). They will work like normal accounts on any online game, with a separate username and password, with means to access them online(from future website[maybe]).

**Account attributes(Database format):**

- `username`:`TEXT` Stores the username
- `password`:`String(128)` Hashed password
- `settings`:`(name)=(setting),...` Player settings(not spending too many columns for this xP)
  - Planned Settings:
    - `hardcore`:`(t | f)` Hardcore mode, allowing more moves, features and unlockables from the bot.
- `inventory`:``

## Command Plans

- **Battle:** Pulls a basic embed with only a code block as the description and additional stats in the footer
- **Settings:** Pulls up an interface with multiple messages and embeds to let you determine how you want to play the game. Most things will be optimized and optional, just letting the player customize what they want to.

## Game Entity Class

Game class Entity include players and enemies

- `id`:`String` 
- `name`:`String` Name of entity
- `health`:`Object` How much health the entity can have
  - `current`:`Number` How much health it currently has
  - `max`:`Number` Max health, how much health it *can* have
- `strength`:`Number`
- `speed`:`Number`
- `defense`:`Number`
- `type`:`String`

**type: monster**

## Game Item Class

Game class Item include weapons, equipment, potions, etc

- `id`:`String` 
- `name`:`String` Name of item
- `type`:`String` Type of item

**type: potion**

- `id`:`P(number)` Format of ID for all potions
- `effect`:`String(Effect)` An effect


## Effects

Effects will have a special language that records values and how they will effectively change

**Syntax:**

- `>`: Starts a new object
  - Any value following a `\` is treated as a normal character
  - Anything after that and before the next `>` will be included in the object(note: `:>` is excluded from this)
  - Any property can be can be assigned to any data, which will be automatically parsed according to it's data type
    - Format: `(value name):(value)`
- `propname:>`: Starts a new object in the current Object and assigns it to the property name
  

**Example:**
```
>n:Dark Shadow&d:Creates a dark shadow over the user&stun:3s&stats:>k*:3&t:4s>n:Love&d:Enemy falls in love with the caster&
```

## Players

Will have base stats(decimal multipliers) that multiply weapon stats(will have no max):

- **Strength:** Multiplies the amount of damage a weapon does
- **Defense:** Multiplies the amount of damage mitigation a shield does
- **Speed:** Speed at which you move through quests
  - No Max, but will likely be debuffed as you go on
  - Plays a role in knockback

Item slots available on the body:

- Helmet
  - Usually offering defense
- Chest Plate
  - Mainly for defence
- Shield
  - One of the main things an adventurer gets, determining one of the moves a player can make in active combat
- Sword
  - Mainly determining attack
- Buckle
  - Would usually contain some special attribute/buff that helps the player + maybe an increase in defense
- Boots
  - Boosts speed
- Potion
  - Another one of the main things an adventure gets, heals or buffs them in the middle of a battle. Can only have one equipped, so needed to be chosen wisely.

## Item buffs & passives

Different items all have at least one buff/passive on them

### Weapon passives

- **Barbaric Blow**: Chance to cause a STUN effect on enemy for Xsec (Warhammers class)
- **Upheaval**: Chance to increase the knockback an enemy X(blocks? feet? percent?) (Maces class)
- **Dripping Cut**: Chance to cause a BLEED effect on enemy for Xsec (Knives class)
- **Full Counter/Noble Shimmer**: Chance to cause an enemy to deal an attack completely on themselves (Swords class)
- **Debilitation**: Chance to reduce an enemy's attack by X% for Xsec (Battleaxe class)
- **Piercing Stab**: Chance to reduce an enemy's defense by X% for Xsec (Spears class)

### Other Item passives (Places applicable may vary)

- **Spiked Exterior**: Returns X% of an enemy's attack back to them (Any)
- **Hardening**: Each consecutive hit by the same enemy does X% less damage each time (Chestplates Only)
- **Living Material**: Regain X amount of health every Xsec during battle (All)
- **Shield Bash**: Causes a stun effect on the enemy when blocking (Shields Only)
- **Spiked Soles**: Reduce the amount of knockback from an attack by X(blocks? feet? percent?) (Boots Only)

## Enemies

## PvE

## Towns

A place on the map where you can unlock stuff and 

**Town Ideas:**

| Name  | Level |                 Description                  | Unlocked Items |            Buffs             | Enemies |      Quests |
| :---- | :---: | :------------------------------------------: | :------------: | :--------------------------: | :-----: | ----------: |
| (TBD) |  10   | Major town that buffs a certain stat majorly |      None      | + 50x in one stat you choose |  None   | Stat Unlock |
