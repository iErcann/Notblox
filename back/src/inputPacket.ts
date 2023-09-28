export class InputPacket {
  entityId: number; // ID of the entity (player) sending the input
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;

  constructor(
    entityId: number,
    forward: boolean,
    backward: boolean,
    left: boolean,
    right: boolean
  ) {
    this.entityId = entityId;
    this.forward = forward;
    this.backward = backward;
    this.left = left;
    this.right = right;
  }
}
