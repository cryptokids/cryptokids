import * as nearAPI from 'near-api-js'
import { getWallet, getContract } from '../foundation/near-utils'
import { atom, selector } from 'recoil'
import { WalletConnection } from 'near-api-js'

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
    // TODO: How to do this call in type safe way?
    return await this.contract.get_greeting({ account_id: accountId })
  }

  async setGreeting({
    accountId,
    greeting,
  }: {
    accountId: string
    greeting: string
  }): Promise<boolean> {
    // TODO: How to do this call in type safe way?
    await this.contract.set_greeting({
      account_id: accountId,
      message: greeting,
    })
    return true
  }
}
