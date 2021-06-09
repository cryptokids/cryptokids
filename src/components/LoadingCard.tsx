import {
  charityIdFromItem,
  fetchItemMetadata,
  mediaUriFromItem,
} from '../state/items'
import Card, { CardShimmer } from '../components/Card'
import { useRecoilValueLoadable } from 'recoil'
import React from 'react'

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

export default LoadingCard
