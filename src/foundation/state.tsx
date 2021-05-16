import React, { createContext, ReactNode, useReducer } from 'react'

type AppContext = {
  [key: string]: any
}

export type Context = {}

export const State = function <Type>(
  initialState: Partial<Type>,
  prefix: string | null
): { [key: string]: any } {
  let updatedState: AppContext
  const getState = () => updatedState
  const store = createContext(initialState)
  const { Provider: InnerProvider } = store

  const updateState = (state: AppContext, newState: AppContext, path = '') => {
    // console.log('updateState', state, path, newState) // debugging
    if (path.length === 0) {
      return { ...state, ...newState }
    }
    const pathArr = path.split('.')
    const first = pathArr[0]
    state = { ...state }
    if (!state[first]) {
      state[first] = {}
    }
    if (pathArr.length === 1) {
      state[first] =
        !!newState && typeof newState === 'object' && !Array.isArray(newState)
          ? {
              ...state[first],
              ...newState,
            }
          : newState
    } else {
      state[first] = {
        ...state[first],
        ...updateState(state[first], newState, pathArr.slice(1).join('.')),
      }
    }

    return state
  }

  const Provider = ({ children }: { children: ReactNode }) => {
    const [state, dispatch] = useReducer((state: AppContext, payload: any) => {
      const { path, newState } = payload
      if (path === undefined) {
        return state
      }
      updatedState = updateState(state, newState, path)
      return updatedState
    }, initialState)

    const update = (path: string, newState: AppContext) => {
      dispatch({ path, newState })
    }
    const wrappedDispatch = (
      fn: (arg0: {
        update: (path: string, newState: AppContext) => void
        getState: () => AppContext
        dispatch: (fn: any) => any
      }) => any
    ) => fn({ update, getState, dispatch: wrappedDispatch })

    return (
      <InnerProvider value={{ update, state, dispatch: wrappedDispatch }}>
        {children}
      </InnerProvider>
    )
  }

  if (prefix) {
    return {
      [prefix + 'Store']: store,
      [prefix.substr(0, 1).toUpperCase() + prefix.substr(1) + 'Provider']:
        Provider,
    }
  }

  return { store, Provider }
}
