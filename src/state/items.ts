import * as mintabseAapi from 'mintbase'
import { MintMetadata } from 'mintbase'
import { selectorFamily } from 'recoil'
import urlcat from 'urlcat'
import { IWallet, nearState } from './near'

export interface ItemWithMetadata {
  id: string
  minter: string
  tokens: Token[]
  thing: MintMetadata
}

export interface Token extends mintabseAapi.Token {
  minter: string
}

export interface StoreThings {
  id: string
  tokens: Token[]
}

interface ExtendedStoreThings extends StoreThings {
  metaId: string
  store: {
    baseUri: string
  }
}

export const fetchItemMetadata = selectorFamily<
  ItemWithMetadata,
  { id: string }
>({
  key: 'itemsMetadata/fetch',
  get:
    ({ id }) =>
    async ({ get }) => {
      const { mintbase } = get(nearState)

      const storeThing = await fetchThingById(mintbase, id)

      const metadataUri = urlcat(storeThing.store.baseUri, storeThing.metaId)
      const { data: metadata, error } = await mintbase.api!.fetchMetadata(
        metadataUri
      )
      if (metadata == null) throw error

      return {
        id,
        tokens: storeThing.tokens,
        minter: storeThing.tokens[0].minter,
        thing: metadata,
      }
    },
  dangerouslyAllowMutability: true,
})

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
    : //@ts-ignore
      item.thing.media.data.uri
}

// API interaction

const fetchThingById = async (
  mintbase: IWallet,
  thingId: string
): Promise<ExtendedStoreThings> => {
  if (!mintbase.api) throw new Error('API is not defined.')

  const query = `
  query GetThingById($thingId: String!) {
    thing(where: {tokens: {burnedAt: {_is_null: true}}, id: {_eq: $thingId}}) {
      id
      metaId
      store {
        baseUri
      }
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

  const { data, error } = await mintbase.api.custom<{
    thing: ExtendedStoreThings[]
  }>(query, {
    thingId,
  })
  if (error) throw error
  return data['thing'][0]
}
