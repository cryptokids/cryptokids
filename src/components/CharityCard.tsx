import React from 'react'

type Props = {
  title: string
  description: string
  logo: any
  url: string
}

const CharityCard: React.FC<Props> = ({ title, description, logo, url }) => {
  return (
    <div className="bg-white flex flex-col shadow-lg rounded-2xl p-2 hover:shadow-xl w-80 h-full pt-8">
      <div className="group flex">
        <img className="w-32 p-4 m-auto" src={logo} alt="" />
      </div>
      <div className="col-span-3 flex-grow row-span-1 ">
        <header className="flex items-center justify-between leading-tight p-2 md:p-4">
          <div>
            <h1 className="font-bold text-2xl text-gray-900 ">{title}</h1>
            <p>
              <a href={url} className="text-sm ">
                {url}
              </a>
            </p>
            <p className="mt-3 text-sm text-gray-600">{description}</p>
          </div>
        </header>
      </div>
      <div className="flex justify-between  items-center text-gray-900">
        <button className="px-6  py-2 mb-5 transition ease-in duration-200 m-auto uppercase rounded-full hover:bg-yellow-800 hover:text-white border-2 border-yellow-900 focus:outline-none">
          Explore Related Items
        </button>
      </div>
    </div>
  )
}

export default CharityCard
