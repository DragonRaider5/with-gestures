import React from 'react'

import { Provider } from '../Provider.js'
import { withHammerManager } from './Responder.js'

class CombineResponders extends React.Component {
  getContext = () => ({
    ...this.props.hammerManager,
    addRecognizer: this.addRecognizer,
    on: this.addEventListener
  })

  childRecognizerIds = []
  eventListeners = []

  addRecognizer = (RecognizerClass, options = {}, recognizeWith = [], requireFailure = false) => {
    const { hammerManager } = this.props
    const id = hammerManager.addRecognizer(
      RecognizerClass,
      options,
      recognizeWith.concat(this.childRecognizerIds),
      requireFailure
    )

    hammerManager.off(this.childRecognizerIds.join(' '))
    this.childRecognizerIds.push(id)
    hammerManager.on(this.childRecognizerIds.join(' '), this.handleEvent)

    return id
  }

  removeRecognizer = (recognizerId) => {
    this.eventListeners = this.eventListeners.filter(({ eventId }) => eventId !== recognizerId)
    this.childRecognizerIds = this.childRecognizerIds.filter((id) => id !== recognizerId)

    return hammerManager.removeRecognizer(recognizerId)
  }

  addEventListener = (eventId, handler) => {
    this.eventListeners.push({ eventId, handler })
  }

  handleEvent = (event) => {
    this.eventListeners.forEach(({ handler }) => handler(event))
  }

  render () {
    return (
      <Provider value={this.getContext()}>
        { this.props.children }
      </Provider>
    )
  }
}

export default withHammerManager(CombineResponders)
