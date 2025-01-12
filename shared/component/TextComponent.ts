import { SerializedComponent, SerializedComponentType } from '../network/server/serialized.js'
import { NetworkComponent } from '../network/NetworkComponent.js'

export class TextComponent extends NetworkComponent {
  constructor(
    entityId: number,
    public text: string = 'No text set',
    public offsetX: number = 0,
    public offsetY: number = 0,
    public offsetZ: number = 0,
    public displayDistance: number = 10
  ) {
    super(entityId, SerializedComponentType.TEXT)
  }

  serialize(): SerializedTextComponent {
    return {
      m: this.text,
      p: {
        x: this.offsetX,
        y: this.offsetY,
        z: this.offsetZ,
      },
      d: this.displayDistance,
    }
  }

  deserialize(data: SerializedTextComponent): void {
    this.text = data.m
    this.offsetX = data.p.x
    this.offsetY = data.p.y
    this.offsetZ = data.p.z
    this.displayDistance = data.d
  }
}

export interface SerializedTextComponent extends SerializedComponent {
  /* The text content to display */
  m: string
  /* Offset position relative to the entity */
  p: {
    x: number
    y: number
    z: number
  }
  /**
   * Display distance from the player
   */
  d: number
  /**
   * May have more properties in the future like CSS styles
   */
}
