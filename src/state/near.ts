import * as nearAPI from 'near-api-js'
import { atom, selector } from 'recoil'
import { WalletConnection } from 'near-api-js'
import getConfig from '../config'

const { Near, keyStores, Account, WalletAccount } = nearAPI

export const {
  utils: {
    format: { formatNearAmount, parseNearAmount },
  },
} = nearAPI

export interface IWallet extends WalletConnection {}

export interface IAccount extends nearAPI.Account {}

export interface IContract {
  readonly contractId: string

  getGreeting({ accountId }: { accountId: string }): Promise<string>
  setGreeting({
    accountId,
    greeting,
  }: {
    accountId: string
    greeting: string
  }): Promise<boolean>
}

export interface INear {
  account: IAccount | null
  contract: IContract | null
  near: nearAPI.Near
  wallet: IWallet
}

const initNear = selector<INear>({
  key: 'nearState/init',
  get: async () => {
    const { near, wallet, contractAccount } = await getWallet()

    let account: IAccount | null = null
    if (wallet.isSignedIn()) {
      account = wallet.account() as IAccount
      // wrapWallet.balance = formatNearAmount(
      //   (await wrapWallet.account().getAccountBalance()).available,
      //   4
      // )
    }
    return {
      account,
      contractAccount,
      near,
      wallet: wallet,
      contract: account && new Contract(getContract(account)),
    }
  },
  dangerouslyAllowMutability: true,
})

export const nearState = atom<INear>({
  key: 'nearState',
  default: initNear,
  dangerouslyAllowMutability: true,
})

class Contract implements IContract {
  readonly contract: nearAPI.Contract

  constructor(contract: nearAPI.Contract) {
    this.contract = contract
  }

  get contractId(): string {
    return this.contract.contractId
  }

  async getGreeting({ accountId }: { accountId: string }): Promise<string> {
    // @ts-ignore: Near Contract generate methods at the runtime
    return await this.contract.get_greeting({ account_id: accountId })
  }

  async setGreeting({
    accountId,
    greeting,
  }: {
    accountId: string
    greeting: string
  }): Promise<boolean> {
    // @ts-ignore: Near Contract generate methods at the runtime
    await this.contract.set_greeting({
      account_id: accountId,
      message: greeting,
    })
    return true
  }
}

// Near connection

let contractMethods = {
  changeMethods: ['set_greeting'],
  viewMethods: ['get_greeting'],
}

export const {
  networkId,
  nodeUrl,
  walletUrl,
  contractName,
}: {
  networkId: string
  nodeUrl: string
  walletUrl?: string
  contractName: string
} = getConfig(process.env.NODE_ENV || 'development')

export const contractId = contractName
export const marketId = 'market.' + contractName

const near = new Near({
  networkId,
  nodeUrl,
  walletUrl,
  deps: {
    keyStore: new keyStores.BrowserLocalStorageKeyStore(),
  },
})

const getWallet = async () => {
  const wallet = new WalletAccount(near, null)

  // walletAccount instance gets access key for contractId

  const contractAccount = new Account(near.connection, contractName)
  return { near, wallet, contractAccount }
}

function getContract(account: nearAPI.Account, methods = contractMethods) {
  return new nearAPI.Contract(account, contractName, { ...methods })
}
