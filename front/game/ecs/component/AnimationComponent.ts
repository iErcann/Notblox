import { Component } from "@shared/component/Component";
import * as THREE from "three";

export class AnimationComponent extends Component {
  mixer: THREE.AnimationMixer;
  animationState: number = 0;
  constructor(
    public entityId: number,
    public mesh: THREE.Mesh,
    public animations: THREE.AnimationClip[]
  ) {
    super(entityId);
    this.mixer = new THREE.AnimationMixer(mesh);

    /*   animations.forEach((clip, index) => {
      if (index === 4) this.mixer.clipAction(clip).play();
    }); */
  }
}
