import { MintMetadata, MetadataField } from 'mintbase'
import { parseNearAmount } from 'near-api-js/lib/utils/format'
import { formatNearAmount } from 'near-api-js/lib/utils/format'
import { selectorFamily } from 'recoil'
import urlcat from 'urlcat'
import { contractId, IWallet, mintbaseContract, network } from './near'

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
  unlisted = 'UNLISTED',
  listed = 'LISTED',
  sold = 'SOLD',
}

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

export const burnTokensOfThing = async (mintbase: IWallet, item: Item) => {
  // Burn all tokens from this item
  mintbase.burn(
    item.thing.tokens
      // Found all not solded tokens
      .filter((t) => t.list === null || t.list.acceptedOfferId === null)
      .map((t) => t.id)
  )
}

export const listAThing = async (
  mintbase: IWallet,
  item: Item,
  price: number
): Promise<boolean> => {
  // We get a first token here, but should list all of them
  let tokenId = item.thing.tokens[0].id
  tokenId = tokenId.split(':')[0]
  // Transfer price in nero in string
  const priceYocto = parseNearAmount(String(price))
  if (priceYocto == null)
    throw new Error("Price parsing error. Couldn't parse " + price)
  const { data, error } = await mintbase.list(
    tokenId,
    mintbaseContract,
    priceYocto,
    {
      autotransfer: true,
    }
  )
  if (data == null) throw error
  return data
}

export const makeAnOffer = async (
  wallet: IWallet,
  metadata: Item,
  offer: number
): Promise<boolean> => {
  const priceYocto = parseNearAmount(String(offer))
  if (priceYocto == null)
    throw new Error("Price parsing error. Couldn't parse " + offer)
  const { data, error } = await wallet.makeOffer(
    metadata.thing.tokens[0].id,
    priceYocto
  )
  if (data == null) throw error
  return data
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
        ownerId: storeThing.tokens[0].ownerId,
      }
    },
})

// Helper functions

export const getItemStatus = (thing: Item): ItemStatus => {
  const listedTokens = thing.thing.tokens.find((t) => t.list !== null)
  if (listedTokens !== undefined) {
    if (listedTokens?.list?.acceptedOfferId !== null) {
      return ItemStatus.sold
    }
    return ItemStatus.listed
  }
  return ItemStatus.unlisted
}

export const charityIdFromItem = (item: Item): string | null => {
  const extras =
    item.metadata.extra != null && Array.isArray(item.metadata.extra)
      ? item.metadata.extra
      : []
  const charityAttr = extras.find(
    (c) => c.trait_type === 'charityId' || c.trait_type === 'charity'
  )
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

export type IItemSplits = {
  creator: number
  charity: number
  cryptoKids: number
}

export const splitRevenueFromItem = (item: Item): IItemSplits | null => {
  /// Inside split field we store 2 contracts ids: CryptoKidsId and charity contractId
  /// The diference between 100% and sum of this splits is a creator profit

  // @ts-ignore
  let splits = { ...item.metadata[MetadataField.SplitRevenue] }
  if (!splits || Object.keys(splits).length != 2) {
    // Splits should be not empty and containts 2 fields
    return null
  }
  let cryptoKids = 0
  if (contractId in splits) {
    cryptoKids = splits[contractId]
    delete splits[contractId]
  }
  if (Object.keys(splits).length != 1) {
    // We should have only charity contract address
    return null
  }
  const charity = splits[Object.keys(splits)[0]]
  // Now we need to calculate left
  return { creator: 100 - charity - cryptoKids, charity, cryptoKids }
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
