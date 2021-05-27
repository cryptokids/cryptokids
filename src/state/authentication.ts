import { atom } from 'recoil'

export type IAccountData = {
  accountId: string
}

export const userState = atom<IAccountData | null>({
  key: 'userDataState',
  default: null,
})

export enum UserState {
  Undefined = 0,
  LogIn = 1,
  Anonymous = 2,
}

export const isLoggedInState = atom<UserState>({
  key: 'isLoggedIn',
  default: UserState.Undefined,
})
