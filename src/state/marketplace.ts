import { selector, selectorFamily } from 'recoil'
import { fetchStoreDetails, ItemWithMetadata, StoreDetails } from './items'
import { mintbaseContract, nearState } from './near'

export const marketplaceSelector = selector<StoreDetails>({
  key: 'marketplaceSelector/fetch',
  get: async ({ get }) => {
    const { mintbase } = get(nearState)
    return await fetchStoreDetails(mintbase, mintbaseContract)
  },
  dangerouslyAllowMutability: true,
})

export const fetchItemMetadata = selectorFamily<
  ItemWithMetadata,
  { id: string; ownerId: string }
>({
  key: 'itemsMetadata/fetch',
  get:
    ({ id, ownerId }) =>
    async ({ get }) => {
      const { mintbase } = get(nearState)
      const { data: metadata } = await mintbase.api!.fetchThingMetadata(id)
      const itemMetadata = { id, ownerId, thing: metadata }
      return itemMetadata
    },
  dangerouslyAllowMutability: true,
})
