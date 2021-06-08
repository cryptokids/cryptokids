import React from 'react'
import './styles/tailwind.css'
import { ToastContainer } from 'react-toastify'
import { Route, Switch } from 'react-router'
import { BrowserRouter as Router } from 'react-router-dom'
import { AuthRoute } from './components/AuthRoute'

import 'react-toastify/dist/ReactToastify.css'
import Header from './components/Header'
import Footer from './components/Footer'
import Welcome from './pages/Welcome'
import Dashboard from './pages/Dashboard'
import Marketplace from './pages/Marketplace'
import Charities from './pages/Charities'
import Activity from './pages/Activity'
import CallbackWatcher from './components/CallbackWatcher'
import Greeting from './pages/Greeting'
import Item from './pages/Item'

const App: React.FC = () => {
  return (
    <div className="flex flex-col h-screen">
      <ToastContainer position="bottom-right" autoClose={5000} />
      <Router basename={process.env.PUBLIC_URL || '/'}>
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
            <Route path="/dashboard">
              <AuthRoute>
                <Dashboard />
              </AuthRoute>
            </Route>
            <Route path="/charities">
              <Charities />
            </Route>
            <Route path="/welcome">
              <Welcome />
            </Route>
            <Route path="/item/:itemId">
              <Item />
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
      </Router>
    </div>
  )
}

export default App
