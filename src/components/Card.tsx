import React from 'react'
import { useRecoilValueLoadable } from 'recoil'
import { charitiesState, ICharitiesData } from '../state/charities'
import { Link } from 'react-router-dom'

type Props = {
  id?: string
  username: string
  title: string
  url: any
  charityId: string | null
  price: string
}

const charityById = (
  charities: ICharitiesData[],
  id: string | null
): string => {
  const charity = charities.find((c) => c.id === id)
  return charity ? charity.title : '-'
}

const Card: React.FC<Props> = ({
  id,
  username,
  title,
  price,
  url,
  charityId,
  children,
}) => {
  const charities = useRecoilValueLoadable(charitiesState)

  const image = <img className="w-full block rounded" src={url} alt={title} />

  return (
    <div className="bg-white-900 shadow-md rounded p-3 hover:shadow-xl">
      <div className="group">
        {id && (
          <Link
            to={{
              pathname: `/item/${id}`,
            }}
          >
            {image}
          </Link>
        )}
        {!id && image}
      </div>
      <div className="col-span-3 row-span-1">
        <header className="flex items-center justify-between leading-tight p-2 md:p-4">
          <div>
            <p className="text-sm text-gray-700">{username}</p>
            <p className="text-md text-gray-900">{title}</p>
          </div>
          <div>
            <p className="text-grey-darker text-sm text-right">
              {charities.state == 'hasValue' &&
                charities.contents &&
                charityById(charities.contents, charityId)}
            </p>
            <p className="text-grey-darker text-sm text-right">Ⓝ{price}</p>
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

export const CardShimmer: React.FC = () => {
  return (
    <div className="bg-white-900 shadow-md rounded p-3 hover:shadow-xl w-min-60 w-min:w-80">
      <div className="w-full">
        <div className="lg:h-48 bg-gray-400 md:h-36 w-full object-cover object-center"></div>
        <div className="p-5">
          <h1 className="mb-4 h-6 animate-pulse bg-gray-500 w-40"></h1>
        </div>
      </div>
    </div>
  )
}

export default Card
