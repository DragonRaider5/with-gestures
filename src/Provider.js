import React from 'react'

import invariant from 'invariant'
import { Manager } from 'hammerjs'
import uuid from 'uuid/v4'

const Context = React.createContext(false)

const getComponentName = (Component) => Component.displayName || Component.name

export default class GestureProvider extends React.Component {
  hammer = false
  startupRecognizers = []
  startupHandlers = []

  componentDidMount () {
    invariant(this.child, 'Please use the function \'setWithGestureRef\' passed ' +
      'to your component your consumer function to set a reference ' +
      'to the component which withGestures should detect gestures for.'
    )

    this.hammer = new Manager(this.child, {
      touchAction: 'compute',
      recognizers: this.startupRecognizers
    })

    this.startupHandlers.forEach(({ event, eventHandler }) => {
      this.hammer.on(event, eventHandler)
    })
  }

  componentWillUnmount () {
    this.hammer.stop(true)
    this.hammer.destroy()
    this.hammer = false
  }

  setChildRef = (ref) => {
    this.child = ref
  }

  getContext = () => ({
    addRecognizer: this.addRecognizer,
    on: this.onEvent,
    off: this.offEvent,
    removeRecognizer: this.removeRecognizer
  })

  addRecognizer = (RecognizerClass, options = {}, recognizeWith = false, requireFailure = false) => {
    const id = uuid()
    options = {
      ...options,
      event: id
    }

    if (!this.hammer) {
      this.startupRecognizers.push([ RecognizerClass, options, recognizeWith, requireFailure ])

      return id
    }

    const recognizer = new RecognizerClass(options)

    if (recognizeWith) {
      recognizeWith.forEach((recWith) => recognizer.recognizeWith(recWith))
    }

    if (requireFailure) {
      requireFailure.forEach((recFailure) => recognizer.requireFailure(recFailure))
    }

    this.hammer.add(recognizer)

    return id
  }

  onEvent = (event, eventHandler) => {
    if (!this.hammer) {
      this.startupHandlers.push({ event, eventHandler })

      return
    }

    this.hammer.on(event, eventHandler)
  }

  offEvent = (event, eventHandler) => {
    if (!this.hammer) {
      if (eventHandler) {
        this.startupHandlers = this.startupHandlers.filter((handler) => !(handler.event === event && handler.eventHandler === eventHandler))
      } else {
        this.startupHandlers = this.startupHandlers.filter((handler) => handler.event !== event)
      }

      return
    }

    this.hammer.off(event, eventHandler)
  }

  removeRecognizer = (id) => {
    if (!this.hammer) {
      this.startupRecognizers = this.startupRecognizers.filter((recognizer) => recognizer[1].event !== id)

      return
    }

    this.hammer.remove(id)
  }

  render () {
    const { children } = this.props

    invariant(typeof children === 'function', 'Please provide a function as the ' +
      'child of the GestureProvider, which will receive the setWithGestureRef function.'
    )

    return (
      <Context.Provider value={this.getContext()}>
        { children(this.setChildRef) }
      </Context.Provider>
    )
  }
}

export const Consumer = Context.Consumer
export const Provider = Context.Provider
