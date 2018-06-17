import React from 'react'

import Provider from './Provider.js'

export default (options = {}) => (WrappedComponent) => (props) => (
  <Provider {...options}>
    {(setWithGestureRef) => <WrappedComponent setWithGestureRef={setWithGestureRef} {...props} />}
  </Provider>
)
