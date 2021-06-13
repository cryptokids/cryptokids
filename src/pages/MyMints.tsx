import React, { useContext } from 'react'
import { useRecoilValueLoadable } from 'recoil'
import Card, { CardControlls } from '../components/Card'
import {
  charityIdFromItem,
  ThingWithMetadata,
  listAThing,
  mediaUriFromItem,
  priceFromItem,
  thingStatus,
  ThingStatus,
  burnTokensOfThing,
} from '../state/items'
import { myItemsState } from '../state/myItems'
import Loader from '../components/Loadaer'
import { MintbaseContext } from '../contexts/mintbase'

const ThingCard: React.FC<{
  item: ThingWithMetadata
  burn: (item: ThingWithMetadata) => void
  list: (item: ThingWithMetadata) => void
}> = ({ item, burn, list }) => {
  const status = thingStatus(item)

  return (
    <Card
      username={item.thing.tokens[0].minter}
      title={item.metadata.title}
      charityId={charityIdFromItem(item)}
      price={priceFromItem(item) || ''}
      url={mediaUriFromItem(item)}
    >
      <CardControlls>
        {status !== ThingStatus.sold && (
          <button
            onClick={() => {
              burn(item)
            }}
            className="uppercase px-8 py-2 border border-blue-600 text-blue-600 max-w-max shadow-sm hover:shadow-lg"
          >
            Burn
          </button>
        )}
        {status === ThingStatus.minted && (
          <button
            onClick={() => {
              list(item)
            }}
            className="uppercase px-8 py-2 border border-blue-600 text-blue-600 max-w-max shadow-sm hover:shadow-lg"
          >
            List
          </button>
        )}
        {status === ThingStatus.listed && <p>Listed at the market</p>}
        {status === ThingStatus.sold && <p>Sold</p>}
      </CardControlls>
    </Card>
  )
}

const MyMints: React.FC = () => {
  const {
    network: { mintbase },
  } = useContext(MintbaseContext)
  const things = useRecoilValueLoadable(myItemsState)

  const burn = async (item: ThingWithMetadata) => {
    await burnTokensOfThing(mintbase, item)
  }

  const list = async (item: ThingWithMetadata) => {
    await listAThing(mintbase, item)
  }

  return (
    <>
      {things.state === 'loading' && <Loader />}
      {things.state === 'hasValue' && things.contents && (
        <div className="grid place-items-center sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-5">
          {things.contents.map((thing, idx) => {
            return (
              <ThingCard
                key={`thing_${idx}`}
                item={thing}
                burn={burn}
                list={list}
              />
            )
          })}
        </div>
      )}
    </>
  )
}

export default MyMints
