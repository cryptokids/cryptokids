import { MintMetadata } from 'mintbase'
import { selector } from 'recoil'
import { ItemWithMetadata, Token } from './items'
import { IWallet, mintbaseContract, nearState } from './near'

export interface ThingDetails {
  id: string
  tokens: Token[]
}

export const myItemsSelector = selector<ItemWithMetadata[]>({
  key: 'myItemsSelector/fetch',
  get: async ({ get }) => {
    const { mintbase } = get(nearState)
    return await fetchMyItemsMetadata(mintbase)
  },
  dangerouslyAllowMutability: true,
})

const fetchMyItemsMetadata = async (
  mintbase: IWallet
): Promise<ItemWithMetadata[]> => {
  if (!mintbase.api) throw new Error('API is not defined.')

  const items = await fetchMyItems(mintbase)
  return Promise.all(
    items.map(async (item) => {
      const { data }: { data: MintMetadata } =
        await mintbase.api!.fetchThingMetadata(item.id)
      return {
        ...item,
        minter: item.tokens[0].minter,
        thing: { ...data, id: item.id },
      }
    })
  )
}

const fetchMyItems = async (mintbase: IWallet): Promise<ThingDetails[]> => {
  if (!mintbase.activeAccount) throw new Error('Account is undefined.')
  if (!mintbase.api) throw new Error('API is not defined.')

  const query = `
  query GetUserItems($storeId: String!, $accountId: String!) {
    thing(where: {tokens: {burnedAt: {_is_null: true}, 
      storeId: {_eq: $storeId}
      minter: {_eq: $accountId}}}) {
      id
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
  const { data, error } = await mintbase.api.custom<{ thing: ThingDetails[] }>(
    query,
    {
      accountId: mintbase.activeAccount.accountId,
      storeId: mintbaseContract,
    }
  )
  if (error) throw error
  return data['thing']
}
