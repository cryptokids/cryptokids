import React from 'react'
import * as nearAPI from 'near-api-js'
import { Contract, contractMethods, IGreetingContract } from '../state/greeting'
import { contractName, INear } from '../state/near'

export const GreetingContext =
  React.createContext<IGreetingContract | null>(null)

export const GreetingContextProvider: React.FC<{ network: INear }> = ({
  network,
  children,
}) => {
  const { account } = network

  const contract = account
    ? new Contract(getContract(account, contractName, contractMethods))
    : null

  return (
    <GreetingContext.Provider value={contract}>
      {children}
    </GreetingContext.Provider>
  )
}

function getContract(
  account: nearAPI.Account,
  contractName: string,
  methods: any
) {
  return new nearAPI.Contract(account, contractName, {
    ...methods,
  })
}
