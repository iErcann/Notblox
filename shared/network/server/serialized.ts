// SNAPSHOT
import { ServerMessage } from './base'
export enum SerializedComponentType {
  NONE = 0,
  POSITION = 1,
  ROTATION = 2,
  SIZE = 3,
  COLOR = 4,
  DESTROYED_EVENT = 5,
  SINGLE_SIZE = 6,

  // Used for animations mostly
  STATE = 7,

  CHAT_LIST = 8,
  CHAT_MESSAGE = 9,

  SERVER_MESH = 10,
  PROXIMITY_PROMPT = 11,
  TEXT = 12,
}

export enum SerializedEntityType {
  NONE = 0,
  PLAYER = 1,
  CUBE = 2,
  WORLD = 3,
  SPHERE = 4,
  CHAT = 5,
  EVENT_QUEUE = 6,
  FLOATING_TEXT = 7,
}

export enum SerializedStateType {
  IDLE = 'Idle',
  WALK = 'Walk',
  RUN = 'Run',
  JUMP = 'Jump',
  ATTACK = 'Attack',
  FALL = 'Fall',
  DEATH = 'Death',
}

export interface SerializedComponent {
  t?: SerializedComponentType
}

export interface SerializedEntity {
  id: number
  // Type
  t: SerializedEntityType
  // Components
  c: SerializedComponent[]
}

export interface SnapshotMessage extends ServerMessage {
  e: Array<SerializedEntity>
}
