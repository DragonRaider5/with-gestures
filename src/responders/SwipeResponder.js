import React from 'react'
import Hammer, { DIRECTION_ALL } from 'hammerjs'

import Responder, { withHammerManager } from './Responder.js'
import { createPropWhiteLister } from '../utils.js'

const whiteListEventProps = createPropWhiteLister([
  'deltaX',
  'deltaY',
  'deltaTime',
  'angle',
  'velocityX',
  'velocityY', // don't allow plain 'velocity' from hammer.js as it's just max(velX, velY) and that's plain wrong - would have to use pytagoras for this
  'direction',
  'offsetDirection',
  'srcEvent',
  'target',
  'pointerType',
  'preventDefault'
])

class PinchResponder extends Responder {
  lastScale = 1

  static getRecognizerClass () {
    return Hammer.Swipe
  }

  getRecognizerOptions = () => {
    const {
      threshold = 10,
      velocity = 0.3,
      direction = DIRECTION_ALL,
      minPointers = 1
    } = this.props

    return {
      threshold,
      velocity,
      direction,
      pointers: minPointers
    }
  }

  makeExposableEvent = (event) => {
    return whiteListEventProps(event)
  }
}

export default withHammerManager(PinchResponder)
