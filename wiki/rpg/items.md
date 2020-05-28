# Item for the RPG

Description for all self written equipment in our RPG. Planning to automate writes to this md file. All equipment will be stored in [`games/rpg/items.yaml`](../../games/rpg/items.yaml)

## Format

```yaml
Big Boi Weapon:
  type: equipment
  description: Lol
  fusion:
    slots: 0
  slot: weapon
  buffs:
  - Ur Mom Gey:
    description: This is a rare and unique ability
    mod: "strengthx50"
```

### Properties

- `(item name)`:`Object` Unique name of item.
  - `description`:`String` Description of the item.
  - `fusion`:
    - `slots`:`Number` How many items you can fuse onto this one(no specification means it can't be fused with)
    - 
  - `type`:`String` Type of item
    - Available types:
      - `equipment`
      - `potion`
      - `collectibles`
  - `buffs`:`List` Stats given to player when item is equipped
    - `(buff name || prebuilt buff id(from`[`buffs.yaml`]('../../games/rpg/buffs.yaml')`))`
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

- `slot`:`String` Which slot this item takes up on the body. Required only with type `equipment`
  - `helmet`
  - `chest`
  - `shield`
  - `weapon`
  - `buckle`
  - `boots`