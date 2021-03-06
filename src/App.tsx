import React from 'react'
import './styles/tailwind.css'
import { ToastContainer } from 'react-toastify'
import { Route, Switch } from 'react-router'
import { BrowserRouter } from 'react-router-dom'
import { AuthRoute } from './components/AuthRoute'

import 'react-toastify/dist/ReactToastify.css'
import Header from './components/Header'
import Footer from './components/Footer'
import Welcome from './pages/Welcome'
import Marketplace from './pages/Marketplace'
import Charities from './pages/Charities'
import Activity from './pages/Activity'
import CallbackWatcher from './components/CallbackWatcher'
import Greeting from './pages/Greeting'
import ItemPage from './pages/Item'
import Mint from './pages/Mint'

const App: React.FC = () => {
  return (
    <div className="flex flex-col h-screen">
      <ToastContainer position="bottom-right" autoClose={5000} />
      <BrowserRouter basename={process.env.PUBLIC_URL}>
        <CallbackWatcher />
        <Header />
        <main className="flex-grow">
          <Switch>
            <Route path="/marketplace">
              <Marketplace />
            </Route>
            <Route path="/activity">
              <Activity />
            </Route>
            <Route path="/mint">
              <AuthRoute>
                <Mint />
              </AuthRoute>
            </Route>
            <Route path="/charities">
              <Charities />
            </Route>
            <Route path="/welcome">
              <Welcome />
            </Route>
            <Route path="/item/:itemId">
              <ItemPage />
            </Route>
            <Route path="/greeting">
              <Greeting />
            </Route>
            <Route exact path="/">
              <Welcome />
            </Route>
          </Switch>
        </main>
        <Footer />
      </BrowserRouter>
    </div>
  )
}

export default App
