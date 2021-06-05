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
  { id: string; ownerId?: string }
>({
  key: 'itemsMetadata/fetch',
  get:
    ({ id, ownerId }) =>
    async ({ get }) => {
      const { mintbase } = get(nearState)

      const { data: metadata } = await mintbase.api!.fetchThingMetadata(id)

      let owner = ownerId
      if (owner == null) {
        const { data } = await mintbase.api!.fetchThingById(id)
        owner = data.thing[0].tokens[0].ownerId
      }
      const itemMetadata = { id, ownerId: owner!, thing: metadata }
      return itemMetadata
    },
  dangerouslyAllowMutability: true,
})
