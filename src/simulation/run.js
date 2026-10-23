import Simulation from "./simulation.js";

const simulation = new Simulation(5);

for (let day = 0; day < 5; day++) {
    simulation.runDay();
}

simulation.summarizeFinalState();
