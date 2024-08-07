import { SerializedComponentType, } from './server/serialized.js';
import { Component } from '../component/Component.js';
export class NetworkDataComponent extends Component {
    entityType;
    components;
    type = SerializedComponentType.NONE;
    constructor(entityId, entityType, components) {
        super(entityId);
        this.entityType = entityType;
        this.components = components;
    }
    getComponents() {
        return this.components;
    }
    removeComponent(componentType) {
        this.components = this.components.filter((c) => !(c instanceof componentType));
    }
    addComponent(component) {
        this.components.push(component);
    }
    removeAllComponents() {
        this.components = [];
    }
    serialize(serializeAll = false) {
        const components = this.getComponents();
        const serializedComponents = components
            .filter((component) => serializeAll || component.updated === true)
            .map((component) => {
            return { t: component.type, ...component.serialize() };
        });
        if (serializedComponents.length === 0) {
            return null;
        }
        const broadcastMessage = {
            id: this.entityId,
            t: this.entityType,
            c: serializedComponents,
        };
        return broadcastMessage;
    }
}
//# sourceMappingURL=NetworkDataComponent.js.map