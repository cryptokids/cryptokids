import { selector } from 'recoil'
import { fetchMyItemsMetadata, ItemWithMetadata } from './items'
import { nearState } from './near'

export const myItemsSelector = selector<ItemWithMetadata[]>({
  key: 'myItemsSelector/fetch',
  get: async ({ get }) => {
    const { mintbase } = get(nearState)
    return await fetchMyItemsMetadata(mintbase)
  },
  dangerouslyAllowMutability: true,
})
