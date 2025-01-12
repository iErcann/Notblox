import { SerializedComponent, SerializedComponentType } from '../network/server/serialized.js'
import { NetworkComponent } from '../network/NetworkComponent.js'
import { Entity } from '../entity/Entity.js'
import { SerializedTextComponent, TextComponent } from './TextComponent.js'

/**
 * Interface for ProximityPromptComponent parameters
 */
export interface ProximityPromptParams {
  text?: string
  onInteract: (interactingEntity: Entity) => void
  maxInteractDistance?: number
  interactionCooldown?: number
  holdDuration?: number
}

/**
 * Component for interactible entities
 * Will be rendered by the client with a TextComponent
 */
export class ProximityPromptComponent extends NetworkComponent {
  public textComponent: TextComponent

  // Map to track interaction timing for each entity (used to check if the player has interacted with the entity recently)
  // Entity  -> Accumulator
  public accumulatorPerEntity: Map<Entity, number> = new Map()

  constructor(entityId: number, params: ProximityPromptParams) {
    super(entityId, SerializedComponentType.PROXIMITY_PROMPT)
    this.textComponent = new TextComponent(
      entityId,
      params.text ?? 'Interact',
      0,
      0,
      0,
      params.maxInteractDistance ?? 10
    )
    this.onInteract = params.onInteract
    this.maxInteractDistance = params.maxInteractDistance ?? 10
    this.interactionCooldown = params.interactionCooldown ?? 1000
    // Unused for now, but could be used for hold interactions in the future
    this.holdDuration = params.holdDuration ?? 1000
  }

  public onInteract: (interactingEntity: Entity) => void
  public maxInteractDistance: number
  public interactionCooldown: number

  // Unused for now, but could be used for hold interactions in the future
  public holdDuration: number

  serialize(): SerializedProximityPromptComponent {
    return {
      tC: this.textComponent.serialize(),
      iC: this.interactionCooldown,
    }
  }

  deserialize(data: SerializedProximityPromptComponent): void {
    this.textComponent.deserialize(data.tC)
    this.interactionCooldown = data.iC
  }

  interact(interactingEntity: Entity) {
    this.onInteract(interactingEntity)
  }
}

export interface SerializedProximityPromptComponent extends SerializedComponent {
  tC: SerializedTextComponent
  iC: number
}
