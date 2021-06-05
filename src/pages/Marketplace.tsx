import React from 'react'
import Card, { CardShimmer } from '../components/Card'

import { useRecoilValueLoadable } from 'recoil'
import Loader from '../components/Loadaer'
import { marketplaceSelector } from '../state/marketplace'
import { fetchItemMetadata } from '../state/marketplace'
import { charityIdFromItem, mediaUriFromItem, Token } from '../state/items'

const LoadingCard: React.FC<{
  id: string
  tokens: Token[]
}> = ({ id, tokens }) => {
  const metadata = useRecoilValueLoadable(
    fetchItemMetadata({ id, ownerId: tokens[0]!.ownerId })
  )

  if (metadata.state === 'hasValue' && metadata.contents) {
    return (
      <Card
        key={id}
        username={metadata.contents.ownerId}
        title={metadata.contents.thing.title}
        price={{ fraction: 1, token: 'NEAR' }}
        charityId={charityIdFromItem(metadata.contents)}
        url={mediaUriFromItem(metadata.contents)}
      />
    )
  }
  // TODO: Process error state
  return <CardShimmer />
}

const Marketplace: React.FC = () => {
  const marketplace = useRecoilValueLoadable(marketplaceSelector)

  if (marketplace.state === 'loading') {
    return <Loader />
  }

  return (
    <div className="grid place-items-center sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-5">
      {marketplace.state === 'hasValue' &&
        marketplace.contents &&
        marketplace.contents.things.map((item) => {
          return <LoadingCard key={item.id} id={item.id} tokens={item.tokens} />
        })}
    </div>
  )
}

export default Marketplace
