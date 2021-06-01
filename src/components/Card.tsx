import React from 'react'

type Props = {
  username: string
  title: string
  url: any
  price: {
    fraction: number
    token: string
  }
}

const Card: React.FC<Props> = ({ username, title, price, url }) => {
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
            {price.token}
            <p className="text-grey-darker text-sm">Ⓝ{price.fraction}</p>
          </div>
        </header>
      </div>
    </div>
  )
}

export default Card
