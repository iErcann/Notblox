// import {
//   SerializedComponentType,
//   SerializedRotationComponent,
// } from "../network/server/serialized.js";

// import { NetworkComponent } from "../network/NetworkComponent.js";

// export class ChatListComponent extends NetworkComponent {
//   constructor(entityId: number, public chatMessages: string[]) {
//     super(entityId, SerializedComponentType.CHAT);
//   }
//   deserialize(data: SerializedRotationComponent): void {
//     this.chatMessages = data.chatMessages;
//   }
//   serialize(): void {
//     return {
//       chatMessages: this.chatMessages,
//     };
//   }
// }
