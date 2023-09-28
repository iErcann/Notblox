import Rapier from "../../physics/rapier.js";

export class PhysicsSystem {
  world: Rapier.World; // Rapier World
  private static instance: PhysicsSystem;

  constructor() {
    console.log("WORLD");
    const gravity = { x: 0.0, y: -9.81, z: 0.0 };
    this.world = new Rapier.World(gravity);
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
