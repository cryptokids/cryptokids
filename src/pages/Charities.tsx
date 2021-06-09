import React from 'react'
import { useRecoilValue } from 'recoil'
import CharityCard from '../components/CharityCard'
import { charitiesState } from '../state/charities'

const Charities: React.FC = () => {
  const charities = useRecoilValue(charitiesState)

  return (
    <div className="grid place-items-center sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-3 gap-4 p-5">
      {charities.map((charity) => {
        return (
          <CharityCard
            key={charity.title}
            title={charity.title}
            description={charity.description}
            logo={charity.logo}
            url={charity.url}
          />
        )
      })}
    </div>
  )
}

export default Charities
