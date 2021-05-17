import React, { useContext, useEffect, useState } from 'react'
import { appStore, onAppMount } from './state/app'
import { Wallet } from './state/near'

import './global.css'
import Welcome from './components/Welcome'
import Home from './components/Home'

const App: React.FC = () => {
  const { state, dispatch } = useContext(appStore)

  const { wallet }: { wallet: Wallet } = state
  console.log('state', state)

  const onMount = () => {
    dispatch(onAppMount())
  }
  useEffect(onMount, [])

  if (wallet && wallet.isSignedIn()) {
    return <Home />
  } else {
    return (
      <Welcome
        login={() => {
          wallet.signIn()
        }}
      />
    )
  }
}

export default App
