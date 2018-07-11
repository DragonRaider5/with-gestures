import React from 'react'

import Provider from './Provider.js'

const defaultOptions = {
  propName: 'setWithGestureRef'
}

export default ({ propName, ...options } = defaultOptions) => (WrappedComponent) => (props) => (
  <Provider {...options}>
    {(setWithGestureRef) => <WrappedComponent {...{ [propName]: setWithGestureRef }} {...props} />}
  </Provider>
)
