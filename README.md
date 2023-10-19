## Shared file import Error .js files

<https://github.com/vercel/next.js/discussions/32237>

## Network Idea

ZombieComponent on back-end equipped on each player
When it is assigned to a player, he becomes a Zombie.
It is then sent via the NetworkDataComponent to the players.
In the future, a component can "sleep" and it will not be sent over the network, some data like ZombieComponent are only relevant once (it can be the same for ColorComponent)
If it sleeps, it isnt sent
The player has to know when a component has been removed, so instead of comparing replicated entities components with incoming serialized entitiies components, we will send a boolean or something like "destroyed"

## Event system ?

https://gamedev.stackexchange.com/questions/194133/is-it-better-design-to-store-event-effects-within-an-entity-itself-or-within-a

Certainly, I can provide examples for the three approaches mentioned for event processing within an ECS (Entity-Component-System) architecture. 1. \*\*Attach Events as Transient Components:\*\* In this approach, you treat events as transient components attached to entities. These components are removed after the event has been processed. Example: In a game, you might have a "PlayerDeathEvent." When a player dies, you attach a \`PlayerDeathEvent\` component to the player entity. A system responsible for handling player death events detects this component, processes it, and removes the component.

typescriptCopy code

`class PlayerDeathEventComponent {
constructor() {
// Initialize event data (e.g., cause of death, timestamp)
}
}

    // In the system's update loop:
    entities.forEach((entity) => {
      if (entity.hasComponent(PlayerDeathEventComponent)) {
        const event = entity.getComponent(PlayerDeathEventComponent);
        // Handle the player's death event (e.g., update score, show game over screen)
        entity.removeComponent(PlayerDeathEventComponent);
      }
    });`

2\. \*\*Systems with Event Queues:\*\* In this approach, systems have event queues, allowing them to receive and process events as part of their update cycle. Example: Consider a game where you have multiple enemy entities and a system responsible for enemy behavior. Events like "EnemyHitByPlayer" can be added to the event queue of the enemy behavior system.

typescriptCopy code

`class EnemyBehaviorSystem {
constructor() {
this.eventQueue = \[\];
}

      update(dt) {
        // Process other enemy behavior logic

        // Process events in the event queue
        while (this.eventQueue.length \> 0) {
          const event = this.eventQueue.pop();
          if (event.type === "EnemyHitByPlayer") {
            // Handle enemy hit event (e.g., reduce enemy health, award points)
          }
        }
      }

      addEventToQueue(event) {
        this.eventQueue.push(event);
      }
    }`

3\. \*\*Global Event Manager:\*\* In this approach, there is a central Event Manager system responsible for receiving and distributing events to subscribing systems. Systems can subscribe to events of interest. Example: You have various systems in your game (e.g., PlayerSystem, EnemySystem, UIUpdateSystem). Each of these systems subscribes to relevant events from the central Event Manager.

typescriptCopy code

`class EventManager {
constructor() {
this.eventSubscriptions = new Map();
}

      subscribe(eventType, system) {
        if (!this.eventSubscriptions.has(eventType)) {
          this.eventSubscriptions.set(eventType, \[\]);
        }
        this.eventSubscriptions.get(eventType).push(system);
      }

      publish(eventType, eventData) {
        if (this.eventSubscriptions.has(eventType)) {
          const subscribers = this.eventSubscriptions.get(eventType);
          for (const system of subscribers) {
            system.handleEvent(eventType, eventData);
          }
        }
      }
    }

    class PlayerSystem {
      constructor(eventManager) {
        eventManager.subscribe("PlayerDied", this);
      }

      handleEvent(eventType, eventData) {
        if (eventType === "PlayerDied") {
          // Handle player death event
        }
      }
    }`

These examples illustrate different approaches to handling events within an ECS architecture, each with its own trade-offs in terms of complexity, maintainability, and performance. The choice of which approach to use depends on the specific requirements of your game and the ECS framework you are working with.

## Component states

A component is "updated" when its data has been changed ex: SizeComponent width += 1
A component can be "destroyed" then it is sent
