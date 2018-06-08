import React from 'react'
import styled from 'styled-components'

import withGestures from '../src/index.js'

const WrappedComponent = ({ setWithGestureRef, pan }) => (
  <GestureResponder style={{
    transform: pan && `translate(${pan.deltaX || 0}px, ${pan.deltaY || 0}px)`
  }} innerRef={setWithGestureRef}> { /* innerRef needed to bypass styled-components, normally it'd only be ref */ }
    withGestures
  </GestureResponder>
)

const options = {
  pinch: {
    enable: true
  },
  pan: {
    enable: true
  }
}

const Component = withGestures(options)(WrappedComponent)

export default () => (
  <Wrapper>
    <Component />
  </Wrapper>
)

const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;

  display: flex;
  align-items: center;
  justify-content: center;

  background: #F9F9F9;
`

const GestureResponder = styled.div`
  padding: 32px 48px;
  border-radius: 8px;

  cursor: pointer;

  color: white;
  background: #663399;
`
