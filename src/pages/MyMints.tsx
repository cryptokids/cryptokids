import React from 'react'
import { useRecoilValueLoadable } from 'recoil'
import Card from '../components/Card'
import { myItemsState } from '../state/myItems'
import Loader from '../components/Loadaer'

const MyMints: React.FC = () => {
  const things = useRecoilValueLoadable(myItemsState)

  return (
    <>
      {things.state === 'loading' && <Loader />}
      {things.state === 'hasValue' && things.contents && (
        <div className="grid place-items-center sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-5">
          {things.contents.map((item, idx) => {
            return <Card key={`idx_${idx}`} item={item} />
          })}
        </div>
      )}
    </>
  )
}

export default MyMints
