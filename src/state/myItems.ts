import { atom, selector } from 'recoil'
import urlcat from 'urlcat'
import { StoreItem, thingFragment, Item } from './items'
import { IWallet, mintbaseContract, network } from './near'

const myItemsSelector = selector<Item[]>({
  key: 'myItemsSelector/fetch',
  get: async () => {
    return await fetchMyItemsMetadata(network.mintbase)
  },
})

export const myItemsState = atom<Item[]>({
  key: 'myItems/state',
  default: myItemsSelector,
})

const fetchMyItemsMetadata = async (mintbase: IWallet): Promise<Item[]> => {
  if (!mintbase.api) throw new Error('API is not defined.')

  const items = await fetchMyItems(mintbase)
  return Promise.all(
    items.map(async (item) => {
      const metadataUri = urlcat(item.store.baseUri, item.metaId)
      const { data: metadata, error } =
        await network.mintbase.api!.fetchMetadata(metadataUri)
      if (metadata == null) throw error

      return {
        thing: item,
        metadata,
      }
    })
  )
}

const fetchMyItems = async (mintbase: IWallet): Promise<StoreItem[]> => {
  if (!mintbase.activeAccount) throw new Error('Account is undefined.')
  if (!mintbase.api) throw new Error('API is not defined.')

  const query = `
${thingFragment}

query GetUserItems($storeId: String!, $accountId: String!) {
  thing(where: {tokens: {burnedAt: {_is_null: true}, 
    storeId: {_eq: $storeId}
    minter: {_eq: $accountId}}}) {
    ...ThingDetails
  }
}
  `
  const { data, error } = await mintbase.api.custom<{ thing: StoreItem[] }>(
    query,
    {
      accountId: mintbase.activeAccount.accountId,
      storeId: mintbaseContract,
    }
  )
  if (error) throw error
  return data.thing
}
