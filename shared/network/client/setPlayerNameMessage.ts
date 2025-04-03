import { ClientMessage, ClientMessageType } from './base.js'

export interface SetPlayerNameMessage extends ClientMessage {
  t: ClientMessageType.SET_PLAYER_NAME
  // Player name to set
  name: string
}
