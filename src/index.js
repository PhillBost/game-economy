const Simulation = require('./simulation/Simulation');

const simulation = new Simulation(100);

for (let i = 0; i < 10; i++) {
    simulation.runDay();
}



