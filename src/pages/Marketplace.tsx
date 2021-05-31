import React from 'react'
import Card from '../components/Card'

import theRooksImage from 'url:../assets/drawings/TheRooksHaveArrived.png'
import dvor from 'url:../assets/drawings/dvor.jpeg'
import elephant from 'url:../assets/drawings/elephant.png'
import tractor from 'url:../assets/drawings/tractor.jpeg'
import horse from 'url:../assets/drawings/horse.jpeg'

const nfts = [
  // {
  //   username: 'deus.near',
  //   title: 'The Rooks Have Arrived',
  //   url: theRooksImage,
  //   price: {
  //     token: 'NEAR',
  //     fraction: 10,
  //   },
  // },
  {
    username: 'alex.near',
    title: 'Dvor',
    url: dvor,
    price: {
      token: 'NEAR',
      fraction: 15,
    },
  },
  {
    username: 'dana.near',
    title: 'Elephant',
    url: elephant,
    price: {
      token: 'NEAR',
      fraction: 6,
    },
  },
  {
    username: 'bender.near',
    title: 'Tractor',
    url: tractor,
    price: {
      token: 'NEAR',
      fraction: 7,
    },
  },
  {
    username: 'rick.near',
    title: 'Horse',
    url: horse,
    price: {
      token: 'NEAR',
      fraction: 2,
    },
  },
]

const Marketplace: React.FC = () => {
  return (
    // grid place-items-center min-h-screen bg-gradient-to-t from-blue-200 to-indigo-900 p-5
    <div className="grid place-items-center sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4 p-5">
      {nfts.map((nft) => {
        return (
          <Card
            key={nft.username + nft.title}
            username={nft.username}
            title={nft.title}
            price={nft.price}
            url={nft.url}
          />
        )
      })}
    </div>
  )
}

export default Marketplace
