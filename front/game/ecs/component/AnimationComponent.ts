import { Component } from "@shared/component/Component";
import * as THREE from "three";

export class AnimationComponent extends Component {
  mixer: THREE.AnimationMixer;
  constructor(
    entityId: number,
    mesh: THREE.Mesh,
    animations: THREE.AnimationClip[]
  ) {
    super(entityId);
    this.mixer = new THREE.AnimationMixer(mesh);

    // Play all animations

    animations.forEach((clip, index) => {
      if (index === 2) this.mixer.clipAction(clip).play();
    });
  }
}
