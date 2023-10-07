import { Entity } from "../entity/Entity.js";
import { SerializedEntityType } from "../network/server/serialized.js";
import { Component } from "../component/Component.js";

export class EntityManager {
  private static instance: EntityManager;
  private entities: Entity[] = [];
  private static nextId = 1;
  private constructor() {}

  // Create a new entity and add it to the list
  createEntity(type: SerializedEntityType, id?: number): Entity {
    const entity = new Entity(type, id ? id : EntityManager.nextId++);
    this.entities.push(entity);
    return entity;
  }
  public static getInstance(): EntityManager {
    if (!EntityManager.instance) {
      EntityManager.instance = new EntityManager();
    }
    return EntityManager.instance;
  }

  // Get all entities
  getAllEntities(): Entity[] {
    return this.entities;
  }

  // Get entities with specific components
  getEntitiesWithComponents<T extends Component>(
    componentType: new (entityId: number, ...args: any[]) => T
  ): Entity[] {
    return this.entities.filter((entity) => entity.getComponent(componentType));
  }

  // Remove an entity
  removeEntity(entity: Entity): void {
    const index = this.entities.indexOf(entity);
    if (index !== -1) {
      this.entities.splice(index, 1);
    }
  }
}
