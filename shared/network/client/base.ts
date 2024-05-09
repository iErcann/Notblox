export enum ClientMessageType {
  FIRST_CONNECTION = 0,
  INPUT = 1,
  CHAT_MESSAGE = 2,
}

export interface ClientMessage {
  t: ClientMessageType;
}
