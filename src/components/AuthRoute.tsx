import React from 'react'
import { Redirect } from 'react-router'
import { useRecoilValue } from 'recoil'
import { isLoggedInState, UserState } from '../state/authentication'

type AuthRouteProps = {
  authFallback?: string // Route for auth redirect
}

export const AuthRoute: React.FC<AuthRouteProps> = ({
  children,
  authFallback = '/',
}) => {
  const state = useRecoilValue(isLoggedInState)

  switch (state) {
    case UserState.Undefined:
      return null
    case UserState.Anonymous:
      return <Redirect to={authFallback} />
    case UserState.LogIn:
      return <>{children}</>
  }
}
