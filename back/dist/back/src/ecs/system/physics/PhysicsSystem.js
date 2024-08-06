import { config } from '../../../../../shared/network/config.js';
import Rapier from '../../../physics/rapier.js';
export class PhysicsSystem {
    world; // Rapier World
    static instance;
    constructor() {
        const gravity = { x: 0.0, y: -9.81 * 10, z: 0.0 };
        this.world = new Rapier.World(gravity);
        this.world.timestep = 1 / config.SERVER_TICKRATE;
        console.log('Physics World constructed');
    }
    update() {
        this.world.step();
    }
    static getInstance() {
        if (!PhysicsSystem.instance) {
            PhysicsSystem.instance = new PhysicsSystem();
        }
        return PhysicsSystem.instance;
    }
}
//# sourceMappingURL=PhysicsSystem.js.map