import React from 'react'
import Card from '../components/Card'

const nfts = [
  {
    username: 'hello',
    title: 'My morning',
    price: {
      token: 'ETH',
      fraction: 0.111,
    },
  },
  {
    username: 'joe',
    title: '.------.',
    price: {
      token: 'ETH',
      fraction: 0.0023,
    },
  },
  {
    username: 'dana',
    title: 'Spooky Mulder',
    price: {
      token: 'ETH',
      fraction: 0.04848,
    },
  },
  {
    username: 'Bender',
    title: 'BMSMA',
    price: {
      token: 'ETH',
      fraction: 0.00002,
    },
  },
  {
    username: 'rick',
    title: 'Planet 2222',
    price: {
      token: 'ETH',
      fraction: 1.0,
    },
  },
]

const Marketplace: React.FC = () => {
  return (
    // grid place-items-center min-h-screen bg-gradient-to-t from-blue-200 to-indigo-900 p-5
    <div className="grid place-items-center sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 p-5">
      {nfts.map((nft) => {
        return (
          <Card username={nft.username} title={nft.title} price={nft.price} />
        )
      })}
    </div>
  )
}

export default Marketplace
