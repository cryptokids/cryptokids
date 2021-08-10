import React, { useState } from 'react'
import {
  IItemSplits,
  Item,
  listAThing,
  splitRevenueFromItem,
} from '../state/items'
import { IWallet } from '../state/near'
import { SplitInfoBar, SplitInfoBarMode } from './PriceSplitsField'

const SplitField: React.FC<{
  splits: IItemSplits
  minPrice: number
  startPrice: number
  onChange: (price: number) => void
}> = ({ splits, minPrice, startPrice, onChange }) => {
  const [price, setPrice] = useState<number>(startPrice)

  const valueChanged = (event: {
    target: { value: React.SetStateAction<string> }
  }) => {
    const x = Number(event.target.value)
    if (x >= 0 && x <= 100000) {
      setPrice(x)
      onChange(price)
    }
  }

  const neroSplits = {
    creator: (price * splits.creator) / 100,
    charity: (price * splits.charity) / 100,
    cryptoKids: (price * splits.cryptoKids) / 100,
  }

  return (
    <div className="">
      <div>
        <span className="my-3 text-xl inline-flex">Enter Price</span>
        <div className="inline-flex relative ml-5">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-600 text-md">Ⓝ</span>
          </div>
          <input
            type="number"
            id="offer"
            onChange={valueChanged}
            min={minPrice}
            step={1}
            defaultValue={startPrice}
            className=" rounded-lg border-transparent flex-1 appearance-none border border-yellow-300 w-full py-2 px-4 pl-8 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:border-transparent"
          />
        </div>
      </div>
      <div>
        <SplitInfoBar splits={neroSplits} mode={SplitInfoBarMode.Nero} />
      </div>
    </div>
  )
}

const ListItem: React.FC<{ mintbase: IWallet; item: Item }> = ({
  mintbase,
  item,
}) => {
  const minPrice = 40
  const splits = splitRevenueFromItem(item)

  const [price, setPrice] = useState<number>(minPrice)

  return (
    <>
      {splits !== null && (
        <SplitField
          splits={splits}
          minPrice={minPrice}
          startPrice={price}
          onChange={(price) => setPrice(price)}
        />
      )}
      <div className="rounded-md mt-3 shadow">
        {/* TODO: Use better style for this button */}
        <a
          onClick={async () => {
            await listAThing(mintbase, item, price)
          }}
          href="#"
          className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 md:py-4 md:text-lg md:px-10"
        >
          List
        </a>
      </div>
    </>
  )
}

export default ListItem
