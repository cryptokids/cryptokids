import { selector } from 'recoil'
import { StoreThings } from './items'
import { IWallet, mintbaseContract, network } from './near'

export const marketplaceSelector = selector<StoreThings[]>({
  key: 'marketplaceSelector/fetch',
  get: async () => {
    return await fetchMarketplaceThings(network.mintbase, mintbaseContract)
  },
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
