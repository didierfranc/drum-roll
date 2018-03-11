###### 🚨 This is highly experimental, APIs will change as highlighted [here](https://github.com/facebook/react/blob/master/packages/simple-cache-provider/README.md#no-really-it-is-unstable), use it with maximum precautions.

# drum-roll 🥁

A simple way to use the new big thing from the React Team: **_Suspense_**.

## Requirements

`drum-roll@next` requires `react@canary` and `react-dom@canary`, because it depends on **React** experimental features.

## How to use it ?

1. Create a fetcher with `createFetcher()`, it accept a function wich will return a Promise.
2. Use the `<Fetcher />` component to handle your result properly.

```js
import React, { Component } from 'react'
import { createFetcher, Fetcher } from 'drum-roll'

const getUser = createFetcher(username =>
  fetch(`https://api.github.com/users/${username}`).then(r => r.json()),
)

class App extends Component {
  state = {
    username: null,
  }
  handleClick = () => {
    const { value: username } = this.el
    this.setState({ username })
  }
  render() {
    const { username } = this.state
    return (
      <div>
        <input ref={el => (this.el = el)} />
        <button onClick={this.handleClick}>load</button>
        <div>
          {username && (
            <Fetcher fetcher={getUser(username)} delay={100}>
              {(data, error) =>
                data ? JSON.stringify(data) : error ? '💥' : '⏳'
              }
            </Fetcher>
          )}
        </div>
      </div>
    )
  }
}

export default App
```

## Links

* [drum-roll-suspense-example (codesandbox)](https://codesandbox.io/s/github/didierfranc/drum-roll-suspense-example)
* [Dan Abramov, Beyond React 16](https://www.youtube.com/watch?v=v6iR3Zk4oDY)
