import React, { useState } from 'react'

export type IPriceSplits = {
  creator: number
  charity: number
  cryptoKids: number
}

export const PriceSplitsField: React.FC<{
  defaultValue: IPriceSplits | null
  onChange: (splits: IPriceSplits) => void
}> = ({ defaultValue, onChange }) => {
  const maxCreatorSplit = 50
  const defaultCryptoSplit = defaultValue?.cryptoKids || 2.5
  const defaultCreatorSplit = defaultValue?.creator || 5
  const [splits, setSplits] = useState<IPriceSplits>(
    defaultValue || {
      creator: defaultCreatorSplit,
      charity: 100 - defaultCreatorSplit - defaultCryptoSplit,
      cryptoKids: defaultCryptoSplit,
    }
  )

  const valueChanged = (event: {
    target: { value: React.SetStateAction<string> }
  }) => {
    const x = Number(event.target.value)
    if (x >= 0 && x <= maxCreatorSplit) {
      const split = {
        ...splits,
        creator: x,
        charity: 100 - defaultCryptoSplit - x,
      }
      setSplits(split)
      onChange(split)
    }
  }

  return (
    <>
      <div>
        <div className="w-auto">
          <input
            type="range"
            onChange={valueChanged}
            min={0}
            max={maxCreatorSplit}
            step={1}
            value={splits.creator}
            className="w-full px-3 py-2 mb-1 border-2 border-gray-200 rounded-md focus:outline-none focus:border-indigo-500 transition-colors"
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
              {splits.creator}%
            </div>
            <div className="w-9/12 h-full bg-red-400 items-center justify-center text-md font-light  text-black bg-pink-300 inline-flex">
              {splits.charity}%
            </div>
            <div className="w-1/12 h-full rounded-r bg-yellow-400 items-center justify-center text-md font-light  text-black bg-pink-300  inline-flex">
              {splits.cryptoKids}%
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
