import { Entity } from '../entity/Entity.js'
import { SerializedEntityType } from '../network/server/serialized.js'
import { Component } from '../component/Component.js'
import { ComponentAddedEvent } from 'shared/component/events/ComponentAddedEvent.js'

export class EntityManager {
  private static instance: EntityManager
  private entities: Entity[] = []
  private static nextId = 1
  private constructor() {}

  // Singleton pattern to get the single instance of EntityManager
  static getInstance(): EntityManager {
    if (!EntityManager.instance) {
      EntityManager.instance = new EntityManager()
    }
    return EntityManager.instance
  }

  // Create a new entity and add it to the list
  createEntity(type: SerializedEntityType, id?: number): Entity {
    const entityId = id ?? EntityManager.nextId++
    const entity = new Entity(type, entityId)
    this.entities.push(entity)
    return entity
  }

  // Get all entities
  getAllEntities(): Entity[] {
    return this.entities
  }

  // Get entities by type
  static getEntitiesByType(entities: Entity[], type: SerializedEntityType): Entity[] {
    return entities.filter((entity) => entity.type === type)
  }

  // Get the first entity by type
  static getFirstEntityByType(entities: Entity[], type: SerializedEntityType): Entity | undefined {
    return entities.find((entity) => entity.type === type)
  }

  // Get entity by id
  static getEntityById(entities: Entity[], id: number): Entity | undefined {
    return entities.find((entity) => entity.id === id)
  }

  // Get the first entity with a specific component
  static getFirstEntityWithComponent<T extends Component>(
    entities: Entity[],
    componentType: new (entityId: number, ...args: any[]) => T
  ): Entity | undefined {
    return entities.find((entity) => entity.getComponent(componentType))
  }

  // Remove an entity
  removeEntity(entity: Entity): void {
    const index = this.entities.indexOf(entity)
    if (index !== -1) {
      this.entities.splice(index, 1)
    }
  }

  // Remove an entity by id
  removeEntityById(id: number): void {
    const index = this.entities.findIndex((entity) => entity.id === id)
    console.log('Removing entity', id, 'from EntityManager')
    if (index !== -1) {
      this.entities.splice(index, 1)
    }
  }
}
