import * as nearAPI from 'near-api-js'
import * as mintbase from 'mintbase'
import { atom, selector } from 'recoil'
import { contractMethods, Contract, IGreetingContract } from './greeting'
import getConfig from '../config'

export interface IWallet extends mintbase.Wallet {}

export interface IAccount extends nearAPI.Account {}

const API_KEY = process.env.MINTBASE_API_KEY || ''
const MINTBASE_CONTRACT =
  process.env.MINTBASE_CONTRACT || 'teststore.mintspace2.testnet'

const {
  networkId,
  // nodeUrl,
  // walletUrl,
  contractName,
}: {
  networkId: string
  // nodeUrl: string
  // walletUrl?: string
  contractName: string
} = getConfig(process.env.NODE_ENV || 'development')

export interface INear {
  account: IAccount | null
  contract: IGreetingContract | null
  mintbase: IWallet
}

const initNear = selector<INear>({
  key: 'nearState/init',
  get: async () => {
    // Load Mintbase
    const mintabseWallet = await initMintbase()

    if (!mintabseWallet.activeNearConnection || !mintabseWallet.activeWallet) {
      console.error("Can't make a Near connection")
      return null!
    }

    const contractAccount = await mintabseWallet.activeNearConnection.account(
      contractName
    )

    let account: IAccount | null = null
    if (
      mintabseWallet.activeWallet.isSignedIn() &&
      mintabseWallet.activeAccount
    ) {
      account = mintabseWallet.activeAccount as unknown as IAccount
      // wrapWallet.balance = formatNearAmount(
      //   (await wrapWallet.account().getAccountBalance()).available,
      //   4
      // )
    }

    return {
      account,
      contractAccount,
      mintbase: mintabseWallet,
      contract:
        account &&
        new Contract(getContract(account, contractName, contractMethods)),
    }
  },
  dangerouslyAllowMutability: true,
})

export const nearState = atom<INear>({
  key: 'nearState',
  default: initNear,
  dangerouslyAllowMutability: true,
})

const contractId = contractName + '.' + networkId
const mintbaseContract = MINTBASE_CONTRACT
export { contractName, contractId, networkId, mintbaseContract }

const initMintbase = async () => {
  const { data: walletData, error } = await new mintbase.Wallet().init({
    networkName: mintabseNetwork(networkId),
    chain: mintbase.Chain.near,
    apiKey: API_KEY,
  })

  if (error) {
    console.error(error)
  }

  const { wallet } = walletData

  return wallet
}

// Map config network into Mintbase constant
const mintabseNetwork = (networkId: string): mintbase.Network => {
  switch (networkId) {
    case 'mainnet':
      return mintbase.Network.mainnet
    default:
      return mintbase.Network.testnet
  }
}

// Mint

export const mintThing = async ({
  mintbase: wallet,
  title,
  thing,
}: {
  mintbase: IWallet
  title: string
  thing?: any[]
}) => {
  if (wallet.minter && title.length > 0 && thing && thing.length > 0) {
    const minter = wallet.minter
    minter.setField(mintbase.MetadataField.Title, title)
    await minter.uploadField(mintbase.MetadataField.Media, thing[0])

    const response = await wallet.mint(1, mintbaseContract)
    console.log(response)
  }
}

// Contracts

function getContract(
  account: nearAPI.Account,
  contractName: string,
  methods: any
) {
  return new nearAPI.Contract(account, contractName, {
    ...methods,
  })
}
