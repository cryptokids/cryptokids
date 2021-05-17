import { State } from '../foundation/state'

import { initNear } from './near'

const initialState = {
  app: {
    mounted: false,
  },
  near: {
    initialized: false,
  },
}
let snackTimeout: NodeJS.Timeout | null

export const { appStore, AppProvider } = State(initialState, 'app')

export const onAppMount =
  () =>
  async ({ update, getState, dispatch }) => {
    update('app', { mounted: true })
    dispatch(initNear())
  }

export const snackAttack =
  (msg: string) =>
  async ({ update, getState, dispatch }) => {
    console.log('Snacking on:', msg)
    update('app.snack', msg)
    if (snackTimeout) clearTimeout(snackTimeout)
    snackTimeout = setTimeout(() => update('app.snack', null), 3000)
  }
