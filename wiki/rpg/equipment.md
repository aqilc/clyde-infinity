# Equipment for the RPG

Description for all self written equipment in our RPG. Planning to automate writes to this md file. All equipment will be stored in [`games/rpg/equipment.yaml`](/edit/#!/clyde-bois?path=games%2Frpg%2Fequipment.yaml%3A4%3A39)(help how do I make this link work)

## Format

```yaml
(equipment name):
  type: (type)
  buffs:
  - (buff name or prebuilt buff id):
    description: (description)
    mod: "strengthx50"
```

### Properties

- `(equipment name)`
  - `type`:`String` Type of equipment
    - Available types:
      - `weapon`