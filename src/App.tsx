import React from 'react'
import './styles/tailwind.css';
import { useRecoilValueLoadable } from 'recoil'
import { useRecoilValue } from 'recoil'
import { ToastContainer } from 'react-toastify'
import { Redirect, Route, Switch } from 'react-router'
import { HashRouter } from 'react-router-dom'
import { nearState } from './state/near'
import { AuthProvider } from './components/AuthProvider'
import { isLoggedInState } from './state/authentication'

import 'react-toastify/dist/ReactToastify.css'
import Home from './components/Home'
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
        <React.Fragment>
          <ToastContainer position="bottom-right" autoClose={5000} />
          <Header />
          <main className="flex-grow">
            <React.Suspense fallback={<div>Loading...</div>}>
              {loadNear.state == 'hasValue' && loadNear.contents && (
                <AuthProvider>
                  <HashRouter>
                    <Switch>
                      <Route exact path="/home" component={Home} />
                      <Route exact path="/">
                        {isLoggedIn ? <Redirect to="/home" /> : <Welcome />}
                      </Route>
                    </Switch>
                  </HashRouter>
                </AuthProvider>
              )}
            </React.Suspense>

          </main>
        </React.Fragment>
        <Footer />
      </div>
    </>
  )
}

export default App
