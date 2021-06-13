import * as mintabseAapi from 'mintbase'
import { MintMetadata } from 'mintbase'
import { formatNearAmount } from 'near-api-js/lib/utils/format'
import { selectorFamily, SerializableParam } from 'recoil'
import urlcat from 'urlcat'
import { IWallet, mintbaseContract, network } from './near'

export interface ThingWithMetadata {
  thing: StoreThing
  metadata: MintMetadata
}

// mintabseAapi.Token
export type Token = {
  id: string
  thingsId: string
  minter: string
  ownerId: string
  store: {
    baseUri: string
  }
  list: {
    price: number
    acceptedOfferId: string
  } | null
}

export type StoreThing = {
  id: string
  metaId: string
  store: {
    baseUri: string
  }
  tokens: Token[]
}

const defaultPrice = '1000000000000000000000000'

// Buy

// Check if user can buy a token from an item
export const isUserCanBuyAnItem = async (
  mintbase: IWallet,
  thing: ThingWithMetadata
): Promise<boolean> => {
  const { data: isOwner } = await mintbase.api!.isTokenOwner(
    mintbase.activeAccount!.accountId,
    thing.thing.tokens[0].id
  )
  return !isOwner
}

export const listAThing = async (
  mintbase: IWallet,
  thing: ThingWithMetadata
) => {
  let tokenId = thing.thing.tokens[0].id
  tokenId = tokenId.split(':')[0]
  await mintbase.list(tokenId, mintbaseContract, defaultPrice, {
    autotransfer: true,
  })
}

export const makeAnOffer = async (
  mintbase: IWallet,
  thing: ThingWithMetadata
) => {
  // TODO: Do not hardcode a price and find a first not bought token in the list
  const { data } = await mintbase.makeOffer(
    thing.thing.tokens[0].id,
    defaultPrice
  )
  console.log(data)
}

// Fetchs

export const fetchItemMetadata = selectorFamily<
  ThingWithMetadata,
  { thing: string | StoreThing }
>({
  key: 'itemsMetadata/fetch',
  get:
    ({ thing }) =>
    async () => {
      // If we already have a Thing, do not load details, only metadata
      let storeThing: StoreThing
      if (typeof thing === 'string') {
        storeThing = await fetchThingById(network.mintbase, thing)
      } else {
        storeThing = thing
      }

      const metadataUri = urlcat(storeThing.store.baseUri, storeThing.metaId)
      const { data: metadata, error } =
        await network.mintbase.api!.fetchMetadata(metadataUri)
      if (metadata == null) throw error

      return {
        thing: storeThing,
        metadata,
      }
    },
})

// Helper functions

export const charityIdFromItem = (item: ThingWithMetadata): string | null => {
  const extras =
    item.metadata.extra != null && Array.isArray(item.metadata.extra)
      ? item.metadata.extra
      : []
  const charityAttr = extras.find((c) => c.trait_type === 'charityId')
  return charityAttr && typeof charityAttr.value === 'string'
    ? charityAttr.value
    : null
}

export const mediaUriFromItem = (item: ThingWithMetadata): string | null => {
  return typeof item.metadata.media === 'string'
    ? item.metadata.media
    : //@ts-ignore
      item.metadata.media.data.uri
}

export const priceFromItem = (item: ThingWithMetadata): string | null => {
  // Get price from an any token
  const token = item.thing.tokens[0]
  // Check is thing listed
  const price =
    token.list !== null
      ? // Get price from list item
        token.list.price.toLocaleString('fullwide', {
          useGrouping: false,
        })
      : null
  if (price === null) {
    return null
  }
  return formatNearAmount(`${price}`)
}

// API interaction

export const thingFragment = `
fragment ThingDetails on things {
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
    list {
      price
      acceptedOfferId
    }
  }
}
`

const fetchThingById = async (
  mintbase: IWallet,
  thingId: string
): Promise<StoreThing> => {
  if (!mintbase.api) throw new Error('API is not defined.')

  const query = `
${thingFragment}

query GetThingById($thingId: String!) {
  thing(where: {tokens: {burnedAt: {_is_null: true}}, id: {_eq: $thingId}}) {
    ...ThingDetails
  }
}
`

  const { data, error } = await mintbase.api.custom<{
    thing: StoreThing[]
  }>(query, {
    thingId,
  })
  if (error) throw error
  return data['thing'][0]
}
