# Item for the RPG

Description for all self written equipment in our RPG. Planning to automate writes to this md file. All equipment will be stored in [`games/rpg/items.yaml`](../../games/rpg/items.yaml) :D

## Format

```yaml
- name: Big Boi Weapon
  type: equipment
  req:
    level: 3
  description: Lol
  fusion:
    slots: 0
  slot: weapon
  buffs:
  - name: Ur Mom Gey
    description: This is a rare and unique ability
    mod: strengthx50
  rarity: rare
```

### Properties

- `(item name)`:`Object` Unique name of item.
  - `description`:`String` Description of the item.
  - `req`:`Object`
    - `level`:`Number` Level required to equip this item
  - `fusion`:
    - `slots`:`Number` How many items you can fuse onto this one(no specification means it can't be fused with)
    - 
  - `type`:`String` Type of item
    - Available types:
      - `equipment`
      - `potion`
      - `collectibles`
  -  `rarity`:`String || Number` How rare this item's supposed to be(Number is how many items are available in the world)(for purposes meant to describe and help us to position the item and control how much to give out)
    - `String` Options:
      - `rare`
      - `common`
      - `legendary`
      - (need more names)

## Equipment

- Unable to fuse if already fused with items.
- Weapons can only fuse with weapons in the same body slots

### Additional Properties

- `slot`:`String` Which slot this equipment takes up on the body.
  - `helmet`
  - `chest`
  - `shield`
  - `weapon`
  - `buckle`
  - `boots`
- `buffs`:`List` Stats given to player when item is equipped
  - `name`:`String(buff name || prebuilt buff id(from`[`buffs.yaml`]('../../games/rpg/buffs.yaml')`))`
  - `description`:`String`
  - 

## Potions

- `effect`:`Object`
  - `duration`:`Number(Percent)` Percent of the user potion duration time set by the game
  - 