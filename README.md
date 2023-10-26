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
    for (const entity of entities) {
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

https://www.reddit.com/r/gamedev/comments/6dsrzy/ecs_and_event_handling_how_to_handle_events/

I have to disagree with the other responses. In an ECS, events can be thought of as components that only exist for one frame. Why write an entire event system when you have an ECS that you've already built to be efficient (hopefully)?

**You should never have to send data from one system to another outside entities and components. If you do, you lose so many benefits of an ECS. (e.g. Simple serialization, save games, networking, replays, execution order, optimization).** So, options (C#):

A. Allow multiple components of the same type to exist on one entity. Simply add collision components to the entity, and handle them using normal query systems.

```
public class Entity
{
    public List<IComponent> Components;
    // Example "Components" list content:
    // RigidbodyComponent
    // TransformComponent
    // FrameCollisionComponent
    // FrameCollisionComponent
    // FrameCollisionComponent
}
```

B. Allow Lists inside components. Whenever you get a collision, create the "FrameCollisionComponent" component if it doesn't exist, and then just add the collision to the list.

```
// No component = No collisions happened.
public struct FrameCollisionComponent
{
    public List<Collision> Collisions = new List<Collision>(1);
}
```

C. Create a new entity per collision, and keep handles to the affected entities.

```
 public void HandleCollisionFromInternalCollisionSystem(CollisionInfo ci)
{
    var ce = new CollisionEvent();
    ce.A = GetEntityFromCollider(ci.ColliderA);
    ce.B = GetEntityFromCollider(ci.ColliderB);
    ce.ColInfo = GetCustomCollisionInfo(ci);

    var entity = _world.CreateEntity();
    entity.AddComponent(ce);
}


public struct CollisionEvent
{
    public EntityHandle A;
    public EntityHandle B;
    public CustomCollisionInfo ColInfo;
}
```

> what if no system ever "consumes" the event, only reacts to it? How does the event get reset?

You just need a cleanup system that runs after your physics. E.g. "Cleanup all frames collision components." Systems **should be** fast and small. You'll have a lot of them, and that's a good thing.

It MIGHT be meaningful for you to have the affected systems remove events themselves, but that ENTIRELY depends on the context of your game, and, I'd stay away from it. E.g.

You have a physics system that raises collision events (a.k.a. Adds components to an entity). You then have a rigidbody tick system that reacts to these collisions and cleans up the event. Later, you add a system that makes all colliding entities visibly shake for a few frames. By some other gameplay rule, this system must happen AFTER the rigidbody system, but, oh no, you've already cleaned up the event. With cleanup systems, this is not a problem.

## Component states

A component is "updated" when its data has been changed ex: SizeComponent width += 1
A component can be "destroyed" then it is sent

## My logic

Front-end only receives the delta, it only receives data when it has changed.
For example if a colorcomponent changes, it is sent to the player.
if there is no change, it will not be sent anymore.
So each time the front-end receives a data, it can be treated like a new change, new color, new position etc.

Back-end needs to pass some events, this is achieved with EventComponents that are only called once and then removed from the Entity.
If a player changes its ColorComponent, we fire a EventColorComponent that is then received by a ColorSystem that checks for each EventColorComponents, then it applies the logic to the ColorComponent and destroys the EventColorComponent

EventFireComponent <- user input
EventFireSystem <- this checks for it

shared/FireComponent <- contains the real data, herited from NetworkComponent
because it needs to be sent to the clients back
