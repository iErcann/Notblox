import { SerializedEntityType } from '../network/server/serialized.js';
import { EventSystem } from '../system/EventSystem.js';
import { NetworkComponent } from '../../shared/network/NetworkComponent.js';
// Define an Entity class
export class Entity {
    type;
    id;
    components = new Map();
    constructor(type = SerializedEntityType.NONE, id) {
        this.type = type;
        this.id = id;
    }
    /**
     * Add a component to the entity
     * @param component  The component to add
     * @param createAddedEvent  Whether to create an added event or not, default is true, useful for skipping recursion
     */
    addComponent(component, createAddedEvent = true) {
        this.components.set(component.constructor, component);
        // This can be used to skip the recursion or non added events
        if (createAddedEvent) {
            EventSystem.onComponentAdded(component);
        }
    }
    // Remove all components using the remove component function
    removeAllComponents() {
        Array.from(this.components.keys()).forEach((componentType) => this.removeComponent(componentType));
    }
    /**
     * Remove a component from the entity
     * @param componentType  The type of component to remove
     * @param createRemoveEvent  Whether to create a remove event or not, default is true, useful for skipping recursion
     */
    removeComponent(componentType, createRemoveEvent = true) {
        const removedComponent = this.components.get(componentType);
        if (removedComponent) {
            this.components.delete(componentType);
            if (createRemoveEvent) {
                EventSystem.onComponentRemoved(removedComponent);
            }
        }
    }
    getAllComponents() {
        return Array.from(this.components.values());
    }
    // Get a component from the entity
    getComponent(componentType) {
        return this.components.get(componentType);
    }
    // This is used by the client only!
    getNetworkComponentBySerializedType(componentType) {
        // Find NetworkComponent by type
        for (const component of this.components.values()) {
            if (component instanceof NetworkComponent && component.type === componentType) {
                return component;
            }
        }
        return undefined;
    }
}
//# sourceMappingURL=Entity.js.map