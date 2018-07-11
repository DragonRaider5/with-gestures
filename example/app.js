import React from 'react'
import styled from 'styled-components'

import { withGestures, CombineResponders, PanResponder, PinchResponder } from '../src/index.js'

class WrappedComponent extends React.PureComponent {
  state = {
    scale: 1,
    deltaScale: 1,
    x: 0,
    y: 0,
    deltaX: 0,
    deltaY: 0
  }

  handlePan = ({ deltaX, deltaY }) => {
    this.setState({
      deltaX,
      deltaY
    })
  }

  handlePanEnd = ({ deltaX, deltaY }) => {
    this.setState((prevState) => ({
      x: prevState.x + deltaX,
      y: prevState.y + deltaY,
      deltaX: 0,
      deltaY: 0
    }))
  }

  handlePinch = ({ scale }) => {
    // console.log(scale)
    this.setState({
      deltaScale: scale
    })
  }

  handlePinchEnd = ({ scale }) => {
    this.setState((prevState) => ({
      scale: prevState.scale * scale,
      deltaScale: 1
    }), () => console.log(this.state))
  }

  getStyle = () => {
    const x = this.state.x + this.state.deltaX
    const y = this.state.y + this.state.deltaY
    const scale = this.state.scale * this.state.deltaScale

    return {
      transform: `translate(${x}px, ${y}px) scale(${scale})`
    }
  }

  render () {
    const { setWithGestureRef } = this.props // injected by withGestures

    return (
      <GestureResponder
        innerRef={setWithGestureRef /* innerRef needed to bypass styled-components, normaly it'd only be ref */}
        style={this.getStyle()}
      >
        withGestures

        <CombineResponders>
          <PinchResponder onEvent={this.handlePinch} onEnd={this.handlePinchEnd} />
          <PanResponder onEvent={this.handlePan} onEnd={this.handlePanEnd} />
        </CombineResponders>
      </GestureResponder>
    )
  }
}

const options = {}

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
