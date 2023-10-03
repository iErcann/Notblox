// SNAPSHOT
import { ServerMessage } from "./base";
export enum SerializedComponentType {
  NONE = 0,
  POSITION = 1,
  ROTATION = 2,
}

export enum SerializedEntityType {
  PLAYER = 1,
  CUBE = 2,
}

export interface SerializedComponent {
  t?: SerializedComponentType;
}

export interface SerializedEntity {
  id: number;
  // Type
  t: SerializedEntityType;
  // Components
  c: SerializedComponent[];
}

export interface SerializedPositionComponent extends SerializedComponent {
  x: number;
  y: number;
  z: number;
}

export interface SerializedRotationComponent extends SerializedComponent {
  x: number;
  y: number;
  z: number;
  w: number;
}
export interface SnapshotMessage extends ServerMessage {
  e: Array<SerializedEntity>;
}
