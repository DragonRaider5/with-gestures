import React from 'react'

import Provider from './Provider.js'

const defaultOptions = {
  propName: 'setWithGestureRef'
}

export default ({ propName, ...options } = defaultOptions) => (WrappedComponent) => React.forwardRef((props, ref) => (
  <Provider {...options}>
    {(setWithGestureRef) => <WrappedComponent {...{ [propName]: setWithGestureRef }} ref={ref} {...props} />}
  </Provider>
))
