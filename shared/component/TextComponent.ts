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

/**
 * CarEntity: 
 *  - PositionComponent
 * - RotationComponent
 * - ProximityPromptComponent
 * - TextComponent
 * - CarComponent 
 * - CarPhysicsComponent
 * - CarPassengerListComponent 
 *  -> Passenger Entity ID + Seat Position
 * - CarDriverComponent
 * 
 * - CarWheelListComponent + Wheel Position + Wheel Rotation
 * - CarLightListComponent + Light Position + Light Rotation
 * 
 * 
 * PlayerEntity:
 * - StateComponent add:
 *  - VEHICLE_DRIVER
 * - VEHICLE_PASSENGER
 * VehicleDriverComponent / VehiclePassengerComponent (which entity is the player driving or passenger of, matybe 
 * combine both since no use for seperation we have the state component. this is just to know which child)
 * 
 * When the player state becomes VEHICLE_ on the front, disable the player rendering and enable the car rendering
 * OR when OnComponentCreatedEvent<VehcicleDriverComponent...> is triggered, disable the player rendering and enable the car rendering
 * - Clone player visual components to the car entity
 * - Also add the follow component to the car entity
 * - Idea : Since 
 * 
 * // IDEA 2
 * 
 * NVM all of this.
 * Keep it server driven like no need to put another component to player like "PlayerDriverComponent" or "PlayerPassengerComponent"
 * just change the state and when the state is changed, the client will know what to do.
 * When client detected passengers/driver it change the rendering + followcomp (ez pz) 
 *
zz */
