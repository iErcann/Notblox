import { ClientMessage } from './base'

// When a player interacts with a proximity prompt, we send this message to the server
export interface ProximityPromptInteractMessage extends ClientMessage {
  // Which entity is being interacted with
  eId: number
}
