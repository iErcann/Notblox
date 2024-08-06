import { InputComponent } from '../component/InputComponent.js';
export class InputProcessingSystem {
    constructor() { }
    receiveInputPacket(playerEntity, inputMessage) {
        let inputComponent = playerEntity.getComponent(InputComponent);
        if (!inputComponent) {
            inputComponent = new InputComponent(playerEntity.id);
            playerEntity.addComponent(inputComponent);
        }
        // Update the InputComponent based on the received packet
        inputComponent.down = inputMessage.d;
        inputComponent.up = inputMessage.u;
        inputComponent.left = inputMessage.l;
        inputComponent.right = inputMessage.r;
        inputComponent.space = inputMessage.s;
        inputComponent.lookingYAngle = inputMessage.y;
    }
}
//# sourceMappingURL=InputProcessingSystem.js.map