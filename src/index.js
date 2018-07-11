export { default as withGestures } from './HOC.js'
export {
  default as GestureProvider,
  Consumer
} from './Provider.js'

export {
  DIRECTION_NONE,
  DIRECTION_LEFT,
  DIRECTION_RIGHT,
  DIRECTION_UP,
  DIRECTION_DOWN,
  DIRECTION_HORIZONTAL,
  DIRECTION_VERTICAL,
  DIRECTION_ALL
} from 'hammerjs'

export { default as CombineResponders } from './responders/CombineResponders.js'

export { default as PanResponder } from './responders/PanResponder.js'
export { default as RotationResponder } from './responders/RotationResponder.js'
export { default as PinchResponder } from './responders/PinchResponder.js'
export { default as SwipeResponder } from './responders/SwipeResponder.js'
