import { Entity } from '../entity/Entity.js';
import { MeshComponent } from '../../front/game/ecs/component/MeshComponent.js'; // Make sure to import MeshComponent
export class EntityManager {
    static instance;
    entities = [];
    static nextId = 1;
    constructor() { }
    // Singleton pattern to get the single instance of EntityManager
    static getInstance() {
        if (!EntityManager.instance) {
            EntityManager.instance = new EntityManager();
        }
        return EntityManager.instance;
    }
    // Create a new entity and add it to the list
    static createEntity(type, id) {
        const entityManager = EntityManager.getInstance();
        const entityId = id ?? EntityManager.nextId++;
        const entity = new Entity(type, entityId);
        entityManager.entities.push(entity);
        return entity;
    }
    // Get all entities
    getAllEntities() {
        return this.entities;
    }
    // Get entities by type
    static getEntitiesByType(entities, type) {
        return entities.filter((entity) => entity.type === type);
    }
    // Get the first entity by type
    static getFirstEntityByType(entities, type) {
        return entities.find((entity) => entity.type === type);
    }
    // Get entity by id
    static getEntityById(entities, id) {
        return entities.find((entity) => entity.id === id);
    }
    // Get the first entity with a specific component
    static getFirstEntityWithComponent(entities, componentType) {
        return entities.find((entity) => entity.getComponent(componentType));
    }
    // Remove an entity
    static removeEntity(entity) {
        const entityManager = EntityManager.getInstance();
        const index = entityManager.entities.indexOf(entity);
        if (index !== -1) {
            entityManager.entities.splice(index, 1);
        }
        else {
            console.error('Entity not found in EntityManager');
        }
    }
    // Remove an entity by id
    static removeEntityById(id) {
        const entityManager = EntityManager.getInstance();
        const index = entityManager.entities.findIndex((entity) => entity.id === id);
        console.log('Removing entity', id, 'from EntityManager');
        if (index !== -1) {
            entityManager.entities.splice(index, 1);
        }
    }
    static getEntityByMesh(mesh) {
        return this.getInstance().entities.find(entity => {
            const meshComponent = entity.getComponent(MeshComponent);
            return meshComponent && meshComponent.mesh === mesh;
        });
    }
}
//# sourceMappingURL=EntityManager.js.map