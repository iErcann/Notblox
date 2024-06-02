import { Entity } from '../entity/Entity.js'
import { SerializedEntityType } from '../network/server/serialized.js'
import { Component } from '../component/Component.js'

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
  static createEntity(type: SerializedEntityType, id?: number): Entity {
    const entityManager = EntityManager.getInstance()
    const entityId = id ?? EntityManager.nextId++
    const entity = new Entity(type, entityId)
    entityManager.entities.push(entity)
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
  static removeEntity(entity: Entity): void {
    const entityManager = EntityManager.getInstance()

    const index = entityManager.entities.indexOf(entity)
    if (index !== -1) {
      entityManager.entities.splice(index, 1)
    } else {
      console.error('Entity not found in EntityManager')
    }
  }

  // Remove an entity by id
  static removeEntityById(id: number): void {
    const entityManager = EntityManager.getInstance()

    const index = entityManager.entities.findIndex((entity) => entity.id === id)
    console.log('Removing entity', id, 'from EntityManager')
    if (index !== -1) {
      entityManager.entities.splice(index, 1)
    }
  }
}
