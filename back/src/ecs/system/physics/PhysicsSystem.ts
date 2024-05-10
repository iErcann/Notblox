import Rapier from "../../../physics/rapier.js";

export class PhysicsSystem {
  world: Rapier.World; // Rapier World
  private static instance: PhysicsSystem;

  constructor() {
    const gravity = { x: 0.0, y: -9.81 * 30, z: 0.0 };
    this.world = new Rapier.World(gravity);
    // this.world.timestep = 1 / 20;
    console.log("Physics World constructed");
  }

  update() {
    this.world.step();
  }
  public static getInstance(): PhysicsSystem {
    if (!PhysicsSystem.instance) {
      PhysicsSystem.instance = new PhysicsSystem();
    }
    return PhysicsSystem.instance;
  }
}
