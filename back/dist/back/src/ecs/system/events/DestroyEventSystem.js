import { EntityDestroyedEvent } from '../../../../../shared/component/events/EntityDestroyedEvent.js';
import { EntityManager } from '../../../../../shared/system/EntityManager.js';
import { EventSystem } from '../../../../../shared/system/EventSystem.js';
import { ChatMessageEvent } from '../../component/events/ChatMessageEvent.js';
import { PlayerComponent } from '../../component/tag/TagPlayerComponent.js';
export class DestroyEventSystem {
    update(entities) {
        const destroyedEvents = EventSystem.getEvents(EntityDestroyedEvent);
        for (const destroyedEvent of destroyedEvents) {
            const entity = EntityManager.getEntityById(entities, destroyedEvent.entityId);
            if (!entity) {
                console.error('Update : DestroySystem: Entity not found with id', destroyedEvent.entityId);
                continue;
            }
            if (entity.getComponent(PlayerComponent)) {
                EventSystem.addEvent(new ChatMessageEvent(entity.id, '🖥️ [SERVER]', `Player ${entity.id} left the game.`));
            }
            // This will create ComponentRemovedEvent for each components
            // Systems will handle the lifecycle of the components
            // E.g : ComponentRemovedEvent<DynamicRigidBodyComponent> will be catched by DynamicRigidBodySystem
            // And the actual physical body will be removed from the physics world
            entity.removeAllComponents();
            // NOTE : We may have to put this in an after update if we want to still access the entity in a remove event
            EntityManager.removeEntityById(destroyedEvent.entityId);
        }
    }
}
//# sourceMappingURL=DestroyEventSystem.js.map