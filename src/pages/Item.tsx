import React from 'react'
import Card from '../components/Card'
import { useRecoilValueLoadable } from 'recoil'
import { useParams } from 'react-router-dom'
import { fetchItemMetadata } from '../state/marketplace'
import { charityIdFromItem, mediaUriFromItem } from '../state/items'

const Item: React.FC = () => {
  let { itemId } = useParams<{ itemId: string }>()

  const metadata = useRecoilValueLoadable(fetchItemMetadata({ id: itemId }))

  // TODO: Handle error state
  return (
    <div>
      {metadata.state === 'hasValue' && metadata.contents && (
        <Card
          id={itemId}
          username={metadata.contents.ownerId}
          title={metadata.contents.thing.title}
          price={{ fraction: 1, token: 'NEAR' }}
          charityId={charityIdFromItem(metadata.contents)}
          url={mediaUriFromItem(metadata.contents)}
        />
      )}
    </div>
  )
}

export default Item
