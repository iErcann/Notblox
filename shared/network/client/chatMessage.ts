import { ClientMessage } from './base'

export interface ChatMessage extends ClientMessage {
  content: string
}
