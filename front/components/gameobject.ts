export interface NetworkGameObject {
  sync(data: any): void;
  update(lerpValue: number): void;
}
