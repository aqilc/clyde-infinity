# Designs

Detailed plans for how the game will work. Will be based off of Post Knight a bit.

## Accounts

Anyone can create any number of accounts as they want(with a rate-limit, of course). They will work like normal accounts on any online game, with a separate username and password, with means to access them online(from future website[maybe]).

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

- `effect`:`String(Effect)` An effect executed on user action 


## Effects

Effects are buffs that last for a short amount of time.  

**Example:**
```
>n:Dark Shadow&d:Creates a dark shadow over the user&stun:3s&stats:>k*:3&t:4s>n:Love&d:Enemy falls in love with the caster&
```

## Players

Will have base stats(decimal multipliers) that multiply weapon stats(will have no max):

- **Strength:** Base damage
- **Defense:** Base damage protection
- **Speed:** Speed at which you move through quests
  - No Max, but will likely be de-buffed as you go on
  - Plays a role in kickback

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

## Item buffs & passives

Different items all have at least one buff/passive on them

## Enemies

## PvE

## Towns

A place on the map where you can unlock stuff and 

**Town Ideas:**

| Name  | Level |                 Description                  | Unlocked Items |            Buffs             | Enemies |      Quests |
| :---- | :---: | :------------------------------------------: | :------------: | :--------------------------: | :-----: | ----------: |
| (TBD) |  10   | Major town that buffs a certain stat majorly |      None      | + 50x in one stat you choose |  None   | Stat Unlock |
