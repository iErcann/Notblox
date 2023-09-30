import * as THREE from "three";

export class EntityManager {
  constructor(scene) {
    this.entities = new Map(); // Map to store entities by their unique IDs
  }

  // Function to create and add a new entity to the scene
  addEntity(entityData) {
    const { id, type, color } = entityData;
    let entity;

    // Customize entity creation based on the type
    if (type === "Player") {
      entity = new Player(color); // Example: Player class
    } else if (type === "Enemy") {
      entity = new Enemy(color); // Example: Enemy class
    }
    // Add more entity types as needed

    if (entity) {
      // Add the entity's mesh to the scene
      this.scene.add(entity.mesh);

      // Store the entity object in the map for future reference
      this.entities.set(id, entity);
    }
  }

  // Function to remove an entity from the scene
  removeEntity(entityId) {
    const entity = this.entities.get(entityId);
    if (entity) {
      this.scene.remove(entity.mesh);
      this.entities.delete(entityId);
    }
  }
}
