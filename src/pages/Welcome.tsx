import React, { useContext } from 'react'
import { Redirect } from 'react-router'
import { useRecoilValue } from 'recoil'
import { MintbaseContext } from '../contexts/mintbase'
import { isLoggedInState, UserState } from '../state/authentication'

type Props = {}

const Welcome: React.FC<Props> = () => {
  const { signIn } = useContext(MintbaseContext)
  const loggedInState = useRecoilValue(isLoggedInState)

  if (loggedInState != UserState.Anonymous) {
    return <Redirect to="/marketplace" />
  }
  return (
    <>
      <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
        <div className="sm:text-center lg:text-left">
          <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            <span className="block xl:inline">Welcome to</span>{' '}
            <span className="block text-indigo-600 xl:inline">CryptoKids</span>
          </h1>
          <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
            CryptoKids is a non-profit project built on NEAR Protocol
            blockchain.
            <br />
            You need to sign in to start using the app.The button below will
            sign you in using NEAR Wallet.
          </p>
          <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
            <div className="rounded-md shadow">
              <a
                onClick={signIn}
                href="#"
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"
              >
                Sign in
              </a>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

export default Welcome
