import React, { Component, Timeout } from 'react'
import { createCache, createResource } from 'simple-cache-provider'

const compatible = React.version.includes('16.4')

if (!compatible) {
  console.warn(
    `🚨 The running version of react is not compatible with the suspense feature → Upgrade react or downgrade drum-roll.`,
  )
}

const cache = createCache()

export const createFetcher = resolver => {
  const resource = createResource(resolver)
  return key => () => resource(cache, key)
}

const Renderer = ({ fetcher, children, didExpire, error }) =>
  error
    ? children(null, true)
    : didExpire ? children(null) : children(fetcher())

export class Fetcher extends Component {
  state = { error: false }

  componentDidCatch(e) {
    this.setState({ error: true })
  }

  static getDerivedStateFromProps = () => ({ error: false })

  render() {
    const { fetcher, children } = this.props
    const { error } = this.state

    return compatible ? (
      <Timeout ms={this.props.delay || 1000}>
        {didExpire => (
          <Renderer
            error={error}
            didExpire={didExpire}
            fetcher={fetcher}
            children={children}
          />
        )}
      </Timeout>
    ) : null
  }
}
