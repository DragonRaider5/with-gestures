import React from 'react'

import Provider from './Provider.js'

export default (options = { propName: 'setWithGestureRef' }) => (WrappedComponent) => (props) => (
  <Provider {...options}>
    {(setWithGestureRef) => <WrappedComponent {...{ [options.propName]: setWithGestureRef }} {...props} />}
  </Provider>
)
