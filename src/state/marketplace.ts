import { atom, selector } from 'recoil'
import { StoreItem, thingFragment } from './items'
import { IWallet, mintbaseContract, network } from './near'

const marketplaceSelector = selector<StoreItem[]>({
  key: 'marketplaceSelector/fetch',
  get: async () => {
    return await fetchMarketplaceThings(network.mintbase, mintbaseContract)
  },
})

export const marketplaceState = atom<StoreItem[]>({
  key: 'marketplace/all',
  default: marketplaceSelector,
})

const fetchMarketplaceThings = async (
  mintbase: IWallet,
  storeId: string
): Promise<StoreItem[]> => {
  if (!mintbase.api) throw new Error('API is not defined.')

  // Get all things in the store that listed
  const query = `
${thingFragment}

query GetMarketplaceThings($storeId: String!) {
  thing(where: {storeId: {_eq: $storeId}, 
                tokens: {burnedAt: {_is_null: true}, 
                          list: {id: {_is_null: false}}}}) {
    ...ThingDetails
  }
}
`

  const { data, error } = await mintbase.api.custom<{ thing: StoreItem[] }>(
    query,
    {
      storeId,
    }
  )
  if (error) throw error
  return data.thing
}
