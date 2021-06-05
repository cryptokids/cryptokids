import { MintMetadata } from 'mintbase'
import { IWallet, mintbaseContract } from './near'

interface ItemDetails {
  id: string
  ownerId: string
  thing: {
    id: string
  }
}

export interface ItemWithMetadata {
  id: string
  ownerId: string
  thing: MintMetadata
}

// Helper functions

export const charityIdFromItem = (item: ItemWithMetadata): string | null => {
  const extras =
    item.thing.extra != null && Array.isArray(item.thing.extra)
      ? item.thing.extra
      : []
  const charityAttr = extras.find((c) => c.trait_type === 'charityId')
  return charityAttr && typeof charityAttr.value === 'string'
    ? charityAttr.value
    : null
}

export const mediaUriFromItem = (item: ItemWithMetadata): string | null => {
  return typeof item.thing.media === 'string'
    ? item.thing.media
    : item.thing.media.data.uri
}

// API interaction

export const fetchMyItemsMetadata = async (
  mintbase: IWallet
): Promise<ItemWithMetadata[]> => {
  if (!mintbase.api) throw new Error('API is not defined.')

  const items = await fetchMyItems(mintbase)
  return Promise.all(
    items.map(async (item) => {
      const { data }: { data: MintMetadata } =
        await mintbase.api!.fetchThingMetadata(item.thing.id)
      return { ...item, thing: { ...data, id: item.thing.id } }
    })
  )
}

export const fetchMyItems = async (
  mintbase: IWallet
): Promise<ItemDetails[]> => {
  if (!mintbase.activeAccount) throw new Error('Account is undefined.')

  return fetchUserItemsInStore(
    mintbase,
    mintbase.activeAccount.accountId,
    mintbaseContract
  )
}

const fetchUserItemsInStore = async (
  mintbase: IWallet,
  accountId: string,
  storeId: string
): Promise<ItemDetails[]> => {
  if (!mintbase.api) throw new Error('API is not defined.')

  const query = `
  query GetUserItems($storeId: String!, $accountId: String!) {
    token(where: {
      store: {id: {_eq: $storeId}}, 
      minter: {_eq: $accountId}, 
      burnedAt: {_is_null: true}}) {
      id
      ownerId
      thing {
        id 
      }
    }
  }
  `
  const { data, error } = await mintbase.api.custom<{ token: ItemDetails[] }>(
    query,
    {
      accountId,
      storeId,
    }
  )
  if (error) throw error
  return data['token']
}
