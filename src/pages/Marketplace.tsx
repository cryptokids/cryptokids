import React from 'react'
import { useRecoilValueLoadable } from 'recoil'

import { marketplaceSelector } from '../state/marketplace'
import {
  charityIdFromItem,
  fetchItemMetadata,
  mediaUriFromItem,
} from '../state/items'
import Card, { CardShimmer } from '../components/Card'
import Loader from '../components/Loadaer'

const LoadingCard: React.FC<{
  id: string
}> = ({ id }) => {
  const metadata = useRecoilValueLoadable(fetchItemMetadata({ id }))

  if (metadata.state === 'hasValue' && metadata.contents) {
    return (
      <Card
        id={id}
        username={metadata.contents.minter}
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
        marketplace.contents.map((item) => {
          return <LoadingCard key={item.id} id={item.id} />
        })}
    </div>
  )
}

export default Marketplace
