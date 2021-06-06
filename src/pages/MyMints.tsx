import React from 'react'
import { useRecoilValue, useRecoilValueLoadable } from 'recoil'
import { nearState } from '../state/near'
import Card, { CardControlls } from '../components/Card'
import {
  charityIdFromItem,
  ItemWithMetadata,
  mediaUriFromItem,
} from '../state/items'
import { myItemsSelector } from '../state/myItems'
import Loader from '../components/Loadaer'

const ThingCard: React.FC<{
  item: ItemWithMetadata
  burn: (item: ItemWithMetadata) => void
}> = ({ item, burn }) => {
  const charityId = charityIdFromItem(item)

  return (
    <Card
      username={item.minter}
      charityId={charityId ? charityId : '-'}
      title={item.thing.title}
      price={{ fraction: 1, token: 'NEAR' }}
      url={mediaUriFromItem(item)}
    >
      <CardControlls>
        <button
          onClick={() => {
            burn(item)
          }}
          className="uppercase px-8 py-2 border border-blue-600 text-blue-600 max-w-max shadow-sm hover:shadow-lg"
        >
          Burn
        </button>
      </CardControlls>
    </Card>
  )
}

const MyMints: React.FC = () => {
  const { mintbase } = useRecoilValue(nearState)
  const things = useRecoilValueLoadable(myItemsSelector)

  const burn = async (item: ItemWithMetadata) => {
    // Burn all tokens from this item
    await mintbase.burn(item.tokens.map((t) => t.id))
  }

  return (
    <>
      {things.state === 'loading' && <Loader />}
      {things.state === 'hasValue' && things.contents && (
        <div className="grid place-items-center sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-5">
          {things.contents.map((item, idx) => {
            return <ThingCard key={`thing_${idx}`} item={item} burn={burn} />
          })}
        </div>
      )}
    </>
  )
}

export default MyMints
