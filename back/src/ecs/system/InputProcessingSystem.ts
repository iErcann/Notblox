import { InputComponent } from '../component/InputComponent.js'
import { Entity } from '../../../../shared/entity/Entity.js'
import { InputMessage } from '../../../../shared/network/client/input.js'

export class InputProcessingSystem {
  constructor() {}

  receiveInputPacket(playerEntity: Entity, inputMessage: InputMessage) {
    let inputComponent = playerEntity.getComponent(InputComponent)

    if (!inputComponent) {
      inputComponent = new InputComponent(playerEntity.id)
      playerEntity.addComponent(inputComponent)
    }

    // Update the InputComponent based on the received packet
    inputComponent.down = inputMessage.down
    inputComponent.up = inputMessage.up
    inputComponent.left = inputMessage.left
    inputComponent.right = inputMessage.right
    inputComponent.space = inputMessage.space
    inputComponent.lookingYAngle = inputMessage.angleY
  }
}
