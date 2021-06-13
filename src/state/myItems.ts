import { atom, selector } from 'recoil'
import urlcat from 'urlcat'
import { StoreThing, thingFragment, ThingWithMetadata } from './items'
import { IWallet, mintbaseContract, network } from './near'

const myItemsSelector = selector<ThingWithMetadata[]>({
  key: 'myItemsSelector/fetch',
  get: async () => {
    return await fetchMyItemsMetadata(network.mintbase)
  },
})

export const myItemsState = atom<ThingWithMetadata[]>({
  key: 'myItems/state',
  default: myItemsSelector,
})

const fetchMyItemsMetadata = async (
  mintbase: IWallet
): Promise<ThingWithMetadata[]> => {
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

const fetchMyItems = async (mintbase: IWallet): Promise<StoreThing[]> => {
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
  const { data, error } = await mintbase.api.custom<{ thing: StoreThing[] }>(
    query,
    {
      accountId: mintbase.activeAccount.accountId,
      storeId: mintbaseContract,
    }
  )
  if (error) throw error
  return data.thing
}
