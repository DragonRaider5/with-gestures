import React from 'react'
import Hammer from 'hammerjs'

import Responder, { withHammerManager } from './Responder.js'
import { createPropWhiteLister } from '../utils.js'

const whiteListEventProps = createPropWhiteLister([
  'rotation',
  'deltaTime',
  'srcEvent',
  'target',
  'pointerType',
  'preventDefault'
])

class RotationResponder extends Responder {
  lastRotation = 0

  static getRecognizerClass () {
    return Hammer.Rotate
  }

  getRecognizerOptions = () => {
    return {}
  }

  makeExposableEvent = (event) => {
    return whiteListEventProps(event)
  }
}

export default withHammerManager(RotationResponder)
