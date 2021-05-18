import React from 'react'

import './global.css'
import Home from './components/Home'
import { useRecoilValueLoadable } from 'recoil'
import { nearState } from './state/near'
import { AuthProvider } from './components/AuthProvider'
import { useRecoilValue } from 'recoil'
import { isLoggedInState } from './state/authentication'
import Welcome from './components/Welcome'

const App: React.FC = () => {
  // Load near library
  const loadNear = useRecoilValueLoadable(nearState)
  const isLoggedIn = useRecoilValue(isLoggedInState)

  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      {loadNear.state == 'hasValue' && loadNear.contents && (
        <AuthProvider>
          {!isLoggedIn && <Welcome />}
          {isLoggedIn && <Home />}
        </AuthProvider>
      )}
    </React.Suspense>
  )
}

export default App
