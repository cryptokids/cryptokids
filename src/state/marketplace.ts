import { selector } from 'recoil'
import { StoreThings } from './items'
import { IWallet, mintbaseContract, nearState } from './near'

export const marketplaceSelector = selector<StoreThings[]>({
  key: 'marketplaceSelector/fetch',
  get: async ({ get }) => {
    const { mintbase } = get(nearState)
    return await fetchMarketplaceThings(mintbase, mintbaseContract)
  },
  dangerouslyAllowMutability: true,
})

export const fetchMarketplaceThings = async (
  mintbase: IWallet,
  storeId: string
): Promise<StoreThings[]> => {
  if (!mintbase.api) throw new Error('API is not defined.')

  const query = `
  query GetMarketplaceThings($storeId: String!) {
    thing(where: {storeId: {_eq: $storeId}, tokens: {burnedAt: {_is_null: true}}}) {
      id
      metaId
      tokens {
        id
        thingId
        storeId
        ownerId
        minter
      }
    }
  }
  `

  const { data, error } = await mintbase.api.custom<{ thing: StoreThings[] }>(
    query,
    {
      storeId,
    }
  )
  if (error) throw error
  return data.thing
}
