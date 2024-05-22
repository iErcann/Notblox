/* 
  Generics explanation:
    const playerEntity = new Entity();
    const colorComponent = new ColorComponent();
    playerEntity.removeComponent(ColorComponent);


    class ColorSystem implements System {
      onComponentRemoved(event: ComponentRemovedEvent<ColorComponent>): void {
        console.log(`Color component removed with color: ${event.component.color}`);
      }
    }
  
  ColorSystem explicitly expects ComponentRemovedEvent<ColorComponent>
  no need for a type guard to check if the component is of type ColorComponent

*/

import { Component } from '../Component.js'

export class ComponentAddedEvent<T extends Component> extends Component {
  constructor(public addedComponent: T) {
    super(addedComponent.entityId)
  }
}
