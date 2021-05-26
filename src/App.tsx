import React from 'react'

import './styles/tailwind.css';
import Home from './components/Home'
import { useRecoilValueLoadable } from 'recoil'
import { nearState } from './state/near'
import { AuthProvider } from './components/AuthProvider'
import { useRecoilValue } from 'recoil'
import { isLoggedInState } from './state/authentication'
import Welcome from './components/Welcome'
import Header from './components/Header';
import Footer from './components/Footer';

const App: React.FC = () => {
  // Load near library
  const loadNear = useRecoilValueLoadable(nearState)
  const isLoggedIn = useRecoilValue(isLoggedInState)

  return (
    <>
    <div className="flex flex-col h-screen">
      <Header />
      <main className="flex-grow">
        <React.Suspense fallback={<div>Loading...</div>}>
          {loadNear.state == 'hasValue' && loadNear.contents && (
            <AuthProvider>
              {!isLoggedIn && <Welcome />}
              {isLoggedIn && <Home />}
            </AuthProvider>
          )}
        </React.Suspense>
      </main>
      <Footer />
      </div>
    </>
  )
}

export default App
