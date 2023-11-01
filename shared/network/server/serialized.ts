// SNAPSHOT
import { ServerMessage } from "./base";
export enum SerializedComponentType {
  NONE = 0,
  POSITION = 1,
  ROTATION = 2,
  SIZE = 3,
  COLOR = 4,
  DESTROYED = 5,
  SINGLE_SIZE = 6,
}

export enum SerializedEntityType {
  PLAYER = 1,
  CUBE = 2,
  WORLD = 3,
  SPHERE = 4,
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

export interface SerializedSizeComponent extends SerializedComponent {
  width: number;
  height: number;
  depth: number;
}

export interface SerializedSingleSizeComponent extends SerializedComponent {
  size: number;
}

export interface SerializedColorComponent extends SerializedComponent {
  color: string;
}

export interface SerializedDestroyedComponent extends SerializedComponent {}

export interface SnapshotMessage extends ServerMessage {
  e: Array<SerializedEntity>;
}
