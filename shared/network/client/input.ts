import { ClientMessage } from "./base";

export interface InputMessage extends ClientMessage {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
  space: boolean;
}
