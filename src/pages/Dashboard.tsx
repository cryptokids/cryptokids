import React from 'react'
import { Switch, Route, useRouteMatch } from 'react-router'
import { NavLink } from 'react-router-dom'
import Greeting from './Greeting'
import Mint from './Mint'
import MyMints from './MyMints'

const MenuItem: React.FC<{ text: string; to: string }> = ({ text, to }) => {
  return (
    <NavLink
      to={to}
      exact
      className="w-full flex justify-between items-center py-3 px-6 text-gray-600 cursor-pointer hover:bg-gray-100 hover:text-gray-700 focus:outline-none"
      activeClassName="bg-gray-100 text-gray-700"
    >
      <span className="flex items-center">
        <span className="mx-4 font-medium">{text}</span>
      </span>
    </NavLink>
  )
}

const Dashboard: React.FC = () => {
  let { path, url } = useRouteMatch()

  return (
    <div className="flex flex-col sm:flex-row sm:start">
      <div className="w-64 h-full bg-white">
        <nav className="mt-10">
          <div>
            <MenuItem to={`${url}`} text="My things" />
            <MenuItem to={`${url}/mint`} text="Mint" />
            <MenuItem to={`${url}/greeting`} text="Greeting Contract" />
          </div>
        </nav>
      </div>
      <div className="p-4 w-full">
        <Switch>
          <Route exact path={`${path}/`}>
            <MyMints />
          </Route>
          <Route path={`${path}/mint`}>
            <Mint />
          </Route>
          <Route path={`${path}/greeting`}>
            <Greeting />
          </Route>
        </Switch>
      </div>
    </div>
  )
}

export default Dashboard
