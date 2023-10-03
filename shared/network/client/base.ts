export enum ClientMessageType {
  FIRST_CONNECTION = 0,
}

export interface ClientMessage {
  t: ClientMessageType;
}
