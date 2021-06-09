import React, { useContext } from 'react'
import { useRecoilValue } from 'recoil'
import LoadingCard from '../components/LoadingCard'
import { MintbaseContext } from '../contexts/mintbase'
import { isLoggedInState, UserState } from '../state/authentication'

type Props = {}

const Welcome: React.FC<Props> = () => {
  const { signIn } = useContext(MintbaseContext)
  const loggedInState = useRecoilValue(isLoggedInState)
  const isLoggedIn = loggedInState != UserState.LogIn

  const itemId =
    'hTQcJ8TVOcv5N2lHYy-XHa7Pkj_eailRt3j-SPBAc-w:cryptokids.mintspace2.testnet'

  return (
    <>
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ">
        <div className="grid place-items-center sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4 p-5 sm:text-center lg:text-left">
          <div>
            <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
              <span className="block xl:inline">Welcome to</span>{' '}
              <span className="block text-yellow-500 xl:inline">
                CryptoKids
              </span>
            </h1>
            <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
              CryptoKids is a non-profit project built on NEAR Protocol
              blockchain.
              <br />
            </p>
            {isLoggedIn ? (
              <div>
                <p className="text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  You need to sign in to start using the app. The button below
                  will sign you in using NEAR Wallet.
                </p>
                <div className="mt-5 mb-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <a
                      onClick={signIn}
                      href="#"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 md:py-4 md:text-lg md:px-10"
                    >
                      Sign in
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-5 mb-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                <div className="rounded-md shadow my-3">
                  <a
                    href="/marketplace"
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 md:py-4 md:text-lg md:px-10"
                  >
                    Explore
                  </a>
                </div>
                <div className="mx-3"></div>
                <div className="rounded-md shadow my-3">
                  <a
                    href="/mint"
                    className="w-full flex items-center justify-center px-8 py-3 border border-yellow-700 text-base font-medium rounded-md text-yellow-700 bg-white hover:bg-yellow-50 md:py-4 md:text-lg md:px-10"
                  >
                    Create
                  </a>
                </div>
              </div>
            )}
          </div>
          <div className="inline-block pb-4 px-12">
            <LoadingCard key={itemId} id={itemId} />
          </div>
        </div>
        <div className="grid place-items-center mb-4">
          <p className="text-black font-medium sm:mt-5 text-2xl sm:text-2xl sm:max-w-xl sm:mx-auto md:mt-5 md:text-2xl lg:mx-0">
            Create and sell your NFTs
          </p>
        </div>
        <div className="grid grid-flow-row sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 p-5 sm:text-center lg:text-left">
          <div className="row-start-1 flex-1">
            <h1 className="text-xl sm:text-center font-medium">
              Set up your wallet
            </h1>
          </div>
          <div className="row-start-2 flex-1 place-items-center sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 sm:text-center lg:text-left">
            <p className="text-gray-500 sm:text-center sm:text-md sm:max-w-md sm:mx-auto md:mt-5 md:text-md lg:mx-0">
              You need to setup NEAR wallet and connect it to CryptoKids. Follow
              A &nbsp;
              <a
                className="text-yellow-600 dark:text-yellow-300 underline"
                href="https://medium.com/nearprotocol/a-starters-guide-to-the-near-wallet-and-staking-process-d2c8f3b61f43"
              >
                Starter&apos;s Guide
              </a>{' '}
              to the NEAR Wallet.
            </p>
          </div>
          <div className="row-start-1 flex-1">
            <h1 className="text-xl sm:text-center font-medium">
              Add your NFTs
            </h1>
          </div>
          <div className="row-start-2 flex-1">
            <p className="text-gray-500 sm:text-center sm:text-md sm:max-w-md sm:mx-auto md:mt-5 md:text-md lg:mx-0">
              Upload your work (image, video, audio, or 3D art), add a title and
              description.
            </p>
          </div>
          <div className="row-start-1 flex-1">
            <h1 className="text-xl sm:text-center font-medium">
              Pick a charity
            </h1>
          </div>
          <div className="row-start-2 flex-1">
            <p className="text-gray-500 sm:text-center sm:text-md sm:max-w-md sm:mx-auto md:mt-5 md:text-md lg:mx-0">
              Pick a charity from the dropdown list and all proceeds from the
              sale will automatically go there!
            </p>
          </div>
          <div className="row-start-1 flex-1">
            <h1 className="text-xl sm:text-center font-medium">
              List for sale
            </h1>
          </div>
          <div className="row-start-2 flex-1">
            <p className="text-gray-500 sm:text-center sm:text-md sm:max-w-md sm:mx-auto md:mt-5 md:text-md lg:mx-0">
              List your item on sale with fixed price. Buyers will choose how
              many they are willing to donate.
            </p>
          </div>
        </div>
        <div className="mb-8"></div>
      </main>
    </>
  )
}

export default Welcome
