import React from 'react'
import { useRecoilValueLoadable } from 'recoil'
import { marketplaceState } from '../state/marketplace'
import Loader from '../components/Loadaer'
import LoadingCard from '../components/LoadingCard'

const Marketplace: React.FC = () => {
  const marketplace = useRecoilValueLoadable(marketplaceState)

  if (marketplace.state === 'loading') {
    return <Loader />
  }

  return (
    <div className="grid place-items-center sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-5">
      {marketplace.state === 'hasValue' &&
        marketplace.contents &&
        marketplace.contents.map((thing) => {
          return <LoadingCard key={thing.id} thing={thing} />
        })}
    </div>
  )
}

export default Marketplace
