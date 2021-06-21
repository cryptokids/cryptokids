import { fetchItemMetadata, StoreItem } from '../state/items'
import Card, { CardShimmer } from '../components/Card'
import { useRecoilValueLoadable } from 'recoil'
import React from 'react'

const LoadingCard: React.FC<{
  thing: string | StoreItem
}> = ({ thing }) => {
  const metadata = useRecoilValueLoadable(fetchItemMetadata({ thing }))

  if (metadata.state === 'hasValue' && metadata.contents) {
    return <Card item={metadata.contents} />
  }
  // TODO: Process error state
  return <CardShimmer />
}

export default LoadingCard
