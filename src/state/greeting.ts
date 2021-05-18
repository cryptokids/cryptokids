import { atom } from 'recoil'

export const greetingState = atom<string>({
  key: 'contract/greeting',
  default: '',
})
