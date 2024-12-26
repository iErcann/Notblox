import { ClientMessage } from './base'

export interface InputMessage extends ClientMessage {
  // UP
  u: boolean
  // DOWN
  d: boolean
  // LEFT
  l: boolean
  // RIGHT
  r: boolean
  // SPACE
  s: boolean
  // Y angle
  y: number
  // INTERACTION
  i: boolean
}
