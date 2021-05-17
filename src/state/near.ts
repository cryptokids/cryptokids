import * as nearAPI from 'near-api-js'
import { WalletConnection, Account } from 'near-api-js'
import { getWallet, contractName, getContract } from '../foundation/near-utils'

export interface Wallet extends WalletConnection {
  signIn: () => void
}

export { Account }

export const {
  utils: {
    format: { formatNearAmount, parseNearAmount },
  },
} = nearAPI

export const getGreating =
  (account: Account, accountId: string) =>
  async ({ update }: { update: (key: string, value: any) => void }) => {
    const contract = getContract(account)
    const greeting = await contract.get_greeting({ account_id: accountId })
    update('app.greeting', greeting)
  }

export const initNear =
  () =>
  async ({ update }: { update: (key: string, value: any) => void }) => {
    const { near, wallet, contractAccount } = await getWallet()
    let wrapWallet = wallet as Wallet

    wrapWallet.signIn = () => {
      wrapWallet.requestSignIn(contractName, 'Blah Blah')
    }
    const signOut = wrapWallet.signOut
    wrapWallet.signOut = () => {
      signOut.call(wallet)
      update('wallet.signedIn', false)
      update('', { account: null })
      update('app.tab', 1)
    }

    let account
    if (wrapWallet.isSignedIn()) {
      account = wrapWallet.account()
      // wrapWallet.balance = formatNearAmount(
      //   (await wrapWallet.account().getAccountBalance()).available,
      //   4
      // )
      await update('', { near, wallet: wrapWallet, contractAccount, account })
    }

    await update('', { near, wallet: wrapWallet, contractAccount, account })
  }
