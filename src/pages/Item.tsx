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
  const { itemId } = useParams<{ itemId: string }>()

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
    <div className="flex flex-row xs:flex-col sm:flex-col lg:flex-row px-4 ">
      {metadata.state === 'hasValue' && metadata.contents && (
        <div className="flex-1 sm:flex-0 m-16">
          <Card
            id={itemId}
            username={metadata.contents.minter}
            title={metadata.contents.thing.title}
            price={{ fraction: 1, token: 'NEAR' }}
            charityId={charityIdFromItem(metadata.contents)}
            url={mediaUriFromItem(metadata.contents)}
          />
        </div>
      )}
      <div className="flex-auto lg:mt-16 md:mt-16 xs:mt-0 sm:mt-0">
        <h1 className="text-3xl">{metadata.contents.thing?.title}</h1>
        <h1 className="text-xl mt-3">
          <span className="block lg:inline">Created by</span>{' '}
          <span className="block text-yellow-700 lg:inline ">
            {metadata.contents.minter}
          </span>
        </h1>
        <h1 className="text-xl">
          <span className="block lg:inline">Owned by</span>
          {'  '}
          <span className="block text-yellow-700 lg:inline ">
            {metadata.contents.ownerId}
          </span>
        </h1>
        <div className="mt-5 mb-5 sm:flex ">
          {metadata.contents.thing?.description}
        </div>
        <div className="mt-5 mb-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
          {canBuy && (
            <div className="mt-5 ">
              <div className="rounded-md shadow">
                <a
                  onClick={async () => {
                    await makeAnOffer(mintbase, metadata.contents)
                  }}
                  href="#"
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 md:py-4 md:text-lg md:px-10"
                >
                  Buy
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Item
