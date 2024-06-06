import { Component } from '../../../../../shared/component/Component.js'

/**
 * This event is triggered when a chat message is sent
 */
export class ChatMessageEvent extends Component {
  constructor(entityId: number, public sender: string, public content: string) {
    super(entityId)
  }
}
