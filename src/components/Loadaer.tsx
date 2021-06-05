import React from 'react'

import * as loaderGif from 'url:../assets/loader.gif'

const Loader: React.FC = () => {
  return (
    <div className="flex items-center justify-center w-full">
      <img className="max-h-80 p-20" src={loaderGif.default} />
    </div>
  )
}

export default Loader
