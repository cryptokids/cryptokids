import {
  charityIdFromItem,
  fetchItemMetadata,
  mediaUriFromItem,
  priceFromItem,
  StoreItem,
} from '../state/items'
import Card, { CardShimmer } from '../components/Card'
import { useRecoilValueLoadable } from 'recoil'
import React from 'react'

const LoadingCard: React.FC<{
  thing: string | StoreItem
}> = ({ thing }) => {
  const metadata = useRecoilValueLoadable(fetchItemMetadata({ thing }))

  if (metadata.state === 'hasValue' && metadata.contents) {
    return (
      <Card
        id={metadata.contents.thing.id}
        username={metadata.contents.thing.tokens[0].minter}
        title={metadata.contents.metadata.title}
        price={priceFromItem(metadata.contents) || ''}
        charityId={charityIdFromItem(metadata.contents)}
        url={mediaUriFromItem(metadata.contents)}
      />
    )
  }
  // TODO: Process error state
  return <CardShimmer />
}

export default LoadingCard
