export enum ClientMessageType {
  FIRST_CONNECTION = 0,
  INPUT = 1,
  CHAT_MESSAGE = 2,
  TRANSFORM_UPDATE = 3,
  TOGGLE_TRANSFORM_CONTROLS = 4,
  ENTITY_POSITION_UPDATE = 5,
  ENTITY_ROTATION_UPDATE = 6,
  ENTITY_SCALE_UPDATE = 7,
}

export interface ClientMessage {
  t: ClientMessageType
  entityId?: number
}

export interface TransformUpdateMessage extends ClientMessage {
  t: ClientMessageType.TRANSFORM_UPDATE;
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  scale: { x: number; y: number; z: number };
}

export interface ToggleTransformControlsMessage extends ClientMessage {
  t: ClientMessageType.TOGGLE_TRANSFORM_CONTROLS;
  enabled: boolean;
}

export interface PositionUpdateMessage extends ClientMessage {
  t: ClientMessageType.ENTITY_POSITION_UPDATE;
  entityId: number;
  x: number;
  y: number;
  z: number;
}

export interface RotationUpdateMessage extends ClientMessage {
  t: ClientMessageType.ENTITY_ROTATION_UPDATE;
  entityId: number;
  x: number;
  y: number;
  z: number;
  w: number;
}

export interface ScaleUpdateMessage extends ClientMessage {
  t: ClientMessageType.ENTITY_SCALE_UPDATE;
  entityId: number;
  x: number;
  y: number;
  z: number;
}