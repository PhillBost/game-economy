Game-Economy (name WIP)

Full, agent run MMO eceonomy simulator.

Players are established, days are passed as ticks, and each day players can trade gathered resources at a market.

Eventually will develop into a full, visually explorable simulator where one can set parameters of an mmo/fantasy economy, including world events, rare items, etc, and watch as the market adapts!

## Economy definitions

Add economy data in `src/economy.js`:

- Add a resource under `resources` with its display name and base value.
- Add an occupation under `occupations`. Gathering occupations specify a
  resource and production range; crafting occupations specify recipes, input
  resources, output, and `ratePerDay`.
- Set shared inventory targets and daily player consumption under `player`.
- Set an occupation-specific inventory target on that occupation, such as the
  smith's iron target or the baker's wheat target.

Player inventories, market behaviors, random occupation assignment, and UI
resource labels are derived from this data. Recipes only craft when their
inputs are available. Fractional `ratePerDay` values accumulate across days.


Roadmap:
- Visual graphing and exploration
- Web-app implementation
- Custom players
- More items and professions
- World events (seasons?)
- Player stats (bargaining?)
- Algorithm redesign to support large simulations

