import { EntityManager } from '../system/EntityManager.js';
import { SerializedEntityType } from '../network/server/serialized.js';
import { NetworkDataComponent } from '../network/NetworkDataComponent.js';
import { EventListComponent } from '../component/events/EventListComponent.js';
export class EventQueue {
    entity;
    constructor() {
        this.entity = EntityManager.createEntity(SerializedEntityType.EVENT_QUEUE);
        this.entity.addComponent(new EventListComponent(this.entity.id), false);
        this.entity.addComponent(new NetworkDataComponent(this.entity.id, this.entity.type, []), false);
    }
}
//# sourceMappingURL=EventQueue.js.map