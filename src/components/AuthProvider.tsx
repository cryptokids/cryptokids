import React, { useEffect, useState } from 'react'
import { Redirect } from 'react-router'
import { useSetRecoilState } from 'recoil'
import { useRecoilValue } from 'recoil'
import { isLoggedInState, UserState, userState } from '../state/authentication'
import { nearState, contractName } from '../state/near'

type Props = {}

export const AuthProvider: React.FC<Props> = ({ children }) => {
  const { mintbase, account } = useRecoilValue(nearState)
  const setLoggedIn = useSetRecoilState(isLoggedInState)
  const setUserState = useSetRecoilState(userState)

  useEffect(() => {
    if (mintbase) {
      if (mintbase.isConnected() && account) {
        setUserState({ accountId: account.accountId })
        setLoggedIn(UserState.LogIn)
      } else {
        setUserState(null)
        setLoggedIn(UserState.Anonymous)
      }
    }
  })

  return <React.Fragment>{children}</React.Fragment>
}

type SignOutLinkProps = {
  onSignOut?: () => void
}

export const SignOutLink: React.FC<SignOutLinkProps> = ({
  children,
  onSignOut,
}) => {
  const { mintbase } = useRecoilValue(nearState)
  const setLoggedIn = useSetRecoilState(isLoggedInState)
  const setUserState = useSetRecoilState(userState)
  const logout = () => {
    mintbase.disconnect()
    // Update local state, as we don't have a callback on a wallet itself
    setLoggedIn(UserState.Anonymous)
    setUserState(null)
    onSignOut && onSignOut()
  }
  return (
    <>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            onClick: logout,
          })
        } else {
          return child
        }
      })}
    </>
  )
}

type SignInLinkProps = {
  onSignIn?: () => void
}

export const SignInLink: React.FC<SignInLinkProps> = ({
  children,
  onSignIn,
}) => {
  const { mintbase } = useRecoilValue(nearState)
  const login = async () => {
    // TODO: Store app name in the config
    // await wallet.requestSignIn(contractName, 'Crypto Kidz')
    await mintbase.connect({
      requestSignIn: true,
      contractAddress: contractName,
    })
    onSignIn && onSignIn()
  }
  return (
    <React.Fragment>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            onClick: login,
          })
        } else {
          return child
        }
      })}
    </React.Fragment>
  )
}

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
