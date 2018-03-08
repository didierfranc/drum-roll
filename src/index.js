import { Component } from 'react'
import { createCache, createResource } from 'simple-cache-provider'

const cache = createCache()

export const createFetcher = resolver => {
  const resource = createResource(resolver)
  return key => () => resource(cache, key)
}

const INITIAL = 'initial'
const LOADING = 'loading'
const SUCCESS = 'success'
const FAILURE = 'failure'

export class Fetcher extends Component {
  state = {
    status: INITIAL,
  }

  load = promise => {
    try {
      promise.then(() => {
        if (this.timeout) clearTimeout(this.timeout)
        this.setState({ status: SUCCESS })
      })
    } catch (e) {
      this.setState({ status: FAILURE })
    }
  }

  startTimeout = () => {
    this.timeout = setTimeout(
      () => this.setState({ status: LOADING }),
      this.props.delay,
    )
  }

  static getDerivedStateFromProps = () => ({ status: INITIAL })

  render() {
    const { children, fetcher } = this.props
    const { status } = this.state

    switch (status) {
      case INITIAL: {
        try {
          return children(fetcher(), false, false)
        } catch (e) {
          this.load(e)
          this.startTimeout()
          return null
        }
      }
      case LOADING:
        return children(false, true, false)
      case SUCCESS:
        return children(fetcher(), false, false)
      case FAILURE:
        return children(false, false, true)
    }
  }
}
