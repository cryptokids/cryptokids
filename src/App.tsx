import React from 'react'
import './styles/tailwind.css'
import { useRecoilValueLoadable } from 'recoil'
import { useRecoilValue } from 'recoil'
import { ToastContainer } from 'react-toastify'
import { Redirect, Route, Switch } from 'react-router'
import { BrowserRouter as Router } from 'react-router-dom'
import { nearState } from './state/near'
import { AuthProvider, AuthRoute } from './components/AuthProvider'
import { isLoggedInState, UserState } from './state/authentication'

import 'react-toastify/dist/ReactToastify.css'
import Header from './components/Header'
import Footer from './components/Footer'
import Welcome from './pages/Welcome'
import Dashboard from './pages/Dashboard'
import Marketplace from './pages/Marketplace'
import Charities from './pages/Charities'
import Activity from './pages/Activity'

const App: React.FC = () => {
  // Load near library
  const loadNear = useRecoilValueLoadable(nearState)
  const loggedInState = useRecoilValue(isLoggedInState)

  return (
    <>
      <div className="flex flex-col h-screen">
        <React.Fragment>
          <ToastContainer position="bottom-right" autoClose={5000} />
          <React.Suspense fallback={<div>Loading...</div>}>
            {loadNear.state == 'hasValue' && loadNear.contents && (
              <AuthProvider>
                <Router basename={process.env.PUBLIC_URL || ''}>
                  <Header />
                  <main className="flex-grow">
                    <Switch>
                      <Route path="/marketplace">
                        <Marketplace />
                      </Route>
                      <Route path="/dashboard">
                        <AuthRoute>
                          <Dashboard />
                        </AuthRoute>
                      </Route>
                      <Route path="/activity">
                        <Activity />
                      </Route>
                      <Route path="/charities">
                        <Charities />
                      </Route>
                      <Route path="/welcome">
                        <Welcome />
                      </Route>
                      <Route exact path="/">
                        {loggedInState != UserState.Anonymous ? (
                          <Redirect to="/marketplace" />
                        ) : (
                          <Welcome />
                        )}
                      </Route>
                    </Switch>
                  </main>
                  <Footer />
                </Router>
              </AuthProvider>
            )}
          </React.Suspense>
        </React.Fragment>
      </div>
    </>
  )
}

export default App
