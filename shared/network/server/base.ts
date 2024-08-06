export enum ServerMessageType {
  SNAPSHOT = 0,
  FIRST_CONNECTION = 1,
}

export interface ServerMessage {
  t: ServerMessageType
}
