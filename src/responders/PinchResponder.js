import React from 'react'
import Hammer from 'hammerjs'

import Responder, { withHammerManager } from './Responder.js'
import { createPropWhiteLister } from '../utils.js'

const whiteListEventProps = createPropWhiteLister([
  'scale',
  'deltaTime',
  'srcEvent',
  'target',
  'pointerType',
  'preventDefault'
])

class PinchResponder extends Responder {
  lastScale = 1

  static getRecognizerClass () {
    return Hammer.Pinch
  }

  getRecognizerOptions = () => {
    const {
      threshold = 0,
      minPointers = 2
    } = this.props

    return {
      threshold,
      pointers: minPointers
    }
  }

  // mutateEvent = (event) => {
  //   if (event.pointers.length < 2) {
  //     return {
  //       ...event,
  //       scale: this.lastScale,
  //       isFinal: true
  //     }
  //   }
  //
  //   this.lastScale = event.scale
  //   return event
  // }

  makeExposableEvent = (event) => {
    return whiteListEventProps(event)
  }
}

export default withHammerManager(PinchResponder)
