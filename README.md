Game-Economy (name WIP)

Full, agent run MMO eceonomy simulator.

Players are established, days are passed as ticks, and each day players can trade gathered resources at a market.

Eventually will develop into a full, visually explorable simulator where one can set parameters of an mmo/fantasy economy, including world events, rare items, etc, and watch as the market adapts!

Crafting recipes are listed on crafting professions in `src/agents/professions.js`.
For example, smiths spend 2 iron to make 1 shovel. Set each recipe's completed
rate per game day in `src/agents/playerNeeds.js` under `craftingRates`, keyed by
recipe ID; fractional rates accumulate (for example, `0.5` makes one recipe
every two days). A player must have the recipe inputs available for crafting
to proceed.


Roadmap:
- Visual graphing and exploration
- Web-app implementation
- Custom players
- More items and professions
- World events (seasons?)
- Player stats (bargaining?)
- Algorithm redesign to support large simulations

