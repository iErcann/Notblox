export enum ClientMessageType {
  FIRST_CONNECTION = 0,
  INPUT = 1,
}

export interface ClientMessage {
  t: ClientMessageType;
}
