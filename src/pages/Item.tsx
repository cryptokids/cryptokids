import React, { useContext, useEffect, useState } from 'react'
import Card from '../components/Card'
import { useRecoilValueLoadable } from 'recoil'
import { useParams } from 'react-router-dom'
import {
  fetchItemMetadata,
  Item,
  isUserCanBuyAnItem,
  makeAnOffer,
  getItemStatus,
  ItemStatus,
  listAThing,
  burnTokensOfThing,
} from '../state/items'
import { IWallet } from '../state/near'
import { MintbaseContext } from '../contexts/mintbase'
import ListItem from '../components/ListItem'

const ItemPage: React.FC = () => {
  const { itemId } = useParams<{ itemId: string }>()

  const metadata = useRecoilValueLoadable(fetchItemMetadata({ thing: itemId }))
  const {
    network: { mintbase, account },
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
    <div className="grid  sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4 p-5">
      {metadata.state === 'hasValue' && metadata.contents && (
        <div className="p-4">
          <Card item={metadata.contents} />
        </div>
      )}
      <div className="flex-1 xs:mt-0 sm:mt-0 p-4">
        <div className="flex-1 mt-5 mb-5 ">
          <div>
            <div>
              <h1 className="text-3xl">{metadata.contents.metadata?.title}</h1>
              <h1 className="text-xl mt-3">
                <span className="inline">Created by</span>{' '}
                <span className="inline text-yellow-700">
                  {metadata.contents.thing?.tokens[0].minter}
                </span>
              </h1>
              <h1 className="text-xl mt-1">
                <span className="inline">Owned by</span>
                {'  '}
                <span className="inline text-yellow-700">
                  {metadata.contents.ownerId}
                </span>
              </h1>
            </div>
            <div className="bg-gray-200 my-5 rounded-lg shadow block p-4 ">
              <div className="mt-5 mb-5 sm:flex ">
                {metadata.contents.metadata?.description}
              </div>
            </div>
          </div>
        </div>
        {/* Check is me an owner */}
        {metadata.contents.thing?.tokens[0].minter === account.accountId && (
          <div className="flex flex-col">
            {/* List tokens on the market */}
            {getItemStatus(metadata.contents) === ItemStatus.unlisted && (
              <ListItem mintbase={mintbase} item={metadata.contents} />
            )}
            {/* Burn tokens */}
            {getItemStatus(metadata.contents) !== ItemStatus.sold && (
              <div className="p-1">
                <button
                  onClick={async () => {
                    await burnTokensOfThing(mintbase, metadata.contents)
                  }}
                  className="uppercase px-8 py-2 border border-blue-600 text-blue-600 max-w-max shadow-sm hover:shadow-lg"
                >
                  Burn
                </button>
              </div>
            )}
            {getItemStatus(metadata.contents) === ItemStatus.listed && (
              <p>Listed at the market</p>
            )}
            {getItemStatus(metadata.contents) === ItemStatus.sold && (
              <p>Sold</p>
            )}
          </div>
        )}

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
