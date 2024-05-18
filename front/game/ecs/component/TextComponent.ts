import * as THREE from 'three'
import { Component } from '@shared/component/Component'
import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js'

export class TextComponent extends Component {
  textObject: CSS2DObject // Assuming you're using CSS2DObject

  constructor(entityId: number, initialText: string = '') {
    super(entityId)
    this.textObject = this.createTextObject(initialText)
  }

  setText(newText: string) {
    this.textObject.element.textContent = newText
  }

  private createTextObject(initialText: string): CSS2DObject {
    const textElement = document.createElement('div')
    textElement.textContent = initialText
    textElement.style.color = '#FFFFFF'
    textElement.style.backgroundColor = 'rgba(0, 0, 0, 0.2)'
    textElement.style.padding = '5px'
    textElement.style.fontFamily = 'Arial, sans-serif'
    textElement.style.fontSize = '14px'

    const cssObject = new CSS2DObject(textElement)
    cssObject.position.set(0, 3, 0) // Adjust the position as needed.
    return cssObject
  }
  setFollowedMesh(mesh: THREE.Mesh) {
    mesh.add(this.textObject)
  }
}
