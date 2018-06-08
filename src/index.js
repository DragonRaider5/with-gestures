import React from 'react'

import invariant from 'invariant'
import Hammer from 'hammerjs'

const getComponentName = (Component) => Component.displayName || Component.name

const capitalizeFirstLetter = (string) => string.charAt(0).toUpperCase() + string.slice(1)

export default (options) => (WrappedComponent) => class withGestures extends React.Component {
  displayName = `withGestures(${getComponentName(WrappedComponent)})`

  componentDidMount () {
    invariant(this.child, 'Please use the property \'setWithGestureRef\' passed ' +
      `to your component '${getComponentName(WrappedComponent)}' to set a reference ` +
      'to the component which withGestures should detect gestures for.'
    )

    this.hammer = new Hammer.Manager(this.child, {
      touchAction: 'compute'
    })

    let key
    for (key in options) {
      const recognizer = new Hammer[capitalizeFirstLetter(key)](options[key])
      this.hammer.add(recognizer)
      this.hammer.on(key, this.handleEvent(key))
    }
  }

  componentWillUnmount () {
    this.hammer.stop(true)
    this.hammer.destroy()
  }

  handleEvent = (key) => (event) => {
    if (!event.isFinal) {
      this.setState({
        [key]: event
      })
    } else {
      this.setState({
        [key]: null
      })
    }
  }

  setChildRef = (ref) => {
    this.child = ref
  }

  render () {
    return (
      <WrappedComponent
        {...this.props}
        setWithGestureRef={this.setChildRef}
        {...this.state}
      />
    )
  }
}
