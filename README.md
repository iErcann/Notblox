 
### Shared file import Error .js files

[Link to GitHub Discussion](https://github.com/vercel/next.js/discussions/32237)

### Network Idea

- ZombieComponent on the back-end equipped on each player
- When assigned to a player, the player becomes a Zombie.
- Sent via the NetworkDataComponent to the players.
- Components can "sleep" to avoid being sent over the network.
- Data like ZombieComponent may be relevant only once.
- If a component sleeps, it isn't sent.
- Players need to know when a component has been removed, so a boolean or "destroyed" indicator is sent.

### Event system?

[Link to StackExchange Question](https://gamedev.stackexchange.com/questions/194133/is-it-better-design-to-store-event-effects-within-an-entity-itself-or-within-a)

#### Attach Events as Transient Components:

```javascript
class PlayerDeathEventComponent {
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
}
```

#### Systems with Event Queues:

```javascript
class EnemyBehaviorSystem {
  constructor() {
    this.eventQueue = [];
  }

  update(dt) {
    // Process other enemy behavior logic

    // Process events in the event queue
    while (this.eventQueue.length > 0) {
      const event = this.eventQueue.pop();
      if (event.type === "EnemyHitByPlayer") {
        // Handle enemy hit event (e.g., reduce enemy health, award points)
      }
    }
  }

  addEventToQueue(event) {
    this.eventQueue.push(event);
  }
}
```

#### Global Event Manager:

```javascript
class EventManager {
  constructor() {
    this.eventSubscriptions = new Map();
  }

  subscribe(eventType, system) {
    if (!this.eventSubscriptions.has(eventType)) {
      this.eventSubscriptions.set(eventType, []);
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
}
```

These examples illustrate different approaches to handling events within an ECS architecture, each with its own trade-offs in terms of complexity, maintainability, and performance.

[Link to Reddit Discussion](https://www.reddit.com/r/gamedev/comments/6dsrzy/ecs_and_event_handling_how_to_handle_events/)

In an ECS, events can be thought of as components that only exist for one frame. Avoid sending data between systems outside entities and components for better ECS benefits.

Options in C#:

A. Allow multiple components of the same type on one entity.

```csharp
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

B. Allow Lists inside components.

```csharp
// No component = No collisions happened.
public struct FrameCollisionComponent
{
  public List<Collision> Collisions = new List<Collision>(1);
}
```

C. Create a new entity per collision and keep handles to affected entities.

```csharp
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

If no system consumes the event, only reacts to it, a cleanup system that runs after physics can reset the event.

### Component states

A component is "updated" when its data has been changed (e.g., `SizeComponent width += 1`). A component can be "destroyed," and then it is sent.

### My logic

- Front-end only receives the delta; it only receives data when it has changed.
- For example, if a `ColorComponent` changes, it is sent to the player.
- If there is no change, it will not be sent anymore.
- Back-end needs to pass some events; this is achieved with `EventComponents` that are only called once and then removed from the Entity.
- If a player changes its `ColorComponent`, an `EventColorComponent` is fired, received by a `ColorSystem` that checks for each `EventColorComponent`, applies the logic to the `ColorComponent`, and destroys the `EventColorComponent`.
- `EventFireComponent` <- user input
- `EventFireSystem` <- this checks for it
- `shared/FireComponent` <- contains the real data, inherited from `NetworkComponent` because it needs to be sent to the clients back.
