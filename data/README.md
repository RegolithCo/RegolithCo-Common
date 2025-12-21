All these are without headers

Look for the Google sheet called "REGOLITH: SC Loadout Data 3.19"

## `refineryBonus.csv`

```csv
Refinery,Bonuses,YieldMod,TimeMod,CostMod
REFNAME,ORENAME,1,1,1
```

## `oreProcessing.csv`

```csv
BaseValues,Yield/Unit,Seconds/Unit,aUEC/unit
SOMEORE,0.95,2.5,0.15
```

## `marketPrice.csv`

```csv
PRICES,Unrefined,Refined
SOMEORE,23.0,25.0
```

## `refineryMethods.csv`

```csv
Cormack Method,0.7,2,0.25
```

## `ships.csv`

```csv
CODE,NAME,Manufacturer,cargo,miningCargo
ANDROMEDA,Constellation Andromeda,RSI,96.00,0.00
```



## `gravityWells.tsv`

from: https://docs.google.com/spreadsheets/d/1otgi3l1rTw5--vlEndv4cvvlPyzxjoKl8IuPxlJLzTc/edit?gid=0#gid=0

## `densities.sjon`

This gets synced to the data bucket at `/Data/CIG/densities.json`. The densities are used for mass and volume calculations.

```json
{
  "ALUMINUM": 2.7,
  "BISMUTH": 9.78,
  "CASSITERITE": 6.99,
  ...
}
```