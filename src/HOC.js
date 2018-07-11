import React from 'react'

import Provider from './Provider.js'

export default ({ propName = 'setWithGestureRef', ...options }) => (WrappedComponent) => (props) => (
  <Provider {...options}>
    {(setWithGestureRef) => <WrappedComponent {...{ [propName]: setWithGestureRef }} {...props} />}
  </Provider>
)
