import { atom } from 'recoil'

export type IAccountData = {
  accountId: string
}

export const userState = atom<IAccountData | null>({
  key: 'userDataState',
  default: null,
})

export const isLoggedInState = atom<boolean>({
  key: 'isLoggedIn',
  default: false,
})
