import { MintMetadata } from 'mintbase'
import { formatNearAmount } from 'near-api-js/lib/utils/format'
import { selectorFamily } from 'recoil'
import urlcat from 'urlcat'
import { IWallet, mintbaseContract, network } from './near'

// Item from the API and loaded metadata
export interface Item {
  thing: StoreItem
  metadata: MintMetadata
}

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

// Item thst we get from the API
export type StoreItem = {
  id: string
  metaId: string
  store: {
    baseUri: string
  }
  tokens: Token[]
}

export enum ItemStatus {
  minted = 'MINTED',
  listed = 'LISTED',
  sold = 'SOLD',
}

const defaultPrice = '1000000000000000000000000'

// Buy

// Check if user can buy a token from an item
export const isUserCanBuyAnItem = async (
  mintbase: IWallet,
  thing: Item
): Promise<boolean> => {
  const { data: isOwner } = await mintbase.api!.isTokenOwner(
    mintbase.activeAccount!.accountId,
    thing.thing.tokens[0].id
  )
  const isSold = thing.thing.tokens[0].list?.acceptedOfferId != undefined
  return !isOwner && !isSold
}

export const burnTokensOfThing = async (mintbase: IWallet, thing: Item) => {
  // Burn all tokens from this item
  mintbase.burn(
    thing.thing.tokens
      // Found all not solded tokens
      .filter((t) => t.list === null || t.list.acceptedOfferId === null)
      .map((t) => t.id)
  )
}

export const listAThing = async (mintbase: IWallet, thing: Item) => {
  let tokenId = thing.thing.tokens[0].id
  tokenId = tokenId.split(':')[0]
  await mintbase.list(tokenId, mintbaseContract, defaultPrice, {
    autotransfer: true,
  })
}

export const makeAnOffer = async (mintbase: IWallet, thing: Item) => {
  // TODO: Do not hardcode a price and find a first not bought token in the list
  let tokenId = thing.thing.tokens[0].id
  console.log(tokenId)
  const { data } = await mintbase.makeOffer(tokenId, defaultPrice)
  console.log(data)
}

// Fetchs

export const fetchItemMetadata = selectorFamily<
  Item,
  { thing: string | StoreItem }
>({
  key: 'itemsMetadata/fetch',
  get:
    ({ thing }) =>
    async () => {
      // If we already have a Thing, do not load details, only metadata
      let storeThing: StoreItem
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

export const thingStatus = (thing: Item): ItemStatus => {
  const listedTokens = thing.thing.tokens.find((t) => t.list !== null)
  if (listedTokens !== undefined) {
    if (listedTokens?.list?.acceptedOfferId !== null) {
      return ItemStatus.sold
    }
    return ItemStatus.listed
  }
  return ItemStatus.minted
}

export const charityIdFromItem = (item: Item): string | null => {
  const extras =
    item.metadata.extra != null && Array.isArray(item.metadata.extra)
      ? item.metadata.extra
      : []
  const charityAttr = extras.find((c) => c.trait_type === 'charityId')
  return charityAttr && typeof charityAttr.value === 'string'
    ? charityAttr.value
    : null
}

export const mediaUriFromItem = (item: Item): string | null => {
  return typeof item.metadata.media === 'string'
    ? item.metadata.media
    : //@ts-ignore
      item.metadata.media.data.uri
}

export const priceFromItem = (item: Item): string | null => {
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
): Promise<StoreItem> => {
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
    thing: StoreItem[]
  }>(query, {
    thingId,
  })
  if (error) throw error
  return data['thing'][0]
}
