import React from 'react'
import './styles/tailwind.css'
import { useRecoilValueLoadable } from 'recoil'
import { useRecoilValue } from 'recoil'
import { ToastContainer } from 'react-toastify'
import { Redirect, Route, Switch } from 'react-router'
import { HashRouter } from 'react-router-dom'
import { nearState } from './state/near'
import { AuthProvider, AuthRoute } from './components/AuthProvider'
import { isLoggedInState } from './state/authentication'

import 'react-toastify/dist/ReactToastify.css'
import Header from './components/Header'
import Footer from './components/Footer'
import Welcome from './pages/Welcome'
import Dashboard from './pages/Dashboard'

const App: React.FC = () => {
  // Load near library
  const loadNear = useRecoilValueLoadable(nearState)
  const isLoggedIn = useRecoilValue(isLoggedInState)

  return (
    <>
      <div className="flex flex-col h-screen">
        <React.Fragment>
          <ToastContainer position="bottom-right" autoClose={5000} />
          <React.Suspense fallback={<div>Loading...</div>}>
            {loadNear.state == 'hasValue' && loadNear.contents && (
              <AuthProvider>
                <Header />
                <main className="flex-grow">
                  <HashRouter>
                    <Switch>
                      <Route exact path="/home">
                        <AuthRoute>
                          <Dashboard />
                        </AuthRoute>
                      </Route>
                      <Route exact path="/">
                        {isLoggedIn ? <Redirect to="/home" /> : <Welcome />}
                      </Route>
                    </Switch>
                  </HashRouter>
                </main>
                <Footer />
              </AuthProvider>
            )}
          </React.Suspense>
        </React.Fragment>
      </div>
    </>
  )
}

export default App
