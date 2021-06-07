import React, { useEffect } from 'react'
import { useSetRecoilState } from 'recoil'
import { isLoggedInState, UserState, userState } from '../state/authentication'
import { contractName, INear } from '../state/near'

export const MintbaseContext = React.createContext<{
  network: any
  signIn: () => void
  signOut: () => void
}>({
  network: null,
  signIn: () => {},
  signOut: () => {},
})

export const MintbaseContextProvider: React.FC<{ network: INear }> = ({
  network,
  children,
}) => {
  const { mintbase, account } = network
  const setLoggedIn = useSetRecoilState(isLoggedInState)
  const setUserState = useSetRecoilState(userState)

  const signIn = async () => {
    // Start NEAR sigin process
    await mintbase.connect({
      requestSignIn: true,
      contractAddress: contractName,
    })
  }

  const signOut = () => {
    // Disconect from the network
    mintbase.disconnect()

    // Update login state
    setLoggedIn(UserState.Anonymous)
    setUserState(null)

    // Reload the screen
    window.location.reload()
  }

  useEffect(() => {
    if (account && Object.keys(account).length) {
      setUserState({ accountId: account.accountId })
      setLoggedIn(UserState.LogIn)
    }
  }, [account])

  return (
    <MintbaseContext.Provider
      value={{
        network,
        signIn,
        signOut,
      }}
    >
      {children}
    </MintbaseContext.Provider>
  )
}
