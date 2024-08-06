// FIRST_CONNECTION
import { ServerMessage } from './base'
export interface ConnectionMessage extends ServerMessage {
  // Connected player entity id
  id: number
}
