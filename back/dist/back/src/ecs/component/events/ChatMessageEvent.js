import { Component } from '../../../../../shared/component/Component.js';
/**
 * This event is triggered when a chat message is sent
 */
export class ChatMessageEvent extends Component {
    sender;
    content;
    constructor(entityId, sender, content) {
        super(entityId);
        this.sender = sender;
        this.content = content;
    }
}
//# sourceMappingURL=ChatMessageEvent.js.map