import React, { useContext, useEffect, useState } from 'react'
import Card from '../components/Card'
import { useRecoilValueLoadable } from 'recoil'
import { useParams } from 'react-router-dom'
import {
  fetchItemMetadata,
  charityIdFromItem,
  mediaUriFromItem,
  Item,
  isUserCanBuyAnItem,
  makeAnOffer,
  priceFromItem,
} from '../state/items'
import { IWallet } from '../state/near'
import { MintbaseContext } from '../contexts/mintbase'

const ItemPage: React.FC = () => {
  const { itemId } = useParams<{ itemId: string }>()

  const metadata = useRecoilValueLoadable(fetchItemMetadata({ thing: itemId }))
  const {
    network: { mintbase },
  } = useContext(MintbaseContext)
  const [canBuy, setCanBuy] = useState(false)

  const [offer, setOffer] = useState(0)
  const [creatorSplit, setCreatorSplit] = useState(0)
  const [charitySplit, setCharitySplit] = useState(0)

  const handleOffer = (event: {
    target: { value: React.SetStateAction<string> }
  }) => {
    const x = Number(event.target.value)
    const creatorRoyalty = Math.round(0.05 * (x - 2) * 100) / 100
    const charitySplit = x - 2 - creatorRoyalty
    setOffer(x)
    setCreatorSplit(creatorRoyalty)
    setCharitySplit(charitySplit)
  }

  useEffect(() => {
    async function checkStatus(mintbase: IWallet, metadata: Item) {
      const canBuy = await isUserCanBuyAnItem(mintbase, metadata)
      setCanBuy(canBuy)
    }
    if (metadata.state === 'hasValue' && metadata.contents) {
      checkStatus(mintbase, metadata.contents)
    }
  }, [metadata])

  // TODO: Handle error state
  return (
    <div className="flex flex-row justify-center xs:flex-col sm:flex-col lg:flex-row px-4 ">
      {metadata.state === 'hasValue' && metadata.contents && (
        <div className="flex w-1/2 sm:flex-0 m-16">
          <Card
            id={itemId}
            username={metadata.contents.thing.tokens[0].minter}
            title={metadata.contents.metadata.title}
            price={priceFromItem(metadata.contents) || ''}
            charityId={charityIdFromItem(metadata.contents)}
            url={mediaUriFromItem(metadata.contents)}
          />
        </div>
      )}
      <div className="flex-1 lg:mt-16 md:mt-16 xs:mt-0 sm:mt-0 justify-center ">
        <div className="flex-1 mt-5 mb-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
          <div>
            <div>
              <h1 className="text-3xl">{metadata.contents.thing?.title}</h1>
              <h1 className="text-xl mt-3">
                <span className="block lg:inline">Created by</span>{' '}
                <span className="block text-yellow-700 lg:inline ">
                  {metadata.contents.minter}
                </span>
              </h1>
              <h1 className="text-xl mt-1">
                <span className="block lg:inline">Owned by</span>
                {'  '}
                <span className="block text-yellow-700 lg:inline ">
                  {metadata.contents.ownerId}
                </span>
              </h1>
            </div>
            <div className="bg-gray-200 w-96 my-5 rounded-lg shadow block p-4 ">
              <div className="mt-5 mb-5 sm:flex ">
                {metadata.contents.thing?.description}
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1 mt-5 mb-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
          {canBuy && (
            <div className="">
              <div>
                <span className="my-3 text-xl inline-flex">
                  Enter Your Offering
                </span>
                <div className="inline-flex relative ml-5">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-600 text-md">Ⓝ</span>
                  </div>
                  <input
                    type="number"
                    id="offer"
                    onChange={handleOffer}
                    min={5}
                    step={1}
                    defaultValue=""
                    className=" rounded-lg border-transparent flex-1 appearance-none border border-yellow-300 w-full py-2 px-4 pl-8 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:border-transparent"
                    placeholder="10"
                  />
                </div>
              </div>
              <div>
                <div className="bg-gray-200 my-5 rounded-lg w-auto shadow block p-4 m-auto">
                  <div>
                    <span className="text-xs font-light inline-block py-1 px-2 uppercase rounded-full text-black bg-indigo-300">
                      Creator
                    </span>
                    <span className="text-xs font-light inline-block py-1 px-2 uppercase rounded-full text-black bg-red-300">
                      Charity
                    </span>
                    <span className="text-xs font-light inline-block py-1 px-2 uppercase rounded-full text-black bg-yellow-300">
                      CryptoKids
                    </span>
                  </div>
                  <div className="w-full h-6 rounded-lg mt-3">
                    <div className="w-2/12 h-full rounded-l bg-indigo-400 items-center justify-center text-md font-light  text-black bg-pink-300 inline-flex">
                      Ⓝ{creatorSplit}
                    </div>
                    <div className="w-9/12 h-full bg-red-400 items-center justify-center text-md font-light  text-black bg-pink-300 inline-flex">
                      Ⓝ{charitySplit}
                    </div>
                    <div className="w-1/12 h-full rounded-r bg-yellow-400 items-center justify-center text-md font-light  text-black bg-pink-300  inline-flex">
                      Ⓝ2
                    </div>
                  </div>
                </div>
              </div>
              <div className="rounded-md mt-3 shadow">
                <a
                  onClick={async () => {
                    await makeAnOffer(mintbase, metadata.contents, offer)
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

export default ItemPage
