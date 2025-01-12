import { PositionComponent, SerializedPositionComponent } from './PositionComponent.js'
import { RotationComponent, SerializedRotationComponent } from './RotationComponent.js'
import { SerializedComponent, SerializedComponentType } from '../network/server/serialized.js'
import { NetworkComponent } from '../network/NetworkComponent.js'

export interface WheelComponentData {
  entityId: number
  /**
   * Serialized :
   * Visual position and rotation of the wheel.
   */
  positionComponent: PositionComponent
  rotationComponent: RotationComponent

  /**
   * Not serialized :
   * Physics properties of the wheel.
   */
  radius?: number
  suspensionLength?: number
  suspensionCompression?: number
  suspensionRelaxation?: number
  suspensionStiffness?: number
  maxSuspensionForce?: number
  maxSuspensionTravel?: number
  sideFrictionStiffness?: number
  frictionSlip?: number
  /**
   * Whether this wheel can steer the vehicle (typically front wheels)
   */
  isSteeringWheel?: boolean
  /**
   * Whether this wheel applies brake force (typically all wheels)
   */
  isBrakeWheel?: boolean
  /**
   * Whether this wheel provides engine power (typically rear or all wheels)
   */
  isEngineWheel?: boolean
}

export class WheelComponent extends NetworkComponent {
  /**
   * Wheels transform components (Position and Rotation) are local to the vehicle
   * In the front, they will be attached to the visual mesh of the vehicle so no need for world transform
   */
  public positionComponent: PositionComponent
  public rotationComponent: RotationComponent
  public radius: number

  /**
   * Physics properties of the wheel.
   */
  public suspensionLength: number
  public suspensionCompression: number
  public suspensionRelaxation: number
  public suspensionStiffness: number
  // Prevents the suspension from applying excessively large forces.
  // Ensure this is high enough to handle the weight of the vehicle without bottoming out but not so high that it causes instability.
  public maxSuspensionForce: number
  public maxSuspensionTravel: number
  // If the car slides too much, increase sideFrictionStiffness.
  public sideFrictionStiffness: number

  //If it doesn't slide enough or feels "stuck," reduce frictionSlip.

  public frictionSlip: number
  public isSteeringWheel: boolean
  public isBrakeWheel: boolean
  public isEngineWheel: boolean

  constructor(data: WheelComponentData) {
    super(data.entityId, SerializedComponentType.WHEEL)
    this.positionComponent = data.positionComponent
    this.rotationComponent = data.rotationComponent
    this.radius = data.radius ?? 1.2
    this.suspensionLength = data.suspensionLength ?? 0.125
    this.suspensionCompression = data.suspensionCompression ?? 0.82
    this.suspensionRelaxation = data.suspensionRelaxation ?? 0.88
    this.suspensionStiffness = data.suspensionStiffness ?? 6000
    this.maxSuspensionForce = data.maxSuspensionForce ?? 6000
    this.maxSuspensionTravel = data.maxSuspensionTravel ?? 5
    this.sideFrictionStiffness = data.sideFrictionStiffness ?? 1
    this.frictionSlip = data.frictionSlip ?? 5
    this.isSteeringWheel = data.isSteeringWheel ?? false
    this.isBrakeWheel = data.isBrakeWheel ?? false
    this.isEngineWheel = data.isEngineWheel ?? false
  }

  serialize() {
    // No need to serialize physics properties, only visual.
    return {
      pC: this.positionComponent.serialize(),
      rC: this.rotationComponent.serialize(),
      r: this.radius,
    }
  }

  deserialize(data: SerializedWheelComponent): void {
    this.positionComponent.deserialize(data.pC)
    this.rotationComponent.deserialize(data.rC)
    this.radius = data.r
  }
}

export interface SerializedWheelComponent extends SerializedComponent {
  pC: SerializedPositionComponent
  rC: SerializedRotationComponent
  r: number
}
