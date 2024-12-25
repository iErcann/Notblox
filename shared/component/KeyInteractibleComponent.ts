import { SerializedComponent, SerializedComponentType } from '../network/server/serialized.js'
import { NetworkComponent } from '../network/NetworkComponent.js'
import { Entity } from '../entity/Entity.js'
import { SerializedTextComponent, TextComponent } from './TextComponent.js'

/**
 * Component for interactible entities
 * Will be rendered by the client with a TextComponent
 */
export class KeyInteractibleComponent extends NetworkComponent {
  public textComponent: TextComponent
  constructor(
    entityId: number,
    public text = 'Interact',
    public callback: (interactingEntity: Entity) => void
  ) {
    super(entityId, SerializedComponentType.KEY_INTERACTIBLE)
    this.textComponent = new TextComponent(entityId, text)
  }

  serialize(): SerializedKeyInteractibleComponent {
    return {
      tC: this.textComponent.serialize(),
    }
  }

  deserialize(data: SerializedKeyInteractibleComponent): void {
    console.log('KeyInteractibleComponent: deserialize', data)
    this.textComponent.deserialize(data.tC)
  }

  interact(interactingEntity: Entity) {
    this.callback(interactingEntity)
  }
}

export interface SerializedKeyInteractibleComponent extends SerializedComponent {
  tC: SerializedTextComponent
}
