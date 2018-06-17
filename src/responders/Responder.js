import React from 'react'

import invariant from 'invariant'
import { Consumer } from '../Provider.js'
import { createAreShallowEqual, callIfDefined, createDidChange } from '../utils.js'

const ABSTRACT_METHOD = (methodName) => () => {
  throw new Error(`Tried to call abstract method '${methodName}'`)
}

function accessAbstractMember(key) {
  const value = this[key]
  if (typeof value === 'undefined') {
    throw new Error(`Every implementation of Responder needs to define '${key}' in their this scope`)
  }
}

const addRecognizer = (hammerManager, recognizer) => {
  return hammerManager.addRecognizer(...recognizer)
}

const removeRecognizer = (hammerManager, recognizerId) => {
  return hammerManager.removeRecognizer(recognizerId)
}

const getRecognizerClass = (instance) => instance.constructor.getRecognizerClass()

const eventTypes = [ '', 'start', 'end', 'cancel' ]
const makeEvents = (eventId) => eventTypes.map((type) => eventId + type).join(' ')

export default class Responder extends React.PureComponent {
  _eventInProgress = false
  _didEventChange = createDidChange(createAreShallowEqual([
    'deltaTime',
    'srcEvent'
  ]), {})

  constructor (props) {
    super(props)

    const isNotExtendedResponder = this.constructor === Responder
    invariant(!isNotExtendedResponder, 'You should never directly instantiate a Responder. ' +
      'Instead extend from it to create specific responders.'
    )
  }

  componentDidMount () {
    const recClass = getRecognizerClass(this)
    const recOptions = this.getRecognizerOptions()

    this.id = addRecognizer(this._getHammerManager(), [ recClass, recOptions ])
    this._getHammerManager().on(makeEvents(this.id), this._handleEvent)
  }

  componentWillUnmount () {
    removeRecognizer(this._getHammerManager(), this.id)
  }

  _getHammerManager = () => this.props.hammerManager

  _handleEvent = (event) => {
    event = callIfDefined(this.mutateEvent, event) || event
    const exposedEvent = this.makeExposableEvent(event)

    if (event.type.includes('start')) {
      callIfDefined(this.props.onBegin, exposedEvent)
    }

    this._didEventChange(event) && callIfDefined(this.props.onEvent, exposedEvent)

    if (event.type.includes('end')) {
      callIfDefined(this.props.onEnd, exposedEvent)
    }
  }

  eventInProgress = () => this._eventInProgress

  _setEventState = (eventInProgress, event) => {
    if (eventInProgress) {
      callIfDefined(this.props.onBegin, event)
    } else {
      callIfDefined(this.props.onEnd, event)
    }

    this._eventInProgress = eventInProgress
  }

  static getRecognizerClass = ABSTRACT_METHOD('static getRecognizerClass')
  getRecognizerOptions = ABSTRACT_METHOD('getRecognizerOptions')
  makeExposableEvent = ABSTRACT_METHOD('makeExposableEvent')

  render () {
    return null
  }
}

export const withHammerManager = (WrappedComponent) => {
  const Component = (props) => (
    <Consumer>
      { (hammerManager) => <WrappedComponent {...props} hammerManager={hammerManager} /> }
    </Consumer>
  )
  Component.displayName = `withHammerManager(${WrappedComponent.displayName || WrappedComponent.name})`

  return Component
}
