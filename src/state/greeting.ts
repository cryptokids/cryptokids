import * as nearAPI from 'near-api-js'
import { atom } from 'recoil'

export const greetingState = atom<string>({
  key: 'contract/greeting',
  default: '',
})

export interface IGreetingContract {
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

export const contractMethods = {
  changeMethods: ['set_greeting'],
  viewMethods: ['get_greeting'],
}

export class Contract implements IGreetingContract {
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
    const res = await this.contract.set_greeting({
      account_id: accountId,
      message: greeting,
    })
    return true
  }
}
