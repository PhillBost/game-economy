import { useState } from "react";
import Simulation from "../simulation/simulation.js";
import { economy } from "../economy.js";

function getSnapshot(simulation, daySummary = null) {
    const resourceTotals = Object.keys(economy.resources).reduce((totals, resource) => {
        totals[resource] = 0;
        return totals;
    }, {});

    for (const player of simulation.players) {
        for (const [resource, amount] of Object.entries(player.inventory)) {
            resourceTotals[resource] = (resourceTotals[resource] || 0) + amount;
        }
    }

    return {
        day: simulation.day,
        playerCount: simulation.players.length,
        resources: resourceTotals,
        tradesToday: daySummary?.transactions.length || 0
    };
}

function App() {
    const [simulation] = useState(() => new Simulation(10));
    const [snapshot, setSnapshot] = useState(() => getSnapshot(simulation));

    function stepDay() {
        const daySummary = simulation.runDay({ log: false });
        setSnapshot(getSnapshot(simulation, daySummary));
    }

    return (
        <main>
            <h1>Game Economy</h1>

            <button onClick={stepDay}>Step one day</button>

            <p>Day: {snapshot.day}</p>
            <p>Players: {snapshot.playerCount}</p>
            <p>Trades today: {snapshot.tradesToday}</p>

            <h2>Resources</h2>
            <ul>
                {Object.entries(snapshot.resources).map(([resource, amount]) => (
                    <li key={resource}>
                        {economy.resources[resource].name}: {amount}
                    </li>
                ))}
            </ul>
        </main>
    );
}

export default App;
