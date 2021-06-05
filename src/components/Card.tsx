import React, { ReactElement } from 'react'
import { useRecoilValueLoadable } from 'recoil'
import { charitiesState, ICharitiesData } from '../state/charities'

type Props = {
  username: string
  title: string
  url: any
  charityId: string | null
  price: {
    fraction: number
    token: string
  }
}

const charityById = (
  charities: ICharitiesData[],
  id: string | null
): string => {
  const charity = charities.find((c) => c.id === id)
  return charity ? charity.title : '-'
}

const Card: React.FC<Props> = ({
  username,
  title,
  price,
  url,
  charityId,
  children,
}) => {
  const charities = useRecoilValueLoadable(charitiesState)

  return (
    <div className="bg-white-900 shadow-md rounded p-3 hover:shadow-xl">
      <div className="group">
        <img className="w-full md:w-68 block rounded" src={url} alt="" />
      </div>
      <div className="col-span-3 row-span-1">
        <header className="flex items-center justify-between leading-tight p-2 md:p-4">
          <div>
            <p className="text-sm text-gray-700">{username}</p>
            <p className="text-md text-gray-900">{title}</p>
          </div>
          <div>
            {charities.state == 'hasValue' &&
              charities.contents &&
              charityById(charities.contents, charityId)}
            <p className="text-grey-darker text-sm">Ⓝ{price.fraction}</p>
          </div>
        </header>
      </div>
      {children != null && children}
    </div>
  )
}

export const CardControlls: React.FC = ({ children }) => {
  return (
    <div className="col-span-3 row-span-1">
      <header className="flex items-center justify-between leading-tight p-2 md:p-4">
        {children}
      </header>{' '}
    </div>
  )
}

export default Card
