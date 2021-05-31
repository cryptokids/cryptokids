import { atom } from 'recoil'

export type ICharitiesData = {
    name: string, 
    logoUrl: string, 
    description: string
  }

export const charitiesState = atom<ICharitiesData | null>({
  key: 'charities',
  default: null,
})