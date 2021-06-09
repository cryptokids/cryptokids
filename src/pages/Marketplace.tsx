import React from 'react'
import { useRecoilValueLoadable } from 'recoil'
import { marketplaceSelector } from '../state/marketplace'
import Loader from '../components/Loadaer'
import LoadingCard from '../components/LoadingCard'

const Marketplace: React.FC = () => {
  const marketplace = useRecoilValueLoadable(marketplaceSelector)
  if (marketplace.state === 'loading') {
    return <Loader />
  }

  return (
    <div className="grid place-items-center sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-5">
      {marketplace.state === 'hasValue' &&
        marketplace.contents &&
        marketplace.contents.map((item) => {
          return <LoadingCard key={item.id} id={item.id} />
        })}
    </div>
  )
}

export default Marketplace
