import React from 'react'
import ReactDOM from 'react-dom'
import { RecoilRoot } from 'recoil'
import App from './App'
import { GreetingContextProvider } from './contexts/greeting'
import { MintbaseContextProvider } from './contexts/mintbase'
import { initNetwork } from './state/near'

//@ts-ignore
window.networkIntPromise = initNetwork()
  .then((network) => {
    ReactDOM.render(
      <RecoilRoot>
        <MintbaseContextProvider network={network}>
          <GreetingContextProvider network={network}>
            <App />
          </GreetingContextProvider>
        </MintbaseContextProvider>
      </RecoilRoot>,
      document.querySelector('#root')
    )
  })
  .catch((error) => {
    console.error(error)
    ReactDOM.render(
      <RecoilRoot>
        <App />
      </RecoilRoot>,
      document.querySelector('#root')
    )
  })
