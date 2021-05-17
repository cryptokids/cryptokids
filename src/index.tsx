import React from 'react'
import ReactDOM from 'react-dom'
import { AppProvider } from './state/app'
import App from './App'

ReactDOM.render(
  <AppProvider>
    <App />
  </AppProvider>,
  document.querySelector('#root')
)
