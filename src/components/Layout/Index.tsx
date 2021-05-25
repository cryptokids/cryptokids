import React from 'react'
import { Redirect } from 'react-router'
import { useRecoilValue } from 'recoil'
import { isLoggedInState } from '../../state/authentication'
import { SignOutLink } from '../AuthProvider'

type Props = {
  auth: boolean // Should we check user auth
  authFallback?: string // Route for auth redirect
}

const Layout: React.FC<Props> = ({
  children,
  auth = false,
  authFallback = '/',
}) => {
  const isLoggedIn = useRecoilValue(isLoggedInState)

  if (auth && !isLoggedIn) {
    return <Redirect to={authFallback} />
  }

  return (
    <React.Fragment>
      <SignOutLink onSignOut={() => {}}>
        <button className="link" style={{ float: 'right' }}>
          Sign out
        </button>
      </SignOutLink>
      <main>{children}</main>
    </React.Fragment>
  )
}

export default Layout
