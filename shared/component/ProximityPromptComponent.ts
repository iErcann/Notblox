import { SerializedComponent, SerializedComponentType } from '../network/server/serialized.js'
import { NetworkComponent } from '../network/NetworkComponent.js'
import { Entity } from '../entity/Entity.js'
import { SerializedTextComponent, TextComponent } from './TextComponent.js'

/**
 * Component for interactible entities
 * Will be rendered by the client with a TextComponent
 *
 * @param text - The text to display
 * @param onInteract - The callback to call when the entity is interacted with
 * @param maxInteractDistance - The distance at which the entity can be interacted with
 * @param interactionCooldown - The cooldown in milliseconds before the entity can be interacted with again (local to the player, multiple players can interact with the same entity at the same time)
 * @param holdDuration - The duration in milliseconds that the player must hold the key to interact with the entity
 */
export class ProximityPromptComponent extends NetworkComponent {
  public textComponent: TextComponent
  public lastInteractionTime: number = 0
  constructor(
    entityId: number,
    public text = 'Interact',
    public onInteract: (interactingEntity: Entity) => void,
    public maxInteractDistance = 10,
    public interactionCooldown = 1000,
    public holdDuration = 1000
  ) {
    super(entityId, SerializedComponentType.PROXIMITY_PROMPT)
    this.textComponent = new TextComponent(entityId, text, 0, 0, 0, maxInteractDistance)
  }

  serialize(): SerializedProximityPromptComponent {
    return {
      tC: this.textComponent.serialize(),
    }
  }

  deserialize(data: SerializedProximityPromptComponent): void {
    this.textComponent.deserialize(data.tC)
  }

  interact(interactingEntity: Entity) {
    this.onInteract(interactingEntity)
  }
}

export interface SerializedProximityPromptComponent extends SerializedComponent {
  tC: SerializedTextComponent
}
