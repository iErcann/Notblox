// import { Entity } from '../../../../../shared/entity/Entity.js'
// import { Component } from '../../../../../shared/component/Component.js'
// import { EntityDestroyedEvent } from '../../../../../shared/component/events/EntityDestroyedEvent.js'
// import { ChatMessageEvent } from '../../component/events/ChatMessageEvent.js'
// import { EventColor } from '../../component/events/EventColor.js'
// import { EventSingleSize } from '../../component/events/EventSingleSize.js'
// import { EventSize } from '../../component/events/EventSize.js'
// import { EventQueue } from '../../../../../shared/entity/EventQueue.js'
// import { ChatSystem } from './ChatSystem.js'
// import { DestroySystem } from './DestroySystem.js'
// import { SyncColorSystem } from './SyncColorSystem.js'
// import { SyncSingleSizeSystem } from './SyncSingleSizeSystem.js'
// import { SyncSizeSystem } from './SyncSizeSystem.js'
// import { EventComponentAdded } from '../../component/events/EventComponentAdded..js'
// import { ComponentRemovedEvent } from '../../../../../shared/component/events/ComponentRemovedEvent.js'
// import { ColorComponent } from 'shared/component/ColorComponent.js'

// // Define a type alias for event class constructors
// type EventConstructor = new (...args: any[]) => Component

// // Interface for System type
// interface System {
//   update(entities: Entity[], component: Component): void
//   afterUpdate?(entities: Entity[], component: Component): void // Optional afterUpdate method
//   onComponentAdded?(entity: Entity, component: Component): void // Optional onComponentAdded method
//   onComponentRemoved?(entity: Entity, component: Component): void // Optional onComponentRemoved method
// }

// /* See https://gamedev.stackexchange.com/a/194135 */
// export class EventSystem {
//   private static instance: EventSystem
//   private subscriptions: Map<EventConstructor, System[]> = new Map()
//   private processedEvents: Component[] = []
//   eventQueue: EventQueue

//   static getInstance(): EventSystem {
//     if (!EventSystem.instance) {
//       EventSystem.instance = new EventSystem()
//     }
//     return EventSystem.instance
//   }

//   private constructor() {
//     this.initializeSubscriptions()
//     this.eventQueue = new EventQueue()
//   }

//   private initializeSubscriptions() {
//     // Some components are treated as events.
//     // Mapping Event Component (String representation of their classnames) to Systems
//     // EventName : [System1, System2, ...]
//     // Register systems
//     this.subscriptions.set(ChatMessageEvent, [new ChatSystem()])
//     this.subscriptions.set(EntityDestroyedEvent, [new DestroySystem()])
//     this.subscriptions.set(EventSize, [new SyncSizeSystem()])
//     this.subscriptions.set(EventSingleSize, [new SyncSingleSizeSystem()])
//     this.subscriptions.set(EventColor, [new SyncColorSystem()])
//   }

//   update(entities: Entity[]) {
//     // Order matters
//     this.handleComponents(entities, false, [
//       EntityDestroyedEvent,
//       ChatMessageEvent,
//       EventSingleSize,
//       EventSize,
//       EventColor,
//     ])
//   }

//   afterUpdate(entities: Entity[]) {
//     this.handleComponents(entities, true, [EntityDestroyedEvent])
//     this.cleanProcessedEvents()
//   }

//   // Duplicate components (events) are authorized for this one
//   addEvent(event: Component) {
//     this.eventQueue.entity.addComponent(event)
//   }
//   // Handle a component event
//   // If multiple events are stored, they are all treated in the same frame
//   // Doing them one by one might have caused issues when 2 clients disconnect at the same
//   private handleComponents(
//     entities: Entity[],
//     afterUpdate: boolean,
//     eventClasses: EventConstructor[]
//   ) {
//     for (const EventClass of eventClasses) {
//       const components = this.eventQueue.entity.getComponents(EventClass)
//       if (components) {
//         for (const component of components) {
//           if (component) {
//             if (this.subscriptions.has(EventClass)) {
//               for (const system of this.subscriptions.get(EventClass)!) {
//                 if (afterUpdate) {
//                   system.afterUpdate && system.afterUpdate(entities, component)
//                 } else {
//                   system.update(entities, component)
//                 }
//               }
//               this.processedEvents.push(component)
//             }
//           }
//         }
//       }
//     }
//   }

//   private cleanProcessedEvents() {
//     for (const event of this.processedEvents) {
//       this.eventQueue.entity.components.splice(this.eventQueue.entity.components.indexOf(event), 1)
//     }
//     this.processedEvents = []
//   }
//   onComponentAdded(addedComponent: Component) {
//     this.addEvent(new EventComponentAdded(addedComponent))
//   }

//   onComponentRemoved(removedComponent: Component) {
//     this.addEvent(new ComponentRemovedEvent(removedComponent))
//   }
// }
