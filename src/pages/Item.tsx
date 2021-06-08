import React, { useContext, useEffect, useState } from 'react'
import Card from '../components/Card'
import { useRecoilValueLoadable } from 'recoil'
import { useParams } from 'react-router-dom'
import {
  fetchItemMetadata,
  charityIdFromItem,
  mediaUriFromItem,
  ItemWithMetadata,
  isUserCanBuyAnItem,
  makeAnOffer,
} from '../state/items'
import { IWallet } from '../state/near'
import { MintbaseContext } from '../contexts/mintbase'

const Item: React.FC = () => {
  let { itemId } = useParams<{ itemId: string }>()

  const metadata = useRecoilValueLoadable(fetchItemMetadata({ id: itemId }))
  const {
    network: { mintbase },
  } = useContext(MintbaseContext)
  const [canBuy, setCanBuy] = useState(false)

  useEffect(() => {
    async function checkStatus(mintbase: IWallet, metadata: ItemWithMetadata) {
      const canBuy = await isUserCanBuyAnItem(mintbase, metadata)
      setCanBuy(canBuy)
    }
    if (metadata.state === 'hasValue' && metadata.contents) {
      checkStatus(mintbase, metadata.contents)
    }
  }, [metadata])

  // TODO: Handle error state
  return (
    <div className="place-items-center gap-3 p-5">
      {metadata.state === 'hasValue' && metadata.contents && (
        <>
          <Card
            id={itemId}
            username={metadata.contents.minter}
            title={metadata.contents.thing.title}
            price={{ fraction: 1, token: 'NEAR' }}
            charityId={charityIdFromItem(metadata.contents)}
            url={mediaUriFromItem(metadata.contents)}
          />
          <div className="p-5">
            {canBuy && (
              <button
                onClick={async () => {
                  await makeAnOffer(mintbase, metadata.contents)
                }}
                className="uppercase px-8 py-2 border border-blue-600 text-blue-600 max-w-max shadow-sm hover:shadow-lg"
              >
                Buy
              </button>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default Item
